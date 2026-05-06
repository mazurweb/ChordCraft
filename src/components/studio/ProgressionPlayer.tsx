'use client';

import * as React from 'react';
import { Play, Pause, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TempoControl } from './TempoControl';
import { SaveProgressionDialog } from './SaveProgressionDialog';
import { useStudioStore } from '@/lib/store/studio-store';
import { parseChordName } from '@/lib/theory/parser';
import { getChordNotes } from '@/lib/theory/chords';
import { toneEngine } from '@/lib/audio/tone-engine';
import { cn } from '@/lib/utils';

export function ProgressionPlayer() {
  const {
    activeProgression,
    isPlaying,
    setIsPlaying,
    currentChordIndex,
    setCurrentChordIndex,
    bpm,
  } = useStudioStore();
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const [exporting, setExporting] = React.useState(false);

  const stop = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentChordIndex(0);
  }, [setIsPlaying, setCurrentChordIndex]);

  React.useEffect(() => () => stop(), [stop]);

  const playLoop = async () => {
    if (!activeProgression) return;
    if (isPlaying) {
      stop();
      return;
    }
    await toneEngine.init();

    setIsPlaying(true);
    setCurrentChordIndex(0);
    const intervalMs = (60 / bpm) * 1000 * 2;

    let idx = 0;
    const step = () => {
      const chord = activeProgression.chords[idx];
      const parsed = parseChordName(chord);
      if (parsed) {
        const notes = getChordNotes(parsed.root, parsed.type);
        void toneEngine.playChord(notes, 3, (intervalMs / 1000) * 0.9);
      }
      setCurrentChordIndex(idx);
      idx = (idx + 1) % activeProgression.chords.length;
    };
    step();
    intervalRef.current = setInterval(step, intervalMs);
  };

  const playCard = (chordStr: string) => {
    const parsed = parseChordName(chordStr);
    if (!parsed) return;
    void toneEngine.playChord(getChordNotes(parsed.root, parsed.type));
  };

  const exportMidi = async () => {
    if (!activeProgression) return;
    setExporting(true);
    try {
      const res = await fetch('/api/midi-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progression: { chords: activeProgression.chords },
          bpm,
          name: activeProgression.name,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        alert(msg || 'MIDI export failed');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeProgression.name}.mid`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      {activeProgression ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {activeProgression.chords.map((c, idx) => (
            <button
              key={`${c}-${idx}`}
              type="button"
              onClick={() => playCard(c)}
              className={cn(
                'rounded-lg border p-3 text-center transition-all',
                isPlaying && idx === currentChordIndex
                  ? 'border-transparent bg-gradient-to-br from-brand-orange to-brand-pink text-white'
                  : 'border-border bg-secondary hover:-translate-y-0.5 hover:border-brand-orange',
              )}
            >
              <div className="text-lg font-bold">{c}</div>
              <div className="mt-0.5 text-xs uppercase opacity-70">
                {activeProgression.roman?.[idx] ?? ''}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Click a progression above to load it
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="gradient" onClick={playLoop} disabled={!activeProgression} size="sm">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? 'Stop Loop' : 'Play Loop'}
        </Button>
        <TempoControl />
        <SaveProgressionDialog>
          <Button variant="outline" size="sm" disabled={!activeProgression}>
            <Save className="h-4 w-4" /> Save
          </Button>
        </SaveProgressionDialog>
        <Button
          variant="outline"
          size="sm"
          onClick={exportMidi}
          disabled={!activeProgression || exporting}
        >
          <Download className="h-4 w-4" /> {exporting ? 'Exporting…' : 'MIDI'}
        </Button>
      </div>
    </div>
  );
}
