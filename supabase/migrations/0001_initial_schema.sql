-- ============================================================================
-- APN Hub — Phase 1 initial schema
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL editor (or via the Supabase CLI) to create all
-- tables, enums, indexes, and Row Level Security (RLS) policies.
--
-- Security model (Phase 1):
--   * Anyone (anon) can READ rows whose status = 'published' (public content)
--     and public prayer requests that are approved/published.
--   * Anyone can INSERT into `submissions`, `prayer_requests`, and
--     `newsletter_subscribers` (public submission flows) — but always as
--     'pending'. Nothing the public submits is published automatically.
--   * Writes/updates/approvals are performed server-side using the service role
--     key (which bypasses RLS), gated by the admin dashboard.
-- ============================================================================

-- Enable useful extensions ---------------------------------------------------
create extension if not exists "pgcrypto";

-- Status enum shared by all content tables -----------------------------------
do $$ begin
  create type content_status as enum ('pending', 'approved', 'rejected', 'published', 'draft');
exception when duplicate_object then null; end $$;

-- Submission type enum -------------------------------------------------------
do $$ begin
  create type submission_type as enum (
    'event', 'sermon', 'podcast', 'music', 'material', 'testimony', 'news', 'prayer'
  );
exception when duplicate_object then null; end $$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- Events ---------------------------------------------------------------------
create table if not exists public.events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  event_date    date,
  event_time    text,
  city          text,
  state         text,
  church_name   text,
  speaker       text,
  category      text,                       -- Revival, Youth Rally, Conference, ...
  source_url    text,
  contact_email text,
  status        content_status not null default 'pending',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Preaching items ------------------------------------------------------------
create table if not exists public.preaching_items (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  speaker             text,
  topic               text,                 -- Baptism in Jesus' Name, Holy Ghost, ...
  scripture_reference text,
  description         text,
  media_url           text,
  media_type          text,                 -- 'video' | 'audio'
  status              content_status not null default 'pending',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Podcast episodes -----------------------------------------------------------
create table if not exists public.podcast_episodes (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  episode_number int,
  guest          text,
  description    text,
  duration       text,                      -- e.g. '52 min'
  media_url      text,
  status         content_status not null default 'pending',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Materials / resource library -----------------------------------------------
create table if not exists public.materials (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text,                         -- Bible Study Lessons, Doctrine Sheets, ...
  description text,
  file_type   text,                         -- PDF, DOC, Canva, Audio, Video
  file_url    text,
  is_premium  boolean not null default false, -- always false in Phase 1
  status      content_status not null default 'pending',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Prayer requests ------------------------------------------------------------
create table if not exists public.prayer_requests (
  id           uuid primary key default gen_random_uuid(),
  name         text,                        -- optional
  title        text,
  request_text text not null,
  category     text,                        -- Healing, Family, Direction, ...
  city         text,
  state        text,
  is_public    boolean not null default true,
  prayer_count int not null default 0,
  status       content_status not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Submissions (central intake for all public content) ------------------------
create table if not exists public.submissions (
  id              uuid primary key default gen_random_uuid(),
  submission_type submission_type not null,
  submitter_name  text,
  submitter_email text,
  title           text,
  description     text,
  content_data    jsonb default '{}'::jsonb, -- type-specific fields live here
  source_url      text,
  status          content_status not null default 'pending',
  admin_notes     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Newsletter subscribers -----------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  phone      text,
  state      text,
  created_at timestamptz not null default now()
);

-- Categories (admin-managed taxonomy) ----------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       text not null,                 -- 'event' | 'preaching' | 'material' | 'prayer'
  created_at timestamptz not null default now(),
  unique (name, type)
);

-- Admin users ----------------------------------------------------------------
create table if not exists public.admin_users (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  role       text not null default 'admin', -- 'admin' | 'editor'
  created_at timestamptz not null default now()
);

-- ============================================================================
-- INDEXES (status + date are the common filter columns)
-- ============================================================================
create index if not exists idx_events_status        on public.events (status);
create index if not exists idx_events_date           on public.events (event_date);
create index if not exists idx_preaching_status      on public.preaching_items (status);
create index if not exists idx_podcast_status        on public.podcast_episodes (status);
create index if not exists idx_materials_status      on public.materials (status);
create index if not exists idx_prayer_status         on public.prayer_requests (status);
create index if not exists idx_submissions_status    on public.submissions (status);

-- ============================================================================
-- updated_at trigger
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array[
    'events','preaching_items','podcast_episodes','materials','prayer_requests','submissions'
  ] loop
    execute format(
      'drop trigger if exists trg_%1$s_updated on public.%1$s;
       create trigger trg_%1$s_updated before update on public.%1$s
       for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- ============================================================================
-- atomic "I Prayed" increment (used by the public prayer wall)
-- ============================================================================
create or replace function public.increment_prayer_count(p_id uuid)
returns int as $$
declare new_count int;
begin
  update public.prayer_requests
     set prayer_count = prayer_count + 1
   where id = p_id
   returning prayer_count into new_count;
  return new_count;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.events                enable row level security;
alter table public.preaching_items       enable row level security;
alter table public.podcast_episodes      enable row level security;
alter table public.materials             enable row level security;
alter table public.prayer_requests       enable row level security;
alter table public.submissions           enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.categories            enable row level security;

-- Public can READ published content ------------------------------------------
create policy "read published events"     on public.events            for select using (status = 'published');
create policy "read published preaching"  on public.preaching_items   for select using (status = 'published');
create policy "read published podcast"    on public.podcast_episodes  for select using (status = 'published');
create policy "read published materials"  on public.materials         for select using (status = 'published');
create policy "read categories"           on public.categories        for select using (true);

-- Public can READ public + visible prayer requests ---------------------------
create policy "read public prayers" on public.prayer_requests
  for select using (is_public = true and status in ('approved','published'));

-- Public can INSERT into the intake tables (always lands as pending) ----------
create policy "submit content" on public.submissions
  for insert with check (status = 'pending');

create policy "submit prayer" on public.prayer_requests
  for insert with check (status = 'pending');

create policy "join newsletter" on public.newsletter_subscribers
  for insert with check (true);

-- NOTE: All UPDATE / approve / publish operations are performed server-side
-- with the service role key, which bypasses RLS. No anon update policies exist
-- on purpose, so nothing public can be edited or published from the browser.

-- ============================================================================
-- GRANTS
-- ----------------------------------------------------------------------------
-- RLS policies decide WHICH ROWS are visible, but the role still needs base
-- table privileges. These grants are safe: RLS continues to restrict rows
-- (e.g. anon SELECT still only returns published content).
-- ============================================================================
grant usage on schema public to anon, authenticated;

grant select on
  public.events, public.preaching_items, public.podcast_episodes,
  public.materials, public.prayer_requests, public.categories
to anon, authenticated;

grant insert on
  public.submissions, public.prayer_requests, public.newsletter_subscribers
to anon, authenticated;

grant execute on function public.increment_prayer_count(uuid) to anon, authenticated;

-- The service_role key (used server-side by the admin dashboard + API routes)
-- needs full access. It bypasses RLS, so this is the intended admin path.
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;
