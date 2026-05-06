import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();
  if (!profile?.stripe_customer_id) return new NextResponse('No Stripe customer', { status: 400 });

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard/settings`,
  });
  return NextResponse.json({ url: session.url });
}
