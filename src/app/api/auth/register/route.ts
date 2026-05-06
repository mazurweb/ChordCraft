import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db, isDbConfigured } from '@/lib/db/client';
import { users } from '@/lib/db/schema';

const schema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(72), // bcrypt's hard limit is 72
});

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) return new NextResponse('DB not configured', { status: 503 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return new NextResponse(body.error.message, { status: 400 });

  const email = body.data.email.toLowerCase();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return new NextResponse('An account with this email already exists', { status: 409 });

  const passwordHash = await bcrypt.hash(body.data.password, 10);
  const [created] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning({ id: users.id, email: users.email });

  return NextResponse.json({ id: created.id, email: created.email }, { status: 201 });
}
