'use client';

import { GENRES } from '@/lib/data/genres';
import { useStudioStore } from '@/lib/store/studio-store';

export function ProgressionList() {
  const { genre, loadProgression } = useStudioStore();
  const g = GENRES[genre];
  if (!g) return null;

  return (
    <div className="space-y-2">
      {g.progressions.map((p) => (
        <button
          key={p.name}
          type="button"
          onClick={() => loadProgression(p)}
          className="w-full rounded-md border border-border bg-secondary p-3 text-left transition-colors hover:border-brand-orange hover:bg-secondary/70"
        >
          <div className="text-sm font-semibold">{p.name}</div>
          <div className="font-mono text-xs text-muted-foreground">{p.chords.join(' → ')}</div>
        </button>
      ))}
    </div>
  );
}
