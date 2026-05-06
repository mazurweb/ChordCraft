import Link from 'next/link';
import { GENRES } from '@/lib/data/genres';

export function GenreShowcase() {
  return (
    <section className="container py-16">
      <h2 className="mb-2 text-center text-3xl font-bold">Built around genres</h2>
      <p className="mb-10 text-center text-muted-foreground">
        Each genre comes with curated keys, BPM, modes, and starter progressions.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.values(GENRES).map((g) => (
          <Link
            key={g.id}
            href={`/genres/${g.id}`}
            className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand-orange"
          >
            <div className="text-sm font-bold text-foreground group-hover:text-brand-orange">{g.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{g.mood}</div>
            <div className="mt-3 font-mono text-[0.7rem] text-muted-foreground">
              {g.bpm} BPM · {g.defaultKey} {g.scale}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
