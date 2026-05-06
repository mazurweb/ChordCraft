import { NextResponse, type NextRequest } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db, isDbConfigured } from '@/lib/db/client';
import { progressions } from '@/lib/db/schema';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDbConfigured()) return new NextResponse('DB not configured', { status: 503 });
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  const body = await req.json();
  const [updated] = await db
    .update(progressions)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(progressions.id, params.id), eq(progressions.userId, session.user.id)))
    .returning();
  if (!updated) return new NextResponse('Not found', { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDbConfigured()) return new NextResponse('DB not configured', { status: 503 });
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  await db
    .delete(progressions)
    .where(and(eq(progressions.id, params.id), eq(progressions.userId, session.user.id)));
  return new NextResponse(null, { status: 204 });
}
