# Root Files

Configuration and setup files at the project root that control how the app is built, deployed, and monitored.

```
learnagenticpatterns/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .eslintrc.json
├── .gitignore
├── middleware.ts
├── instrumentation.ts
├── instrumentation-client.ts
└── next-env.d.ts
```

---

## package.json

The project manifest that defines dependencies, scripts, and metadata.

**Scripts:**
- `npm run dev` — starts the development server
- `npm run build` — creates a production build
- `npm run start` — starts the production server (port configurable via `$PORT` env var, defaults to 3000)
- `npm run lint` — runs ESLint

**Core Dependencies:**
| Package | Purpose |
|---|---|
| `next` 14 | React framework with server-side rendering and file-based routing |
| `react` / `react-dom` 18 | UI library |
| `framer-motion` | Animations (scroll reveals, page transitions, game effects) |
| `@radix-ui/*` | Accessible UI primitives (accordion, dropdown, tooltip, etc.) |
| `zod` | Runtime form/data validation with TypeScript type inference |
| `react-hook-form` + `@hookform/resolvers` | Performant form management |
| `pg` | PostgreSQL client for database queries |
| `bcryptjs` | Password hashing |
| `resend` | Email sending API |
| `posthog-js` + `posthog-node` | Analytics (events, heatmaps, session replay) |
| `@sentry/nextjs` | Error monitoring (client, server, edge) |
| `clsx` + `tailwind-merge` | Utility class merging without conflicts |
| `class-variance-authority` | Component variant styling |
| `lucide-react` | Icon library |

---

## next.config.js

Configures how Next.js builds and serves the application.

- **`output: "standalone"`** — produces a self-contained build suitable for Docker containers. Instead of needing the entire `node_modules`, it copies only the files needed to run.
- **Sentry integration** — wraps the config with `withSentryConfig()` to upload source maps during build. Source maps are hidden from the client for security. Disabled if `SENTRY_AUTH_TOKEN` is not set (safe for local dev).
- **`experimental.instrumentationHook: true`** — enables the `instrumentation.ts` and `instrumentation-client.ts` files for Sentry initialization.

**Environment Variables Used:**
- `SENTRY_ORG` — Sentry organization slug
- `SENTRY_PROJECT` — Sentry project name
- `SENTRY_AUTH_TOKEN` — Sentry auth token for source map uploads

---

## tailwind.config.ts

Defines the visual design system for the entire app — a custom dark, cyberpunk-inspired theme.

**Custom Color Palette:**
| Token | Value | Usage |
|---|---|---|
| `background` | `#0A0E1A` | Page background |
| `surface` | `#0F1629` | Card/panel background |
| `border` | `#1A2040` | Borders and dividers |
| `primary` | `#00D4FF` (cyan) | Main accent, links, buttons |
| `accent` | `#FF6B35` (orange) | Secondary accent, warnings |
| `success` | `#00FF88` (green) | Completed states, checkmarks |
| `code-bg` | `#060A14` | Code block background |
| `text-*` | Various grays | Primary, secondary, muted text |

**Custom Fonts:**
- `mono` — Space Mono (headers, decorative text)
- `sans` — DM Sans (body text)
- `code` — Fira Code (code blocks)

**Custom Animations:** `pulse-slow`, `fade-up`, `slide-in`, `glow`

---

## tsconfig.json

TypeScript compiler configuration.

- **`strict: true`** — enables all strict type-checking options
- **`@/*` path alias** — allows imports like `@/components/NavBar` instead of long relative paths like `../../components/NavBar`
- **`moduleResolution: "bundler"`** — modern resolution strategy optimized for bundlers like webpack/turbopack
- **`jsx: "preserve"`** — lets Next.js handle JSX transformation

---

## postcss.config.js

Registers PostCSS plugins that process CSS during the build:

1. **`tailwindcss`** — transforms Tailwind utility classes into real CSS
2. **`autoprefixer`** — automatically adds vendor prefixes (like `-webkit-`) for cross-browser support

This is the standard minimal setup for any Tailwind + Next.js project.

---

## .eslintrc.json

Configures ESLint with the `next/core-web-vitals` ruleset, which includes:
- React best practices and hooks rules
- Next.js-specific rules (image optimization, link usage)
- Core Web Vitals performance rules

---

## .gitignore

Tells Git which files to exclude from version control:
- `/node_modules` — dependencies (installed from `package.json`)
- `/.next/`, `/out/`, `/build` — build output
- `.env*.local` — environment variables (contains secrets)
- `/data/leads.json` — project-specific data file
- `.DS_Store`, `*.pem` — OS files and certificates

---

## middleware.ts

A Next.js middleware that runs on every request before page rendering. It handles **subdomain-based routing**:

- When a request comes from `practice.learnagenticpatterns.com` (or any host starting with `practice.`), it rewrites the URL to serve from the `/practice` route internally
- API routes, static assets, and Next.js internal files are passed through unchanged
- This allows the practice section to live on its own subdomain while sharing the same codebase

**Matcher:** Applies to all paths except `_next/static`, `_next/image`, and `favicon.ico`.

---

## instrumentation.ts

Initializes Sentry error tracking on the **server side** (both Node.js and Edge runtimes). This file runs once when the server starts, thanks to the Next.js instrumentation hook.

- Only initializes if `NEXT_PUBLIC_SENTRY_DSN` is set (safe for local dev without Sentry)
- **Trace sample rate:** 20% of requests are sampled for performance monitoring

---

## instrumentation-client.ts

Initializes Sentry on the **client side** (in the browser). Sets up error tracking, performance tracing, and session replay.

- **Trace sample rate:** 20% of page loads are sampled
- **Session replay:** records only when errors occur (0% for normal sessions, 100% when an error happens)
- **Privacy:** all text is masked and all media is blocked in replays

---

## next-env.d.ts

Auto-generated by Next.js. Provides TypeScript type definitions for Next.js-specific features like `Image`, `Link`, and environment variables. Should not be edited manually.
