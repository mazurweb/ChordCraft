import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import { db, isDbConfigured } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { getStripe } from '@/lib/stripe/server';
import { planFromPriceId } from '@/lib/stripe/plans';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) return new NextResponse('DB not configured', { status: 503 });
  const stripe = getStripe();
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return new NextResponse('Webhook misconfigured', { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    return new NextResponse(`Bad signature: ${err instanceof Error ? err.message : 'unknown'}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const subId =
        typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
      if (userId && subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        const priceId = sub.items.data[0]?.price.id;
        const plan = priceId ? planFromPriceId(priceId) : 'free';
        await db
          .update(users)
          .set({
            plan,
            stripeSubscriptionId: sub.id,
            subscriptionStatus: sub.status,
          })
          .where(eq(users.id, userId));
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price.id;
      const plan =
        sub.status === 'active' || sub.status === 'trialing'
          ? priceId
            ? planFromPriceId(priceId)
            : 'free'
          : 'free';
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
      await db
        .update(users)
        .set({ plan, subscriptionStatus: sub.status })
        .where(eq(users.stripeCustomerId, customerId));
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
