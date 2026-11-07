-- Run this whole file in Supabase > SQL Editor
create table if not exists public.designs (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  category text not null,
  description text not null default '',
  images text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);

alter table public.designs enable row level security;
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql security definer set search_path = public stable
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

create policy "public reads published" on public.designs for select using (published = true or public.is_admin());
create policy "admin inserts" on public.designs for insert with check (public.is_admin());
create policy "admin updates" on public.designs for update using (public.is_admin()) with check (public.is_admin());
create policy "admin deletes" on public.designs for delete using (public.is_admin());
create policy "admin reads self" on public.admins for select using (user_id = auth.uid());

-- Storage bucket for photos (public read)
insert into storage.buckets (id, name, public) values ('designs', 'designs', true) on conflict (id) do nothing;
create policy "public reads photos" on storage.objects for select using (bucket_id = 'designs');
create policy "admin uploads photos" on storage.objects for insert with check (bucket_id = 'designs' and public.is_admin());
create policy "admin updates photos" on storage.objects for update using (bucket_id = 'designs' and public.is_admin());
create policy "admin deletes photos" on storage.objects for delete using (bucket_id = 'designs' and public.is_admin());

-- AFTER creating your admin user in Authentication > Users, run (replace the email):
-- insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
