import { notFound } from 'next/navigation';
import { NOTES, SCALE_DISPLAY_NAMES, SCALE_PATTERNS, INTERVAL_NAMES, type ScaleName } from '@/lib/data/scale-patterns';
import { getScaleNotes } from '@/lib/theory/scales';

export function generateStaticParams() {
  return Object.keys(SCALE_PATTERNS).map((scale) => ({ scale }));
}

export function generateMetadata({ params }: { params: { scale: string } }) {
  const name = SCALE_DISPLAY_NAMES[params.scale as ScaleName];
  if (!name) return { title: 'Scale — ChordCraft' };
  return {
    title: `${name} scale — notes in every key | ChordCraft`,
    description: `All twelve keys of the ${name} scale, with intervals.`,
  };
}

export default function ScalePage({ params }: { params: { scale: string } }) {
  const scale = params.scale as ScaleName;
  if (!SCALE_PATTERNS[scale]) notFound();
  const intervals = SCALE_PATTERNS[scale];

  return (
    <div className="container max-w-3xl space-y-8 py-12">
      <header>
        <h1 className="text-4xl font-bold">{SCALE_DISPLAY_NAMES[scale]} scale</h1>
        <p className="mt-2 text-muted-foreground">
          Intervals: {intervals.map((i) => INTERVAL_NAMES[i]).join(' · ')}
        </p>
      </header>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {NOTES.map((root) => {
          const notes = getScaleNotes(root, scale);
          return (
            <div key={root} className="rounded-md border border-border bg-secondary p-4">
              <div className="text-sm font-semibold">{root} {SCALE_DISPLAY_NAMES[scale]}</div>
              <div className="mt-1 font-mono text-xs text-muted-foreground">{notes.join(' · ')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
