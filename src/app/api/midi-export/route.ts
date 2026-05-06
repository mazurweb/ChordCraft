import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { generateProgressionMidi } from '@/lib/midi/exporter';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  progression: z.object({ chords: z.array(z.string()).min(1).max(32) }),
  bpm: z.number().int().min(40).max(240),
  name: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Sign in to export MIDI', { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();
  if (!profile || profile.plan === 'free') {
    return new NextResponse('MIDI export requires the Pro plan', { status: 402 });
  }

  const body = schema.safeParse(await req.json());
  if (!body.success) return new NextResponse(body.error.message, { status: 400 });

  const buf = generateProgressionMidi(body.data.progression, body.data.bpm);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'audio/midi',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(body.data.name)}.mid"`,
    },
  });
}
