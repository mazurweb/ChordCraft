import { notFound } from 'next/navigation';
import { NOTES, type Note } from '@/lib/data/scale-patterns';
import { getScaleNotes } from '@/lib/theory/scales';
import { getChordNotes, buildChordName } from '@/lib/theory/chords';

const TRIADS_MAJOR_DEGREES: Array<'maj' | 'min' | 'dim'> = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
const TRIADS_MINOR_DEGREES: Array<'min' | 'dim' | 'maj'> = ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];

export function generateStaticParams() {
  return NOTES.map((n) => ({ key: encodeURIComponent(n) }));
}

export function generateMetadata({ params }: { params: { key: string } }) {
  const key = decodeURIComponent(params.key);
  return { title: `Chords in ${key} — ChordCraft`, description: `Common chords in ${key} major and minor.` };
}

export default function KeyPage({ params }: { params: { key: string } }) {
  const key = decodeURIComponent(params.key) as Note;
  if (!NOTES.includes(key)) notFound();

  const majorScale = getScaleNotes(key, 'major');
  const minorScale = getScaleNotes(key, 'minor');
  const majorChords = majorScale.map((root, i) => buildChordName(root, TRIADS_MAJOR_DEGREES[i]));
  const minorChords = minorScale.map((root, i) => buildChordName(root, TRIADS_MINOR_DEGREES[i]));

  return (
    <div className="container max-w-3xl space-y-8 py-12">
      <header>
        <h1 className="text-4xl font-bold">Chords in {key}</h1>
        <p className="mt-2 text-muted-foreground">Diatonic triads in {key} major and {key} minor.</p>
      </header>
      <Section title={`${key} major`} chords={majorChords} scale={majorScale} degrees={TRIADS_MAJOR_DEGREES} />
      <Section title={`${key} minor`} chords={minorChords} scale={minorScale} degrees={TRIADS_MINOR_DEGREES} />
    </div>
  );
}

function Section({
  title,
  chords,
  scale,
  degrees,
}: {
  title: string;
  chords: string[];
  scale: string[];
  degrees: string[];
}) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
        {chords.map((c, i) => (
          <div key={`${c}-${i}`} className="rounded-md border border-border bg-secondary p-3 text-center">
            <div className="text-base font-bold">{c}</div>
            <div className="text-xs text-muted-foreground">
              {scale[i]} {degrees[i]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
