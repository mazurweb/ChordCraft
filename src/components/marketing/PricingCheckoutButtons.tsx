'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { PlanKey } from '@/lib/stripe/plans';

const OPTIONS: { plan: PlanKey; label: string }[] = [
  { plan: 'pro_monthly', label: 'Subscribe to Pro (monthly)' },
  { plan: 'pro_yearly', label: 'Subscribe to Pro (yearly)' },
  { plan: 'studio_monthly', label: 'Subscribe to Studio (monthly)' },
];

export function PricingCheckoutButtons() {
  const [pending, setPending] = React.useState<PlanKey | null>(null);

  const checkout = async (plan: PlanKey) => {
    setPending(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 401) {
        window.location.href = `/login?redirectTo=/pricing`;
        return;
      }
      if (!res.ok) {
        alert(await res.text());
        return;
      }
      const { url } = await res.json();
      window.location.href = url;
    } finally {
      setPending(null);
    }
  };

  return (
    <section className="container max-w-xl space-y-3 pb-16">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Quick checkout
      </h3>
      {OPTIONS.map((o) => (
        <Button
          key={o.plan}
          variant="outline"
          className="w-full justify-between"
          onClick={() => checkout(o.plan)}
          disabled={pending !== null}
        >
          <span>{o.label}</span>
          <span className="text-xs text-muted-foreground">
            {pending === o.plan ? 'Redirecting…' : 'Stripe →'}
          </span>
        </Button>
      ))}
    </section>
  );
}
