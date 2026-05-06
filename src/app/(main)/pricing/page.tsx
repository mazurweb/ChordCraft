import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Pricing — ChordCraft' };

export default function PricingPage() {
  return (
    <div className="container max-w-2xl py-20 text-center">
      <h1 className="text-4xl font-bold">Free during beta</h1>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">
        Every feature is available to anyone with an account while ChordCraft is in beta —
        unlimited saved progressions, MIDI export, AI suggestions, public sharing.
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Paid plans will land later. Current users get grandfathered.
      </p>
      <Link href="/studio" className="mt-8 inline-block">
        <Button variant="gradient" size="lg">
          Open Studio
        </Button>
      </Link>
    </div>
  );
}
