import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// NOTE: untyped client. Once you regenerate types via
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
// thread the Database generic through here for full type safety on .from(...).select(...).
export function isSupabaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Component: ignore. Middleware refreshes the session cookie.
          }
        },
        remove: (name: string, options: CookieOptions) => {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // ignore
          }
        },
      },
    },
  );
}

export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: { get: () => undefined, set: () => undefined, remove: () => undefined },
    },
  );
}
