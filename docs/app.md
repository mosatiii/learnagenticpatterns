# App Directory

The `app/` directory uses Next.js 14's App Router, where the folder structure maps directly to URL routes. Each folder can contain:

- **`page.tsx`** — the page component rendered at that URL
- **`layout.tsx`** — a wrapper that sets metadata (title, description, OG tags) and wraps children
- **`loading.tsx`** — a skeleton placeholder shown while the page loads
- **`opengraph-image.tsx`** — dynamically generates social sharing images

```
app/
├── page.tsx                        # / (homepage)
├── layout.tsx                      # Root layout (wraps everything)
├── globals.css                     # Global styles
├── loading.tsx                     # Root loading skeleton
├── not-found.tsx                   # 404 page
├── global-error.tsx                # Error boundary
├── icon.tsx                        # Dynamic favicon
├── manifest.ts                     # PWA manifest
├── opengraph-image.tsx             # Default OG image
├── robots.ts                       # robots.txt
├── sitemap.ts                      # XML sitemap
│
├── about/
│   ├── layout.tsx
│   └── page.tsx
│
├── agentic-ai-design-patterns-cheatsheet/
│   ├── layout.tsx
│   ├── page.tsx
│   └── opengraph-image.tsx
│
├── assessment/
│   ├── layout.tsx
│   └── page.tsx
│
├── blog/
│   ├── layout.tsx
│   ├── page.tsx
│   └── [slug]/
│       ├── layout.tsx
│       └── page.tsx
│
├── forgot-password/
│   ├── layout.tsx
│   └── page.tsx
│
├── guide/
│   └── from-software-engineer-to-agentic-architect/
│       ├── layout.tsx
│       └── page.tsx
│
├── login/
│   ├── layout.tsx
│   ├── loading.tsx
│   └── page.tsx
│
├── patterns/
│   └── [slug]/
│       ├── layout.tsx
│       ├── loading.tsx
│       ├── opengraph-image.tsx
│       └── page.tsx
│
├── practice/
│   ├── layout.tsx
│   └── page.tsx
│
├── reset-password/
│   ├── layout.tsx
│   └── page.tsx
│
├── signup/
│   ├── layout.tsx
│   ├── loading.tsx
│   └── page.tsx
│
└── api/
    ├── assessment/
    │   └── route.ts
    ├── auth/
    │   ├── forgot-password/
    │   │   └── route.ts
    │   ├── login/
    │   │   └── route.ts
    │   ├── reset-password/
    │   │   └── route.ts
    │   └── verify/
    │       └── route.ts
    ├── game-scores/
    │   └── route.ts
    ├── progress/
    │   └── route.ts
    ├── signup/
    │   └── route.ts
    └── waitlist/            # (empty placeholder)
```

---

## Root-Level App Files

### page.tsx — Homepage

The main homepage that renders **two completely different views** depending on auth state:

- **Signed out (marketing landing page):** hero section with animated SVG diagram, pain-point cards, an agentic-to-SWE mapping table, the 21-pattern curriculum grid (first 7 unlocked, rest show lock icon), AEO explainer articles, maturity model visualization, FAQ accordion, and sign-up CTAs.
- **Signed in (dashboard):** personalized greeting, reading progress circle, game scores and leaderboard, and the curriculum grid with green checkmarks on completed patterns.

Uses `useAuth` for auth state and renders `SectionHeader`, `PatternCard`, `MappingTable`, `MaturityLevel`, and `ProgressCircle` components.

### layout.tsx — Root Layout

The outermost wrapper for the entire application. It:

1. Sets `<html>` and `<body>` tags with the dark theme
2. Imports `globals.css` for base styles
3. Wraps everything in `<Providers>` (auth context + analytics)
4. Renders `<NavBar>`, `<AnimatedGrid>` (background), `<Footer>`
5. Injects JSON-LD structured data for SEO (WebSite, Course, ItemList schemas)
6. Defines extensive metadata: title template, OpenGraph, Twitter cards, keywords, canonical URLs

### globals.css — Global Styles

Imports Tailwind CSS (`@tailwind base/components/utilities`), loads Google Fonts (Space Mono, DM Sans, Fira Code), and defines:

- Base dark theme styles (background `#0A0E1A`, text `#E8EDF8`)
- Custom scrollbar styling
- Utility classes: `.text-gradient` (cyan gradient), `.border-glow` (glowing shadow), `.card-hover` (lift effect), `.blueprint-grid` (dotted grid), `.circuit-line` (animated line)

### loading.tsx — Root Loading Skeleton

Shows `SkeletonHomepage` while the homepage streams/loads, preventing a blank flash.

### not-found.tsx — 404 Page

A custom 404 styled as a terminal window with red/yellow/green dots, `Error 404: Pattern not found` message, and a link back to homepage styled as `cd /home`. Uses Framer Motion for fade-in.

### global-error.tsx — Error Boundary

Catches unhandled errors across the entire app. Shows a minimal "Something went wrong" page with a "Try again" button. Reports errors to Sentry via `Sentry.captureException`. Uses inline styles since the error boundary replaces the entire `<html>`.

### icon.tsx — Dynamic Favicon

Generates a 32x32 PNG favicon at build time showing the letter "A" in cyan on a dark background. Replaces the need for a static favicon file.

### manifest.ts — PWA Manifest

Generates the web app manifest (`manifest.json`) declaring app name, theme colors (dark background + cyan accent), standalone display mode, and icon reference.

### opengraph-image.tsx — Default Social Image

Generates the default 1200x630 OpenGraph image with a terminal-style prompt, "Learn Agentic Design Patterns" title with gradient text, tag pills, and author credit. Used when sharing links on social media.

### robots.ts — Search Engine Rules

Generates `robots.txt` that:
- Allows crawling of the entire site
- Blocks `/api/`, `/login`, `/forgot-password`, `/reset-password`
- Explicitly welcomes AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
- Points to both the main sitemap and practice subdomain sitemap

### sitemap.ts — XML Sitemap

Generates the sitemap with all pages: homepage (priority 1), all 21 pattern pages (priority 0.9), all blog posts (priority 0.8), and static pages (about, assessment, cheatsheet, guide, practice, signup).

---

## Page Routes

### about/ — About Page

**URL:** `/about`

Bio page for the author (Mousa Al-Jawaheri) with education, certifications, technical projects, mission statement, acknowledgments, and a sign-up CTA. All sections animate in on scroll with Framer Motion.

### agentic-ai-design-patterns-cheatsheet/ — Cheatsheet Landing Page

**URL:** `/agentic-ai-design-patterns-cheatsheet`

A landing page for a free downloadable PDF that maps all 21 agentic patterns to SWE concepts. Contains:
- Hero with download CTA (direct download if signed in, sign-up gate if not)
- "What's Inside" section
- Full 21-row pattern mapping preview table
- "Why Senior Engineers Love This" section
- Pattern grid and FAQ accordion

Has a custom OpenGraph image (`opengraph-image.tsx`) showing "FREE PDF" badge and pattern examples.

### assessment/ — AI Career Assessment

**URL:** `/assessment`

A multi-step interactive "Will AI Replace Me?" assessment tool with four phases:

1. **RolePicker** — landing page where users choose their role (Developer, Product Manager, Designer, or Writer)
2. **Quiz** — multi-step form with single-select, multi-select, and free-text questions with a progress bar
3. **AnalyzingLoader** — animated loading screen while Gemini AI analyzes answers
4. **Results** — displays an AI-proof score (animated SVG circle), strengths, vulnerabilities, 30-day action plan, elevator pitch with copy/share, and email-your-report option

Calls `POST /api/assessment` to get AI-generated results.

### blog/ — Blog

**URL:** `/blog` and `/blog/[slug]`

**Listing page (`page.tsx`):** Shows all blog posts with a tag filter bar, post cards with reading time and TL;DR preview. Includes an AI disclosure footer for crawlers.

**Post page (`[slug]/page.tsx`):** Renders a single post with header, TL;DR box, article body with code blocks, key takeaway box, related pattern CTA, social share links (X, LinkedIn), and prev/next navigation. Includes AI-readable summary for crawlers.

Both use `generateStaticParams` to pre-build all pages at build time.

### forgot-password/ — Password Reset Request

**URL:** `/forgot-password`

Email input form with Zod validation. Calls `POST /api/auth/forgot-password`. Shows confirmation screen after submission telling the user to check their email. Not indexed by search engines.

### guide/ — Career Guide

**URL:** `/guide/from-software-engineer-to-agentic-architect`

A long-form article aimed at senior engineers covering:
- "The 80% You Already Know" intro
- Six deep-dive pattern mappings (Prompt Chaining, Reflection, Tool Use, Multi-Agent, RAG, Planning)
- Full 21-pattern mapping table
- 5-level reskilling roadmap (L0 Awareness → L4 Leadership)
- FAQ section
- CTA to explore the curriculum

Server component with Article, Breadcrumb, and FAQ JSON-LD schemas.

### login/ — Login Page

**URL:** `/login`

Email/password form with show/hide toggle, Zod validation, and "Forgot password?" link. Redirects to homepage if already authenticated. Not indexed by search engines. Has a loading skeleton (`loading.tsx`).

### patterns/[slug]/ — Pattern Detail Pages

**URL:** `/patterns/prompt-chaining`, `/patterns/reflection`, etc. (21 total)

The most feature-rich page in the app. Has two modes:

- **Locked mode** (user not signed in + pattern requires signup): shows a rich crawlable preview with agentic definition, description, SWE mapping, key takeaway, FAQ, and a sign-up gate.
- **Unlocked mode:** shows a sidebar listing all 21 patterns with read/locked status, a tabbed content area with:
  - **Overview** — agentic definition and description
  - **The Code** — before/after code examples with syntax highlighting
  - **SWE Mapping** — similarity and divergence analysis
  - **Production Notes** — real-world deployment considerations
  - **Key Takeaway** — summary
  - **Build** (optional) — interactive `AgentBuilder` drag-and-drop game

Auto-marks patterns as read after 5 seconds. Has custom OpenGraph images per pattern and a loading skeleton.

### practice/ — Practice Exercises Landing

**URL:** `/practice` (also `practice.learnagenticpatterns.com`)

Landing page for the interactive Agent Builder exercises with:
- Hero with animated builder diagram (SVG)
- Social proof bar (21 exercises, 100% free, 0 lines of code)
- "How Does the Agent Builder Work?" explainer
- "Why Practice Beats Reading" benefits section
- Mock exercise demo
- Grid of 21 exercise cards (7 open, 14 require sign-up)
- FAQ accordion

### reset-password/ — Password Reset Form

**URL:** `/reset-password?token=...`

Reads a token from URL query parameters. Shows new password + confirm password form with Zod validation. Calls `POST /api/auth/reset-password`. Shows success screen with login link. Not indexed.

### signup/ — Signup Page

**URL:** `/signup`

Collects first name, email, password, role (dropdown), and optional "Biggest challenge with Agentic AI?" textarea. Uses Zod validation. Calls `signup()` from auth context. Redirects to homepage on success. **Is** indexed by search engines (unlike login). Has a loading skeleton.

---

## API Routes

All API routes live in `app/api/` and export HTTP method handlers (`GET`, `POST`).

### api/assessment/route.ts

**Method:** `POST`

Handles the AI career assessment. Validates the request body (role, answers, optional email) with Zod, builds a prompt using `buildSystemPrompt` and `buildUserMessage`, calls the Gemini proxy service, and returns the AI-generated result (score, strengths, vulnerabilities, action plan, elevator pitch). Optionally emails the report via Resend.

**Env vars:** `GEMINI_PROXY_URL`, `GEMINI_API_SECRET`, `RESEND_API_KEY`

### api/auth/forgot-password/route.ts

**Method:** `POST`

Rate-limited to 3 requests per 15 minutes per IP. Validates email, looks up user in PostgreSQL, generates a secure random token (1-hour expiry), saves it to `password_resets` table, and sends a reset email via Resend. Always returns success to prevent email enumeration.

### api/auth/login/route.ts

**Method:** `POST`

Rate-limited to 10 attempts per 15 minutes per IP. Validates credentials, looks up user by email, compares password against bcrypt hash. Returns user object on success or specific error messages.

### api/auth/reset-password/route.ts

**Method:** `POST`

Validates the token and new password, verifies the token exists and hasn't expired, hashes the new password with bcrypt (cost factor 12), updates the user's password, and marks the token as used.

### api/auth/verify/route.ts

**Method:** `POST`

Checks if a user exists by email. Used by the client-side auth context to verify stored sessions on page reload. Returns user data if found, 404 if not.

### api/game-scores/route.ts

**Methods:** `GET`, `POST`

- **GET** (with `?email=...`): Returns the user's best score per pattern, total attempts, average percentage, global leaderboard (top 20 users), and the requesting user's rank.
- **POST**: Saves a game attempt with scores broken down by architecture, resilience, and efficiency. Uses SQL window functions for ranking.

### api/progress/route.ts

**Methods:** `GET`, `POST`

- **GET** (with `?email=...`): Returns all pattern slugs the user has marked as read.
- **POST**: Marks a specific pattern as read for a user. Uses `ON CONFLICT DO NOTHING` to prevent duplicates. Powers the checkmarks and progress circle.

### api/signup/route.ts

**Method:** `POST`

Rate-limited to 5 attempts per 15 minutes per IP. Validates form data with Zod, hashes password with bcrypt (cost 12), checks for duplicate emails, inserts user into PostgreSQL, sends a welcome email to the user and a notification email to the admin.
