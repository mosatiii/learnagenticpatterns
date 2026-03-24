# Learn Agentic Patterns

A free, open-source educational platform that teaches senior software engineers how to build agentic AI systems by mapping **21 design patterns** to classical software engineering concepts.

**Live site**: [learnagenticpatterns.com](https://learnagenticpatterns.com)

## What You'll Learn

### Developer Track (21 Patterns)

Each agentic AI pattern is mapped to a familiar SWE concept — so you learn new AI architectures through patterns you already know:

| Agentic Pattern | Maps To |
|---|---|
| Prompt Chaining | Pipe & Filter |
| Reflection | Test-Driven Development |
| Tool Use | Strategy Pattern |
| ReAct | Observer Pattern |
| Multi-Agent | Microservices |
| ...and 16 more | |

Includes interactive code examples, architecture diagrams, and an **Agent Builder** game with 21 hands-on exercises.

### Product Manager Track (10 Modules)

Code-free modules focused on AI architecture decisions and product tradeoffs for PMs working with agentic systems. Includes two challenge games: **Ship or Skip** and **Budget Builder**.

### AI Career Assessment

An interactive "Will AI Replace Me?" assessment powered by Google Gemini that provides personalized analysis across 40+ questions for 4 different roles.

## Tech Stack

- **Framework**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Database**: PostgreSQL (auto-initializing schema)
- **Auth**: Email/password with bcrypt + JWT
- **AI**: Google Gemini API
- **Email**: Resend
- **Analytics**: PostHog (optional)
- **Monitoring**: Sentry (optional)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- API keys for Gemini and Resend (see `.env.example`)

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/mosatiii/learnagenticpatterns.git
   cd learnagenticpatterns
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and fill in your values. See `.env.example` for all available options.

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

The PostgreSQL schema auto-initializes on first connection — no manual migrations needed.

## Project Structure

```
app/                  # Next.js App Router pages & API routes
  api/                # REST endpoints (auth, assessment, stats)
  patterns/           # Developer track pattern pages
  pm/                 # Product manager track pages
  blog/               # Blog articles
  practice/           # Agent Builder game & exercises
components/           # React components (UI, game, layout)
contexts/             # Auth context provider
data/                 # Static content (patterns, questions, blog posts, exercises)
lib/                  # Utilities (db, jwt, email, validation, game logic)
docs/                 # Detailed technical documentation
public/               # Static assets
```

See the [docs/](docs/) folder for comprehensive documentation of every module.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
