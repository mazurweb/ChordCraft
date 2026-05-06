'use client';

import * as React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseChordName } from '@/lib/theory/parser';
import { getChordNotes } from '@/lib/theory/chords';
import { toneEngine } from '@/lib/audio/tone-engine';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  chords: string[];
  roman?: string[];
  bpm: number;
}

export function ShareableProgressionPlayer({ name, chords, roman, bpm }: Props) {
  const [playing, setPlaying] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const ref = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = React.useCallback(() => {
    if (ref.current) clearInterval(ref.current);
    ref.current = null;
    setPlaying(false);
    setIdx(0);
  }, []);

  React.useEffect(() => () => stop(), [stop]);

  const toggle = async () => {
    if (playing) {
      stop();
      return;
    }
    await toneEngine.init();
    setPlaying(true);
    setIdx(0);
    let i = 0;
    const intervalMs = (60 / bpm) * 1000 * 2;
    const step = () => {
      const parsed = parseChordName(chords[i]);
      if (parsed) {
        const notes = getChordNotes(parsed.root, parsed.type);
        void toneEngine.playChord(notes, 3, (intervalMs / 1000) * 0.9);
      }
      setIdx(i);
      i = (i + 1) % chords.length;
    };
    step();
    ref.current = setInterval(step, intervalMs);
  };

  return (
    <div className="space-y-3">
      <div className="text-lg font-semibold">{name}</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {chords.map((c, i) => (
          <div
            key={`${c}-${i}`}
            className={cn(
              'rounded-lg border p-3 text-center',
              playing && idx === i
                ? 'border-transparent bg-gradient-to-br from-brand-orange to-brand-pink text-white'
                : 'border-border bg-secondary',
            )}
          >
            <div className="text-lg font-bold">{c}</div>
            {roman?.[i] && <div className="mt-0.5 text-xs uppercase opacity-70">{roman[i]}</div>}
          </div>
        ))}
      </div>
      <Button variant="gradient" size="sm" onClick={toggle}>
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {playing ? 'Stop' : 'Play'}
      </Button>
    </div>
  );
}
