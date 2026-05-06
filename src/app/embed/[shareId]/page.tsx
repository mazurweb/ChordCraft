import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db, isDbConfigured } from '@/lib/db/client';
import { progressions, shares } from '@/lib/db/schema';
import { ShareableProgressionPlayer } from '@/components/studio/ShareableProgressionPlayer';

interface PageProps {
  params: { shareId: string };
}

export default async function EmbedPage({ params }: PageProps) {
  if (!isDbConfigured()) notFound();
  const [share] = await db.select().from(shares).where(eq(shares.shareId, params.shareId)).limit(1);
  if (!share) notFound();
  const [prog] = await db
    .select()
    .from(progressions)
    .where(eq(progressions.id, share.progressionId))
    .limit(1);
  if (!prog || !prog.isPublic) notFound();

  return (
    <div className="p-4">
      <ShareableProgressionPlayer
        name={prog.name}
        chords={prog.chords.chords}
        roman={prog.chords.roman}
        bpm={prog.bpm}
      />
    </div>
  );
}
