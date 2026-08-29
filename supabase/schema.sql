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
  body text not null default '' check (char_length(body) <= 12000),
  source_label text,
  source_url text,
  media_url text,
  media_urls text[] not null default '{}',
  media_type text check (media_type in ('image', 'video')),
  attachments jsonb not null default '[]'::jsonb check (jsonb_typeof(attachments) = 'array'),
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notes_has_content check (
    char_length(trim(body)) > 0
    or source_url is not null
    or media_url is not null
    or cardinality(media_urls) > 0
    or jsonb_array_length(attachments) > 0
  )
);

create table if not exists public.note_comments (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null default '',
  attachments jsonb not null default '[]'::jsonb check (jsonb_typeof(attachments) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Upgrade an existing notes table without replacing published content.
alter table public.notes add column if not exists media_urls text[] not null default '{}';
alter table public.notes add column if not exists media_type text;
alter table public.notes add column if not exists attachments jsonb not null default '[]'::jsonb;
alter table public.note_comments add column if not exists attachments jsonb not null default '[]'::jsonb;
alter table public.notes alter column body set default '';
alter table public.note_comments alter column body set default '';
alter table public.notes drop constraint if exists notes_body_check;
alter table public.notes drop constraint if exists notes_body_length_check;
alter table public.notes add constraint notes_body_length_check
  check (char_length(body) <= 12000);
alter table public.notes drop constraint if exists notes_media_type_check;
alter table public.notes add constraint notes_media_type_check
  check (media_type in ('image', 'video'));
alter table public.notes drop constraint if exists notes_attachments_check;
alter table public.notes add constraint notes_attachments_check
  check (jsonb_typeof(attachments) = 'array');
alter table public.note_comments drop constraint if exists note_comments_attachments_check;
alter table public.note_comments add constraint note_comments_attachments_check
  check (jsonb_typeof(attachments) = 'array');

update public.notes
set
  media_urls = array[media_url],
  media_type = case when kind = 'video' then 'video' else 'image' end
where media_url is not null
  and cardinality(media_urls) = 0;

alter table public.notes drop constraint if exists notes_has_content;
alter table public.notes add constraint notes_has_content check (
  char_length(trim(body)) > 0
  or source_url is not null
  or media_url is not null
  or cardinality(media_urls) > 0
  or jsonb_array_length(attachments) > 0
);

alter table public.note_comments drop constraint if exists note_comments_body_check;
alter table public.note_comments drop constraint if exists note_comments_content_check;
alter table public.note_comments add constraint note_comments_content_check check (
  char_length(body) <= 3000
  and (
    char_length(trim(body)) > 0
    or jsonb_array_length(attachments) > 0
  )
);

create index if not exists notes_public_feed_idx
  on public.notes (published, published_at desc);
create index if not exists notes_author_idx
  on public.notes (author_id);
create index if not exists note_comments_note_created_idx
  on public.note_comments (note_id, created_at);
create index if not exists note_comments_author_idx
  on public.note_comments (author_id);

alter table public.site_editors enable row level security;
alter table public.notes enable row level security;
alter table public.note_comments enable row level security;

-- Explicit grants keep these tables available when Data API auto-exposure is disabled.
grant select on public.site_editors to authenticated;
grant select on public.notes to anon;
grant select, insert, update, delete on public.notes to authenticated;
revoke all on public.note_comments from public, anon, authenticated;
grant select on public.note_comments to anon, authenticated;
grant insert, delete on public.note_comments to authenticated;

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

drop policy if exists "Published note comments are public" on public.note_comments;
create policy "Published note comments are public"
  on public.note_comments for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.notes
      where notes.id = note_comments.note_id
        and notes.published = true
        and notes.published_at <= now()
    )
  );

drop policy if exists "Editors can create note comments" on public.note_comments;
create policy "Editors can create note comments"
  on public.note_comments for insert
  to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.site_editors
      where site_editors.user_id = (select auth.uid())
    )
    and exists (
      select 1 from public.notes
      where notes.id = note_comments.note_id
        and notes.published = true
        and notes.published_at <= now()
    )
  );

drop policy if exists "Editors can delete note comments" on public.note_comments;
create policy "Editors can delete note comments"
  on public.note_comments for delete
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
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
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
