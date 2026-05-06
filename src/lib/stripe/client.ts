'use client';

import { loadStripe, type Stripe } from '@stripe/stripe-js';

let cached: Promise<Stripe | null> | null = null;

export function getStripeJs() {
  if (!cached) {
    cached = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return cached;
}
