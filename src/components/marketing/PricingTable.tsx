import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/lib/stripe/plans';

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    interval: '',
    features: ['Full studio access', '3 saved progressions', 'Public share links', 'All 12 genres'],
    cta: 'Start free',
    href: '/studio',
    variant: 'outline' as const,
  },
  {
    id: 'pro_monthly',
    name: 'Pro',
    price: `$${PLANS.pro_monthly.price}`,
    interval: '/mo',
    features: PLANS.pro_monthly.features,
    cta: 'Go Pro',
    href: '/pricing',
    variant: 'gradient' as const,
    highlight: true,
  },
  {
    id: 'studio_monthly',
    name: 'Studio',
    price: `$${PLANS.studio_monthly.price}`,
    interval: '/mo',
    features: PLANS.studio_monthly.features,
    cta: 'Get Studio',
    href: '/pricing',
    variant: 'outline' as const,
  },
];

export function PricingTable() {
  return (
    <section className="container py-16">
      <h2 className="mb-2 text-center text-3xl font-bold">Simple pricing</h2>
      <p className="mb-10 text-center text-muted-foreground">
        Start free. Upgrade when you&apos;re ready to ship.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.id}
            className={
              'rounded-xl border bg-card p-6 ' +
              (t.highlight ? 'border-brand-orange shadow-[0_0_40px_-15px_rgba(249,115,22,0.5)]' : 'border-border')
            }
          >
            <div className="text-sm uppercase tracking-wider text-muted-foreground">{t.name}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{t.price}</span>
              <span className="text-sm text-muted-foreground">{t.interval}</span>
            </div>
            <ul className="mt-5 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href={t.href} className="mt-6 block">
              <Button variant={t.variant} className="w-full">
                {t.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
