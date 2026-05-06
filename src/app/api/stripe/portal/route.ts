import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db, isDbConfigured } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { getStripe } from '@/lib/stripe/server';

export async function POST() {
  if (!isDbConfigured()) return new NextResponse('DB not configured', { status: 503 });
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  const [user] = await db
    .select({ stripeCustomerId: users.stripeCustomerId })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!user?.stripeCustomerId) return new NextResponse('No Stripe customer', { status: 400 });

  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard/settings`,
  });
  return NextResponse.json({ url: portal.url });
}
