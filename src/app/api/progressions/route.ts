import { NextResponse, type NextRequest } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db, isDbConfigured } from '@/lib/db/client';
import { progressions } from '@/lib/db/schema';

const upsertSchema = z.object({
  name: z.string().min(1).max(100),
  genre: z.string().min(1).max(40),
  key: z.string().min(1).max(4),
  scale: z.string().min(1).max(40),
  bpm: z.number().int().min(40).max(240),
  chords: z.array(z.string()).min(1).max(32),
  roman: z.array(z.string()).optional(),
  is_public: z.boolean().optional(),
});

export async function GET() {
  if (!isDbConfigured()) return new NextResponse('DB not configured', { status: 503 });
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  const rows = await db
    .select()
    .from(progressions)
    .where(eq(progressions.userId, session.user.id))
    .orderBy(desc(progressions.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) return new NextResponse('DB not configured', { status: 503 });
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  const body = upsertSchema.safeParse(await req.json());
  if (!body.success) return new NextResponse(body.error.message, { status: 400 });

  const { name, genre, key, scale, bpm, chords, roman, is_public } = body.data;
  const [created] = await db
    .insert(progressions)
    .values({
      userId: session.user.id,
      name,
      genre,
      key,
      scale,
      bpm,
      chords: { chords, roman },
      isPublic: !!is_public,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
