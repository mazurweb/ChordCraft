# ChordCraft

Genre-first music theory for modern producers. Pick a genre, get a key, build chord progressions that work.

Built with Next.js 14 (App Router, TypeScript, RSC), Tailwind CSS, Tone.js, **Neon Postgres + Drizzle ORM**, **Auth.js v5**, Stripe, and Claude.

## Status

Scaffolded from `CLAUDE_CODE_BUILD_SPEC.md`, then pivoted from Supabase to a Neon-only stack. Phases 1–3 are present:

- **Phase 1 (MVP parity)** — port of `chordcraft_mvp.html` to Next.js: 12 genres, 12 scales, 12 chord types, interactive piano with Tone.js, progression player with BPM-driven loop.
- **Phase 2 (Pro features)** — Auth.js v5 with Credentials (email/password) + optional Google OAuth, saved progressions with a 3-save free-tier cap, Stripe Checkout + webhook + customer portal, MIDI export, Claude `claude-sonnet-4-6` chord suggestions.
- **Phase 3 (Sharing & SEO)** — public share pages, iframe-friendly `/embed/[shareId]`, static genre / scale / key SEO pages.

## Setup

```bash
npm install
cp .env.example .env.local        # then fill in real keys
```

Required services:

1. **Neon** — create a Postgres project, copy the connection string into `DATABASE_URL`.
2. **Auth.js secret** — generate one with `openssl rand -base64 32` and put it in `AUTH_SECRET`.
3. **Google OAuth** *(optional)* — set `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` to enable the Google sign-in button. Leave blank and the button hides itself.
4. **Stripe** — create three subscription prices (Pro monthly, Pro yearly, Studio monthly) and paste the price IDs. Point a webhook at `<APP_URL>/api/stripe/webhook` for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Paste the signing secret into `STRIPE_WEBHOOK_SECRET`.
5. **Anthropic** — API key for the AI suggestions endpoint.

Apply the database migration:

```bash
npm run db:push        # development: pushes the Drizzle schema directly
# or
npm run db:migrate     # production: applies generated SQL from drizzle/migrations
```

The generated SQL lives at `drizzle/migrations/`.

## Run

```bash
npm run dev          # http://localhost:3000
npm run type-check   # tsc --noEmit
npm test             # vitest
npm run build
npm run db:studio    # drizzle-kit studio (local DB explorer)
```

## Architecture

```
src/
  app/
    layout.tsx                 # html/body shell, theme + session providers
    (main)/                    # Header + Footer wrap these routes
      layout.tsx
      page.tsx                 # marketing landing
      studio/                  # the studio (client-side, Tone.js)
      dashboard/               # saved progressions + settings (auth-gated)
      pricing/
      share/[shareId]/         # public progression
      genres/[genre]/          # static SEO
      scales/[scale]/
      keys/[key]/
      (auth)/login,signup
    embed/[shareId]/           # bare iframe widget (no Header/Footer)
    api/
      auth/[...nextauth]/      # Auth.js handlers (Credentials + optional Google)
      auth/register/           # signup → bcrypt + insert + auto sign-in
      progressions/            # CRUD (free tier capped at 3)
      midi-export/             # Pro+ only
      ai-suggest/              # Pro+ only — claude-sonnet-4-6
      stripe/checkout/         # creates subscription session
      stripe/webhook/          # syncs users.plan
      stripe/portal/           # customer self-service
      shares/                  # generates share_id

  components/
    studio/                    # Piano, GenreSelector, ChordBuilder, etc.
    marketing/                 # Hero, FeatureGrid, PricingTable…
    auth/                      # Login + Signup forms (next-auth/react)
    dashboard/                 # buttons & client widgets
    shared/                    # Header, Footer, ThemeProvider, SessionProvider
    ui/                        # shadcn-style primitives (button, card, dialog…)

  lib/
    theory/                    # scales, chords, parser, intervals
    audio/                     # Tone.js engine (singleton)
    midi/                      # midi-writer-js wrapper
    data/                      # NOTES, SCALE_PATTERNS, CHORD_PATTERNS, GENRES
    db/                        # Drizzle schema + Neon HTTP client
    auth.ts                    # Auth.js v5 config (Node runtime — DB + bcrypt)
    auth.config.ts             # Edge-safe config (used by middleware)
    stripe/                    # plans + server + browser
    ai/                        # claude.ts
    store/                     # zustand studio store

drizzle/
  migrations/                  # generated SQL via `npm run db:generate`
```

## Stack notes

- **DB driver** — `@neondatabase/serverless` over HTTP via `drizzle-orm/neon-http`. Works fine in serverless / edge functions, no connection pool to manage.
- **Auth.js v5 split config** — `auth.config.ts` is the edge-safe slice (no DB or bcrypt) used by `src/middleware.ts`. The full config (with the Drizzle adapter, Credentials provider, bcrypt) lives in `auth.ts` and is only imported by the Node-runtime route handlers / RSCs.
- **Session strategy** — JWT, with a `plan` claim refreshed from the `users` table on every JWT mint. The webhook updates `users.plan` directly; the next request mints a fresh JWT.
- **Authorization model** — explicit `WHERE user_id = ?` in every query (no Supabase RLS). The `auth()` call in route handlers gives us `session.user.id` to scope by.
- **Free-tier cap** — `/api/progressions` POST counts the user's rows and returns 402 once the user has 3 saves.
- **Tone.js** — loaded only on the client. `dynamic(..., { ssr: false })` for the studio, audio init on first user gesture.
- **Model ID** — uses `claude-sonnet-4-6` (the spec's `claude-sonnet-4-7` isn't a real model).
- **Stripe API version** — pinned to `2025-02-24.acacia`.
- **Tests** — unit tests cover theory + MIDI. No E2E yet.

## Deploy (Vercel + Neon)

1. Vercel ↔ GitHub: project should already be connected.
2. Vercel env: paste every key from `.env.example`. Set `NEXT_PUBLIC_APP_URL` to your production URL. `AUTH_URL` is derived automatically by Auth.js when running on Vercel.
3. Neon: run `npm run db:push` locally with the production `DATABASE_URL`, or commit a generated migration and run it via your CI.
4. Stripe webhook: point at `https://<your-domain>/api/stripe/webhook` and update `STRIPE_WEBHOOK_SECRET`.
