import Link from "next/link";
import { ArrowRight, ChevronRight, Home, BookOpen, Layers, Shield, Zap, Target, Users } from "lucide-react";
import { patterns } from "@/data/patterns";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";

const KEY_MAPPINGS = [
  {
    icon: Layers,
    pattern: "Prompt Chaining",
    slug: "prompt-chaining",
    swe: "Pipe & Filter",
    insight:
      "You've decomposed monolithic functions into composable pipelines for decades. Prompt chaining is the same principle — break a complex LLM task into discrete steps where each step's output feeds the next. The difference? The interface between steps is natural language instead of typed data, so you need guardrails where you'd normally rely on type safety.",
  },
  {
    icon: Shield,
    pattern: "Reflection",
    slug: "reflection",
    swe: "Unit Testing / TDD",
    insight:
      "TDD means writing the test before the code: define what \"correct\" looks like, then iterate until it passes. Reflection applies this to LLMs — the model critiques its own output against defined criteria and re-generates until it meets the bar. You already think in red-green-refactor. This is the same loop, but the system under test is probabilistic.",
  },
  {
    icon: Zap,
    pattern: "Tool Use",
    slug: "tool-use",
    swe: "Adapter / Proxy Pattern",
    insight:
      "Your codebase is full of adapters: wrappers that let incompatible interfaces talk to each other. Tool Use gives LLMs the same capability — structured function calling that bridges the gap between natural language reasoning and deterministic external systems (APIs, databases, file systems). The design challenge is identical: clean interfaces, error handling, and access control.",
  },
  {
    icon: Users,
    pattern: "Multi-Agent Collaboration",
    slug: "multi-agent-collaboration",
    swe: "Microservices Architecture",
    insight:
      "Each agent owns a single domain, communicates through defined protocols, and can be developed and scaled independently. Sound familiar? It's the microservices playbook. The new dimension is that agents negotiate in natural language, which means you need explicit contracts and conflict resolution — just as you'd need API schemas and circuit breakers in a distributed system.",
  },
  {
    icon: BookOpen,
    pattern: "Knowledge Retrieval (RAG)",
    slug: "knowledge-retrieval-rag",
    swe: "Database Query / Search Index",
    insight:
      "RAG is to AI what a search index is to your application. Instead of stuffing everything into the model's context (like loading an entire database into memory), you retrieve only what's relevant at query time. You've been optimizing database queries for years — RAG architecture requires the same skills: indexing strategy, relevance ranking, and caching.",
  },
  {
    icon: Target,
    pattern: "Planning",
    slug: "planning",
    swe: "Workflow Orchestration / Saga",
    insight:
      "Saga patterns decompose long-running business processes into steps with compensating actions. Agentic planning does the same for LLM reasoning: the model creates a multi-step plan, executes each step, and can backtrack or re-plan when something fails. Your experience with workflow orchestration (Temporal, Step Functions, Airflow) maps directly.",
  },
];

const MATURITY_LEVELS = [
  {
    level: "L0",
    name: "Awareness",
    description: "Understand that agentic patterns exist and map to SWE concepts you know.",
    action: "Read through the 21 pattern overview cards on this site.",
  },
  {
    level: "L1",
    name: "Comprehension",
    description: "Articulate each pattern's purpose, its SWE parallel, and where they diverge.",
    action: "Study each pattern deep-dive, focusing on the SWE Mapping and Key Takeaway tabs.",
  },
  {
    level: "L2",
    name: "Application",
    description: "Build a simple agentic system using 3-4 patterns (e.g., Prompt Chain + Tool Use + Reflection).",
    action: "Follow the code examples. Ship a prototype that chains prompts and calls external tools.",
  },
  {
    level: "L3",
    name: "Architecture",
    description: "Design multi-agent production systems with proper error handling, observability, and human-in-the-loop checkpoints.",
    action: "Combine patterns like Multi-Agent + Exception Handling + Human-in-the-Loop for a real workflow.",
  },
  {
    level: "L4",
    name: "Leadership",
    description: "Evaluate agentic architecture trade-offs, mentor teams, and make build-vs-buy decisions for AI infrastructure.",
    action: "Use the production notes to guide architectural decisions. Lead your team's AI strategy.",
  },
];

const FAQS = [
  {
    question: "Will AI replace software engineers?",
    answer:
      "No. AI is creating a new architectural layer, not eliminating the existing one. Senior engineers who understand distributed systems, design patterns, and production reliability are the ones best equipped to build and govern agentic AI systems. The skills transfer is roughly 80% — what you know about Pipe & Filter, TDD, Microservices, Circuit Breakers, and Observability maps directly to agentic patterns like Prompt Chaining, Reflection, Multi-Agent Collaboration, Exception Handling, and Evaluation.",
  },
  {
    question: "How do I stay relevant as a senior developer in the AI era?",
    answer:
      "Learn the 21 agentic AI design patterns and understand how they map to the software engineering concepts you already use daily. Agentic AI systems need the same engineering rigor as any production system: reliability, observability, security, and scalability. Your existing expertise is the foundation — the new layer is understanding how to orchestrate LLMs as probabilistic components in your architecture.",
  },
  {
    question: "What agentic AI skills should product managers learn?",
    answer:
      "Product managers should understand the capability and limitations of agentic patterns to make informed product decisions. Key patterns to understand: Human-in-the-Loop (when to require human approval), Guardrails & Safety (what the system should never do), Planning (how agents decompose complex goals), and Evaluation & Monitoring (how to measure if the AI is actually working). These map to concepts PMs already know: approval workflows, business rules, project planning, and KPI tracking.",
  },
  {
    question: "What are agentic AI design patterns?",
    answer:
      "Agentic AI design patterns are reusable architectural blueprints for building AI systems that can perceive, reason, plan, and act with varying degrees of autonomy. There are 21 recognized patterns — from foundational ones like Prompt Chaining and Reflection to advanced patterns like Multi-Agent Collaboration and Exploration & Discovery. Each maps to a classical software engineering concept, making them accessible to experienced developers.",
  },
  {
    question: "How is agentic AI different from traditional software architecture?",
    answer:
      "The core difference is non-determinism. In traditional software, a function with the same input always produces the same output. In agentic AI, LLMs are probabilistic — the same prompt can yield different responses. This means familiar patterns need adaptation: type safety becomes guardrails, unit tests become reflection loops, fixed workflows become dynamic planning, and error handling must account for hallucinations and semantic drift. The architectural thinking is the same; the implementation details shift.",
  },
  {
    question: "How long does it take to learn agentic AI patterns as a senior engineer?",
    answer:
      "Most senior engineers can reach L2 (Application level — building simple agentic systems) within 2-4 weeks of focused study, because the conceptual foundations already exist. Reaching L3 (Architecture level — designing production multi-agent systems) typically takes 2-3 months of hands-on building. The reskilling curve is dramatically shorter than learning software engineering from scratch, because you're mapping new concepts to existing mental models.",
  },
];

export default function GuidePage() {
  return (
    <main className="relative z-10 pt-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://learnagenticpatterns.com" },
          { name: "Guide", url: "https://learnagenticpatterns.com/guide/from-software-engineer-to-agentic-architect" },
        ]}
      />
      <FAQPageJsonLd faqs={FAQS} />

      <GuideJsonLd />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-text-secondary mb-8">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home size={12} />
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-text-primary">Guide</span>
        </nav>

        {/* Hero */}
        <header className="mb-16">
          <span className="inline-block font-mono text-xs text-accent border border-accent/30 rounded-full px-3 py-1 mb-6">
            CAREER GUIDE — For Senior Engineers &amp; Technical Leaders
          </span>
          <h1 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
            From Software Engineer to Agentic Architect
          </h1>
          <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-3xl">
            You&apos;ve been shipping production systems for 10+ years. AI agents aren&apos;t replacing
            you — they&apos;re the next architecture you&apos;ll master. You already know roughly 80%
            of what&apos;s needed. This guide shows you exactly how your existing skills translate.
          </p>
        </header>

        {/* The 80% You Already Know */}
        <section className="mb-16">
          <h2 className="font-mono text-2xl font-bold text-text-primary mb-4">
            The 80% You Already Know
          </h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            Agentic AI sounds new, but the architectural patterns underneath are ones you&apos;ve been
            using for years. Prompt chaining is pipe-and-filter. Reflection is TDD. Multi-agent systems
            are microservices. The vocabulary is different; the engineering thinking is the same.
          </p>
          <p className="text-text-secondary leading-relaxed mb-6">
            The 20% that&apos;s genuinely new? Non-determinism. In traditional software, a function
            with the same input always returns the same output. LLMs are probabilistic. This means
            your familiar patterns need adaptation — type safety becomes guardrails, unit tests
            become reflection loops, and error handling must account for hallucinations and
            semantic drift.
          </p>
          <p className="text-text-secondary leading-relaxed">
            This site maps <strong className="text-text-primary">21 agentic AI design patterns</strong> to
            classical software engineering concepts. Here are the six most important mappings to
            understand first.
          </p>
        </section>

        {/* Six Key Mappings */}
        <section className="mb-16">
          <h2 className="font-mono text-2xl font-bold text-text-primary mb-8">
            Six Patterns You Already Understand
          </h2>
          <div className="space-y-8">
            {KEY_MAPPINGS.map((m) => (
              <div key={m.slug} className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <m.icon size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-mono text-lg font-bold text-text-primary mb-1">
                      {m.pattern} → {m.swe}
                    </h3>
                    <p className="text-text-secondary leading-relaxed mb-3">
                      {m.insight}
                    </p>
                    <Link
                      href={`/patterns/${m.slug}`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Deep dive into {m.pattern}
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm mt-6">
            These are 6 of{" "}
            <Link href="/#curriculum" className="text-primary hover:underline">
              21 total patterns
            </Link>{" "}
            covered in the full curriculum.
          </p>
        </section>

        {/* The Full 21-Pattern Map */}
        <section className="mb-16">
          <h2 className="font-mono text-2xl font-bold text-text-primary mb-4">
            The Complete 21-Pattern Map
          </h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            Every agentic AI pattern has a classical software engineering equivalent. Here&apos;s
            the full mapping at a glance.
          </p>
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_1fr] text-xs font-mono">
              <div className="px-4 py-3 bg-code-bg text-text-secondary border-b border-border">#</div>
              <div className="px-4 py-3 bg-code-bg text-primary border-b border-border">Agentic Pattern</div>
              <div className="px-4 py-3 bg-code-bg text-accent border-b border-border">SWE Equivalent</div>
              {patterns.map((p) => (
                <PatternRow key={p.slug} pattern={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Reskilling Roadmap */}
        <section className="mb-16">
          <h2 className="font-mono text-2xl font-bold text-text-primary mb-4">
            Reskilling Roadmap: L0 to L4
          </h2>
          <p className="text-text-secondary leading-relaxed mb-8">
            Most senior engineers reach L2 (building simple agentic systems) within 2–4 weeks,
            because the conceptual foundations already exist. Here&apos;s the progression.
          </p>
          <div className="space-y-4">
            {MATURITY_LEVELS.map((level) => (
              <div key={level.level} className="bg-surface border border-border rounded-lg p-5">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-primary font-bold text-sm">{level.level}</span>
                  <h3 className="font-mono text-text-primary font-bold">{level.name}</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-2">
                  {level.description}
                </p>
                <p className="text-text-secondary/70 text-xs font-mono">
                  → {level.action}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="font-mono text-2xl font-bold text-text-primary mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-mono text-text-primary font-bold mb-3">
                  {faq.question}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface border border-primary/20 rounded-xl p-8 md:p-12 text-center border-glow">
          <h2 className="font-mono text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Start Learning the 21 Patterns
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mb-8">
            Every pattern includes an agentic definition, code comparisons (before/after),
            the SWE mapping, production notes, and a key takeaway. Free to access.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#curriculum"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              Explore All 21 Patterns
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/agentic-ai-design-patterns-cheatsheet"
              className="inline-flex items-center gap-2 border border-border hover:border-accent/50 text-text-secondary hover:text-accent font-sans font-medium px-8 py-3.5 rounded-md transition-all"
            >
              Download Free Cheat Sheet
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}

function PatternRow({ pattern }: { pattern: (typeof patterns)[number] }) {
  return (
    <>
      <div className="px-4 py-2.5 text-text-secondary/60 border-b border-border/50 text-xs font-mono">
        {String(pattern.number).padStart(2, "0")}
      </div>
      <div className="px-4 py-2.5 border-b border-border/50">
        <Link
          href={`/patterns/${pattern.slug}`}
          className="text-text-primary hover:text-primary transition-colors text-xs"
        >
          {pattern.name}
        </Link>
      </div>
      <div className="px-4 py-2.5 text-text-secondary border-b border-border/50 text-xs">
        {pattern.sweParallel}
      </div>
    </>
  );
}

function GuideJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "From Software Engineer to Agentic Architect — A Reskilling Guide for the AI Era",
    description:
      "A practical guide for senior engineers showing how 21 agentic AI design patterns map to classical software engineering concepts like Pipe & Filter, TDD, Microservices, and more.",
    url: "https://learnagenticpatterns.com/guide/from-software-engineer-to-agentic-architect",
    datePublished: "2026-03-02T00:00:00Z",
    dateModified: "2026-03-02T00:00:00Z",
    author: {
      "@type": "Person",
      name: "Mousa Al-Jawaheri",
      url: "https://www.linkedin.com/in/mosatiii/",
    },
    publisher: {
      "@type": "Organization",
      name: "Learn Agentic Patterns",
      url: "https://learnagenticpatterns.com",
    },
    inLanguage: "en",
    isAccessibleForFree: true,
    articleBody:
      "You've been shipping production systems for 10+ years. AI agents aren't replacing you — they're the next architecture you'll master. Agentic AI sounds new, but the patterns underneath are ones you've been using for years. Prompt chaining is pipe-and-filter. Reflection is TDD. Multi-agent systems are microservices. The vocabulary is different; the engineering thinking is the same. This guide maps 21 agentic AI design patterns to classical software engineering concepts and provides a reskilling roadmap from L0 (Awareness) to L4 (Leadership).",
    about: [
      { "@type": "Thing", name: "Agentic AI Design Patterns" },
      { "@type": "Thing", name: "Software Engineering Career Development" },
      { "@type": "Thing", name: "AI Reskilling for Developers" },
    ],
    keywords:
      "agentic AI, design patterns, software engineer reskilling, AI career guide, LLM architecture, senior developer AI skills, will AI replace software engineers",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
