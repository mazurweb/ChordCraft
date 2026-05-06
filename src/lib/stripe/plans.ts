export const PLANS = {
  pro_monthly: {
    name: 'Pro',
    price: 9.99,
    interval: 'month' as const,
    priceIdEnv: 'STRIPE_PRICE_ID_PRO_MONTHLY',
    plan: 'pro' as const,
    features: [
      'Unlimited saved progressions',
      'MIDI export',
      'AI chord suggestions',
      'Premium sample sounds',
    ],
  },
  pro_yearly: {
    name: 'Pro (yearly)',
    price: 79,
    interval: 'year' as const,
    priceIdEnv: 'STRIPE_PRICE_ID_PRO_YEARLY',
    plan: 'pro' as const,
    features: ['All Pro features', 'Save 33% vs monthly'],
  },
  studio_monthly: {
    name: 'Studio',
    price: 29.99,
    interval: 'month' as const,
    priceIdEnv: 'STRIPE_PRICE_ID_STUDIO_MONTHLY',
    plan: 'studio' as const,
    features: ['Everything in Pro', 'Advanced AI features', 'Bulk MIDI export', 'API access'],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPriceId(key: PlanKey): string | undefined {
  return process.env[PLANS[key].priceIdEnv];
}

export function planFromPriceId(priceId: string): 'free' | 'pro' | 'studio' {
  for (const def of Object.values(PLANS)) {
    if (process.env[def.priceIdEnv] === priceId) return def.plan;
  }
  return 'free';
}
