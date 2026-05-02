# lap-dashboard

Internal state-of-truth dashboard for learnagenticpatterns. Queries Postgres directly, answers questions PostHog cannot answer cleanly: who finished a track, who is mid-funnel, who deserves an outreach email.

This service is intentionally separated from the main app. It runs as its own Railway service from this `dashboard/` directory. The public app stays unaware of it.

## What it shows

- Total signups, 7d / 30d signups, 7d active readers
- Activation funnel: signed up to read within 24h to 5+ to 10+ to track completed
- Per-week cohort table: signups, activation, depth, completion
- Median / p90 time from signup to first read
- Distribution of users by track-completion percentage
- Full list of users who completed a track (these are your warmest leads)
- Top engaged users
- Most-read patterns and PM modules
- Cross-track readers (PMs reading dev content, devs reading PM content)
- Game leaderboard
- Lesson feedback summary
- Warning if `reading_progress` contains slugs not in `curriculum.js` (curriculum drift detector)

## Auth model

A single shared access code, gated server-side with a constant-time comparison. Refuses to start if `DASHBOARD_ACCESS_CODE` is missing or shorter than 16 characters.

The first valid `?code=...` request sets a 7-day HttpOnly Secure SameSite=Strict cookie that contains an HMAC of the access code (not the code itself), so the URL can be cleaned up after the first visit. `GET /logout` clears the cookie.

This is appropriate for a one-operator internal tool. If you ever invite collaborators, replace this with per-user auth.

## Local development

```sh
cd dashboard
cp .env.example .env
# Fill in DATABASE_URL and DASHBOARD_ACCESS_CODE in .env

npm install
node --env-file=.env server.js
# open http://localhost:3000/?code=<your code>
```

## Railway deploy

1. In the Railway project, click **New Service** and pick **Deploy from GitHub repo**.
2. Select the same repo (`mosatiii/learnagenticpatterns`).
3. Once the service is created, open **Settings**:
   - **Root Directory:** `dashboard`
   - **Build Command:** leave blank (Nixpacks auto-detects `npm install`)
   - **Start Command:** `npm start`
4. Open **Variables** and add:
   - `DATABASE_URL` — same Postgres URL as the main app (use Railway's `${{Postgres.DATABASE_URL}}` reference if available)
   - `DASHBOARD_ACCESS_CODE` — generate with `openssl rand -hex 24` and paste the result. Do not reuse any password from elsewhere.
5. Open **Settings → Networking** and click **Generate Domain**. Use that domain plus your access code: `https://<your-domain>/?code=<your-code>`. Bookmark the URL.
6. After the first load the cookie is set, so you can drop `?code=...` from the bookmark.

## Why this lives in the same repo (and why it might not later)

It is in the public repo because:
- The queries are generic SQL over data shapes that are already public (the slug names are in `data/patterns.ts`).
- Auth is by access code, not by repo visibility.
- One repo is faster to maintain.

It should move to a private repo if any of these become true:
- You add queries that reveal sensitive segments (revenue per user, NPS detractors, individual learner notes).
- You start running internal experiments and tracking them here.
- You add user-identifiable data (full names, employer guesses, qualitative comments) beyond what the public app already exposes via the leaderboard.

The dashboard is a single self-contained directory, so extracting it to a private repo later is a `git mv` away.

## Keeping the curriculum list in sync

`curriculum.js` hardcodes the 21 dev pattern slugs and 15 PM module slugs. The dashboard renders a red banner at the top if `reading_progress` contains a slug not in this list. When you add or rename a pattern in `data/patterns.ts` or `data/pm-curriculum.ts`, update `curriculum.js` in the same commit.

## Footprint

- Two npm dependencies: `express`, `pg`. No build step. Cold start under a second.
- All HTML is server-rendered; zero client-side JS.
- All routes set `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow`.
