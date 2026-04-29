-- Allow guest (unauthenticated) submissions via service role API
-- user_id becomes optional; provider defaults to 'guest'

alter table public.endorsements
  alter column user_id drop not null,
  alter column provider set default 'guest';

-- Drop unique constraint on user_id so multiple guests can submit
alter table public.endorsements
  drop constraint if exists endorsements_user_id_key;

-- Store a hashed IP for server-side rate limiting (no PII stored)
alter table public.endorsements
  add column if not exists ip_hash text;
