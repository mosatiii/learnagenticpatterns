"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Trophy, Medal, Gamepad2, Briefcase, Code2, Puzzle, BarChart3, Crosshair } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import PatternCard from "@/components/PatternCard";
import PMModuleCard from "@/components/PMModuleCard";
import ProgressCircle from "@/components/ProgressCircle";
import { patterns } from "@/data/patterns";
import { pmModules } from "@/data/pm-curriculum";
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

// ─── FAQ Data ──────────────────────────────────────────────
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

// ─── PM Game Stats Section ───────────────────────────────────
const PM_GAME_LABELS: Record<string, string> = {
  "pm-ship-or-skip": "Ship or Skip",
  "pm-budget-builder": "Budget Builder",
  "pm-stakeholder-sim": "Stakeholder Simulator",
};

function PMGameStats({ scores, totalAttempts }: { scores: PatternScore[]; totalAttempts: number }) {
  const pmScores = scores.filter((s) => s.pattern_slug.startsWith("pm-"));
  const pmAttempts = pmScores.reduce((sum, s) => sum + 1, 0);

  if (pmAttempts === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Decision Game Scores"
            subtitle="Play Ship or Skip or Budget Builder inside any module to see your scores here."
            decorator="▶"
          />
          <div className="bg-surface border border-border rounded-xl p-10 text-center">
            <Gamepad2 size={48} className="text-text-secondary/30 mx-auto mb-4" />
            <p className="text-text-secondary font-mono text-sm">
              No games played yet. Open any module and try the <span className="text-accent font-bold">decision games</span>!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const avgPercent = Math.round(
    pmScores.reduce((sum, s) => sum + (s.score_max > 0 ? (s.score_total / s.score_max) * 100 : 0), 0) / pmScores.length
  );

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Decision Game Scores"
          subtitle={`${pmScores.length} game${pmScores.length === 1 ? "" : "s"} played. Keep sharpening your product instincts!`}
          decorator="▶"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Avg Score", value: `${avgPercent}%`, accent: avgPercent >= 60 },
            { label: "Games Played", value: `${pmScores.length}/3`, accent: false },
            { label: "Best Score", value: `${Math.max(...pmScores.map((s) => Math.round((s.score_total / s.score_max) * 100)))}%`, accent: true },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-surface border rounded-lg p-4 text-center ${
                stat.accent ? "border-accent/30" : "border-border"
              }`}
            >
              <p className={`font-mono text-2xl font-bold ${stat.accent ? "text-accent" : "text-text-primary"}`}>
                {stat.value}
              </p>
              <p className="text-text-secondary text-xs font-mono mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-mono text-sm text-text-secondary mb-4 flex items-center gap-2">
            <Trophy size={14} className="text-accent" />
            Best Scores by Game
          </h3>
          <div className="space-y-2">
            {pmScores.map((s, i) => {
              const percent = Math.round((s.score_total / s.score_max) * 100);
              const name = PM_GAME_LABELS[s.pattern_slug] ?? s.pattern_slug;

              return (
                <motion.div
                  key={s.pattern_slug}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-code-bg transition-colors"
                >
                  <span className={`font-mono text-lg font-bold w-12 text-right ${
                    percent === 100 ? "text-success" : percent >= 60 ? "text-accent" : "text-red-400"
                  }`}>
                    {percent}%
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="h-2 bg-code-bg rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          percent === 100 ? "bg-success" : percent >= 60 ? "bg-accent" : "bg-red-400"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6, delay: i * 0.04 }}
                      />
                    </div>
                    <p className="text-text-secondary text-xs font-mono mt-1 truncate">
                      {name}
                    </p>
                  </div>
                  {s.passed && <span className="text-success text-xs font-mono">PASS</span>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page Component ────────────────────────────────────
export default function HomePage() {
  const {
    user, readSlugs, isLoading, isProductManager,
    pmReadSlugs, pmProgressPercent,
    gameScores, totalAttempts, avgPercent, leaderboard, userRank,
  } = useAuth();

  // Find the next unread pattern/module for "Continue learning" CTA
  const nextUnread = patterns.find((p) => !readSlugs.includes(p.slug));
  const nextUnreadPM = pmModules.find((m) => !pmReadSlugs.includes(m.slug));

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
              {/* Left: Greeting + next action */}
              <div className="flex-1">
                <span className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1 mb-4">
                  {isProductManager ? "Product Manager Track" : "Welcome back"}
                </span>
                <h1 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-4">
                  {isProductManager ? (
                    <>
                      Your AI playbook,{" "}
                      <span className="text-gradient">{user.firstName}.</span>
                    </>
                  ) : (
                    <>
                      Keep going,{" "}
                      <span className="text-gradient">{user.firstName}.</span>
                    </>
                  )}
                </h1>

                {isProductManager ? (
                  pmReadSlugs.length === 0 ? (
                    <p className="text-text-secondary text-lg mb-8 max-w-lg">
                      11 modules covering everything you need to make smart product
                      decisions about agentic AI — no code required. Click any
                      module below to dive in.
                    </p>
                  ) : pmReadSlugs.length === pmModules.length ? (
                    <p className="text-text-secondary text-lg mb-8 max-w-lg">
                      You&apos;ve completed all 11 modules. Revisit any module
                      to refresh your understanding.
                    </p>
                  ) : (
                    <p className="text-text-secondary text-lg mb-8 max-w-lg">
                      You&apos;ve completed{" "}
                      <span className="text-primary font-mono font-bold">
                        {pmReadSlugs.length}
                      </span>{" "}
                      of 11 modules. Pick up where you left off.
                    </p>
                  )
                ) : readSlugs.length === 0 ? (
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

                {isProductManager ? (
                  nextUnreadPM ? (
                    <Link
                      href={`/pm/${nextUnreadPM.slug}`}
                      className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      <Briefcase size={18} />
                      {pmReadSlugs.length === 0
                        ? "Start Module 01"
                        : `Continue: Module ${String(nextUnreadPM.number).padStart(2, "0")} · ${nextUnreadPM.title}`}
                      <ArrowRight size={18} />
                    </Link>
                  ) : (
                    <a
                      href="#pm-curriculum"
                      className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      <Briefcase size={18} />
                      Review Modules
                      <ArrowRight size={18} />
                    </a>
                  )
                ) : (
                  nextUnread && (
                    <Link
                      href={`/patterns/${nextUnread.slug}`}
                      className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      <BookOpen size={18} />
                      Continue: Pattern {String(nextUnread.number).padStart(2, "0")} · {nextUnread.name}
                      <ArrowRight size={18} />
                    </Link>
                  )
                )}
              </div>

              {/* Right: Progress circle (developers only) or PM stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isProductManager ? (
                  <div className="relative w-44 h-44">
                    <svg viewBox="0 0 160 160" className="w-full h-full">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor"
                        strokeWidth="6" className="text-border" />
                      <motion.circle cx="80" cy="80" r="70" fill="none" stroke="currentColor"
                        strokeWidth="6" strokeLinecap="round" className="text-accent"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - pmProgressPercent / 100) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        transform="rotate(-90 80 80)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-3xl text-accent font-bold">
                        {pmProgressPercent}%
                      </span>
                      <span className="text-text-secondary text-[10px] font-mono">
                        {pmReadSlugs.length}/{pmModules.length}
                      </span>
                    </div>
                  </div>
                ) : (
                  <ProgressCircle size={180} strokeWidth={12} />
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {isProductManager ? (
          <PMGameStats scores={gameScores} totalAttempts={totalAttempts} />
        ) : (
          <GameStats
            scores={gameScores}
            totalAttempts={totalAttempts}
            avgPercent={avgPercent}
            leaderboard={leaderboard}
            userRank={userRank}
            firstName={user.firstName}
          />
        )}

        {/* ─── PM Curriculum ─── */}
        {isProductManager && (
          <section id="pm-curriculum" className="py-16 bg-surface/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                title="Your PM Curriculum"
                subtitle={pmReadSlugs.length === 0
                  ? "11 modules unlocked. Click any module to dive in and play the decision games."
                  : `${pmReadSlugs.length} of 11 modules completed. Modules you've read are marked with a checkmark.`}
                decorator="PM"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pmModules.map((mod, i) => (
                  <PMModuleCard key={mod.id} module={mod} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Developer Curriculum ─── */}
        {!isProductManager && (
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
        )}

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
              "Yes. The PM Track has 11 decision-focused modules (zero code required) that reframe the 21 engineering patterns through a product lens. You learn tradeoff frameworks (cost vs. quality vs. latency), key product decisions for each pattern, questions to ask your engineering team, and practice with interactive games: Ship or Skip, Budget Builder, and Stakeholder Simulator.",
          },
          {
            question: "Is this really free?",
            answer:
              "Yes. Both the Developer and Product Manager tracks are completely free. 7 developer patterns are open without sign-up. Create a free account (no credit card) to unlock all 21 developer patterns, all 11 PM modules, and all interactive games.",
          },
          {
            question: "Who is Antonio Gullí?",
            answer:
              "Antonio Gullí is an Engineering Leader at Google and author of 'Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems.' His framework defines 21 design patterns for building agentic AI systems. This curriculum is inspired by and builds upon his work.",
          },
        ]}
      />

      {/* ── HERO ── */}
      <section className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={stagger.item}
              className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1 mb-6"
            >
              Based on Antonio Gull&iacute;&apos;s 21 Agentic Design Patterns
            </motion.span>

            <motion.h1
              variants={stagger.item}
              className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6"
            >
              Don&apos;t fear AI agents.{" "}
              <span className="text-gradient">Build them.</span>
            </motion.h1>

            <motion.p
              variants={stagger.item}
              className="text-text-secondary text-lg md:text-xl leading-relaxed mb-4 max-w-2xl mx-auto"
            >
              Open source and LeetCode-like for AI agents.
            </motion.p>

            <motion.p
              variants={stagger.item}
              className="text-text-secondary/80 text-base leading-relaxed mb-10 max-w-2xl mx-auto"
            >
              Free curriculum. Two tracks. Interactive games.
              <br className="hidden sm:block" />
              Pick the one that matches how you work.
            </motion.p>

            <motion.div
              variants={stagger.item}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Start Free
                <ArrowRight size={18} />
              </Link>
              <a
                href="https://practice.learnagenticpatterns.com"
                className="inline-flex items-center justify-center gap-2 border border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all"
              >
                <Gamepad2 size={18} />
                Practice
              </a>
              <Link
                href="#tracks"
                className="inline-flex items-center justify-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium text-base px-8 py-3.5 rounded-md transition-all"
              >
                See what&apos;s inside
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TWO TRACKS ── */}
      <section id="tracks" className="py-20 bg-surface/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Two Tracks. Pick Yours."
            decorator="⟨⟩"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {/* Developer Track */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface border border-primary/30 rounded-xl p-8 hover:border-primary/50 transition-all flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 size={20} className="text-primary" />
                </div>
                <h3 className="font-mono text-lg text-text-primary font-bold">
                  For Developers
                </h3>
              </div>

              <p className="text-text-primary font-medium mb-1">We teach you:</p>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                The 21 agentic design patterns — mapped to SWE concepts you already know.
                Code examples, architecture breakdowns, production notes.
              </p>

              <div className="space-y-2.5 mb-6 flex-1">
                {[
                  { icon: <BookOpen size={14} />, text: "21 patterns with Python pseudocode" },
                  { icon: <Puzzle size={14} />, text: "SWE mapping for every pattern" },
                  { icon: <Gamepad2 size={14} />, text: "Drag-and-drop Agent Builder game" },
                  { icon: <BarChart3 size={14} />, text: "Leaderboard & progress tracking" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 text-text-secondary text-sm">
                    <span className="text-primary flex-shrink-0">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              <Link
                href="#curriculum"
                className="inline-flex items-center gap-2 text-primary font-mono text-sm hover:underline"
              >
                Preview patterns →
              </Link>
            </motion.div>

            {/* PM Track */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-surface border border-accent/30 rounded-xl p-8 hover:border-accent/50 transition-all flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Briefcase size={20} className="text-accent" />
                </div>
                <h3 className="font-mono text-lg text-text-primary font-bold">
                  For Product Managers
                </h3>
              </div>

              <p className="text-text-primary font-medium mb-1">We give you:</p>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                Decision frameworks for agentic AI — zero code. The tradeoffs,
                questions, and vocabulary you need to lead AI product decisions.
              </p>

              <div className="space-y-2.5 mb-6 flex-1">
                {[
                  { icon: <BookOpen size={14} />, text: "11 modules — no code required" },
                  { icon: <Crosshair size={14} />, text: "Tradeoff frameworks (cost / quality / latency)" },
                  { icon: <Gamepad2 size={14} />, text: "Ship or Skip scenario game" },
                  { icon: <Gamepad2 size={14} />, text: "Budget Builder & Stakeholder Sim" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 text-text-secondary text-sm">
                    <span className="text-accent flex-shrink-0">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-accent font-mono text-sm hover:underline"
              >
                Sign up to unlock →
              </Link>
            </motion.div>
          </div>

          {/* Quick stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { value: "21", label: "Developer Patterns" },
              { value: "11", label: "PM Modules" },
              { value: "4", label: "Interactive Games" },
              { value: "Free", label: "No Credit Card" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-code-bg border border-border rounded-lg py-3 px-4 text-center"
              >
                <span className="font-mono text-xl text-primary font-bold">{stat.value}</span>
                <span className="block text-text-secondary text-[11px] font-mono mt-0.5">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM PREVIEW ── */}
      <section id="curriculum" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Preview the Patterns"
            subtitle="5 of 21 patterns shown. Sign up free to unlock everything."
            decorator="$"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {patterns.slice(0, 5).map((pattern, i) => (
              <PatternCard key={pattern.id} pattern={pattern} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              Unlock All 21 Patterns — Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-code-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-mono text-2xl md:text-3xl text-text-primary font-bold mb-3">
            Ready to start?
          </h2>
          <p className="text-text-secondary mb-8 font-mono text-sm">
            All 21 patterns, all 11 PM modules, all games. No credit card.
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

      {/* ── FAQ ── */}
      <section className="py-20 bg-surface/30">
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
