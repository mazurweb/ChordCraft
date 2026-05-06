import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music } from 'lucide-react';

export function Hero() {
  return (
    <section className="container py-20 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs">
          <Music className="h-3.5 w-3.5 text-brand-orange" />
          Genre-first music theory
        </div>
        <h1 className="mb-4 text-balance text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
          <span className="text-brand-gradient">Pick a genre.</span> Get a key.
          <br />
          Build chords that work.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-balance text-lg text-muted-foreground">
          ChordCraft is the chord progression sketchpad for modern producers. Phonk, trap, lo-fi,
          house, drift — pick a vibe, and the theory comes pre-tuned.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/studio">
            <Button variant="gradient" size="lg">
              Open Studio <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              See pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
