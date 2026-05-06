import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ShareableProgressionPlayer } from '@/components/studio/ShareableProgressionPlayer';

interface PageProps {
  params: { shareId: string };
}

export default async function EmbedPage({ params }: PageProps) {
  const supabase = createClient();
  const { data: share } = await supabase
    .from('shares')
    .select('*')
    .eq('share_id', params.shareId)
    .single();
  if (!share) notFound();
  const { data: prog } = await supabase
    .from('progressions')
    .select('*')
    .eq('id', share.progression_id)
    .single();
  if (!prog || !prog.is_public) notFound();

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
