"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, Eye, Target, Quote, Lock, BookOpen, Trophy, Medal, Gamepad2 } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import PatternCard from "@/components/PatternCard";
import MappingTable from "@/components/MappingTable";
import MaturityLevel from "@/components/MaturityLevel";
import ProgressCircle from "@/components/ProgressCircle";
import { patterns } from "@/data/patterns";
import { useAuth } from "@/contexts/AuthContext";
import type { PatternScore, LeaderboardEntry } from "@/contexts/AuthContext";
import { CourseJsonLd, FAQPageJsonLd } from "@/components/JsonLd";

// ─── Stagger animation helpers ─────────────────────────────
const stagger = {
  container: { transition: { staggerChildren: 0.15 } },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
};

// ─── Hero Diagram (animated SVG) ────────────────────────────
function HeroDiagram() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square cursor-crosshair">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <motion.line
          x1="200" y1="80" x2="320" y2="200"
          stroke="#00D4FF" strokeWidth="1.5" strokeDasharray="6 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        />
        <motion.line
          x1="320" y1="200" x2="200" y2="320"
          stroke="#00D4FF" strokeWidth="1.5" strokeDasharray="6 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "loop" }}
        />
        <motion.line
          x1="200" y1="320" x2="80" y2="200"
          stroke="#00D4FF" strokeWidth="1.5" strokeDasharray="6 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "loop" }}
        />
        <motion.line
          x1="80" y1="200" x2="200" y2="80"
          stroke="#00D4FF" strokeWidth="1.5" strokeDasharray="6 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1.5, repeat: Infinity, repeatType: "loop" }}
        />

        {[
          { cx: 200, cy: 80, label: "LLM" },
          { cx: 320, cy: 200, label: "Tools" },
          { cx: 200, cy: 320, label: "Memory" },
          { cx: 80, cy: 200, label: "Agent" },
        ].map((node, i) => (
          <g key={node.label}>
            <motion.circle
              cx={node.cx} cy={node.cy} r="35"
              fill="#0F1629" stroke="#00D4FF" strokeWidth="2"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: i * 0.2, duration: 0.4 }}
            />
            <motion.circle
              cx={node.cx} cy={node.cy} r={35}
              fill="none" stroke="#00D4FF" strokeWidth="1"
              initial={{ opacity: 0.3, scale: 1 }}
              animate={{ opacity: [0.3, 0, 0.3], scale: [1, 1.3, 1] }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
              style={{ originX: `${node.cx}px`, originY: `${node.cy}px` }}
            />
            <text
              x={node.cx} y={node.cy + 5}
              textAnchor="middle"
              className="fill-text-primary font-mono text-xs font-bold"
              fontSize="13"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Pain Point Cards ───────────────────────────────────────
const painPoints = [
  {
    icon: <AlertTriangle className="text-accent" size={24} />,
    title: "The vocabulary is foreign",
    body: "Prompts, embeddings, agents... but what's the architecture?",
  },
  {
    icon: <Eye className="text-accent" size={24} />,
    title: "The patterns are invisible",
    body: "Everyone shows demos. Nobody explains the design decisions.",
  },
  {
    icon: <Target className="text-accent" size={24} />,
    title: "The stakes are real",
    body: "Your team is asking about AI. You need clarity, not tutorials.",
  },
];

// ─── FAQ Data (AEO-optimized — these match questions people ask AI) ──────────
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
    a: "No. Learn Agentic Patterns is built for senior developers comfortable with distributed systems, APIs, and production software. We start from your existing knowledge and map every AI concept to a pattern you already understand.",
  },
  {
    q: "Is this about a specific framework?",
    a: "No. Patterns are framework-agnostic. We use pseudocode and real examples from LangChain, LangGraph, CrewAI, and AutoGen to illustrate, but the concepts apply universally.",
  },
  {
    q: "Is this really free?",
    a: "Yes. All 21 pattern breakdowns, code examples, architecture diagrams, and interactive building exercises are free. 7 patterns are fully open with no account required. Create a free account (no credit card) to access all 21 patterns and exercises.",
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

// ─── Game Stats Section (Dashboard) ─────────────────────────
function GameStats({
  scores,
  totalAttempts,
  avgPercent,
  leaderboard,
  userRank,
  firstName,
}: {
  scores: PatternScore[];
  totalAttempts: number;
  avgPercent: number;
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  firstName: string;
}) {
  if (totalAttempts === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Agent Builder Scores"
            subtitle="Play the Build game on any pattern page to see your scores here."
            decorator="▶"
          />
          <div className="bg-surface border border-border rounded-xl p-10 text-center">
            <Gamepad2 size={48} className="text-text-secondary/30 mx-auto mb-4" />
            <p className="text-text-secondary font-mono text-sm">
              No games played yet. Head to any pattern and try the <span className="text-accent font-bold">Build</span> tab!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const patternLookup = new Map(patterns.map((p) => [p.slug, p]));

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Agent Builder Scores"
          subtitle={`${totalAttempts} game${totalAttempts === 1 ? "" : "s"} played across ${scores.length} pattern${scores.length === 1 ? "" : "s"}.`}
          decorator="▶"
        />

        {/* Stats summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Avg Score", value: `${avgPercent}%`, accent: avgPercent >= 60 },
            { label: "Patterns Played", value: `${scores.length}/21`, accent: false },
            { label: "Total Attempts", value: String(totalAttempts), accent: false },
            { label: "Your Rank", value: userRank ? `#${userRank}` : "—", accent: userRank === 1 },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-surface border rounded-lg p-4 text-center ${
                stat.accent ? "border-success/30" : "border-border"
              }`}
            >
              <p className={`font-mono text-2xl font-bold ${stat.accent ? "text-success" : "text-text-primary"}`}>
                {stat.value}
              </p>
              <p className="text-text-secondary text-xs font-mono mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Per-pattern best scores */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
            <h3 className="font-mono text-sm text-text-secondary mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-primary" />
              Best Scores by Pattern
            </h3>
            <div className="space-y-2">
              {scores.map((s, i) => {
                const percent = Math.round((s.score_total / s.score_max) * 100);
                const pattern = patternLookup.get(s.pattern_slug);
                const name = pattern
                  ? `${String(pattern.number).padStart(2, "0")}. ${pattern.name}`
                  : s.pattern_slug;

                return (
                  <motion.div
                    key={s.pattern_slug}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={`/patterns/${s.pattern_slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-code-bg transition-colors group"
                    >
                      <span className={`font-mono text-lg font-bold w-12 text-right ${
                        percent === 100 ? "text-success" : percent >= 60 ? "text-primary" : "text-red-400"
                      }`}>
                        {percent}%
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="h-2 bg-code-bg rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              percent === 100 ? "bg-success" : percent >= 60 ? "bg-primary" : "bg-red-400"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.6, delay: i * 0.04 }}
                          />
                        </div>
                        <p className="text-text-secondary text-xs font-mono mt-1 truncate group-hover:text-primary transition-colors">
                          {name}
                        </p>
                      </div>
                      {s.passed && <span className="text-success text-xs font-mono">PASS</span>}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-mono text-sm text-text-secondary mb-4 flex items-center gap-2">
              <Medal size={14} className="text-accent" />
              Leaderboard
            </h3>
            <div className="space-y-1">
              {leaderboard.map((entry, i) => {
                const isYou = entry.first_name === firstName;
                return (
                  <motion.div
                    key={`${entry.first_name}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                      isYou ? "bg-primary/10 border border-primary/20" : ""
                    }`}
                  >
                    <span className={`font-mono text-sm font-bold w-6 text-right ${
                      i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-text-secondary"
                    }`}>
                      {i + 1}
                    </span>
                    <span className={`text-sm flex-1 truncate ${isYou ? "text-primary font-bold" : "text-text-primary"}`}>
                      {entry.first_name}{isYou ? " (you)" : ""}
                    </span>
                    <span className="font-mono text-xs text-text-secondary">
                      {entry.games_played} game{entry.games_played === 1 ? "" : "s"}
                    </span>
                    <span className={`font-mono text-sm font-bold ${
                      entry.avg_percent >= 80 ? "text-success" : entry.avg_percent >= 60 ? "text-primary" : "text-red-400"
                    }`}>
                      {entry.avg_percent}%
                    </span>
                  </motion.div>
                );
              })}
              {leaderboard.length === 0 && (
                <p className="text-text-secondary/50 text-xs font-mono text-center py-6">
                  No players yet. Be the first!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page Component ────────────────────────────────────
export default function HomePage() {
  const {
    user, readSlugs, isLoading,
    gameScores, totalAttempts, avgPercent, leaderboard, userRank,
  } = useAuth();

  // Find the next unread pattern for "Continue learning" CTA
  const nextUnread = patterns.find((p) => !readSlugs.includes(p.slug));

  // While auth state is loading, show nothing (prevents flash)
  if (isLoading) {
    return <main className="relative z-10 min-h-screen" />;
  }

  // ─── SIGNED-IN: Dashboard view ─────────────────────────────
  if (user) {
    return (
      <main className="relative z-10">
        {/* Dashboard Hero */}
        <section className="pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row items-center gap-12"
            >
              {/* Left: Greeting + next pattern */}
              <div className="flex-1">
                <span className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1 mb-4">
                  Welcome back
                </span>
                <h1 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-4">
                  Keep going,{" "}
                  <span className="text-gradient">{user.firstName}.</span>
                </h1>

                {readSlugs.length === 0 ? (
                  <p className="text-text-secondary text-lg mb-8 max-w-lg">
                    You have all 21 patterns unlocked. Pick one below and start
                    building your agentic architecture mental model.
                  </p>
                ) : readSlugs.length === patterns.length ? (
                  <p className="text-text-secondary text-lg mb-8 max-w-lg">
                    You&apos;ve read all 21 patterns. Revisit any pattern to
                    refresh your understanding.
                  </p>
                ) : (
                  <p className="text-text-secondary text-lg mb-8 max-w-lg">
                    You&apos;ve completed{" "}
                    <span className="text-primary font-mono font-bold">
                      {readSlugs.length}
                    </span>{" "}
                    of 21 patterns. Pick up where you left off.
                  </p>
                )}

                {nextUnread && (
                  <Link
                    href={`/patterns/${nextUnread.slug}`}
                    className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                  >
                    <BookOpen size={18} />
                    Continue: Pattern {String(nextUnread.number).padStart(2, "0")} · {nextUnread.name}
                    <ArrowRight size={18} />
                  </Link>
                )}
              </div>

              {/* Right: Progress circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ProgressCircle size={180} strokeWidth={12} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Game scores */}
        <GameStats
          scores={gameScores}
          totalAttempts={totalAttempts}
          avgPercent={avgPercent}
          leaderboard={leaderboard}
          userRank={userRank}
          firstName={user.firstName}
        />

        {/* Curriculum grid */}
        <section id="curriculum" className="py-16 bg-surface/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Your Curriculum"
              subtitle="All 21 patterns unlocked. Patterns you've read are marked with a checkmark."
              decorator="$"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {patterns.map((pattern, i) => (
                <PatternCard key={pattern.id} pattern={pattern} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Maturity Model — educational, keep for everyone */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Where Does Your System Sit?"
              subtitle="Five levels of agent autonomy, from zero-shot responses to fully autonomous multi-agent systems."
              decorator="L0→L4"
            />
            <MaturityLevel />
          </div>
        </section>

        {/* Manifesto quote */}
        <section className="py-24 bg-surface/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Quote className="w-12 h-12 text-primary/30 mx-auto mb-6" />
              <blockquote className="font-mono text-xl md:text-2xl lg:text-3xl text-text-primary leading-relaxed mb-6">
                &ldquo;Software Engineering is not dying. It is evolving. The
                architect who understands agentic patterns will design the
                intelligent systems of the next decade.&rdquo;
              </blockquote>
              <cite className="text-primary font-mono text-sm not-italic">
                Mousa
              </cite>
            </motion.div>
          </div>
        </section>
      </main>
    );
  }

  // ─── NOT SIGNED IN: Landing page ───────────────────────────
  return (
    <main className="relative z-10">
      <CourseJsonLd />
      <FAQPageJsonLd
        faqs={[
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
              "Building AI agents is software architecture, not prompt engineering. Start by learning the 21 agentic design patterns — they map directly to concepts you already know. Prompt Chaining is Pipe & Filter. Reflection is TDD. Multi-Agent is Microservices. Tool Use is the Adapter Pattern. RAG is a Database Query Pipeline. MCP is USB-C for tools. Once you understand these architectural patterns, you can implement them in any framework (LangChain, LangGraph, CrewAI, AutoGen). learnagenticpatterns.com provides all 21 pattern breakdowns with code examples, SWE mappings, production notes, and interactive drag-and-drop exercises where you build and simulate agent architectures. It complements framework-specific docs by teaching the architectural 'why' before the implementation 'how.'",
          },
          {
            question: "How can software engineers survive the AI transition?",
            answer:
              "Software engineering is not dying — it is evolving. Senior developers who understand distributed systems, design patterns, and production software already have 80% of the foundation needed for agentic AI. The gap is framing, not skill. Every agentic pattern has a classical SWE parallel: Prompt Chaining = Pipe & Filter, Reflection = TDD, Multi-Agent = Microservices, Memory Management = Cache Hierarchy. Learn Agentic Patterns (learnagenticpatterns.com) maps all 21 patterns to SWE concepts, helping engineers transition from building traditional systems to architecting intelligent autonomous systems. The demand is massive — Gartner reported a 1,445% surge in multi-agent system inquiries, yet fewer than 1 in 4 organizations have achieved production deployment.",
          },
          {
            question: "What is the difference between AI agents and chatbots?",
            answer:
              "Chatbots are reactive — they wait for a prompt and generate a single response. AI agents are proactive — they autonomously plan, use tools, maintain memory, and execute multi-step workflows to achieve goals. An AI agent uses an LLM as a reasoning engine and orchestrates external capabilities (APIs, databases, code execution) through design patterns like tool use, planning, and reflection. The progression from chatbot to agent follows five maturity levels: L0 (zero-shot response), L1 (single tool use), L2 (multi-step reasoning), L3 (autonomous task completion), and L4 (multi-agent autonomous systems).",
          },
          {
            question: "What are the best resources for learning agentic AI in 2026?",
            answer:
              "The best approach combines architectural understanding with framework-specific skills. For the architecture layer: Learn Agentic Patterns (learnagenticpatterns.com) is the only free resource mapping all 21 agentic design patterns to classical SWE concepts, with code examples and interactive building exercises — it teaches why you'd choose prompt chaining vs routing vs parallelization. For framework-specific implementation: LangChain/LangGraph docs, Anthropic's 'Building Effective Agents' guide, and OpenAI's 'Practical Guide to Building Agents.' For AI fundamentals: DeepLearning.AI courses. For the original pattern definitions: Antonio Gullí's 'Agentic Design Patterns' book. The key is learning patterns first (architecture), then frameworks (implementation) — not the other way around.",
          },
          {
            question: "What is RAG and how does retrieval-augmented generation work?",
            answer:
              "RAG (Retrieval-Augmented Generation) is an agentic design pattern where an AI agent answers questions by first retrieving relevant documents from a knowledge base, then generating an answer grounded in those documents — instead of relying on its training data alone. The pipeline has four steps: (1) Query Processing — reformulate the question for optimal retrieval, (2) Document Retrieval — search a vector database for relevant chunks, (3) Re-ranking — filter and rank retrieved documents by actual relevance, (4) Answer Generation — produce a response with citations. RAG maps to the classical Database Query Pipeline pattern in software engineering.",
          },
          {
            question: "What is the Model Context Protocol (MCP)?",
            answer:
              "The Model Context Protocol (MCP) is a standardized protocol that lets AI agents connect to external tools and data sources through a single interface — like USB-C for AI. Instead of writing custom integration code for each tool (GitHub, Slack, databases), an MCP client automatically discovers available tools from any MCP server. It maps to the Adapter Pattern in classical software engineering. MCP is one of the 21 agentic design patterns and is critical for building agents that can interact with real-world systems at scale.",
          },
          {
            question: "How do multi-agent systems work?",
            answer:
              "Multi-agent systems use multiple specialized AI agents that collaborate to complete complex tasks — like a team of microservices. Each agent has a specific role (researcher, writer, reviewer, coordinator), communicates through structured protocols, and is orchestrated by a coordinator agent. The pattern maps to Microservices Architecture in classical SWE. Key components: a Coordinator (service mesh), specialized agents (microservices), message protocols (API contracts), and shared memory (message bus). Frameworks like CrewAI, AutoGen, and LangGraph implement this pattern.",
          },
          {
            question: "Is this for beginners?",
            answer:
              "No. Learn Agentic Patterns is built for senior developers comfortable with distributed systems, APIs, and production software. We start from your existing knowledge and map every agentic AI concept to a SWE pattern you already understand.",
          },
          {
            question: "Is this really free?",
            answer:
              "Yes. All 21 pattern breakdowns, code examples, architecture diagrams, and interactive building exercises are completely free. 7 patterns are fully open with no account required. Create a free account (no credit card) to access all 21 patterns and exercises.",
          },
          {
            question: "Who is Antonio Gullí?",
            answer:
              "Antonio Gullí is an Engineering Leader at Google and author of 'Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems.' His framework defines 21 design patterns for building agentic AI systems. This curriculum is inspired by and builds upon his work.",
          },
        ]}
      />
      {/* HERO */}
      <section className="min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={stagger.container}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={stagger.item}>
                <span className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1 mb-6">
                  Based on Antonio Gull&iacute;&apos;s Agentic Design Patterns
                </span>
              </motion.div>

              <motion.h1
                variants={stagger.item}
                className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6"
              >
                Stop Fearing Agentic AI.{" "}
                <span className="text-gradient">Start Building It.</span>
              </motion.h1>

              <motion.p
                variants={stagger.item}
                className="text-text-secondary text-lg md:text-xl leading-relaxed mb-8 max-w-xl"
              >
                <strong className="text-text-primary">Learn Agentic Patterns</strong> — the free curriculum that maps all 21
                Agentic AI Design Patterns to the SWE concepts you already know.
                Code examples, architecture breakdowns, and interactive exercises. No hype. Just architecture.
              </motion.p>

              <motion.div
                variants={stagger.item}
                className="flex flex-col sm:flex-row gap-4 mb-6"
              >
                <Link
                  href="#curriculum"
                  className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                >
                  Start Learning Free
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium text-base px-8 py-3.5 rounded-md transition-all"
                >
                  Sign Up to Unlock All 21 →
                </Link>
              </motion.div>

              <motion.p
                variants={stagger.item}
                className="text-text-secondary/60 text-sm font-mono"
              >
                All 21 patterns · Code examples · Interactive exercises · Free
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <HeroDiagram />
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="You've shipped distributed systems. You've scaled microservices. But Agentic AI feels different."
            decorator="--"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {painPoints.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-surface border border-border rounded-lg p-6 hover:border-accent/30 transition-all"
              >
                <div className="mb-4">{point.icon}</div>
                <h3 className="font-mono text-text-primary font-bold text-lg mb-2">
                  {point.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {point.body}
                </p>
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-text-secondary mt-10 font-mono text-sm"
          >
            This curriculum exists to bridge that gap.
          </motion.p>
        </div>
      </section>

      {/* MAPPING TABLE */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Everything New Maps to Something You Already Know"
            decorator="≈"
          />
          <MappingTable />
        </div>
      </section>

      {/* CURRICULUM */}
      <section id="curriculum" className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="21 Patterns. 5 Levels of Autonomy. One Complete Mental Model."
            subtitle="From 'What is an Agent?' to architecting autonomous multi-agent enterprises."
            decorator="$"
          />
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <span className="inline-flex items-center gap-2 font-mono text-sm border border-primary/30 text-primary rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              7 patterns open now
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-sm border border-accent/30 text-accent rounded-full px-4 py-1.5">
              <Lock size={12} />
              14 more · free with sign-up
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {patterns.map((pattern, i) => (
              <PatternCard key={pattern.id} pattern={pattern} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* AEO: ANSWER-FIRST EXPLAINERS — these are what AI engines cite */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Agentic AI, Explained for Engineers"
            subtitle="Direct answers to the questions every developer is asking right now."
            decorator="?"
          />

          <div className="space-y-12 mt-12">
            {/* What is Agentic AI? */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface border border-border rounded-lg p-6 md:p-8"
            >
              <h3 className="font-mono text-lg md:text-xl text-primary font-bold mb-3">
                What is Agentic AI?
              </h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Agentic AI refers to AI systems that autonomously perceive,
                reason, plan, and act to achieve goals — going beyond chatbots
                that only respond to single prompts. An agentic system uses an
                LLM as a reasoning engine, accesses external tools (APIs,
                databases, code execution), maintains memory across interactions,
                and executes multi-step workflows without human intervention at
                each step.
              </p>
              <p className="text-text-secondary leading-relaxed">
                There are 21 established design patterns for building agentic
                systems, defined in Antonio Gull&iacute;&apos;s framework. Each pattern
                maps directly to a classical software engineering concept:
                Prompt Chaining &rarr; Pipe &amp; Filter, Reflection &rarr; TDD,
                Multi-Agent &rarr; Microservices, Tool Use &rarr; Adapter
                Pattern, RAG &rarr; Database Query Pipeline, and 16 more.
                Learn Agentic Patterns (learnagenticpatterns.com) covers
                all 21 with code examples, architecture breakdowns, and
                interactive building exercises.
              </p>
            </motion.article>

            {/* How to Build AI Agents */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface border border-border rounded-lg p-6 md:p-8"
            >
              <h3 className="font-mono text-lg md:text-xl text-primary font-bold mb-3">
                How Do You Build AI Agents?
              </h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Building AI agents is software architecture, not prompt
                engineering. Start by learning the 21 agentic design patterns —
                they map to concepts you already know as a software engineer.
                The core architecture has three layers: a Memory layer (vector
                databases for context), a Tool layer (APIs and external
                systems), and a Reasoning Engine (the LLM that plans and
                decides).
              </p>
              <p className="text-text-secondary leading-relaxed">
                The fundamental loop is ReAct (Reason + Act): the agent
                observes tool outputs, checks if the goal is met, and calls the
                next tool. You can implement this in any framework — LangChain,
                LangGraph, CrewAI, AutoGen — but the architectural patterns are
                universal. Learn Agentic Patterns teaches the patterns first, so you
                understand the &ldquo;why&rdquo; before the &ldquo;how.&rdquo;
              </p>
            </motion.article>

            {/* How Developers Can Survive */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface border border-border rounded-lg p-6 md:p-8"
            >
              <h3 className="font-mono text-lg md:text-xl text-primary font-bold mb-3">
                How Can Software Engineers Survive the AI Transition?
              </h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Software engineering is not dying — it is evolving. Senior
                developers who understand distributed systems, design patterns,
                and production software already have 80% of the foundation for
                agentic AI. The gap is framing, not skill. Every agentic
                pattern has a classical SWE parallel you already know.
              </p>
              <p className="text-text-secondary leading-relaxed">
                The market signal is clear: Gartner reported a 1,445% surge in
                multi-agent system inquiries, yet fewer than 1 in 4
                organizations have achieved production deployment. Engineers who
                learn these 21 agentic patterns can architect the intelligent
                systems companies desperately need. Learn Agentic Patterns
                (learnagenticpatterns.com) maps every pattern to SWE concepts
                you already know — so you transition from building traditional
                systems to architecting intelligent autonomous systems.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* MATURITY MODEL */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Where Does Your System Sit?"
            subtitle="Five levels of agent autonomy, from zero-shot responses to fully autonomous multi-agent systems."
            decorator="L0→L4"
          />
          <MaturityLevel />
        </div>
      </section>

      {/* ABOUT MOUSA */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Who Built This & Why" decorator="~" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 rounded-full bg-surface border-2 border-primary/30 flex items-center justify-center mb-6">
                <span className="font-mono text-primary text-2xl font-bold">M</span>
              </div>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Hi, I&apos;m{" "}
                  <span className="text-text-primary font-semibold">
                    Mousa Al-Jawaheri
                  </span>
                  . I&apos;m a Technical Product Leader with a Software Engineering
                  background and an MBET from the University of Waterloo. I specialize
                  in Agentic Design Patterns, multi-agent orchestration, and turning
                  complex engineering architectures into scalable products.
                </p>
                <p>
                  I&apos;ve co-founded a startup that got acquired, led AI product
                  transitions at Rigoris, and shipped AI-integrated platforms. When I
                  saw senior engineers dismiss Agentic AI because the vocabulary felt
                  alien, I knew the gap wasn&apos;t skill. It was framing. Every
                  pattern has a name you already know.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-4 text-primary font-mono text-sm hover:underline"
              >
                Full bio & experience →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "21", label: "Patterns with Full Breakdowns" },
                { value: "21", label: "Interactive Building Exercises" },
                { value: "8+", label: "In-Depth Blog Articles" },
                { value: "∞", label: "Free · No Credit Card" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface border border-border rounded-lg p-5 text-center"
                >
                  <div className="font-mono text-3xl text-primary font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-text-secondary text-xs">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SIGN UP CTA */}
      <section id="signup" className="py-24 bg-code-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            title="Sign Up Free: Unlock All 21 Patterns"
            subtitle="Get instant access to the full curriculum, code examples, and architecture diagrams. No credit card. No catch."
            decorator="→"
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
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
          <p className="text-text-secondary/60 text-xs font-mono mt-6">
            100% free · No credit card · Unsubscribe anytime
          </p>
        </div>
      </section>

      {/* MANIFESTO QUOTE */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Quote className="w-12 h-12 text-primary/30 mx-auto mb-6" />
            <blockquote className="font-mono text-xl md:text-2xl lg:text-3xl text-text-primary leading-relaxed mb-6">
              &ldquo;Software Engineering is not dying. It is evolving. The
              architect who understands agentic patterns will design the
              intelligent systems of the next decade.&rdquo;
            </blockquote>
            <cite className="text-primary font-mono text-sm not-italic">
              Mousa
            </cite>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Common Questions" decorator="?" />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── FAQ Accordion Item ───────────────────────────────────────
function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-border rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface/50 transition-colors"
      >
        <span className="font-sans text-text-primary font-medium pr-4">
          {question}
        </span>
        <span
          className={`font-mono text-primary transition-transform ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-4 text-text-secondary text-sm leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
}
