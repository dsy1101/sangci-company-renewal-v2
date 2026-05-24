-- ══════════════════════════════════════════════════════════
-- Supabase Storage: "uploads" bucket for admin image uploads
-- Run this in SQL Editor AFTER 002_seed.sql.
-- ══════════════════════════════════════════════════════════

-- 1) Create the bucket (public so the marketing site can <img src=...> it)
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

-- 2) RLS policies for storage.objects:
--    - everyone can SELECT (read) → marketing site image tags work
--    - authenticated users can INSERT/UPDATE/DELETE → admin uploads
drop policy if exists "uploads public read"   on storage.objects;
drop policy if exists "uploads auth insert"   on storage.objects;
drop policy if exists "uploads auth update"   on storage.objects;
drop policy if exists "uploads auth delete"   on storage.objects;

create policy "uploads public read"
  on storage.objects for select
  using (bucket_id = 'uploads');

create policy "uploads auth insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'uploads');

create policy "uploads auth update"
  on storage.objects for update to authenticated
  using (bucket_id = 'uploads')
  with check (bucket_id = 'uploads');

create policy "uploads auth delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'uploads');
