# Daniel Lezhanskiy — Ideas, Writing & Projects

A Next.js site for long-form writing on philosophy, religion, politics, economics, and related ideas, alongside a personal profile, projects, and a short-form feed.

## Run locally

```bash
npm ci
npm run dev
```

The default local address is `http://localhost:3000`. The macOS launcher, if installed, uses `http://localhost:4319`.

## Configuration

Copy `.env.example` to `.env.local` and fill in the values needed for your deployment:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` connect the feed and editor sign-in. They are public client configuration values. The feed tables and storage policies are described in `supabase/schema.sql`.
- `OPENAI_API_KEY` and `OPENAI_MODEL` are optional server-side settings for the ideas chat. Without a key, framework questions use the built-in retrieval fallback. Keep the key out of client variables and Git history.

The chat indexes published writing only, including Philosophy, and skips chapters marked in progress. It uses `gpt-6-luna` by default, caps message and context size, and limits each IP to 20 requests per 10 minutes and 100 per day within each running server process. On a serverless host, those counters are not shared across instances; configure a host-level IP rate limit before promoting the site to a public production URL. Keep an enforced OpenAI project spending limit as the final cost ceiling.

Editors sign in at `/admin`. Supabase's `site_editors` table controls publishing access and whether unfinished chapters open in the reading UI. Signed-out visitors see those chapters greyed out and disabled.

## Build and publication

```bash
npm run build
```

The build uses webpack for a reproducible local and hosted build. The Fortnite clips served by the site are compressed web versions; the full-size source videos stay local and are ignored by Git.

**Editorial locks are navigation controls, not a secrecy boundary.** Chapter text included in this repository can be read from the source if the repository is public. Keep the repository private until any writing you want private has been moved out of the client bundle and Git history.
