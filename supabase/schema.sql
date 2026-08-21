-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists products (
  id text primary key,
  name text not null,
  category text not null,
  description text not null,
  price text default 'Hubungi kami',
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists site_content (
  id int primary key default 1,
  site_name text not null,
  logo_url text not null,
  hero_headline text not null,
  hero_subheadline text not null,
  whatsapp_number text not null,
  about_text text not null,
  contact_address text not null,
  constraint single_row check (id = 1)
);

-- RLS is enabled with NO policies defined, which means: nobody can read or
-- write through the public/anon key. Only the service role key (used
-- server-side in lib/supabase/admin.ts) can bypass RLS. This keeps all data
-- access forced through your Next.js API routes — the browser never talks
-- to Supabase directly, so there's nothing to lock down with policies.
alter table products enable row level security;
alter table site_content enable row level security;

-- Storage bucket for product images and logo uploads.
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;
