import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GENRES, GENRE_IDS } from '@/lib/data/genres';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function generateStaticParams() {
  return GENRE_IDS.map((id) => ({ genre: id }));
}

export function generateMetadata({ params }: { params: { genre: string } }) {
  const g = GENRES[params.genre];
  if (!g) return { title: 'Genre — ChordCraft' };
  return {
    title: `${g.name} chord progressions — ChordCraft`,
    description: `Best ${g.name.toLowerCase()} chord progressions, keys, scales, and BPM. Mood: ${g.mood}.`,
  };
}

export default function GenrePage({ params }: { params: { genre: string } }) {
  const g = GENRES[params.genre];
  if (!g) notFound();

  return (
    <div className="container max-w-3xl space-y-8 py-12">
      <header>
        <h1 className="text-4xl font-bold">{g.name}</h1>
        <p className="mt-2 text-muted-foreground">{g.mood}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Genre defaults</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Stat label="Default key" value={g.defaultKey} />
          <Stat label="Scale" value={g.scale} />
          <Stat label="BPM" value={String(g.bpm)} />
          <Stat label="Common keys" value={g.keys.join(', ')} />
        </CardContent>
      </Card>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Starter progressions</h2>
        <div className="space-y-2">
          {g.progressions.map((p) => (
            <div key={p.name} className="rounded-md border border-border bg-secondary p-4">
              <div className="font-semibold">{p.name}</div>
              <div className="font-mono text-sm text-muted-foreground">{p.chords.join(' → ')}</div>
              <div className="font-mono text-xs text-muted-foreground">{p.roman.join(' · ')}</div>
            </div>
          ))}
        </div>
      </section>
      <Link href={`/studio?genre=${g.id}`}>
        <Button variant="gradient" size="lg">
          Build {g.name} in the Studio
        </Button>
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
