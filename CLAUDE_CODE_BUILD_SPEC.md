# ChordCraft — Claude Code Build Specification

## Project: Music Theory Web App for Modern Producers
**Type:** Next.js 14 SaaS application
**Domain:** chordcraft.app
**Reference MVP:** `/mnt/user-data/uploads/chordcraft_mvp.html` (single-file prototype showing UI/UX and music theory logic)

---

## 0. Read First

Before writing any code, read these in order:
1. This entire spec file
2. The MVP HTML file (`chordcraft_mvp.html`) — it contains all music theory logic, genre data, and UI patterns that need to be ported to React/TypeScript
3. The product plan (`ChordCraft_Product_Plan.md`) for business context

The MVP is the **visual and functional source of truth**. Your job is to port it to Next.js with proper architecture, add server-side features (auth, subscriptions, MIDI export, AI suggestions), and make it production-ready.

---

## 1. Tech Stack (Definitive)

```
Framework:    Next.js 14+ (App Router, TypeScript, Server Components)
Styling:      Tailwind CSS + shadcn/ui
Audio:        Tone.js (client-only, requires SSR handling)
Theory:       Tonal.js (works server + client)
MIDI:         midi-writer-js
State:        React Server Components + Zustand (client state)
Forms:        react-hook-form + Zod
Database:     Supabase (Postgres)
Auth:         Supabase Auth (email/password + OAuth)
Payments:     Stripe (subscriptions)
AI:           Anthropic Claude API (claude-sonnet-4-7)
Deployment:   Vercel
Analytics:    Vercel Analytics + Posthog (optional)
```

**Do NOT use:** Redux, MobX, raw fetch (use server actions or React Query), CSS modules, styled-components.

---

## 2. Project Setup Commands

```bash
# Create the project
npx create-next-app@latest chordcraft --typescript --tailwind --app --src-dir --import-alias "@/*"
cd chordcraft

# Initialize shadcn/ui
npx shadcn-ui@latest init
# Select: Default, Slate, CSS variables: yes

# Install components
npx shadcn-ui@latest add button card dialog input label select slider tabs toast tooltip dropdown-menu separator badge

# Audio & music theory
npm install tone tonal midi-writer-js

# Database & auth
npm install @supabase/ssr @supabase/supabase-js

# Payments
npm install stripe @stripe/stripe-js

# AI
npm install @anthropic-ai/sdk

# State & utilities
npm install zustand zod react-hook-form @hookform/resolvers

# Icons & motion
npm install lucide-react framer-motion

# Dev dependencies
npm install -D @types/node prettier eslint-config-prettier

# Initialize git
git init
git add .
git commit -m "Initial Next.js setup with ChordCraft dependencies"
```

---

## 3. Environment Variables

Create `.env.local` with these keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID_PRO_MONTHLY=
STRIPE_PRICE_ID_PRO_YEARLY=
STRIPE_PRICE_ID_STUDIO_MONTHLY=

# Anthropic
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Add `.env.local` to `.gitignore` (already there from create-next-app).

---

## 4. File Structure

```
chordcraft/
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Root layout with Toaster
│   │   ├── page.tsx                        # Marketing landing page
│   │   ├── globals.css                     # Tailwind + shadcn variables
│   │   │
│   │   ├── studio/
│   │   │   ├── page.tsx                    # Main app (auth-gated for save features)
│   │   │   └── loading.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── auth/callback/route.ts      # Supabase OAuth callback
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx                    # User's saved progressions
│   │   │   └── settings/page.tsx
│   │   │
│   │   ├── pricing/page.tsx                # Pricing page
│   │   ├── share/[shareId]/page.tsx        # Public progression share
│   │   │
│   │   └── api/
│   │       ├── progressions/route.ts       # CRUD saved progressions
│   │       ├── ai-suggest/route.ts         # Claude API for chord suggestions
│   │       ├── midi-export/route.ts        # Generate .mid file
│   │       ├── stripe/
│   │       │   ├── checkout/route.ts       # Create checkout session
│   │       │   └── webhook/route.ts        # Handle Stripe events
│   │       └── shares/route.ts             # Create/fetch shared progressions
│   │
│   ├── components/
│   │   ├── ui/                             # shadcn components (auto-generated)
│   │   │
│   │   ├── studio/
│   │   │   ├── Studio.tsx                  # Main studio container (client)
│   │   │   ├── Piano.tsx                   # Interactive piano keyboard
│   │   │   ├── GenreSelector.tsx           # Genre grid + info
│   │   │   ├── KeyScaleSelector.tsx        # Key + scale dropdowns
│   │   │   ├── NotesDisplay.tsx            # Scale notes with intervals
│   │   │   ├── ChordBuilder.tsx            # Chord type buttons + builder
│   │   │   ├── ProgressionList.tsx         # Suggested progressions panel
│   │   │   ├── ProgressionPlayer.tsx       # Active progression + playback
│   │   │   ├── TempoControl.tsx            # BPM input + transport
│   │   │   └── SaveProgressionDialog.tsx   # Save dialog (auth required)
│   │   │
│   │   ├── marketing/
│   │   │   ├── Hero.tsx
│   │   │   ├── FeatureGrid.tsx
│   │   │   ├── PricingTable.tsx
│   │   │   ├── GenreShowcase.tsx
│   │   │   └── CTASection.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   │
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── ThemeProvider.tsx
│   │
│   ├── lib/
│   │   ├── theory/
│   │   │   ├── scales.ts                   # Scale calculations
│   │   │   ├── chords.ts                   # Chord building
│   │   │   ├── progressions.ts             # Progression utilities
│   │   │   ├── intervals.ts                # Interval naming
│   │   │   └── parser.ts                   # Parse "Cmaj7" → {root, type}
│   │   │
│   │   ├── audio/
│   │   │   ├── tone-engine.ts              # Tone.js wrapper (client-only)
│   │   │   └── synth-presets.ts            # Different synth voicings
│   │   │
│   │   ├── midi/
│   │   │   └── exporter.ts                 # midi-writer-js wrapper
│   │   │
│   │   ├── data/
│   │   │   ├── genres.ts                   # All genre data (port from MVP)
│   │   │   ├── scale-patterns.ts           # SCALE_PATTERNS constant
│   │   │   └── chord-patterns.ts           # CHORD_PATTERNS constant
│   │   │
│   │   ├── supabase/
│   │   │   ├── client.ts                   # Browser client
│   │   │   ├── server.ts                   # Server client (for Server Components)
│   │   │   ├── middleware.ts               # Auth middleware
│   │   │   └── types.ts                    # Generated database types
│   │   │
│   │   ├── stripe/
│   │   │   ├── client.ts                   # Stripe.js wrapper
│   │   │   ├── server.ts                   # Server-side Stripe
│   │   │   └── plans.ts                    # Plan definitions
│   │   │
│   │   ├── ai/
│   │   │   └── claude.ts                   # Claude API wrapper
│   │   │
│   │   ├── store/
│   │   │   └── studio-store.ts             # Zustand store for studio state
│   │   │
│   │   └── utils.ts                        # cn() helper from shadcn
│   │
│   ├── types/
│   │   ├── music.ts                        # Music theory types
│   │   ├── database.ts                     # Supabase types
│   │   └── index.ts
│   │
│   └── middleware.ts                       # Next.js middleware (auth)
│
├── public/
│   ├── og-image.png
│   └── favicon.ico
│
├── supabase/
│   └── migrations/
│       └── 0001_initial_schema.sql         # Database schema
│
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## 5. Phase 1: MVP Parity (Build This First)

**Goal:** Recreate everything in `chordcraft_mvp.html` with proper Next.js architecture.

### Build Order

#### Step 1: Port the music theory engine

Create `src/lib/data/scale-patterns.ts`:

```typescript
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type Note = typeof NOTES[number];

export const SCALE_PATTERNS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
  melodic_minor: [0, 2, 3, 5, 7, 9, 11],
  pentatonic_major: [0, 2, 4, 7, 9],
  pentatonic_minor: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
} as const;

export type ScaleName = keyof typeof SCALE_PATTERNS;

export const SCALE_DISPLAY_NAMES: Record<ScaleName, string> = {
  major: 'Major',
  minor: 'Minor (Natural)',
  dorian: 'Dorian',
  phrygian: 'Phrygian',
  lydian: 'Lydian',
  mixolydian: 'Mixolydian',
  locrian: 'Locrian',
  harmonic_minor: 'Harmonic Minor',
  melodic_minor: 'Melodic Minor',
  pentatonic_major: 'Major Pentatonic',
  pentatonic_minor: 'Minor Pentatonic',
  blues: 'Blues',
};

export const INTERVAL_NAMES: Record<number, string> = {
  0: 'Root', 1: 'b2', 2: '2nd', 3: 'b3', 4: '3rd', 5: '4th',
  6: 'b5', 7: '5th', 8: 'b6', 9: '6th', 10: 'b7', 11: '7th',
};
```

Create `src/lib/data/chord-patterns.ts`:

```typescript
export const CHORD_PATTERNS = {
  maj: { intervals: [0, 4, 7], suffix: '' },
  min: { intervals: [0, 3, 7], suffix: 'm' },
  dim: { intervals: [0, 3, 6], suffix: 'dim' },
  aug: { intervals: [0, 4, 8], suffix: 'aug' },
  sus2: { intervals: [0, 2, 7], suffix: 'sus2' },
  sus4: { intervals: [0, 5, 7], suffix: 'sus4' },
  maj7: { intervals: [0, 4, 7, 11], suffix: 'maj7' },
  min7: { intervals: [0, 3, 7, 10], suffix: 'm7' },
  dom7: { intervals: [0, 4, 7, 10], suffix: '7' },
  maj9: { intervals: [0, 4, 7, 11, 14], suffix: 'maj9' },
  min9: { intervals: [0, 3, 7, 10, 14], suffix: 'm9' },
  add9: { intervals: [0, 4, 7, 14], suffix: 'add9' },
} as const;

export type ChordType = keyof typeof CHORD_PATTERNS;

export const CHORD_DISPLAY_NAMES: Record<ChordType, string> = {
  maj: 'Major', min: 'Minor', dim: 'Dim', aug: 'Aug',
  sus2: 'Sus2', sus4: 'Sus4',
  maj7: 'Maj7', min7: 'Min7', dom7: 'Dom7',
  maj9: 'Maj9', min9: 'Min9', add9: 'Add9',
};
```

Port the genres from MVP into `src/lib/data/genres.ts` — copy the full `GENRES` object from the MVP HTML file. Type it strictly:

```typescript
export interface Genre {
  id: string;
  name: string;
  keys: string[];
  bpm: number;
  scale: ScaleName;
  defaultKey: Note;
  mood: string;
  scales: ScaleName[];
  progressions: Progression[];
}

export interface Progression {
  name: string;
  chords: string[];
  roman: string[];
}

export const GENRES: Record<string, Genre> = { /* port from MVP */ };
```

#### Step 2: Theory utilities

Create `src/lib/theory/scales.ts`, `chords.ts`, `parser.ts` — port the helper functions from the MVP:
- `getNoteIndex(note)` 
- `getScaleNotes(rootNote, scaleName)`
- `getChordNotes(rootNote, chordType)`
- `parseChordName(chordStr)` — handles "Cmaj7", "F#m", "Bb", etc.

Use **Tonal.js** where it simplifies things (e.g., for Roman numeral analysis later), but the core logic from the MVP works fine for Phase 1.

#### Step 3: Audio engine (CRITICAL — Tone.js + Next.js gotcha)

Tone.js requires `window` and breaks SSR. Wrap it carefully:

`src/lib/audio/tone-engine.ts`:

```typescript
'use client';

import * as Tone from 'tone';

class ToneEngine {
  private synth: Tone.Synth | null = null;
  private chordSynth: Tone.PolySynth | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    if (typeof window === 'undefined') return;

    await Tone.start();
    
    this.synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 }
    }).toDestination();
    
    this.chordSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 1.5 }
    }).toDestination();
    this.chordSynth.volume.value = -8;
    
    this.initialized = true;
  }

  async playNote(note: string, octave = 4, duration = 0.3) {
    await this.init();
    this.synth?.triggerAttackRelease(`${note}${octave}`, duration);
  }

  async playChord(notes: string[], octave = 3, duration = 1) {
    await this.init();
    const noteNames = notes.map(n => `${n}${octave}`);
    this.chordSynth?.triggerAttackRelease(noteNames, duration);
  }

  setBpm(bpm: number) {
    Tone.Transport.bpm.value = bpm;
  }
}

export const toneEngine = new ToneEngine();
```

**Important:** All components using `toneEngine` MUST be `'use client'` and only call methods inside `useEffect` or event handlers.

#### Step 4: Studio store (Zustand)

`src/lib/store/studio-store.ts`:

```typescript
'use client';

import { create } from 'zustand';
import type { Note, ScaleName } from '@/lib/data/scale-patterns';
import type { ChordType } from '@/lib/data/chord-patterns';
import type { Progression } from '@/lib/data/genres';

interface StudioState {
  genre: string;
  key: Note;
  scale: ScaleName;
  chordRoot: Note | null;
  chordType: ChordType;
  activeProgression: Progression | null;
  bpm: number;
  isPlaying: boolean;
  currentChordIndex: number;
  
  setGenre: (genre: string) => void;
  setKey: (key: Note) => void;
  setScale: (scale: ScaleName) => void;
  setChordRoot: (note: Note | null) => void;
  setChordType: (type: ChordType) => void;
  loadProgression: (prog: Progression) => void;
  setBpm: (bpm: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentChordIndex: (idx: number) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  genre: 'phonk',
  key: 'D',
  scale: 'minor',
  chordRoot: null,
  chordType: 'maj',
  activeProgression: null,
  bpm: 90,
  isPlaying: false,
  currentChordIndex: 0,
  
  setGenre: (genre) => set({ genre }),
  setKey: (key) => set({ key }),
  setScale: (scale) => set({ scale }),
  setChordRoot: (chordRoot) => set({ chordRoot }),
  setChordType: (chordType) => set({ chordType }),
  loadProgression: (activeProgression) => set({ activeProgression, currentChordIndex: 0 }),
  setBpm: (bpm) => set({ bpm }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentChordIndex: (currentChordIndex) => set({ currentChordIndex }),
}));
```

#### Step 5: React components

Build these in order, referencing the MVP for visual layout:

1. `Piano.tsx` — Most complex component. Use absolute positioning for black keys, relative for whites. Highlight scale notes (orange), root (red), chord notes (purple). Click to set chord root + play note.

2. `GenreSelector.tsx` — Grid of buttons. Updates store on click.

3. `KeyScaleSelector.tsx` — Two `<Select>` dropdowns from shadcn.

4. `NotesDisplay.tsx` — Pills showing scale notes with intervals.

5. `ChordBuilder.tsx` — Grid of chord type buttons. Shows current chord name + notes.

6. `ProgressionList.tsx` — Lists `genres[currentGenre].progressions`. Click to load.

7. `ProgressionPlayer.tsx` — Shows active progression cards. Play button cycles through chords using `setInterval` based on BPM.

8. `Studio.tsx` — Three-panel layout container.

#### Step 6: Pages

`src/app/studio/page.tsx`:

```tsx
import { Studio } from '@/components/studio/Studio';

export default function StudioPage() {
  return <Studio />;
}

export const metadata = {
  title: 'ChordCraft Studio — Build chords, progressions, and melodies',
};
```

`src/app/page.tsx` — Marketing landing page:
- Hero with "Pick a genre. Get a key. Build chords that work."
- Feature grid (12 genres, 12 scales, 12 chord types, MIDI export)
- Embedded mini-piano demo (auto-playing a phonk progression)
- Pricing teaser
- Footer with social links

#### Phase 1 Acceptance Criteria

- [ ] All 12 genres selectable, update key/BPM/scale
- [ ] Piano renders with proper highlighting
- [ ] Click any note to play it via Tone.js
- [ ] Chord builder generates correct notes
- [ ] Progressions play in loop at correct BPM
- [ ] Mobile responsive (stack panels vertically <1024px)
- [ ] No SSR errors (Tone.js handled correctly)
- [ ] Lighthouse score 90+ on landing page

---

## 6. Phase 2: Pro Features

### Step 7: Supabase setup

Run this SQL in Supabase dashboard or via migration:

```sql
-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  username text unique,
  plan text default 'free' check (plan in ('free', 'pro', 'studio')),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Saved progressions
create table public.progressions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  genre text not null,
  key text not null,
  scale text not null,
  chords jsonb not null,
  bpm integer not null,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index progressions_user_id_idx on public.progressions(user_id);
create index progressions_is_public_idx on public.progressions(is_public);

-- Public shares
create table public.shares (
  id uuid default gen_random_uuid() primary key,
  progression_id uuid references public.progressions on delete cascade not null,
  share_id text unique not null,
  view_count integer default 0,
  created_at timestamptz default now()
);

create index shares_share_id_idx on public.shares(share_id);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.progressions enable row level security;
alter table public.shares enable row level security;

create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can read own progressions" on public.progressions
  for select using (auth.uid() = user_id);
create policy "Users can read public progressions" on public.progressions
  for select using (is_public = true);
create policy "Users can insert own progressions" on public.progressions
  for insert with check (auth.uid() = user_id);
create policy "Users can update own progressions" on public.progressions
  for update using (auth.uid() = user_id);
create policy "Users can delete own progressions" on public.progressions
  for delete using (auth.uid() = user_id);

create policy "Anyone can read shares" on public.shares
  for select using (true);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### Step 8: Auth flow

Use Supabase SSR Auth Helpers:
- `src/lib/supabase/client.ts` — browser client
- `src/lib/supabase/server.ts` — server client for Server Components
- `src/middleware.ts` — refresh sessions

Build login/signup forms with `react-hook-form` + Zod validation. Use Supabase OAuth (Google, GitHub) for one-click signup.

### Step 9: Save/Load progressions

Server actions in `src/app/api/progressions/route.ts`:
- `POST` — Save new progression (requires auth, free tier limited to 3)
- `GET` — List user's progressions
- `PATCH /:id` — Update
- `DELETE /:id` — Remove

Add "Save" button to ProgressionPlayer. If unauthenticated, show signup modal.

### Step 10: MIDI export (Pro feature)

`src/lib/midi/exporter.ts`:

```typescript
import MidiWriter from 'midi-writer-js';
import { getChordNotes } from '@/lib/theory/chords';
import { parseChordName } from '@/lib/theory/parser';

export function generateProgressionMidi(
  progression: { chords: string[] },
  bpm: number,
  octave = 3
): Buffer {
  const track = new MidiWriter.Track();
  track.setTempo(bpm);
  
  progression.chords.forEach(chordStr => {
    const parsed = parseChordName(chordStr);
    if (!parsed) return;
    
    const notes = getChordNotes(parsed.root, parsed.type);
    const midiNotes = notes.map(n => `${n}${octave}`);
    
    const noteEvent = new MidiWriter.NoteEvent({
      pitch: midiNotes,
      duration: '2', // half note (2 beats)
      velocity: 80,
    });
    
    track.addEvent(noteEvent);
  });
  
  const writer = new MidiWriter.Writer([track]);
  return Buffer.from(writer.buildFile());
}
```

`src/app/api/midi-export/route.ts`:

```typescript
import { generateProgressionMidi } from '@/lib/midi/exporter';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Check user's plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();
  
  if (profile?.plan === 'free') {
    return new Response('MIDI export requires Pro plan', { status: 403 });
  }
  
  const { progression, bpm, name } = await req.json();
  const midiBuffer = generateProgressionMidi(progression, bpm);
  
  return new Response(midiBuffer, {
    headers: {
      'Content-Type': 'audio/midi',
      'Content-Disposition': `attachment; filename="${name}.mid"`,
    },
  });
}
```

### Step 11: Stripe integration

`src/lib/stripe/plans.ts`:

```typescript
export const PLANS = {
  pro_monthly: {
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    priceId: process.env.STRIPE_PRICE_ID_PRO_MONTHLY!,
    features: [
      'Unlimited saved progressions',
      'MIDI export',
      'AI chord suggestions',
      'Premium sample sounds',
    ],
  },
  pro_yearly: {
    name: 'Pro',
    price: 79,
    interval: 'year',
    priceId: process.env.STRIPE_PRICE_ID_PRO_YEARLY!,
    features: [
      'All Pro features',
      'Save 33% vs monthly',
    ],
  },
  studio_monthly: {
    name: 'Studio',
    price: 29.99,
    interval: 'month',
    priceId: process.env.STRIPE_PRICE_ID_STUDIO_MONTHLY!,
    features: [
      'Everything in Pro',
      'Advanced AI features',
      'Bulk MIDI export',
      'API access',
    ],
  },
};
```

Build:
- `/pricing` page with plan cards
- `/api/stripe/checkout` route to create Checkout sessions
- `/api/stripe/webhook` route to handle subscription events (update `profiles.plan`)
- Customer portal link for managing subscriptions

### Step 12: AI chord suggestions

`src/lib/ai/claude.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function suggestNextChord(
  currentProgression: string[],
  genre: string,
  key: string,
  scale: string
): Promise<{ suggestions: { chord: string; reason: string }[] }> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-7',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `You are a music theory expert. The user is making a ${genre} track in ${key} ${scale}.

Their current chord progression is: ${currentProgression.join(' → ')}

Suggest 3 chords that could come next. For each, explain why it works in this genre and key. Return ONLY valid JSON in this exact format:

{
  "suggestions": [
    {"chord": "Am", "reason": "Brief reason why"},
    {"chord": "F", "reason": "Brief reason why"},
    {"chord": "G", "reason": "Brief reason why"}
  ]
}

No preamble, no markdown, just the JSON.`
    }],
  });
  
  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return JSON.parse(text);
}
```

`src/app/api/ai-suggest/route.ts`:

```typescript
import { suggestNextChord } from '@/lib/ai/claude';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return new Response('Unauthorized', { status: 401 });
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();
  
  if (profile?.plan === 'free') {
    return new Response('AI suggestions require Pro plan', { status: 403 });
  }
  
  const body = await req.json();
  const result = await suggestNextChord(
    body.progression,
    body.genre,
    body.key,
    body.scale
  );
  
  return Response.json(result);
}
```

#### Phase 2 Acceptance Criteria

- [ ] Email/password + Google OAuth signup working
- [ ] Free users limited to 3 saved progressions
- [ ] Pro users can save unlimited + export MIDI
- [ ] MIDI files import correctly into FL Studio + Ableton
- [ ] Stripe checkout flow working end-to-end
- [ ] Webhook properly updates user plans
- [ ] AI suggestions return valid chords for each genre
- [ ] Customer portal accessible for plan management

---

## 7. Phase 3: Sharing & Polish

### Step 13: Public shares

- "Share" button on saved progressions creates a `shares` row with a 6-character `share_id`
- Public route `/share/[shareId]` shows the progression with a "Try it yourself" CTA
- Increment `view_count` on each visit
- Add OG image generation with `@vercel/og` showing the progression

### Step 14: Embeddable widget

Create `/embed/[shareId]` route that returns a minimal widget version (no header, no footer, just the player). Allow iframe embedding for music blogs.

### Step 15: SEO content

Generate static pages for:
- `/genres/[genre]` — Deep dive on each genre with progressions
- `/scales/[scale]` — Each scale explained with examples
- `/keys/[key]` — Common chords in each key

These should be Server Components with full SEO metadata for organic traffic.

### Step 16: Marketing landing page polish

- Add testimonials section (collect from beta users)
- Add "Made in ChordCraft" showcase (user tracks)
- Implement Posthog analytics for conversion tracking
- A/B test pricing page CTAs

---

## 8. Critical Implementation Notes

### Tone.js + Next.js gotchas

1. **Always wrap in `'use client'`** — never import Tone in Server Components
2. **Initialize on user gesture** — Web Audio API requires user interaction. Call `Tone.start()` on first click only.
3. **Lazy load** — Use dynamic imports for the Studio component:
   ```tsx
   const Studio = dynamic(() => import('@/components/studio/Studio'), { ssr: false });
   ```
4. **Cleanup** — In `useEffect`, return a cleanup function that calls `Tone.Transport.cancel()`.

### shadcn/ui dark mode

Set up `next-themes` and add `darkMode: 'class'` to `tailwind.config.ts`. Default to dark mode (producers prefer it).

### Mobile responsiveness

The three-panel desktop layout becomes a single scrolling column on mobile. Use Tailwind responsive utilities:
- `lg:grid lg:grid-cols-[280px_1fr_280px] lg:gap-6` 
- `flex flex-col gap-4 lg:flex-row` for piano controls

### Accessibility

- All interactive elements need keyboard handlers
- Piano keys: arrow keys to navigate, Enter to play
- Progression cards: Tab through, Enter/Space to select
- `aria-label` on all icon-only buttons

### Performance

- Use `React.memo` on Piano component (re-renders are expensive)
- Debounce rapid state changes
- Code-split the studio: marketing pages load fast, studio loads on demand
- Preload Tone.js worklets on studio page mount

---

## 9. Testing Strategy

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Write unit tests for:
- All theory functions (`getScaleNotes`, `getChordNotes`, `parseChordName`)
- MIDI generation (verify byte output)
- API route auth checks

Skip E2E tests for MVP — focus on shipping. Add Playwright tests in Phase 3.

---

## 10. Deployment

1. Connect GitHub repo to Vercel
2. Add all `.env.local` vars to Vercel project settings
3. Set up custom domain (chordcraft.app)
4. Configure Stripe webhook endpoint to `https://chordcraft.app/api/stripe/webhook`
5. Test full payment flow with Stripe test cards
6. Run Lighthouse audit, fix any issues
7. Submit to ProductHunt

---

## 11. Build Commands Reference

```bash
# Development
npm run dev

# Type checking
npm run type-check  # add: "type-check": "tsc --noEmit"

# Build
npm run build

# Production
npm start

# Generate Supabase types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
```

---

## 12. Phase Priorities (Ship Order)

**Week 1–2:** Phase 1 complete (MVP parity in Next.js)
**Week 3:** Auth + save progressions
**Week 4:** Stripe + MIDI export
**Week 5:** AI suggestions + sharing
**Week 6:** SEO content + landing page polish
**Week 7:** Beta testing with 50 producers
**Week 8:** ProductHunt launch

---

## 13. What NOT to Build (Yet)

Skip these in v1:
- Mobile app (web responsive is enough)
- Real-time collaboration
- Custom synthesizer designer
- Audio recording/looping
- VST plugin version
- Sample marketplace

Add them in v2 based on user feedback.

---

## 14. Reference Files

- `chordcraft_mvp.html` — Visual + functional spec (UI logic, music theory data)
- `ChordCraft_Product_Plan.md` — Business strategy, marketing, monetization
- This file — Technical build instructions

---

## 15. Definition of Done (v1.0 Launch)

- [ ] Public landing page at chordcraft.app
- [ ] Free tier: full studio, 3 saved progressions
- [ ] Pro tier ($9.99/mo): unlimited saves, MIDI export, AI suggestions
- [ ] Stripe payments working end-to-end
- [ ] Mobile responsive
- [ ] 90+ Lighthouse score
- [ ] All 12 genres + 12 scales + 12 chord types working
- [ ] MIDI exports import correctly to FL Studio, Ableton, Logic Pro
- [ ] Public progression sharing
- [ ] Auth via email + Google OAuth
- [ ] Beta tested with 20+ producers
- [ ] Privacy policy + terms of service
- [ ] Analytics tracking conversions

---

**Build this. Ship it. Iterate.**

The MVP HTML file proves the concept works. This spec gets it production-ready. Estimated build time: 6–8 weeks of focused work for a single full-stack developer.
