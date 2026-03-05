# Data

Static content and configuration data files. These define the curriculum content, blog posts, game exercises, and assessment questions. All data is stored as TypeScript objects (not in the database or markdown files).

```
data/
├── assessment.ts    # Assessment question bank (4 roles, 40+ questions)
├── blog.ts          # Blog post content (8 articles)
├── games.ts         # Agent Builder game configs (21 exercises)
└── patterns.ts      # 21 pattern definitions + maturity levels
```

---

## assessment.ts

Defines the complete question bank for the "Will AI Replace Me?" career assessment tool. Covers four roles with tailored questions:

| Role | Question Count | Focus |
|---|---|---|
| Developer | 12 questions | Maps directly to the 21 agentic patterns, evaluates hands-on experience |
| Product Manager | 10 questions | AI product sense, strategy, stakeholder management |
| Designer | 8 questions | AI-native UX, prototyping, design system integration |
| Writer | 8 questions | AI-augmented content workflows, editorial judgment |

Plus 2 shared closing questions that apply to all roles.

Each question has:
- A `type` (`single`, `multi`, or `text`) determining the input format
- An array of `options`, each with a `signal` string that the AI uses to understand what the answer reveals about the person

**Exports:**
- `Role` type — `"developer" | "pm" | "designer" | "writer"`
- `AssessmentOption`, `AssessmentQuestion`, `RoleAssessment`, `AssessmentResult` interfaces
- `sharedQuestions` — questions asked to all roles
- `roleAssessments` — the full question bank array
- `getRoleAssessment(role)` — returns the question set for a specific role

---

## blog.ts

Contains all blog post content as structured TypeScript objects (not markdown files). Each post includes:

| Field | Purpose |
|---|---|
| `slug` | URL path segment (e.g., `what-is-an-ai-agent`) |
| `title` | Article title |
| `description` | Short description for cards and SEO |
| `tags` | Array of category tags for filtering |
| `readingTime` | Estimated reading time (e.g., "6 min") |
| `publishedAt` / `updatedAt` | Dates for SEO and display |
| `sections` | Array of content sections with optional headings, body text, and code snippets |
| `tldr` | One-line summary shown in a callout box |
| `keyTakeaway` | The main insight readers should remember |
| `aiQuestion` / `aiAnswer` | SEO-optimized Q&A pair for AI crawlers to surface |
| `relatedPattern` | Slug linking to the related pattern page |

**Current articles (8):**
1. What is an AI Agent?
2. Prompt Chaining Explained
3. RAG vs Fine-Tuning
4. Reflection Pattern
5. Model Context Protocol (MCP)
6. Multi-Agent Systems
7. Tool Use Pattern
8. How to Choose the Right Pattern

**Exports:**
- `BlogPost`, `BlogSection` interfaces
- `blogPosts` — the full array
- `getAllBlogPosts()` — returns all posts
- `getBlogPostBySlug(slug)` — finds a post by its URL slug
- `getBlogPostsByTag(tag)` — filters posts by tag
- `getAllTags()` — returns deduplicated tag list

---

## games.ts

Defines the game configuration for all 21 interactive Agent Builder exercises — one per agentic pattern. This is the core data that powers the drag-and-drop learning games.

Each `GameConfig` contains:

| Field | Purpose |
|---|---|
| `slug` | Pattern slug this game belongs to (e.g., `prompt-chaining`) |
| `title` | Game title (e.g., "Build a Prompt Chain Agent") |
| `mission` | Description of the scenario the user must solve |
| `blocks` | Array of available blocks (including distractors meant to trick users) |
| `requiredBlocks` | IDs of blocks that must be placed for a correct solution |
| `validTopologies` | Arrays of valid block orderings (multiple correct solutions possible) |
| `simulate(placedIds)` | Function that generates simulation events based on user's arrangement |
| `scoring` | Weights for architecture, resilience, and efficiency categories |
| `hints` | Array of hint strings if the user gets stuck |
| `successMessage` | Message shown on successful completion |

Each `BlockDefinition` has:
- `id` — unique identifier
- `label` — display name
- `icon` — emoji/icon
- `category` — `agent`, `gate`, `data`, or `distractor`

**Exports:**
- `BlockCategory`, `BlockDefinition`, `SimulationEvent`, `GameConfig` types
- `getGameConfig(slug)` — returns the game config for a pattern
- `hasGameConfig(slug)` — checks if a game exists for a pattern

---

## patterns.ts

The central data file defining all 21 agentic design patterns. This is the backbone of the entire curriculum.

Each `Pattern` object contains:

| Field | Purpose |
|---|---|
| `slug` | URL segment (e.g., `prompt-chaining`) |
| `number` | Order in the curriculum (1-21) |
| `name` | Agentic pattern name (e.g., "Prompt Chaining") |
| `sweParallel` | Classical SWE equivalent (e.g., "Pipe & Filter") |
| `description` | Short description for cards |
| `agenticDefinition` | Detailed definition of the agentic pattern |
| `sweMapping.similarity` | How this pattern is similar to its SWE parallel |
| `sweMapping.divergence` | How this pattern differs from its SWE parallel |
| `codeExample.before` | Code showing the traditional approach |
| `codeExample.after` | Code showing the agentic approach |
| `productionNotes` | Real-world deployment considerations |
| `keyTakeaway` | Summary insight |
| `isLocked` | Whether the pattern requires signup (`true` for patterns 8-21) |

**The 21 patterns:**
1. Prompt Chaining ↔ Pipe & Filter
2. Routing ↔ Strategy Pattern
3. Parallelization ↔ MapReduce / Fork-Join
4. Orchestrator-Worker ↔ Master-Worker
5. Evaluator-Optimizer ↔ Genetic Algorithms
6. Autonomous Agent ↔ Event-Driven Architecture
7. Reflection ↔ Test-Driven Development
8. Tool Use ↔ Adapter / Facade
9. Planning ↔ HTN Planning / BFS
10. Multi-Agent ↔ Microservices
11. RAG ↔ CQRS / Materialized Views
12. Guardrails ↔ Input Validation / Middleware
13. Fallback ↔ Circuit Breaker
14. Human-in-the-Loop ↔ Approval Workflow
15. Caching ↔ Memoization / CDN
16. Memory ↔ Session State / Event Sourcing
17. Few-Shot Learning ↔ Template Method
18. Self-Consistency ↔ Consensus / Quorum
19. Meta-Prompting ↔ Abstract Factory
20. Mixture of Agents ↔ Ensemble Methods
21. Context Engineering ↔ Dependency Injection

Also defines:
- **`MATURITY_LEVELS`** — 5 levels (L0 Reactive → L4 Autonomous Multi-Agent)
- **`MAPPING_TABLE_DATA`** — simplified mapping data for the MappingTable component

**Exports:**
- `Pattern` interface
- `patterns` — the full array (21 items)
- `getPatternBySlug(slug)` — finds a pattern by URL slug
- `getUnlockedPatterns()` — returns only the 7 free patterns
- `MATURITY_LEVELS` — maturity level data
- `MAPPING_TABLE_DATA` — mapping table data
