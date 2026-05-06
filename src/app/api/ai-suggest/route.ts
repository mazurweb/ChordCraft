import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { isDbConfigured } from '@/lib/db/client';
import { suggestNextChord } from '@/lib/ai/claude';

const schema = z.object({
  progression: z.array(z.string()).min(1).max(16),
  genre: z.string().min(1).max(40),
  key: z.string().min(1).max(4),
  scale: z.string().min(1).max(40),
});

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) return new NextResponse('DB not configured', { status: 503 });
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

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
