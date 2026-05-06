'use client';

import { Button } from '@/components/ui/button';

export function ManageBillingButton({ hasCustomer }: { hasCustomer: boolean }) {
  const onClick = async () => {
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    const { url } = await res.json();
    window.location.href = url;
  };
  return (
    <Button variant="outline" onClick={onClick} disabled={!hasCustomer}>
      Manage billing
    </Button>
  );
}
