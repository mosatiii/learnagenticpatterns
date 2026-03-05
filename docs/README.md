# Learn Agentic Patterns — Project Documentation

A Next.js 14 web application that teaches senior software engineers how to build agentic AI systems by mapping 21 agentic design patterns to classical software engineering concepts they already know.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.4 |
| Styling | Tailwind CSS 3.4, custom dark theme |
| UI | Radix UI primitives, Framer Motion animations |
| Database | PostgreSQL (via `pg`) |
| Auth | Custom email/password with bcrypt + localStorage sessions |
| Email | Resend API |
| AI | Google Gemini (via a separate proxy service) |
| Analytics | PostHog (events, heatmaps, session replay) |
| Error Monitoring | Sentry (client + server + edge) |
| Deployment | Standalone build (container-ready), Vercel-compatible |

## Project Structure

```
learnagenticpatterns/
├── app/                          # Next.js App Router — all pages and API routes
│   ├── page.tsx                  # Homepage (marketing landing + user dashboard)
│   ├── layout.tsx                # Root layout (providers, navbar, footer, SEO)
│   ├── globals.css               # Global styles, Tailwind imports, custom utilities
│   ├── loading.tsx               # Root loading skeleton
│   ├── not-found.tsx             # Custom 404 page (terminal theme)
│   ├── global-error.tsx          # Top-level error boundary (Sentry integration)
│   ├── icon.tsx                  # Dynamic favicon generation
│   ├── manifest.ts               # PWA web app manifest
│   ├── opengraph-image.tsx       # Default OpenGraph social image
│   ├── robots.ts                 # robots.txt (allows AI crawlers)
│   ├── sitemap.ts                # XML sitemap for all pages
│   │
│   ├── about/                    # About the author page
│   ├── agentic-ai-design-patterns-cheatsheet/  # Free PDF cheatsheet landing page
│   ├── assessment/               # "Will AI Replace Me?" interactive tool
│   ├── blog/                     # Blog listing + individual posts
│   │   └── [slug]/              # Dynamic blog post pages
│   ├── forgot-password/          # Password reset request form
│   ├── guide/                    # Long-form career guides
│   │   └── from-software-engineer-to-agentic-architect/
│   ├── login/                    # Login form
│   ├── patterns/                 # Individual pattern detail pages
│   │   └── [slug]/              # Dynamic pattern pages (21 patterns)
│   ├── practice/                 # Interactive exercises landing page
│   ├── reset-password/           # Password reset completion form
│   ├── signup/                   # Signup form
│   │
│   └── api/                      # Backend API routes
│       ├── assessment/           # AI-powered career assessment
│       ├── auth/                 # Authentication endpoints
│       │   ├── forgot-password/
│       │   ├── login/
│       │   ├── reset-password/
│       │   └── verify/
│       ├── game-scores/          # Agent Builder game scoring + leaderboard
│       ├── progress/             # Reading progress tracking
│       ├── signup/               # User registration
│       └── waitlist/             # (empty — placeholder)
│
├── components/                   # Reusable React components
│   ├── AgentBuilder/             # Interactive drag-and-drop game
│   │   ├── AgentBuilder.tsx
│   │   ├── BlockPalette.tsx
│   │   ├── BuildCanvas.tsx
│   │   ├── CanvasNode.tsx
│   │   ├── ConnectionEdges.tsx
│   │   └── ScoreCard.tsx
│   ├── AnimatedGrid.tsx          # Decorative background grid
│   ├── CodeBlock.tsx             # Syntax-highlighted code display
│   ├── Footer.tsx                # Site footer
│   ├── JsonLd.tsx                # SEO structured data components
│   ├── MappingTable.tsx          # Agentic ↔ SWE pattern mapping table
│   ├── MaturityLevel.tsx         # 5-level maturity model display
│   ├── NavBar.tsx                # Top navigation bar
│   ├── PatternCard.tsx           # Pattern card for curriculum grid
│   ├── PostHogProvider.tsx       # Analytics initialization
│   ├── ProgressBadge.tsx         # Mini progress indicator (navbar)
│   ├── ProgressCircle.tsx        # Large circular progress chart
│   ├── Providers.tsx             # Top-level context provider composition
│   ├── SectionHeader.tsx         # Reusable section heading
│   ├── Skeleton.tsx              # Loading skeleton components
│   └── ui/                       # (empty — placeholder for Radix/shadcn)
│
├── contexts/                     # React context providers
│   └── AuthContext.tsx           # Auth state, progress tracking, game scores
│
├── data/                         # Static content and configuration data
│   ├── assessment.ts             # Assessment question bank (4 roles)
│   ├── blog.ts                   # Blog post content
│   ├── games.ts                  # Agent Builder game configs (21 exercises)
│   └── patterns.ts               # 21 pattern definitions + maturity levels
│
├── lib/                          # Shared utilities and backend helpers
│   ├── assessment-prompt.ts      # Gemini AI prompt builder for assessments
│   ├── db.ts                     # PostgreSQL connection + schema auto-creation
│   ├── email-templates.ts        # HTML email templates (4 types)
│   ├── game/                     # Game logic (validation + scoring)
│   │   ├── graph-validator.ts    # Block arrangement validation
│   │   └── simulation-engine.ts  # Scoring and simulation orchestration
│   ├── posthog-config.ts         # PostHog API key + host
│   ├── rate-limit.ts             # In-memory rate limiter
│   ├── utils.ts                  # cn() class merger + formatPatternNumber()
│   └── validations.ts            # Zod schemas for auth forms
│
├── gemini-proxy/                 # Standalone Gemini AI proxy microservice
│   ├── index.js                  # HTTP server proxying to Gemini API
│   └── package.json              # Proxy service dependencies
│
├── public/                       # Static assets
│   ├── favicon.svg
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg
│   ├── llms.txt                  # AI-readable site description
│   ├── Agentic-Design-Architecture-...pdf  # Downloadable PDF cheatsheet
│   └── images/                   # (empty — placeholder)
│
├── middleware.ts                  # Subdomain routing (practice.* → /practice)
├── instrumentation.ts            # Server-side Sentry initialization
├── instrumentation-client.ts     # Client-side Sentry initialization
├── package.json                  # Dependencies and scripts
├── next.config.js                # Next.js + Sentry configuration
├── tailwind.config.ts            # Custom dark theme design system
├── tsconfig.json                 # TypeScript strict mode + path aliases
├── postcss.config.js             # PostCSS plugins (Tailwind + Autoprefixer)
├── .eslintrc.json                # ESLint (next/core-web-vitals)
└── .gitignore                    # Git exclusions
```

## Documentation Index

Each file below documents all the files inside the corresponding folder:

| Document | Covers |
|---|---|
| [Root Files](./root-files.md) | Configuration files at the project root (`package.json`, `next.config.js`, `middleware.ts`, etc.) |
| [App Directory](./app.md) | All pages, layouts, and API routes inside `app/` |
| [Components](./components.md) | All reusable React components inside `components/` |
| [Library](./lib.md) | Utility functions and backend helpers inside `lib/` |
| [Data](./data.md) | Static content and configuration inside `data/` |
| [Contexts](./contexts.md) | React context providers inside `contexts/` |
| [Gemini Proxy](./gemini-proxy.md) | The standalone AI proxy microservice inside `gemini-proxy/` |
