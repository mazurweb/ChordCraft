-- Profiles (extends Supabase auth.users)
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

-- Row level security
alter table public.profiles enable row level security;
alter table public.progressions enable row level security;
alter table public.shares enable row level security;

create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can read own progressions" on public.progressions
  for select using (auth.uid() = user_id);
create policy "Anyone can read public progressions" on public.progressions
  for select using (is_public = true);
create policy "Users can insert own progressions" on public.progressions
  for insert with check (auth.uid() = user_id);
create policy "Users can update own progressions" on public.progressions
  for update using (auth.uid() = user_id);
create policy "Users can delete own progressions" on public.progressions
  for delete using (auth.uid() = user_id);

create policy "Anyone can read shares" on public.shares
  for select using (true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
