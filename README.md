# ChordCraft

Genre-first music theory for modern producers. Pick a genre, get a key, build chord progressions that work.

Built with Next.js 14 (App Router, TypeScript, RSC), Tailwind CSS, Tone.js, Supabase, Stripe, and Claude.

## Status

Scaffolded from `CLAUDE_CODE_BUILD_SPEC.md`. Phases 1–3 are present:

- **Phase 1 (MVP parity)** — port of `chordcraft_mvp.html` to Next.js: 12 genres, 12 scales, 12 chord types, interactive piano with Tone.js, progression player with BPM-driven loop.
- **Phase 2 (Pro features)** — Supabase auth (email + Google OAuth), saved progressions with a 3-save free-tier cap, Stripe Checkout + webhook + customer portal, MIDI export, Claude `claude-sonnet-4-6` chord suggestions.
- **Phase 3 (Sharing & SEO)** — public share pages, iframe-friendly `/embed/[shareId]`, static genre / scale / key SEO pages.

## Setup

```bash
npm install
cp .env.example .env.local        # then fill in real keys
```

Required services:

1. **Supabase** — create a project, paste the URL + anon + service-role keys into `.env.local`. Run the SQL in `supabase/migrations/0001_initial_schema.sql` in the SQL editor (or `npx supabase db push` if using the CLI).
2. **Stripe** — create three subscription prices (Pro monthly, Pro yearly, Studio monthly) and paste the price IDs. Point a webhook at `<APP_URL>/api/stripe/webhook` listening for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Paste the signing secret into `STRIPE_WEBHOOK_SECRET`.
3. **Anthropic** — create an API key for the AI suggestions endpoint.

## Run

```bash
npm run dev          # http://localhost:3000
npm run type-check   # tsc --noEmit
npm test             # vitest
npm run build
```

## Architecture

```
src/
  app/
    layout.tsx                 # html/body shell, theme provider
    (main)/                    # Header + Footer wrap these routes
      layout.tsx
      page.tsx                 # marketing landing
      studio/                  # the studio (client-side, Tone.js)
      dashboard/               # saved progressions + settings
      pricing/
      share/[shareId]/         # public progression
      genres/[genre]/          # static SEO
      scales/[scale]/
      keys/[key]/
      (auth)/login,signup
    embed/[shareId]/           # bare iframe widget (no Header/Footer)
    auth/callback/             # Supabase OAuth redirect
    api/
      progressions/            # CRUD (free tier capped at 3)
      midi-export/             # Pro+ only
      ai-suggest/              # Pro+ only — claude-sonnet-4-6
      stripe/checkout/         # creates subscription session
      stripe/webhook/          # syncs profiles.plan
      stripe/portal/           # customer self-service
      shares/                  # generates share_id

  components/
    studio/                    # Piano, GenreSelector, ChordBuilder, etc.
    marketing/                 # Hero, FeatureGrid, PricingTable…
    auth/                      # Login + Signup forms
    dashboard/                 # buttons & client widgets
    shared/                    # Header, Footer, ThemeProvider
    ui/                        # shadcn-style primitives (button, card, dialog…)

  lib/
    theory/                    # scales, chords, parser, intervals
    audio/                     # Tone.js engine (singleton)
    midi/                      # midi-writer-js wrapper
    data/                      # NOTES, SCALE_PATTERNS, CHORD_PATTERNS, GENRES
    supabase/                  # client + server + middleware
    stripe/                    # plans + server + browser
    ai/                        # claude.ts
    store/                     # zustand studio store
```

## Notes & known limitations

- **Tone.js** is loaded only on the client. The studio component uses `dynamic(..., { ssr: false })`. Audio init happens on first user gesture.
- **Model ID** — the spec referenced `claude-sonnet-4-7`; that's not a valid model. Code uses `claude-sonnet-4-6` (current Sonnet).
- **Stripe API version** — pinned to `2024-10-28.acacia` in `lib/stripe/server.ts`; bump if your account is on a newer version.
- **Free-tier cap** — `/api/progressions` POST checks `count(*)` and returns 402 once the user has 3 saves. The dashboard shows the count but doesn't visually warn — easy follow-up.
- **Share view counts** — RLS allows public read on `shares` but not write; bumping `view_count` requires a service-role server action. Stubbed for now.
- **Tests** — unit tests cover theory + MIDI. No E2E yet (per the spec, ships in Phase 3 polish).
- **Next.js root layout** — split into a bare root (`app/layout.tsx`) and a `(main)` group layout that adds Header/Footer, so `/embed` can render bare for iframes.

## Deploy

1. Push to GitHub, import into Vercel.
2. Set every key from `.env.example` in Vercel project settings.
3. Set `NEXT_PUBLIC_APP_URL` to the production URL.
4. Repoint your Stripe webhook to `https://<your-domain>/api/stripe/webhook` and update `STRIPE_WEBHOOK_SECRET`.
5. Custom domain `chordcraft.app` (per spec).
