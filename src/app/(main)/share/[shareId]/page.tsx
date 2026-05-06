import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db, isDbConfigured } from '@/lib/db/client';
import { progressions, shares } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShareableProgressionPlayer } from '@/components/studio/ShareableProgressionPlayer';

interface PageProps {
  params: { shareId: string };
}

async function loadShare(shareId: string) {
  if (!isDbConfigured()) return null;

  const [share] = await db.select().from(shares).where(eq(shares.shareId, shareId)).limit(1);
  if (!share) return null;
  const [prog] = await db
    .select()
    .from(progressions)
    .where(eq(progressions.id, share.progressionId))
    .limit(1);
  if (!prog || !prog.isPublic) return null;
  // Best-effort view bump.
  await db
    .update(shares)
    .set({ viewCount: share.viewCount + 1 })
    .where(eq(shares.id, share.id));
  return { share, prog };
}

export async function generateMetadata({ params }: PageProps) {
  const data = await loadShare(params.shareId);
  if (!data) return { title: 'Shared progression — ChordCraft' };
  return {
    title: `${data.prog.name} — ChordCraft`,
    description: `${data.prog.chords.chords.join(' → ')} · ${data.prog.genre} in ${data.prog.key} ${data.prog.scale}`,
  };
}

export default async function SharePage({ params }: PageProps) {
  const data = await loadShare(params.shareId);
  if (!data) notFound();
  const { prog } = data;

  return (
    <div className="container max-w-2xl space-y-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Shared progression</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ShareableProgressionPlayer
            name={prog.name}
            chords={prog.chords.chords}
            roman={prog.chords.roman}
            bpm={prog.bpm}
          />
          <div className="text-xs text-muted-foreground">
            {prog.genre} · {prog.key} {prog.scale} · {prog.bpm} BPM
          </div>
          <Link href="/studio">
            <Button variant="gradient">Try ChordCraft yourself</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
