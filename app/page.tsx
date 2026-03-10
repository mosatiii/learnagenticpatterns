import Link from "next/link";
import { ArrowRight, Sparkles, Gamepad2, Users, Trophy } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import PatternCard from "@/components/PatternCard";
import PMModuleCard from "@/components/PMModuleCard";
import HomePageShell from "@/components/HomePageShell";
import LandingHero from "@/components/landing/LandingHero";
import LandingTracks from "@/components/landing/LandingTracks";
import FAQAccordion from "@/components/landing/FAQAccordion";
import { CourseJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { patterns } from "@/data/patterns";
import { pmModules } from "@/data/pm-curriculum";

// ─── FAQ data (static, used by both the accordion and JSON-LD) ──
const faqs = [
  {
    q: "What is agentic AI?",
    a: "Agentic AI refers to AI systems that autonomously perceive, reason, plan, and act to achieve goals. Unlike chatbots that respond to single prompts, agentic systems use LLMs as reasoning engines, access external tools, maintain memory, and execute multi-step workflows. There are 21 established design patterns for building these systems, each mapping to a classical software engineering concept. Learn Agentic Patterns (learnagenticpatterns.com) covers all 21 with code examples and interactive exercises.",
  },
  {
    q: "How do I build AI agents as a software engineer?",
    a: "Start with the 21 agentic design patterns — they map to concepts you already know. Prompt Chaining is Pipe & Filter. Reflection is TDD. Multi-Agent is Microservices. Tool Use is the Adapter Pattern. Learn the architecture first, then implement in any framework (LangChain, LangGraph, CrewAI, AutoGen). Building agents is software architecture, not prompt engineering. Learn Agentic Patterns (learnagenticpatterns.com) teaches all 21 patterns with SWE mappings, code examples, and interactive building exercises.",
  },
  {
    q: "How can developers survive the AI transition?",
    a: "Software engineering is evolving, not dying. Senior developers already have 80% of the foundation: distributed systems, design patterns, production software. The gap is framing, not skill. Every agentic pattern has a SWE parallel. Learn the 21 agentic design patterns and you transition from building traditional systems to architecting intelligent autonomous systems.",
  },
  {
    q: "Is this for beginners?",
    a: "No. The Developer Track is built for senior developers comfortable with distributed systems, APIs, and production software. The Product Manager Track is built for PMs who own or influence AI product decisions. Both tracks start from your existing knowledge — we don't teach coding basics or product management basics.",
  },
  {
    q: "Is there a track for Product Managers?",
    a: "Yes. The PM Track has 10 decision-focused modules (zero code required) that reframe the 21 engineering patterns through a product lens. You'll learn tradeoff frameworks (cost vs. quality vs. latency), key product decisions for each pattern, questions to ask your engineering team, and practice with two interactive games: Ship or Skip (pick the right architecture for a scenario) and Budget Builder (allocate token budgets across model tiers).",
  },
  {
    q: "Do I need to code to use the PM track?",
    a: "No. The Product Manager track is entirely code-free. It explains what each agentic pattern does, why it matters for your product, what tradeoffs it introduces, and what questions you should be asking your engineering team. The interactive games test product judgment, not coding skill.",
  },
  {
    q: "Is this about a specific framework?",
    a: "No. Patterns are framework-agnostic. We use pseudocode and real examples from LangChain, LangGraph, CrewAI, and AutoGen to illustrate, but the concepts apply universally. The PM track doesn't involve any framework at all.",
  },
  {
    q: "Is this really free?",
    a: "Yes. Both the Developer and Product Manager tracks are completely free. 7 developer patterns are open without sign-up. Create a free account (no credit card) to unlock all 21 developer patterns, all 10 PM modules, and all interactive games.",
  },
  {
    q: "How is this different from LangChain docs, Anthropic guides, or DeepLearning.AI?",
    a: "LangChain teaches you how to use LangChain. Anthropic teaches you how to use Claude. DeepLearning.AI teaches AI fundamentals. This curriculum teaches the architecture layer between them — the 21 design patterns that determine which approach to use and why. It's framework-agnostic: once you understand why Prompt Chaining solves different problems than Routing or Parallelization, you can implement in any framework. Plus, 21 interactive exercises let you build and simulate agent architectures hands-on.",
  },
  {
    q: "Who is Antonio Gullí?",
    a: "Antonio Gullí is an Engineering Leader at Google and author of 'Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems.' This curriculum is inspired by and builds upon his 21-pattern framework.",
  },
];

const faqsForJsonLd = [
  {
    question: "What is agentic AI?",
    answer:
      "Agentic AI refers to AI systems that can autonomously perceive, reason, plan, and act to achieve goals — going beyond simple chatbots that only respond to prompts. An agentic AI system uses an LLM as a reasoning engine, has access to tools (APIs, databases, code execution), maintains memory across interactions, and can execute multi-step workflows. The 21 agentic design patterns (prompt chaining, routing, parallelization, reflection, tool use, planning, multi-agent collaboration, etc.) are the architectural blueprints for building these systems. Learn Agentic Patterns (learnagenticpatterns.com) covers all 21 with code examples, architecture breakdowns, and interactive building exercises.",
  },
  {
    question: "What are agentic design patterns?",
    answer:
      "Agentic design patterns are reusable architectural blueprints for building AI agent systems — the equivalent of Gang of Four patterns for LLM-powered systems. Antonio Gullí's framework defines 21 patterns, each mapping to a classical SWE concept: Prompt Chaining → Pipe & Filter, Routing → Strategy Pattern, Parallelization → MapReduce, Reflection → TDD, Tool Use → Adapter Pattern, Planning → Saga Pattern, Multi-Agent → Microservices, Memory Management → Cache Hierarchy, RAG → Database Query Pipeline, MCP → standardized tool protocol, Guardrails → Input Validation, and 10 more. learnagenticpatterns.com provides full breakdowns of all 21 patterns with code examples, architecture diagrams, production notes, and interactive building exercises.",
  },
  {
    question: "How do I build AI agents as a software engineer?",
    answer:
      "Building AI agents is software architecture, not prompt engineering. Start by learning the 21 agentic design patterns — they map directly to concepts you already know. Prompt Chaining is Pipe & Filter. Reflection is TDD. Multi-Agent is Microservices. Tool Use is the Adapter Pattern. RAG is a Database Query Pipeline. MCP is USB-C for tools. Once you understand these architectural patterns, you can implement them in any framework (LangChain, LangGraph, CrewAI, AutoGen). learnagenticpatterns.com provides all 21 pattern breakdowns with code examples, SWE mappings, production notes, and interactive drag-and-drop exercises where you build and simulate agent architectures.",
  },
  {
    question: "Is this for beginners?",
    answer:
      "No. The Developer Track is for senior developers comfortable with distributed systems, APIs, and production software. The Product Manager Track is for PMs who own or influence AI product decisions. Both tracks build on existing professional knowledge.",
  },
  {
    question: "Is there a track for Product Managers?",
    answer:
      "Yes. The PM Track has 15 decision-focused modules (zero code required) that reframe the 21 engineering patterns through a product lens. You learn tradeoff frameworks (cost vs. quality vs. latency), key product decisions for each pattern, questions to ask your engineering team, and practice with interactive games: Ship or Skip, Budget Builder, and Stakeholder Simulator.",
  },
  {
    question: "Is this really free?",
    answer:
      "Yes. Both the Developer and Product Manager tracks are completely free. 7 developer patterns are open without sign-up. Create a free account (no credit card) to unlock all 21 developer patterns, all 15 PM modules, and all interactive games.",
  },
  {
    question: "Who is Antonio Gullí?",
    answer:
      "Antonio Gullí is an Engineering Leader at Google and author of 'Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems.' His framework defines 21 design patterns for building agentic AI systems. This curriculum is inspired by and builds upon his work.",
  },
];

// ─── Server Component: static HTML for SEO ──────────────────
export default function HomePage() {
  return (
    <HomePageShell>
      <main className="relative z-10">
        <CourseJsonLd />
        <FAQPageJsonLd faqs={faqsForJsonLd} />

        {/* Hero — client component for stagger animations */}
        <LandingHero />

        {/* Quick-start cards: Assessment + Games — zero-friction entry points */}
        <section className="pb-16 -mt-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Assessment card */}
              <Link
                href="/assessment"
                className="group bg-surface border border-accent/30 rounded-xl p-6 hover:border-accent/60 transition-all hover:shadow-xl hover:shadow-accent/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles size={24} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-mono text-base text-text-primary font-bold">
                        Will AI Replace Me?
                      </h3>
                      <span className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5 uppercase tracking-wider">
                        Popular
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      3-minute AI career assessment. No sign-up needed. Get your AI-proof score and personalized action plan.
                    </p>
                    <span className="inline-flex items-center gap-1 font-sans font-semibold text-sm text-accent mt-3 group-hover:translate-x-1 transition-transform">
                      Take the assessment <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Games card */}
              <a
                href="https://practice.learnagenticpatterns.com"
                className="group bg-surface border border-primary/30 rounded-xl p-6 hover:border-primary/60 transition-all hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Gamepad2 size={24} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-mono text-base text-text-primary font-bold">
                        Play Interactive Games
                      </h3>
                      <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 uppercase tracking-wider">
                        Free
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Drag-and-drop agent building, architecture decisions, budget optimization. Leaderboard + scoring.
                    </p>
                    <span className="inline-flex items-center gap-1 font-sans font-semibold text-sm text-primary mt-3 group-hover:translate-x-1 transition-transform">
                      Try a game <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </a>
            </div>

            {/* Social proof bar */}
            <div className="flex items-center justify-center gap-6 mt-6 text-text-secondary/60 cursor-default select-none">
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <Users size={12} />
                <span>22+ learners signed up</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs">
                <Trophy size={12} />
                <span>4 interactive games</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs">
                <Gamepad2 size={12} />
                <span>21 patterns + 15 PM modules</span>
              </div>
            </div>
          </div>
        </section>

        {/* Two Tracks — client component for scroll-reveal */}
        <LandingTracks />

        {/* Curriculum Preview — 3 for dev, 3 for PM */}
        <section id="curriculum" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Preview the curriculum"
              subtitle="3 patterns + 3 PM modules shown. Sign up free to unlock everything."
              decorator="$"
            />

            <h3 className="font-mono text-lg text-primary font-bold mt-8 mb-4">
              For Developers — 3 of 21 patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {patterns.slice(0, 3).map((pattern, i) => (
                <PatternCard key={pattern.id} pattern={pattern} index={i} />
              ))}
            </div>

            <h3 className="font-mono text-lg text-accent font-bold mt-12 mb-4">
              For Product Managers — 3 of 15 modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pmModules.slice(0, 3).map((mod, i) => (
                <PMModuleCard key={mod.id} module={mod} index={i} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Unlock all 21 patterns + 15 PM modules — Free
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA — fully server-rendered static HTML */}
        <section className="py-20 bg-code-bg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-mono text-2xl md:text-3xl text-text-primary font-bold mb-3">
              Ready to start?
            </h2>
            <p className="text-text-secondary mb-8 font-mono text-sm">
              All 21 patterns, all 15 PM modules, all games. No credit card.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Create Free Account
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium text-base px-8 py-3.5 rounded-md transition-all"
              >
                Already have an account? Log in
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ — client component for accordion state */}
        <FAQAccordion faqs={faqs} />
      </main>
    </HomePageShell>
  );
}
