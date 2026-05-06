import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function Header() {
  const user = isSupabaseConfigured()
    ? (await createClient().auth.getUser()).data.user
    : null;

  return (
    <header className="border-b border-border">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🎹</span>
          <span className="text-lg font-bold text-brand-gradient">ChordCraft</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/studio">
            <Button variant="ghost" size="sm">
              Studio
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              Pricing
            </Button>
          </Link>
          {user ? (
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="gradient" size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
