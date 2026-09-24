# Daniel Lezhanskiy — Ideas, Writing & Projects

**Live site:** [daniellezhanskiy.com](https://daniellezhanskiy.com)

This is my personal site for collecting and connecting my writing, ideas, and projects. It is built as an interactive reading space rather than a conventional blog: start from the idea bubbles, open a subject, and move through its chapters and subsections.

## What you can explore

- **Ideas:** Long-form writing on philosophy, religion, politics, and economics. Chapters include short summaries and section navigation. Psychology and technology are visible as works in progress and remain locked for visitors.
- **Profile and projects:** A personal page with background, selected work, and media.
- **Feed:** Short thoughts, links, photos, and project updates that do not need a full chapter.
- **Ideas chat:** Ask questions about the writing. The server retrieves relevant published sections and uses them as context for the conversation.

## Run locally

```bash
npm ci
npm run dev
```

The development server prints its local address when it starts. To create the same optimized build used for deployment, run:

```bash
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local` and add the values for the services you want to use:

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Feed data, media, and editor sign-in |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public Supabase client access, governed by database and storage policies |
| `OPENAI_API_KEY` | Optional server-side model responses in the ideas chat |
| `OPENAI_MODEL` | Chat model; defaults to `gpt-6-luna` |

The site can fall back to local retrieval when no OpenAI key is configured. Never put the OpenAI key in a `NEXT_PUBLIC_` variable or commit a populated environment file.

## Publishing and access

Editors sign in at `/admin`. Supabase's `site_editors` table controls publishing access and whether in-progress chapters can be opened in the editor. Visitors see those chapters locked.

The locks are navigation controls, not a privacy boundary: writing included in the public site or this public repository can be read from its source. Keep genuinely private material out of both.

The chat limits message and context size and applies per-process IP limits. Those counters reset when the server restarts and are not shared between server instances, so keep an enforced OpenAI project spending limit in place.

The compressed Fortnite clips are included for the site; full-size source videos remain local and are ignored by Git.
