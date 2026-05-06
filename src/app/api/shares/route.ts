import { NextResponse, type NextRequest } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db, isDbConfigured } from '@/lib/db/client';
import { progressions, shares } from '@/lib/db/schema';

const schema = z.object({ progression_id: z.string().uuid() });

function genShareId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) return new NextResponse('DB not configured', { status: 503 });
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return new NextResponse(body.error.message, { status: 400 });

  const [prog] = await db
    .select({ id: progressions.id })
    .from(progressions)
    .where(and(eq(progressions.id, body.data.progression_id), eq(progressions.userId, session.user.id)))
    .limit(1);
  if (!prog) return new NextResponse('Not found', { status: 404 });

  await db.update(progressions).set({ isPublic: true }).where(eq(progressions.id, prog.id));

  const shareId = genShareId();
  const [created] = await db.insert(shares).values({ progressionId: prog.id, shareId }).returning();
  return NextResponse.json(created, { status: 201 });
}
