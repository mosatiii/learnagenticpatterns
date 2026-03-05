# Components

Reusable React components used across the application. The `AgentBuilder/` subfolder contains the interactive drag-and-drop game, while the remaining files are general-purpose UI components.

```
components/
├── AgentBuilder/
│   ├── AgentBuilder.tsx       # Game orchestrator (state machine)
│   ├── BlockPalette.tsx       # Sidebar of draggable blocks
│   ├── BuildCanvas.tsx        # Drop zone where blocks are placed
│   ├── CanvasNode.tsx         # Individual block on the canvas
│   ├── ConnectionEdges.tsx    # SVG lines connecting blocks
│   └── ScoreCard.tsx          # Game results display
│
├── AnimatedGrid.tsx           # Decorative background
├── CodeBlock.tsx              # Syntax-highlighted code display
├── Footer.tsx                 # Site footer
├── JsonLd.tsx                 # SEO structured data
├── MappingTable.tsx           # Pattern ↔ SWE mapping table
├── MaturityLevel.tsx          # 5-level maturity model
├── NavBar.tsx                 # Top navigation
├── PatternCard.tsx            # Pattern card for grids
├── PostHogProvider.tsx        # Analytics setup
├── ProgressBadge.tsx          # Mini progress indicator
├── ProgressCircle.tsx         # Large progress chart
├── Providers.tsx              # Context provider composition
├── SectionHeader.tsx          # Reusable heading
├── Skeleton.tsx               # Loading placeholders
└── ui/                        # (empty — placeholder for shadcn/Radix)
```

---

## AgentBuilder/ — Interactive Game

The Agent Builder is a drag-and-drop game where users build an AI agent pipeline by placing blocks in the correct order. Each of the 21 agentic patterns has its own exercise.

### AgentBuilder.tsx

The main orchestrator that manages the entire game lifecycle using `useReducer`. The game has three phases:

1. **`building`** — user drags blocks from the palette onto the canvas and arranges them
2. **`simulating`** — the system animates through the pipeline step by step, showing pass/fail/warn for each block
3. **`complete`** — displays the score card with results

When the game finishes, it saves the score to the backend via the `/api/game-scores` endpoint. The reducer handles actions like `PLACE_NODE`, `REMOVE_NODE`, `REORDER_NODES`, `START_SIMULATION`, `SIMULATION_TICK`, and `SIMULATION_COMPLETE`.

### BlockPalette.tsx

The sidebar panel that shows all available blocks the user can drag onto the canvas. Each block is color-coded by category:

| Category | Color | Purpose |
|---|---|---|
| `agent` | Cyan | Core agent blocks (the right answer) |
| `gate` | Orange | Gating/validation blocks |
| `data` | Green | Data processing blocks |
| `distractor` | Red | Wrong answers meant to trick the user |

Blocks are disabled during simulation so the user can't modify the pipeline mid-run.

### BuildCanvas.tsx

The drop-target area where the user builds their agent pipeline. It handles:
- **Drag over** — highlights the drop zone when a block is being dragged over it
- **Dropping** — adds a new block from the palette when dropped
- **Reordering** — allows rearranging blocks by dragging within the canvas

Renders `CanvasNode` components connected by `ConnectionEdges`.

### CanvasNode.tsx

Renders a single block on the canvas with its label, icon, and category-colored styling. During simulation, it shows visual feedback:
- **Pass** — green glow
- **Fail** — red glow
- **Warn** — orange glow

Supports drag-to-reorder and has a remove button (X). Uses Framer Motion for smooth entry/exit animations.

### ConnectionEdges.tsx

Draws SVG vertical lines connecting consecutive blocks on the canvas, creating the visual "pipeline" flow. Lines change color during simulation to reflect the status of the block above (green for pass, red for fail, orange for warn).

### ScoreCard.tsx

Displays the game results after simulation completes:
- Trophy icon and total percentage score
- Breakdown across three scoring categories: Architecture, Resilience, Efficiency
- Full simulation log showing each event with pass/fail/warn icons
- "Try Again" button to reset

Uses spring animations from Framer Motion for a satisfying reveal.

---

## General Components

### AnimatedGrid.tsx

A purely decorative background component that renders a subtle blueprint-style dotted grid behind the page content. It's fixed-position and `pointer-events-none` so it never interferes with interactions. Provides the "technical blueprint" aesthetic for the dark theme.

### CodeBlock.tsx

A styled code display component with:
- macOS-style window header (red/yellow/green dots + filename title)
- Line numbers in the gutter
- Copy-to-clipboard button
- Basic syntax highlighting for JavaScript/TypeScript keywords (`const`, `function`, `await`, `return`, `if`, etc.) and comments (`//`)

The highlighting splits the code by keyword regex and wraps matches in colored `<span>` elements.

### Footer.tsx

The site footer with a three-column layout:
- **Branding** — logo and tagline
- **Navigation** — links to Home, Curriculum, Blog, Practice, Cheatsheet, Guide, About, Assessment
- **Social** — LinkedIn and GitHub links

Includes a CTA banner linking to Prompted Studio. Adapts its link set when on the `/practice` subdomain.

### JsonLd.tsx

A collection of JSON-LD structured data components that inject `<script type="application/ld+json">` tags into the page for SEO. Search engines and AI crawlers use this to understand the content. Includes:

| Component | Schema Type | Used On |
|---|---|---|
| `WebSiteJsonLd` | WebSite | Root layout |
| `CourseJsonLd` | Course | Root layout |
| `ItemListJsonLd` | ItemList | Root layout |
| `PatternArticleJsonLd` | Article | Pattern detail pages |
| `BreadcrumbJsonLd` | BreadcrumbList | Blog, patterns, guide |
| `FAQPageJsonLd` | FAQPage | Assessment, practice, guide |
| `CheatSheetJsonLd` | WebPage | Cheatsheet page |
| `BlogPostJsonLd` | BlogPosting | Individual blog posts |
| `BlogListJsonLd` | Blog | Blog listing page |

### MappingTable.tsx

An animated table showing how each Agentic AI pattern maps to a classical Software Engineering concept (e.g., "Prompt Chaining" ↔ "Pipe & Filter"). Each row slides in from the left as it enters the viewport using Framer Motion's `whileInView`. Data comes from `MAPPING_TABLE_DATA` in `data/patterns.ts`.

### MaturityLevel.tsx

Displays the 5 agent maturity levels as cards in a responsive grid:

| Level | Name | Example |
|---|---|---|
| L0 | Reactive | Simple chatbots |
| L1 | Informed | RAG-enhanced assistants |
| L2 | Deliberative | Reasoning agents with tool use |
| L3 | Adaptive | Self-improving agents |
| L4 | Autonomous Multi-Agent | Orchestrated agent teams |

Includes a scroll-linked horizontal progress bar on desktop. Data comes from `MATURITY_LEVELS` in `data/patterns.ts`.

### NavBar.tsx

The fixed top navigation bar with:
- Monospace logo with a blinking cursor animation
- Desktop nav links (Home, Curriculum, Blog, Practice, etc.)
- "Free Cheat Sheet" CTA button
- User dropdown (name + logout) when signed in
- `ProgressBadge` for logged-in users
- Mobile hamburger menu with slide-in panel

Adapts its link set when on the `/practice` subdomain.

### PatternCard.tsx

A card component for the curriculum grid. Shows the pattern number, name, SWE parallel, and description. Behavior depends on state:
- **Unlocked + unread** — clickable, links to the pattern page
- **Unlocked + read** — green left border and checkmark icon
- **Locked** — shows lock icon, redirects to signup on click

Uses Framer Motion for scroll-triggered entry animations.

### PostHogProvider.tsx

Initializes the PostHog analytics SDK when the component mounts. Configures:
- Automatic pageview capture
- Autocapture of clicks/form submissions
- Heatmaps
- Console log recording

Also exports a `PostHogIdentify` component that identifies the logged-in user to PostHog whenever the auth state changes.

### ProgressBadge.tsx

A small inline badge that appears in the navbar showing reading progress as a mini circular SVG indicator and a count like "7/21". Returns `null` if the user is not signed in.

### ProgressCircle.tsx

A larger animated circular progress indicator for the dashboard. Shows completion as a percentage (e.g., "33%") and a fraction ("7/21"). Uses Framer Motion to animate the SVG stroke dasharray. Returns `null` for unauthenticated users.

### Providers.tsx

The top-level client-side wrapper that composes all global providers in the correct nesting order:
1. `PostHogProvider` (outermost — analytics)
2. `AuthProvider` (with `totalPatterns` set to 21)
3. `PostHogIdentify` (identifies the user for analytics)

This is the single place where all context providers are assembled, and it's rendered in `layout.tsx`.

### SectionHeader.tsx

A reusable section heading component with:
- A monospace decorator character (defaults to `>`)
- A large bold title
- An optional subtitle
- A decorative circuit-line divider below

Animates into view on scroll with Framer Motion.

### Skeleton.tsx

A collection of loading skeleton components used while pages stream/load:

| Component | Used By |
|---|---|
| `SkeletonLine` | General-purpose animated bar |
| `SkeletonCard` | Card placeholder |
| `SkeletonPatternPage` | Pattern detail page loading state |
| `SkeletonHomepage` | Homepage loading state (hero + grid) |

All use pulsing animations to indicate loading.
