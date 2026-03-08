# Full SEO & Discoverability Audit Report

**Date:** 2026-03-08  
**Project:** Learn Agentic Patterns (Next.js)  
**Note:** Build and curl checks were run with the server on **port 3010** (port 3000 was in use). Replace `localhost:3010` with `localhost:3000` or your production URL as needed.

---

## SECTION 1: CRAWLABILITY & INDEXING

### 1.1 Build, start, and curl outputs

**Build:** `npm run build` — ✅ **PASS** (completed successfully)

**Start:** `npm run start` — ✅ **PASS** (server started on port 3010)

**curl -s http://localhost:3010 | head -300**  
Output was captured (157 KB). The HTML contains the full document with nav, hero, tracks, curriculum preview, CTA, and FAQ. Key content strings present in raw HTML: e.g. "Tool Use", "For Developers", nav links, and pattern cards.

**curl -s http://localhost:3010/robots.txt** — ✅ **PASS**
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /login
Disallow: /forgot-password
Disallow: /reset-password
... (GPTBot, ClaudeBot, etc. same allow/disallow)
Host: https://learnagenticpatterns.com
Sitemap: https://learnagenticpatterns.com/sitemap.xml
Sitemap: https://practice.learnagenticpatterns.com/sitemap.xml
```

**curl -s http://localhost:3010/sitemap.xml** — ✅ **PASS**  
Valid XML sitemap with 81 `<loc>` URLs (home, blog index, cheatsheet, guide, about, signup, assessment, 21 patterns, 11 PM modules, 8 blog posts, 34 practice subdomain URLs).

**curl -s http://localhost:3010/llms.txt | head -30** — ✅ **PASS**  
Returns the LLM-oriented markdown file (project description, pattern mappings, curriculum overview). Served from `public/llms.txt`.

**curl -s http://localhost:3010/manifest.webmanifest** — ✅ **PASS**  
Returns valid JSON web app manifest with name, short_name, description, start_url, display, theme_color, background_color, icons.

---

### 1.2 Homepage raw HTML — visible text without JavaScript

| Content | In raw HTML? | Status |
|--------|----------------|--------|
| Hero heading (e.g. "fear AI agents", "Build them") | Yes | ✅ PASS |
| Two-track section ("For Developers", "For Product Managers") | Yes | ✅ PASS |
| FAQ questions/answers (e.g. "What is agentic AI?") | Yes | ✅ PASS |
| CTA text ("Ready to start?") | Yes | ✅ PASS |

**Status: ✅ PASS** — Critical landing content (hero, two-track, FAQ, CTA) is present in the initial HTML and does not depend on client-side JavaScript to appear.

---

### 1.3 Sitemap URL counts

| Category | Count |
|----------|--------|
| **Total URLs** | **81** |
| Pattern pages (`/patterns/*` on main domain) | 21 |
| PM module pages (`/pm/*` on main domain) | 11 |
| Blog posts (`/blog/*` on main domain) | 8 |
| Practice subdomain (`practice.learnagenticpatterns.com/*`) | 34 (1 root + 1 leaderboard + 21 pattern practice + 11 PM practice) |
| Static/main pages (home, /blog, cheatsheet, guide, about, signup, assessment) | 7 |

---

### 1.4 Public routes vs sitemap — missing pages

**Public routes in `app/` (excluding api, login, forgot-password, reset-password):**

In sitemap: `/`, `/blog`, `/blog/[slug]` (8), `/patterns/[slug]` (21), `/pm/[slug]` (11), `/agentic-ai-design-patterns-cheatsheet`, `/guide/from-software-engineer-to-agentic-architect`, `/about`, `/signup`, `/assessment`.

**Missing from sitemap (public pages that exist as routes):**

- `/privacy`
- `/terms`
- `/community-partner`
- `/ambassador`
- `/featured-partners`
- `/featured-ambassadors`

**Status: ⚠️ WARNING** — Six public routes are not in the sitemap. Consider adding at least `/privacy` and `/terms`; add the others if you want them indexed.

---

### 1.5 robots.txt

| Check | Result |
|-------|--------|
| Sitemap URL referenced? | ✅ Yes — main + practice sitemaps listed |
| Anything important blocked? | ✅ No — only /api/, /login, /forgot-password, /reset-password disallowed |
| Practice subdomain accessible? | ✅ Yes — Allow: / for all agents; practice URLs are in the main sitemap and a second Sitemap line points to practice |

**Status: ✅ PASS**

---

## SECTION 2: METADATA & STRUCTURED DATA

### 2.1 Per-page metadata (title, description, canonical, og:title)

| Page | Title | Unique? | Notes |
|------|--------|--------|--------|
| Homepage (/) | Learn Agentic Patterns — AI Design Patterns for Developers & Product Managers (Free) | ✅ | Default from layout |
| /patterns/prompt-chaining | Prompt Chaining → Pipe & Filter (Free Guide) \| Learn Agentic Patterns | ✅ | Pattern-specific |
| /pm/ai-native-foundations | Becoming AI-Native — Agentic AI for Product Managers \| Learn Agentic Patterns | ✅ | PM-specific |
| /blog/what-is-an-ai-agent | What Is an AI Agent (and Why It's Not a Chatbot) | ✅ | Blog-specific (no template suffix in title) |
| /assessment | Will AI Replace Me? Free AI-Readiness Assessment \| Learn Agentic Patterns | ✅ | Assessment-specific |
| /agentic-ai-design-patterns-cheatsheet | Agentic AI Design Patterns Cheat Sheet — Free PDF Download \| Learn Agentic Patterns | ✅ | Cheatsheet-specific |
| /about | About Mousa Al-Jawaheri \| Learn Agentic Patterns \| Learn Agentic Patterns | ⚠️ | Duplicate "Learn Agentic Patterns" (layout template applied to already-complete title) |

**Status: ⚠️ WARNING for /about** — Fix by setting the about layout title to `"About Mousa Al-Jawaheri"` only so the root template produces a single suffix.

All checked pages have unique `<meta name="description">`, canonical, and og:title in the HTML (where applicable).

---

### 2.2 JSON-LD structured data

| Location | Schemas present | Valid JSON? |
|----------|------------------|-------------|
| Homepage | WebSite, Course (layout + page), ItemList (layout), FAQPage (page) | ✅ |
| Pattern pages | TechArticle (pattern-specific) + layout’s WebSite/Organization | ✅ |
| Blog posts | TechArticle, FAQPage | ✅ |
| FAQ sections | FAQPage | ✅ |

**Status: ✅ PASS** — Required schema types are present; no JSON-LD syntax errors observed in sampled pages.

---

### 2.3 Open Graph images

| Page type | OG image | Status |
|-----------|----------|--------|
| Homepage | Default `/opengraph-image` | ✅ |
| Pattern pages | Dynamic per-pattern `opengraph-image` (e.g. pattern name + SWE parallel) | ✅ |
| Cheatsheet | Dedicated `agentic-ai-design-patterns-cheatsheet/opengraph-image.tsx` | ✅ |
| Blog posts | No route-specific `opengraph-image`; use default | ⚠️ |

**Status: ⚠️ WARNING** — Blog posts do not have per-post OG images. og:title/og:description are per-post via layout; adding `blog/[slug]/opengraph-image.tsx` would improve sharing.

---

## SECTION 3: PERFORMANCE & RENDERING

### 3.1 app/page.tsx is a server component

**Status: ✅ PASS** — `app/page.tsx` does **not** have `"use client"` at the top. It is a server component; interactive pieces are in client components (HomePageShell, LandingHero, etc.).

---

### 3.2 All "use client" files in app/

Every `app/**` file that starts with `"use client"`:

| File | Type | SEO note |
|------|------|----------|
| app/page.tsx | — | Not client (server component) |
| app/featured-partners/page.tsx | page | ⚠️ Client page |
| app/global-error.tsx | component | OK (error boundary) |
| app/login/page.tsx | page | OK (auth; not for indexing) |
| app/practice/pm/budget-builder/page.tsx | page | ⚠️ Client (practice subdomain) |
| app/reset-password/page.tsx | page | OK (auth) |
| app/practice/patterns/[slug]/build/page.tsx | page | ⚠️ Client (practice) |
| app/practice/patterns/[slug]/prompt/page.tsx | page | ⚠️ Client (practice) |
| app/not-found.tsx | component | OK |
| app/practice/profile/page.tsx | page | ⚠️ Client (practice, likely gated) |
| app/community-partner/page.tsx | page | ⚠️ Client page |
| app/agentic-ai-design-patterns-cheatsheet/page.tsx | page | ⚠️ Client page |
| app/assessment/page.tsx | page | ⚠️ Client page |
| app/featured-ambassadors/page.tsx | page | ⚠️ Client page |
| app/patterns/[slug]/page.tsx | page | ⚠️ Client page (content still crawlable; consider server component for main content) |
| app/practice/patterns/[slug]/page.tsx | page | ⚠️ Client (practice) |
| app/pm/[slug]/page.tsx | page | ⚠️ Client page |
| app/about/page.tsx | page | ⚠️ Client page |
| app/ambassador/page.tsx | page | ⚠️ Client page |
| app/forgot-password/page.tsx | page | OK (auth) |
| app/practice/leaderboard/page.tsx | page | ⚠️ Client (practice) |
| app/blog/page.tsx | page | ⚠️ Client page |
| app/signup/page.tsx | page | ⚠️ Client page |
| app/practice/page.tsx | page | ⚠️ Client (practice) |
| app/practice/patterns/page.tsx | page | ⚠️ Client (practice) |
| app/practice/pm/page.tsx | page | ⚠️ Client (practice) |
| app/practice/pm/ship-or-skip/page.tsx | page | ⚠️ Client (practice) |
| app/practice/pm/stakeholder-sim/page.tsx | page | ⚠️ Client (practice) |
| app/practice/patterns/[slug]/debug/page.tsx | page | ⚠️ Client (practice) |
| app/practice/patterns/[slug]/optimize/page.tsx | page | ⚠️ Client (practice) |

**Status: ⚠️ WARNING** — Many page.tsx files are client components. Highest SEO impact: `/patterns/[slug]`, `/pm/[slug]`, `/blog` (blog index), `/about`, `/assessment`, `/agentic-ai-design-patterns-cheatsheet`. If their main content is already in the initial HTML (e.g. via SSR or child server components), impact is limited; otherwise consider moving static content to server components.

---

### 3.3 loading.tsx for key routes

| Route | loading.tsx present? |
|-------|----------------------|
| Homepage (app/) | ✅ Yes (app/loading.tsx) |
| Patterns (app/patterns/[slug]/) | ✅ Yes |
| Blog | ❌ No |
| PM (app/pm/[slug]/) | ❌ No |
| Signup | ✅ Yes |
| Login | ✅ Yes |

**Status: ⚠️ WARNING** — Add `app/blog/loading.tsx` and `app/pm/[slug]/loading.tsx` (and optionally `app/blog/[slug]/loading.tsx`) to improve perceived performance on those routes.

---

### 3.4 Images: next/image and alt text

**Status: ⚠️ WARNING** — No usage of `next/image` (or `<Image`) was found in the codebase. If you add images later, use `next/image` with appropriate `width`/`height` (or `fill`) and `alt` for performance and accessibility.

---

## Summary

| Section | Result |
|---------|--------|
| 1. Crawlability & indexing | ✅ PASS (1.4 and 1.2 both good; 1.4 missing 6 public pages) |
| 2. Metadata & structured data | ✅ PASS (about title + blog OG images = minor warnings) |
| 3. Performance & rendering | ✅ PASS for server homepage; ⚠️ client pages and loading/images |

**Recommended next steps**

1. Add `/privacy` and `/terms` (and optionally partner/ambassador pages) to the sitemap.
2. Fix about page title: use `title: "About Mousa Al-Jawaheri"` in about layout so the root template doesn’t duplicate the site name.
3. Add `blog/[slug]/opengraph-image.tsx` for per-post OG images.
4. Add `loading.tsx` for `/blog` and `/pm/[slug]`.
5. Use `next/image` with alt text for any new images.
