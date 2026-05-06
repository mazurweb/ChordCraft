import Stripe from 'stripe';

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  cached = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-10-28.acacia' });
  return cached;
}
