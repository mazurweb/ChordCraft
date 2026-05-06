import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe/server';
import { getPriceId, type PlanKey } from '@/lib/stripe/plans';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  plan: z.enum(['pro_monthly', 'pro_yearly', 'studio_monthly']),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return new NextResponse(body.error.message, { status: 400 });
  const planKey = body.data.plan as PlanKey;
  const priceId = getPriceId(planKey);
  if (!priceId) return new NextResponse('Plan not configured', { status: 500 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email')
    .eq('id', user.id)
    .single();

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  let customerId = profile?.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    metadata: { user_id: user.id, plan: planKey },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
