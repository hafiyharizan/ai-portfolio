create extension if not exists pgcrypto;

create table if not exists public.endorsements (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users(id) on delete cascade,
  provider    text        not null default 'guest',
  name        text        not null,
  avatar_url  text,
  message     text        not null check (char_length(message) <= 240),
  role        text,
  linkedin_url text,
  tags        text[]      not null default '{}',
  country     text,
  ip_hash     text,
  status      text        not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved    boolean     not null default false,
  featured    boolean     not null default false,
  created_at  timestamptz not null default timezone('utc', now()),
  updated_at  timestamptz not null default timezone('utc', now())
);

create index if not exists endorsements_approved_idx
  on public.endorsements (approved, featured desc, created_at desc);

create index if not exists endorsements_status_idx
  on public.endorsements (status, created_at desc);

create index if not exists endorsements_country_idx
  on public.endorsements (country);

create or replace function public.touch_endorsements_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists endorsements_touch_updated_at on public.endorsements;

create trigger endorsements_touch_updated_at
before update on public.endorsements
for each row
execute function public.touch_endorsements_updated_at();

alter table public.endorsements enable row level security;

drop policy if exists "Public can read approved endorsements" on public.endorsements;
create policy "Public can read approved endorsements"
on public.endorsements
for select
using (approved = true);
