'use client';

import { GENRES } from '@/lib/data/genres';
import { useStudioStore } from '@/lib/store/studio-store';
import { cn } from '@/lib/utils';

export function GenreSelector() {
  const { genre, applyGenrePreset } = useStudioStore();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {Object.values(GENRES).map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => applyGenrePreset(g.id, g.defaultKey, g.scale, g.bpm)}
            className={cn(
              'rounded-md border px-2 py-2.5 text-xs font-medium transition-colors',
              genre === g.id
                ? 'border-transparent bg-gradient-to-br from-brand-orange to-brand-pink text-white'
                : 'border-border bg-secondary text-muted-foreground hover:border-brand-orange hover:bg-secondary/70',
            )}
          >
            {g.name}
          </button>
        ))}
      </div>
      <GenreInfo />
    </div>
  );
}

function GenreInfo() {
  const { genre } = useStudioStore();
  const g = GENRES[genre];
  if (!g) return null;
  return (
    <div className="rounded-md bg-background/70 p-3 text-xs leading-relaxed text-muted-foreground">
      <div>
        <strong className="text-foreground">BPM:</strong> {g.bpm}
      </div>
      <div>
        <strong className="text-foreground">Mood:</strong> {g.mood}
      </div>
      <div>
        <strong className="text-foreground">Common keys:</strong> {g.keys.join(', ')}
      </div>
      <div>
        <strong className="text-foreground">Best scales:</strong> {g.scales.join(', ')}
      </div>
    </div>
  );
}
