import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { SessionProvider } from '@/components/shared/SessionProvider';

export const metadata: Metadata = {
  title: 'ChordCraft — Music theory for modern producers',
  description:
    'Pick a genre. Get a key. Build chords that work. ChordCraft helps producers write progressions that fit phonk, trap, lo-fi, house, and more.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'ChordCraft — Music theory for modern producers',
    description: 'Genre-first chord progressions and music theory for producers.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
