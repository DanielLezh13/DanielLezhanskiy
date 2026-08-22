-- Notes publishing schema. Run this in the Supabase SQL editor once.

create table if not exists public.site_editors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('thought', 'link', 'image', 'video')),
  title text,
  body text not null check (char_length(body) between 1 and 12000),
  source_label text,
  source_url text,
  media_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_public_feed_idx
  on public.notes (published, published_at desc);

alter table public.site_editors enable row level security;
alter table public.notes enable row level security;

drop policy if exists "Editors can verify their access" on public.site_editors;
create policy "Editors can verify their access"
  on public.site_editors for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Published notes are public" on public.notes;
create policy "Published notes are public"
  on public.notes for select
  to anon, authenticated
  using (published = true and published_at <= now());

drop policy if exists "Editors can read every note" on public.notes;
create policy "Editors can read every note"
  on public.notes for select
  to authenticated
  using (
    exists (
      select 1 from public.site_editors
      where site_editors.user_id = (select auth.uid())
    )
  );

drop policy if exists "Editors can create notes" on public.notes;
create policy "Editors can create notes"
  on public.notes for insert
  to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.site_editors
      where site_editors.user_id = (select auth.uid())
    )
  );

drop policy if exists "Editors can update notes" on public.notes;
create policy "Editors can update notes"
  on public.notes for update
  to authenticated
  using (
    exists (
      select 1 from public.site_editors
      where site_editors.user_id = (select auth.uid())
    )
  )
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.site_editors
      where site_editors.user_id = (select auth.uid())
    )
  );

drop policy if exists "Editors can delete notes" on public.notes;
create policy "Editors can delete notes"
  on public.notes for delete
  to authenticated
  using (
    exists (
      select 1 from public.site_editors
      where site_editors.user_id = (select auth.uid())
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'notes-media',
  'notes-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Editors can upload note media" on storage.objects;
create policy "Editors can upload note media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'notes-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.site_editors
      where site_editors.user_id = (select auth.uid())
    )
  );

drop policy if exists "Editors can update note media" on storage.objects;
create policy "Editors can update note media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'notes-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.site_editors
      where site_editors.user_id = (select auth.uid())
    )
  );

drop policy if exists "Editors can delete note media" on storage.objects;
create policy "Editors can delete note media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'notes-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.site_editors
      where site_editors.user_id = (select auth.uid())
    )
  );

-- After creating your account in Supabase Authentication, make it the editor:
-- insert into public.site_editors (user_id)
-- select id from auth.users where email = 'your-email@example.com';
