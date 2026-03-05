# Library (lib/)

Shared utility functions and backend helpers used across the application. The `game/` subfolder contains the Agent Builder game logic.

```
lib/
├── assessment-prompt.ts     # AI prompt builder for career assessments
├── db.ts                    # PostgreSQL connection + schema management
├── email-templates.ts       # HTML email templates (4 types)
├── posthog-config.ts        # Analytics configuration
├── rate-limit.ts            # In-memory request rate limiter
├── utils.ts                 # Small shared utility functions
├── validations.ts           # Zod validation schemas for forms
└── game/
    ├── graph-validator.ts   # Block arrangement validation
    └── simulation-engine.ts # Scoring and simulation orchestration
```

---

## assessment-prompt.ts

Builds the system prompt and user message sent to the Gemini AI for career assessments. Contains detailed, role-specific instructions for four roles:

| Role | Focus |
|---|---|
| Developer | Maps SWE skills to specific agentic patterns, evaluates technical depth |
| Product Manager | Evaluates AI product sense, stakeholder management |
| Designer | Evaluates AI-native UX thinking, prototyping approach |
| Writer | Evaluates content strategy for AI-augmented workflows |

The prompt instructs the AI to return structured JSON with: an AI-proof score (0-100), strengths, vulnerabilities, a 30-day action plan, and an elevator pitch.

**Exports:** `buildSystemPrompt(role)`, `buildUserMessage(role, answers)`

---

## db.ts

Sets up a PostgreSQL connection pool and auto-creates the database schema on first query.

**Database Tables:**

| Table | Purpose |
|---|---|
| `users` | Stores user accounts (id, email, password_hash, first_name, role, challenge, created_at) |
| `reading_progress` | Tracks which patterns each user has read (user_id, pattern_slug, read_at) |
| `password_resets` | Stores password reset tokens (user_id, token, expires_at, used) |
| `game_scores` | Stores Agent Builder game results (user_id, pattern_slug, total_score, architecture_score, resilience_score, efficiency_score) |

The `ensureTablesExist()` function runs `CREATE TABLE IF NOT EXISTS` statements and handles schema migrations (adding columns to existing tables). This means the database is self-initializing — no separate migration tool is needed.

**Exports:** `query<T>(text, params)` (typed query helper), `default pool` (raw `pg.Pool`)

**Env vars:** `DATABASE_URL` (PostgreSQL connection string)

---

## email-templates.ts

Contains HTML email template functions styled to match the site's dark-mode branding. All templates generate complete HTML documents with inline styles.

| Function | Sent When | Contents |
|---|---|---|
| `welcomeEmail(firstName)` | User signs up | Welcome message, link to first pattern |
| `adminNotificationEmail(data)` | User signs up | New user details for admin monitoring |
| `assessmentReportEmail(result, role)` | User requests email of assessment | Full AI-readiness results (score, strengths, vulnerabilities, action plan, elevator pitch) |
| `passwordResetEmail(firstName, resetUrl)` | User requests password reset | Reset link (expires in 1 hour) |

---

## posthog-config.ts

A simple config file that exports the PostHog analytics credentials as constants. Centralizes these values so they're imported from one place.

**Exports:** `POSTHOG_KEY` (string), `POSTHOG_HOST` (string)

**Env vars:** `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`

---

## rate-limit.ts

An in-memory rate limiter that tracks request counts per IP address within a sliding time window.

**How it works:**
1. Each IP gets an entry with a request count and a window start timestamp
2. When a request comes in, it checks if the window has expired (resets if so) or if the count exceeds the max
3. Returns `{ success: true }` if allowed, or `{ success: false, retryAfterMs }` if rate-limited
4. A periodic cleanup removes stale entries to prevent memory leaks

Also exports `getClientIp(request)` to extract the client IP from `x-forwarded-for` or `x-real-ip` headers.

**Exports:** `rateLimit(ip, config)`, `getClientIp(request)`

---

## utils.ts

Small utility functions shared across the codebase.

- **`cn(...inputs)`** — merges Tailwind CSS class names using `clsx` + `tailwind-merge`. This prevents class conflicts (e.g., `p-4` and `p-2` won't both apply — the last one wins).
- **`formatPatternNumber(num)`** — formats a number like `3` into `[03]` for display consistency.

**Exports:** `cn`, `formatPatternNumber`

---

## validations.ts

Zod validation schemas for all authentication forms. Each schema defines the shape and rules for form data, and the `infer` utility generates matching TypeScript types automatically.

| Schema | Fields | Rules |
|---|---|---|
| `signupSchema` | firstName, email, password, role, challenge? | Name 1-50 chars, valid email, password 8+ chars, role from enum, optional challenge text |
| `loginSchema` | email, password | Valid email, password 1+ chars |
| `forgotPasswordSchema` | email | Valid email |
| `resetPasswordSchema` | password, confirmPassword | Password 8+ chars, both fields must match |

**Exports:** `signupSchema`, `SignupFormData`, `loginSchema`, `LoginFormData`, `forgotPasswordSchema`, `ForgotPasswordFormData`, `resetPasswordSchema`, `ResetPasswordFormData`

---

## game/ — Game Logic

### graph-validator.ts

Pure utility functions for validating a user's block arrangement in the Agent Builder game. These are side-effect-free and easy to unit test.

- **`isTopologyMatch(userOrder, validOrders)`** — checks if the user's block arrangement matches any of the valid topologies defined in the game config
- **`findMissingBlocks(userIds, requiredIds)`** — returns which required blocks the user forgot to place
- **`findDistractors(userIds, requiredIds)`** — returns which placed blocks are wrong (distractors that shouldn't be there)

### simulation-engine.ts

The scoring and simulation orchestration layer that sits on top of `graph-validator.ts`.

- **`validateGraph(placedIds, config)`** — combines all graph-validator checks into a single validation result
- **`runSimulation(placedIds, config)`** — delegates to the game config's `simulate()` function to generate a sequence of events
- **`calculateScore(placedIds, config)`** — computes a 3-category score:
  - **Architecture** — did they pick the right blocks in the right order?
  - **Resilience** — did they include error handling/validation blocks?
  - **Efficiency** — did they avoid unnecessary blocks?

  A total score of 60% or above is a pass.

**Exports:** `Score` interface, `ValidationResult` interface, `validateGraph`, `runSimulation`, `calculateScore`
