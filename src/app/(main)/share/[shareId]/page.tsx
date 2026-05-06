import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShareableProgressionPlayer } from '@/components/studio/ShareableProgressionPlayer';

interface PageProps {
  params: { shareId: string };
}

async function loadShare(shareId: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data: share } = await supabase
    .from('shares')
    .select('*')
    .eq('share_id', shareId)
    .single();
  if (!share) return null;
  const { data: prog } = await supabase
    .from('progressions')
    .select('*')
    .eq('id', share.progression_id)
    .single();
  if (!prog || !prog.is_public) return null;
  // Best-effort view bump (RLS on shares: read-only; writing it requires service role).
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
