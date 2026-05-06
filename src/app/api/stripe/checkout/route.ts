import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db, isDbConfigured } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { getStripe } from '@/lib/stripe/server';
import { getPriceId, type PlanKey } from '@/lib/stripe/plans';

const schema = z.object({
  plan: z.enum(['pro_monthly', 'pro_yearly', 'studio_monthly']),
});

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) return new NextResponse('DB not configured', { status: 503 });
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return new NextResponse(body.error.message, { status: 400 });
  const planKey = body.data.plan as PlanKey;
  const priceId = getPriceId(planKey);
  if (!priceId) return new NextResponse('Plan not configured', { status: 500 });

  const [user] = await db
    .select({ stripeCustomerId: users.stripeCustomerId, email: users.email })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!user) return new NextResponse('User not found', { status: 404 });

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: session.user.id },
    });
    customerId = customer.id;
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, session.user.id));
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    metadata: { user_id: session.user.id, plan: planKey },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: checkout.url });
}
