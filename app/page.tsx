import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import HomePageShell from "@/components/HomePageShell";
import LandingHero from "@/components/landing/LandingHero";
import LandingTracks from "@/components/landing/LandingTracks";
import LandingPersonaSwitcher from "@/components/landing/LandingPersonaSwitcher";
import SocialProof from "@/components/landing/SocialProof";
import FAQAccordion from "@/components/landing/FAQAccordion";
import StickyAssessmentCTA from "@/components/landing/StickyAssessmentCTA";
import { CourseJsonLd, FAQPageJsonLd } from "@/components/JsonLd";

// FAQ data (static, used by both the accordion and JSON-LD)
const faqs = [
  {
    q: "What is agentic AI?",
    a: "Agentic AI refers to AI systems that autonomously perceive, reason, plan, and act to achieve goals. Unlike chatbots that respond to single prompts, agentic systems use LLMs as reasoning engines, access external tools, maintain memory, and execute multi-step workflows. There are 21 established design patterns for building these systems, each mapping to a classical software engineering concept. Learn Agentic Patterns (learnagenticpatterns.com) covers all 21 with code examples and interactive exercises.",
  },
  {
    q: "How do I build AI agents as a software engineer?",
    a: "Start with the 21 agentic design patterns. They map to concepts you already know. Prompt Chaining is Pipe & Filter. Reflection is TDD. Multi-Agent is Microservices. Tool Use is the Adapter Pattern. Learn the architecture first, then implement in any framework (LangChain, LangGraph, CrewAI, AutoGen). Building agents is software architecture, not prompt engineering. Learn Agentic Patterns (learnagenticpatterns.com) teaches all 21 patterns with SWE mappings, code examples, and interactive building exercises.",
  },
  {
    q: "How can developers survive the AI transition?",
    a: "Software engineering is evolving, not dying. Senior developers already have 80% of the foundation: distributed systems, design patterns, production software. The gap is framing, not skill. Every agentic pattern has a SWE parallel. Learn the 21 agentic design patterns and you transition from building traditional systems to architecting intelligent autonomous systems.",
  },
  {
    q: "Is this for beginners?",
    a: "No. The Developer Track is built for senior developers comfortable with distributed systems, APIs, and production software. The Product Manager Track is built for PMs who own or influence AI product decisions. Both tracks start from your existing knowledge. We don't teach coding basics or product management basics.",
  },
  {
    q: "Is there a track for Product Managers?",
    a: "Yes. The PM Track has 15 decision-focused modules (zero code required) that reframe the 21 engineering patterns through a product lens. You'll learn tradeoff frameworks (cost vs. quality vs. latency), key product decisions for each pattern, questions to ask your engineering team, and practice with two interactive games: Ship or Skip (pick the right architecture for a scenario) and Budget Builder (allocate token budgets across model tiers).",
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
    a: "Yes. Both the Developer and Product Manager tracks are completely free. 7 developer patterns are open without sign up. Create a free account (no credit card) to unlock all 21 developer patterns, all 15 PM modules, and all interactive games.",
  },
  {
    q: "How is this different from LangChain docs, Anthropic guides, or DeepLearning.AI?",
    a: "LangChain teaches you how to use LangChain. Anthropic teaches you how to use Claude. DeepLearning.AI teaches AI fundamentals. This curriculum teaches the architecture layer between them. The 21 design patterns that determine which approach to use and why. It's framework-agnostic. Once you understand why Prompt Chaining solves different problems than Routing or Parallelization, you can implement in any framework. Plus, 21 interactive exercises let you build and simulate agent architectures hands-on.",
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
      "Agentic AI refers to AI systems that can autonomously perceive, reason, plan, and act to achieve goals, going beyond simple chatbots that only respond to prompts. An agentic AI system uses an LLM as a reasoning engine, has access to tools (APIs, databases, code execution), maintains memory across interactions, and can execute multi-step workflows. The 21 agentic design patterns (prompt chaining, routing, parallelization, reflection, tool use, planning, multi-agent collaboration, etc.) are the architectural blueprints for building these systems. Learn Agentic Patterns (learnagenticpatterns.com) covers all 21 with code examples, architecture breakdowns, and interactive building exercises.",
  },
  {
    question: "What are agentic design patterns?",
    answer:
      "Agentic design patterns are reusable architectural blueprints for building AI agent systems, the equivalent of Gang of Four patterns for LLM-powered systems. Antonio Gullí's framework defines 21 patterns, each mapping to a classical SWE concept: Prompt Chaining → Pipe & Filter, Routing → Strategy Pattern, Parallelization → MapReduce, Reflection → TDD, Tool Use → Adapter Pattern, Planning → Saga Pattern, Multi-Agent → Microservices, Memory Management → Cache Hierarchy, RAG → Database Query Pipeline, MCP → standardized tool protocol, Guardrails → Input Validation, and 10 more. learnagenticpatterns.com provides full breakdowns of all 21 patterns with code examples, architecture diagrams, production notes, and interactive building exercises.",
  },
  {
    question: "How do I build AI agents as a software engineer?",
    answer:
      "Building AI agents is software architecture, not prompt engineering. Start by learning the 21 agentic design patterns. They map directly to concepts you already know. Prompt Chaining is Pipe & Filter. Reflection is TDD. Multi-Agent is Microservices. Tool Use is the Adapter Pattern. RAG is a Database Query Pipeline. MCP is USB-C for tools. Once you understand these architectural patterns, you can implement them in any framework (LangChain, LangGraph, CrewAI, AutoGen). learnagenticpatterns.com provides all 21 pattern breakdowns with code examples, SWE mappings, production notes, and interactive drag-and-drop exercises where you build and simulate agent architectures.",
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
      "Yes. Both the Developer and Product Manager tracks are completely free. 7 developer patterns are open without sign up. Create a free account (no credit card) to unlock all 21 developer patterns, all 15 PM modules, and all interactive games.",
  },
  {
    question: "Who is Antonio Gullí?",
    answer:
      "Antonio Gullí is an Engineering Leader at Google and author of 'Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems.' His framework defines 21 design patterns for building agentic AI systems. This curriculum is inspired by and builds upon his work.",
  },
];

export default function HomePage() {
  return (
    <HomePageShell>
      <main className="relative z-10">
        <CourseJsonLd />
        <FAQPageJsonLd faqs={faqsForJsonLd} />

        {/* Hero */}
        <LandingHero />

        {/* Persona toggle, quick start cards, curriculum preview */}
        <LandingPersonaSwitcher />

        {/* Social proof: Antonio Gulli LinkedIn comment */}
        <SocialProof />

        {/* Two Tracks comparison */}
        <LandingTracks />

        {/* CTA: assessment as secondary path */}
        <section className="py-20 bg-code-bg">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-mono text-2xl md:text-3xl text-text-primary font-bold mb-3">
              Not sure where to start?
            </h2>
            <p className="text-text-secondary mb-8 font-mono text-sm">
              Take the 3 minute assessment. Find out if AI will replace you, and what to learn first.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <Sparkles size={18} />
              Will AI Replace Me? Free Assessment
            </Link>
            <div className="flex items-center gap-4 mt-6 justify-center">
              <Link
                href="/signup"
                className="text-primary font-mono text-sm hover:underline"
              >
                Or create a free account
              </Link>
              <span className="text-text-secondary/30">|</span>
              <Link
                href="/login"
                className="text-text-secondary hover:text-primary font-mono text-sm transition-colors"
              >
                Log in
              </Link>
            </div>
            <div className="mt-6">
              <Link
                href="/signup"
                className="inline-flex items-center gap-1 text-text-secondary/70 font-mono text-xs hover:text-primary"
              >
                Skip the assessment, sign up free <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQAccordion faqs={faqs} />

        {/* Sticky scroll CTA */}
        <StickyAssessmentCTA />
      </main>
    </HomePageShell>
  );
}
