import type { NextAuthConfig } from 'next-auth';

// Edge-safe auth config — no DB, no bcrypt, no adapter. Used by middleware.
// Full provider list and adapter live in src/lib/auth.ts (node runtime).
export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  providers: [], // populated in src/lib/auth.ts
  callbacks: {
    authorized({ auth, request }) {
      const isAuthed = !!auth?.user;
      const url = request.nextUrl.pathname;
      const isAuthRoute = url.startsWith('/dashboard');
      if (isAuthRoute && !isAuthed) return false; // triggers redirect to /login
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string;
      session.user.plan = (token.plan as 'free' | 'pro' | 'studio') ?? 'free';
      return session;
    },
  },
};
