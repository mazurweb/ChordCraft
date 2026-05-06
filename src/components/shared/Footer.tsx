import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
        <div>
          Built with Tone.js • <strong>ChordCraft</strong>
        </div>
        <nav className="flex gap-4">
          <Link href="/studio" className="hover:text-foreground">Studio</Link>
          <a href="https://chordcraft.app" className="hover:text-foreground">chordcraft.app</a>
        </nav>
      </div>
    </footer>
  );
}
