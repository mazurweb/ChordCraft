'use client';

import * as React from 'react';
import { useStudioStore } from '@/lib/store/studio-store';
import { getScaleNotes } from '@/lib/theory/scales';
import { getChordNotes } from '@/lib/theory/chords';
import { toneEngine } from '@/lib/audio/tone-engine';
import { cn } from '@/lib/utils';
import type { Note } from '@/lib/data/scale-patterns';

interface KeyDescriptor {
  note: Note;
  octave: number;
  isBlack: boolean;
  /** index of preceding white key for black-key positioning */
  after?: number;
}

const WHITE_NOTES: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

function buildKeyboard(): { whites: KeyDescriptor[]; blacks: KeyDescriptor[] } {
  const whites: KeyDescriptor[] = [];
  const blacks: KeyDescriptor[] = [];
  const blacksByWhiteIndex: Record<string, Note> = { C: 'C#', D: 'D#', F: 'F#', G: 'G#', A: 'A#' };

  let whiteIndex = 0;
  for (const octave of [3, 4, 5]) {
    for (const w of WHITE_NOTES) {
      whites.push({ note: w, octave, isBlack: false });
      const blk = blacksByWhiteIndex[w];
      if (blk) blacks.push({ note: blk, octave, isBlack: true, after: whiteIndex });
      whiteIndex++;
    }
  }
  return { whites, blacks };
}

const KEYBOARD = buildKeyboard();

export const Piano = React.memo(function Piano() {
  const { key, scale, chordRoot, chordType, setChordRoot } = useStudioStore();
  const [pressedId, setPressedId] = React.useState<string | null>(null);

  const scaleNotes = React.useMemo(() => getScaleNotes(key, scale), [key, scale]);
  const chordNotes = React.useMemo(
    () => (chordRoot ? getChordNotes(chordRoot, chordType) : []),
    [chordRoot, chordType],
  );

  const handlePress = (note: Note, octave: number) => {
    const id = `${note}${octave}`;
    setPressedId(id);
    setTimeout(() => setPressedId((cur) => (cur === id ? null : cur)), 200);
    void toneEngine.playNote(note, octave);
    setChordRoot(note);
  };

  const totalWhites = KEYBOARD.whites.length;

  return (
    <div className="rounded-lg bg-background p-3 overflow-x-auto">
      <div className="relative flex h-40 min-w-[600px] select-none">
        {KEYBOARD.whites.map((k, idx) => {
          const id = `${k.note}${k.octave}`;
          const isRoot = k.note === key;
          const inScale = scaleNotes.includes(k.note);
          const inChord = chordNotes.includes(k.note);
          return (
            <button
              key={`w-${id}-${idx}`}
              type="button"
              aria-label={`${k.note}${k.octave}`}
              onClick={() => handlePress(k.note, k.octave)}
              className={cn(
                'relative flex-1 cursor-pointer rounded-b border border-slate-700 bg-gradient-to-b from-slate-50 to-slate-200 text-[0.7rem] font-semibold text-slate-600 transition-transform',
                'flex items-end justify-center pb-2 hover:from-slate-200 hover:to-slate-300',
                inScale && 'from-orange-200 to-orange-400 text-orange-950',
                isRoot && 'from-red-300 to-red-500 text-white',
                inChord && 'from-violet-300 to-violet-500 text-white',
                pressedId === id && 'scale-[0.97]',
              )}
            >
              {k.note}
            </button>
          );
        })}
        {KEYBOARD.blacks.map((k, idx) => {
          const id = `${k.note}${k.octave}`;
          const isRoot = k.note === key;
          const inScale = scaleNotes.includes(k.note);
          const inChord = chordNotes.includes(k.note);
          const leftPercent = (((k.after ?? 0) + 0.65) / totalWhites) * 100;
          return (
            <button
              key={`b-${id}-${idx}`}
              type="button"
              aria-label={`${k.note}${k.octave}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePress(k.note, k.octave);
              }}
              style={{ left: `${leftPercent}%` }}
              className={cn(
                'absolute z-10 h-[60%] w-[4%] cursor-pointer rounded-b border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-950 text-[0.65rem] font-semibold text-slate-400 transition-transform',
                'flex items-end justify-center pb-1 hover:from-slate-700 hover:to-slate-900',
                inScale && 'from-orange-600 to-orange-800 text-white',
                isRoot && 'from-red-600 to-red-900 text-white',
                inChord && 'from-violet-600 to-violet-800 text-white',
                pressedId === id && 'scale-[0.97]',
              )}
            >
              {k.note}
            </button>
          );
        })}
      </div>
    </div>
  );
});
