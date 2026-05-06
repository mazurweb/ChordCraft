import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { suggestNextChord } from '@/lib/ai/claude';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  progression: z.array(z.string()).min(1).max(16),
  genre: z.string().min(1).max(40),
  key: z.string().min(1).max(4),
  scale: z.string().min(1).max(40),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();
  if (!profile || profile.plan === 'free') {
    return new NextResponse('AI suggestions require the Pro plan', { status: 402 });
  }

  const body = schema.safeParse(await req.json());
  if (!body.success) return new NextResponse(body.error.message, { status: 400 });

  try {
    const result = await suggestNextChord(
      body.data.progression,
      body.data.genre,
      body.data.key,
      body.data.scale,
    );
    return NextResponse.json(result);
  } catch (e) {
    return new NextResponse(e instanceof Error ? e.message : 'AI request failed', { status: 500 });
  }
}
