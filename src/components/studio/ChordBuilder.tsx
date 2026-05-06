'use client';

import { Button } from '@/components/ui/button';
import { useStudioStore } from '@/lib/store/studio-store';
import { CHORD_DISPLAY_NAMES, CHORD_TYPES_ORDER } from '@/lib/data/chord-patterns';
import { getChordNotes, buildChordName } from '@/lib/theory/chords';
import { toneEngine } from '@/lib/audio/tone-engine';
import { cn } from '@/lib/utils';
import { Play, X } from 'lucide-react';

export function ChordBuilder() {
  const { chordRoot, chordType, setChordRoot, setChordType } = useStudioStore();

  const playCurrent = () => {
    if (!chordRoot) return;
    const notes = getChordNotes(chordRoot, chordType);
    void toneEngine.playChord(notes);
  };

  const clear = () => {
    setChordRoot(null);
    setChordType('maj');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {CHORD_TYPES_ORDER.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setChordType(t)}
            className={cn(
              'rounded-md border px-2 py-2 text-xs font-medium transition-colors',
              chordType === t
                ? 'border-transparent bg-gradient-to-br from-violet-500 to-indigo-500 text-white'
                : 'border-border bg-secondary text-muted-foreground hover:border-brand-purple',
            )}
          >
            {CHORD_DISPLAY_NAMES[t]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="gradient" onClick={playCurrent} disabled={!chordRoot} size="sm">
          <Play className="h-4 w-4" /> Play Chord
        </Button>
        <Button variant="outline" size="sm" onClick={clear}>
          <X className="h-4 w-4" /> Clear
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          {chordRoot ? (
            <>
              <strong className="text-brand-orange">{buildChordName(chordRoot, chordType)}</strong>{' '}
              — {getChordNotes(chordRoot, chordType).join(', ')}
            </>
          ) : (
            'Select a note'
          )}
        </span>
      </div>

      <div className="rounded-md border-l-2 border-brand-orange bg-gradient-to-br from-orange-500/10 to-pink-500/10 p-3 text-xs leading-relaxed text-muted-foreground">
        💡 <strong>Tip:</strong> Click any note on the piano to set the chord root. Pick a chord
        type — &quot;7&quot; and &quot;9&quot; add jazz/lo-fi color tones.
      </div>
    </div>
  );
}
