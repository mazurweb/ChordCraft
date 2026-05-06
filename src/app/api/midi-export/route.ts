import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { isDbConfigured } from '@/lib/db/client';
import { generateProgressionMidi } from '@/lib/midi/exporter';

const schema = z.object({
  progression: z.object({ chords: z.array(z.string()).min(1).max(32) }),
  bpm: z.number().int().min(40).max(240),
  name: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) return new NextResponse('DB not configured', { status: 503 });
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Sign in to export MIDI', { status: 401 });

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
