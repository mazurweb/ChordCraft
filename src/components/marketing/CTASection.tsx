import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="container py-20">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 p-10 text-center">
        <h2 className="text-3xl font-bold">Stop fighting music theory.</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Open the studio and write your first progression in 30 seconds. No signup required.
        </p>
        <Link href="/studio" className="mt-6 inline-block">
          <Button variant="gradient" size="lg">
            Launch Studio
          </Button>
        </Link>
      </div>
    </section>
  );
}
