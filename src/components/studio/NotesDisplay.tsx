'use client';

import { useStudioStore } from '@/lib/store/studio-store';
import { getScaleNotes } from '@/lib/theory/scales';
import { SCALE_PATTERNS, INTERVAL_NAMES } from '@/lib/data/scale-patterns';
import { cn } from '@/lib/utils';

export function NotesDisplay() {
  const { key, scale } = useStudioStore();
  const notes = getScaleNotes(key, scale);
  const pattern = SCALE_PATTERNS[scale];

  return (
    <div className="flex flex-wrap gap-2">
      {notes.map((note, idx) => (
        <div
          key={`${note}-${idx}`}
          className={cn(
            'rounded-md border px-3 py-1.5 text-sm font-semibold',
            idx === 0
              ? 'border-transparent bg-gradient-to-r from-red-500 to-red-700 text-white'
              : 'border-border bg-secondary',
          )}
        >
          {note}
          <span className="block text-[0.65rem] uppercase opacity-70">
            {INTERVAL_NAMES[pattern[idx]]}
          </span>
        </div>
      ))}
    </div>
  );
}
