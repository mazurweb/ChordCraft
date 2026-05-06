import { Music2, Piano as PianoIcon, Wand2, Download, Share2, Sparkles } from 'lucide-react';

const features = [
  { icon: Music2, title: '12 genres', desc: 'Phonk, drift, trap, lo-fi, house, R&B, pop, rock, drill, jazz, ambient, techno.' },
  { icon: PianoIcon, title: '12 scales', desc: 'Major, minor, modal, harmonic / melodic minor, pentatonic, blues.' },
  { icon: Wand2, title: '12 chord types', desc: 'Triads, 7ths, 9ths, suspensions, augmentations — all genre-aware.' },
  { icon: Download, title: 'MIDI export', desc: 'Drag straight into FL Studio, Ableton, Logic Pro.' },
  { icon: Sparkles, title: 'AI suggestions', desc: 'Claude suggests next chords that fit your genre and key.' },
  { icon: Share2, title: 'Shareable links', desc: 'Send a public link of any progression — or embed it.' },
];

export function FeatureGrid() {
  return (
    <section className="container py-16">
      <h2 className="mb-10 text-center text-3xl font-bold">Everything you need to write</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-5">
            <f.icon className="mb-3 h-5 w-5 text-brand-orange" />
            <div className="font-semibold">{f.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
