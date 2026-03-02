"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Blocks,
  Play,
  Trophy,
  Zap,
  Shield,
  Brain,
  GitBranch,
  Layers,
  RefreshCw,
  Wrench,
  Map,
  Users,
  Lock,
  MousePointerClick,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";

const MAIN = "https://learnagenticpatterns.com";

// ─── Animation helpers ─────────────────────────────────────
const stagger = {
  container: { transition: { staggerChildren: 0.12 } },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
};

// ─── Game data for the showcase section ────────────────────
const GAMES = [
  {
    slug: "prompt-chaining",
    name: "Prompt Chaining",
    mission: "Build a Customer Support Pipeline",
    icon: <GitBranch size={20} />,
    isUnlocked: true,
  },
  {
    slug: "routing",
    name: "Routing",
    mission: "Build a Multi-Path Request Handler",
    icon: <GitBranch size={20} className="rotate-90" />,
    isUnlocked: true,
  },
  {
    slug: "parallelization",
    name: "Parallelization",
    mission: "Build a Parallel Analysis System",
    icon: <Layers size={20} />,
    isUnlocked: true,
  },
  {
    slug: "reflection",
    name: "Reflection",
    mission: "Build a Self-Improving Code Generator",
    icon: <RefreshCw size={20} />,
    isUnlocked: true,
  },
  {
    slug: "tool-use",
    name: "Tool Use",
    mission: "Build a Data-Grounded Research Agent",
    icon: <Wrench size={20} />,
    isUnlocked: true,
  },
  {
    slug: "planning",
    name: "Planning",
    mission: "Build a Multi-Step Task Executor",
    icon: <Map size={20} />,
    isUnlocked: true,
  },
  {
    slug: "multi-agent-collaboration",
    name: "Multi-Agent",
    mission: "Build a Content Creation Team",
    icon: <Users size={20} />,
    isUnlocked: true,
  },
  {
    slug: "memory-management",
    name: "Memory Management",
    mission: "Build a Context-Aware Chatbot",
    icon: <Brain size={20} />,
    isUnlocked: false,
  },
  {
    slug: "learning-adaptation",
    name: "Learning & Adaptation",
    mission: "Build a Self-Improving Support Agent",
    icon: <BarChart3 size={20} />,
    isUnlocked: false,
  },
  {
    slug: "state-management-mcp",
    name: "State Management (MCP)",
    mission: "Build a Universal Tool Integration",
    icon: <Blocks size={20} />,
    isUnlocked: false,
  },
  {
    slug: "goal-setting-monitoring",
    name: "Goal Monitoring",
    mission: "Build a Self-Monitoring Report Agent",
    icon: <BarChart3 size={20} />,
    isUnlocked: false,
  },
  {
    slug: "exception-handling-recovery",
    name: "Exception Handling",
    mission: "Build a Resilient Data Pipeline",
    icon: <Shield size={20} />,
    isUnlocked: false,
  },
  {
    slug: "human-in-the-loop",
    name: "Human-in-the-Loop",
    mission: "Build an Approval Workflow",
    icon: <Users size={20} />,
    isUnlocked: false,
  },
  {
    slug: "knowledge-retrieval-rag",
    name: "Knowledge Retrieval (RAG)",
    mission: "Build a Document Q&A Agent",
    icon: <Brain size={20} />,
    isUnlocked: false,
  },
  {
    slug: "inter-agent-communication",
    name: "Inter-Agent Comms",
    mission: "Build Agent-to-Agent Messaging",
    icon: <GitBranch size={20} />,
    isUnlocked: false,
  },
  {
    slug: "resource-aware-optimization",
    name: "Resource Optimization",
    mission: "Build a Cost-Optimized Pipeline",
    icon: <Zap size={20} />,
    isUnlocked: false,
  },
  {
    slug: "reasoning-techniques",
    name: "Reasoning Techniques",
    mission: "Build a Step-by-Step Reasoner",
    icon: <Brain size={20} />,
    isUnlocked: false,
  },
  {
    slug: "guardrails-safety",
    name: "Guardrails & Safety",
    mission: "Build a Safe Customer-Facing Agent",
    icon: <Shield size={20} />,
    isUnlocked: false,
  },
  {
    slug: "evaluation-monitoring",
    name: "Evaluation & Monitoring",
    mission: "Build an Observability Stack for AI",
    icon: <BarChart3 size={20} />,
    isUnlocked: false,
  },
  {
    slug: "prioritization",
    name: "Prioritization",
    mission: "Build an Intelligent Task Scheduler",
    icon: <Layers size={20} />,
    isUnlocked: false,
  },
  {
    slug: "exploration-discovery",
    name: "Exploration & Discovery",
    mission: "Build a Hypothesis-Testing Research Agent",
    icon: <Map size={20} />,
    isUnlocked: false,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Sign Up Free",
    description:
      "Create a free account in 30 seconds. No credit card. Unlock all 21 exercises instantly.",
    icon: <MousePointerClick size={28} className="text-primary" />,
  },
  {
    step: "02",
    title: "Choose a Pattern",
    description:
      "Each exercise targets one agentic design pattern — from Prompt Chaining to Multi-Agent Collaboration.",
    icon: <Blocks size={28} className="text-primary" />,
  },
  {
    step: "03",
    title: "Build & Simulate",
    description:
      "Drag agent blocks onto the canvas, arrange them, and hit Run. Watch your architecture succeed or fail in real-time.",
    icon: <Play size={28} className="text-primary" />,
  },
];

const BENEFITS = [
  {
    icon: <Blocks size={24} className="text-primary" />,
    title: "Learn by building, not reading",
    body: "Drag agent blocks, arrange them into architectures, and run simulations. Mistakes teach you more than documentation ever could.",
  },
  {
    icon: <Zap size={24} className="text-accent" />,
    title: "Instant feedback on every decision",
    body: "Skip a validation gate? The simulation shows you exactly what breaks. Add a distractor block? Your score drops. Every choice has visible consequences.",
  },
  {
    icon: <Shield size={24} className="text-success" />,
    title: "Production-grade thinking",
    body: "Each exercise scores you on architecture correctness, resilience, and efficiency — the same criteria used in real system design reviews.",
  },
  {
    icon: <Trophy size={24} className="text-primary" />,
    title: "21 patterns, 21 challenges",
    body: "Cover every pattern from Antonio Gullí's framework: prompt chaining, routing, parallelization, reflection, tool use, planning, multi-agent, RAG, MCP, and more.",
  },
];

// ─── FAQ data (AEO-optimized questions) ────────────────────
const FAQS = [
  {
    q: "How can I practice building AI agents?",
    a: "Practice Agentic Patterns provides 21 interactive drag-and-drop exercises where you build real AI agent architectures. Each exercise teaches a specific agentic design pattern — like prompt chaining, routing, parallelization, or multi-agent collaboration — by having you assemble agent blocks, connect them, and run a simulation to see how your architecture performs.",
  },
  {
    q: "What are the best hands-on exercises for learning agentic design patterns?",
    a: "The best exercises combine architecture building with instant feedback. Here, you drag agent blocks (like Extraction Agent, Validation Gate, Classifier) onto a canvas, arrange them in the correct topology, and simulate the data flow. You get scored on architecture correctness, resilience, and efficiency — teaching you not just what patterns exist, but why each component matters.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No coding is required. The exercises use a visual drag-and-drop interface where you focus on architecture decisions — which blocks to include, what order to place them in, and how they connect. This teaches the design thinking behind agentic systems, which you can then apply in any framework (LangChain, CrewAI, AutoGen, etc.).",
  },
  {
    q: "Is this really free?",
    a: "Yes. Sign up is completely free with no credit card required. 7 exercises are available immediately after sign-up, with all 21 unlocked for free accounts.",
  },
  {
    q: "What patterns can I practice?",
    a: "All 21 patterns from Antonio Gullí's framework: Prompt Chaining, Routing, Parallelization, Reflection, Tool Use, Planning, Multi-Agent Collaboration, Memory Management, Learning & Adaptation, State Management (MCP), Goal Monitoring, Exception Handling, Human-in-the-Loop, Knowledge Retrieval (RAG), Inter-Agent Communication, Resource Optimization, Reasoning Techniques, Guardrails & Safety, Evaluation & Monitoring, Prioritization, and Exploration & Discovery.",
  },
  {
    q: "How is this different from reading about agentic patterns?",
    a: "Reading teaches you what patterns exist. Building teaches you why each component matters. When you skip the Validation Gate in a Prompt Chain exercise and watch the simulation fail with 'Hallucinated entities propagated,' you understand the pattern at a visceral level that no article can provide.",
  },
  {
    q: "Who is this for?",
    a: "Senior developers, software architects, and technical leaders who want to go from reading about agentic AI to confidently building agent architectures. You should understand distributed systems and design patterns — we translate that expertise into agentic AI fluency.",
  },
];

// ─── Animated Hero Diagram ─────────────────────────────────
function BuilderDiagram() {
  const blocks = [
    { x: 60, y: 80, label: "Extract", color: "#00D4FF" },
    { x: 200, y: 80, label: "Validate", color: "#00FF88" },
    { x: 340, y: 80, label: "Analyze", color: "#00D4FF" },
    { x: 200, y: 220, label: "Respond", color: "#FF6B35" },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square cursor-crosshair">
      <svg viewBox="0 0 400 320" className="w-full h-full">
        {/* Connection lines */}
        {[
          { x1: 110, y1: 80, x2: 175, y2: 80 },
          { x1: 255, y1: 80, x2: 315, y2: 80 },
          { x1: 200, y1: 105, x2: 200, y2: 195 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#00D4FF"
            strokeWidth="2"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              delay: i * 0.4,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        ))}

        {/* Agent blocks */}
        {blocks.map((block, i) => (
          <g key={block.label}>
            <motion.rect
              x={block.x - 45}
              y={block.y - 25}
              width={90}
              height={50}
              rx={8}
              fill="#0F1629"
              stroke={block.color}
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            />
            <motion.rect
              x={block.x - 45}
              y={block.y - 25}
              width={90}
              height={50}
              rx={8}
              fill="none"
              stroke={block.color}
              strokeWidth="1"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
            />
            <text
              x={block.x}
              y={block.y + 5}
              textAnchor="middle"
              className="fill-text-primary font-mono text-xs font-bold"
              fontSize="12"
            >
              {block.label}
            </text>
          </g>
        ))}

        {/* Floating "drag" cursor hint */}
        <motion.g
          initial={{ x: 50, y: 250 }}
          animate={{ x: [50, 200, 200], y: [250, 250, 220] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        >
          <circle r="6" fill="#FF6B35" opacity={0.8} />
          <circle r="12" fill="none" stroke="#FF6B35" strokeWidth="1" opacity={0.4} />
        </motion.g>
      </svg>
    </div>
  );
}

// ─── Game Card Component ───────────────────────────────────
function GameCard({
  game,
  index,
  isSignedIn,
}: {
  game: (typeof GAMES)[0];
  index: number;
  isSignedIn: boolean;
}) {
  const href = isSignedIn
    ? `${MAIN}/patterns/${game.slug}#build`
    : `${MAIN}/signup`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <a
        href={href}
        className={`group block bg-surface border rounded-lg p-5 transition-all h-full ${
          game.isUnlocked
            ? "border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            : "border-border/50 opacity-75 hover:opacity-90"
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className={`p-2 rounded-md ${
              game.isUnlocked
                ? "bg-primary/10 text-primary"
                : "bg-border/30 text-text-secondary"
            }`}
          >
            {game.icon}
          </div>
          <span className="font-mono text-xs text-text-secondary">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="font-mono text-sm font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">
          {game.name}
        </h3>

        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          {game.mission}
        </p>

        <div className="flex items-center justify-between">
          {game.isUnlocked ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-primary">
              <Play size={10} className="fill-primary" />
              Play now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary">
              <Lock size={10} />
              Sign up to play
            </span>
          )}
        </div>
      </a>
    </motion.div>
  );
}

// ─── FAQ Accordion ─────────────────────────────────────────
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

// ─── Main Page Component ───────────────────────────────────
export default function PracticePage() {
  const { user, isLoading } = useAuth();
  const isSignedIn = !!user;

  return (
    <main className="relative z-10">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="min-h-[90vh] flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={stagger.container}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={stagger.item}>
                <span className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1 mb-6">
                  21 Interactive Exercises · Free
                </span>
              </motion.div>

              <motion.h1
                variants={stagger.item}
                className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6"
              >
                Stop Reading About AI Agents.{" "}
                <span className="text-gradient">Start Building Them.</span>
              </motion.h1>

              <motion.p
                variants={stagger.item}
                className="text-text-secondary text-lg md:text-xl leading-relaxed mb-8 max-w-xl"
              >
                Practice all 21 agentic design patterns with hands-on
                drag-and-drop exercises. Build agent architectures, run
                simulations, and see exactly why each component matters.
              </motion.p>

              <motion.div
                variants={stagger.item}
                className="flex flex-col sm:flex-row gap-4 mb-6"
              >
                {!isLoading && !isSignedIn ? (
                  <>
                    <a
                      href={`${MAIN}/signup`}
                      className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      Sign Up Free — Start Building
                      <ArrowRight size={18} />
                    </a>
                    <Link
                      href="#exercises"
                      className="inline-flex items-center justify-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium text-base px-8 py-3.5 rounded-md transition-all"
                    >
                      See All 21 Exercises
                    </Link>
                  </>
                ) : !isLoading ? (
                  <a
                    href={`${MAIN}/patterns/prompt-chaining#build`}
                    className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                  >
                    Start Your First Exercise
                    <ArrowRight size={18} />
                  </a>
                ) : null}
              </motion.div>

              <motion.p
                variants={stagger.item}
                className="text-text-secondary/60 text-sm font-mono"
              >
                No credit card · Free forever · 7 exercises open now
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <BuilderDiagram />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ─────────────────────────────── */}
      <section className="py-8 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { value: "21", label: "Exercises" },
              { value: "21", label: "Agentic Patterns" },
              { value: "100%", label: "Free" },
              { value: "0", label: "Lines of Code Required" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-mono text-2xl md:text-3xl text-primary font-bold">
                  {stat.value}
                </div>
                <div className="text-text-secondary text-xs mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="How Does the Agent Builder Work?"
            subtitle="Three steps. Zero setup. Instant feedback on your architecture decisions."
            decorator="→"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="relative bg-surface border border-border rounded-lg p-8 hover:border-primary/30 transition-all"
              >
                <span className="absolute -top-4 left-6 bg-background border border-primary/30 rounded-full px-3 py-1 font-mono text-xs text-primary">
                  Step {step.step}
                </span>
                <div className="mb-5 mt-2">{step.icon}</div>
                <h3 className="font-mono text-lg text-text-primary font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT YOU'LL LEARN ────────────────────────────── */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Practice Beats Reading"
            subtitle="Building agent architectures yourself creates understanding that sticks."
            decorator="≠"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-surface border border-border rounded-lg p-6 hover:border-primary/30 transition-all"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="font-mono text-text-primary font-bold text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {benefit.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXERCISE DEMO ────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What an Exercise Looks Like"
            subtitle="Each exercise gives you a mission, a set of agent blocks, and a canvas to build on."
            decorator="#"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface border border-border rounded-xl overflow-hidden"
          >
            {/* Mock exercise header */}
            <div className="border-b border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs text-primary border border-primary/30 rounded-full px-2.5 py-0.5">
                  Exercise 01
                </span>
                <span className="font-mono text-xs text-text-secondary">
                  Prompt Chaining
                </span>
              </div>
              <h3 className="font-mono text-xl text-text-primary font-bold">
                Build a Customer Support Pipeline
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Assemble an agent pipeline that extracts intent, validates the
                extraction, analyzes sentiment, and generates a response.
              </p>
            </div>

            {/* Mock canvas area */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] min-h-[300px]">
              {/* Block palette */}
              <div className="border-b md:border-b-0 md:border-r border-border p-4">
                <p className="font-mono text-xs text-text-secondary mb-3 uppercase tracking-wider">
                  Blocks
                </p>
                {[
                  { label: "Extraction Agent", cat: "agent" },
                  { label: "Validation Gate", cat: "gate" },
                  { label: "Analysis Agent", cat: "agent" },
                  { label: "Response Agent", cat: "agent" },
                  { label: "Router", cat: "distractor" },
                ].map((block, i) => (
                  <motion.div
                    key={block.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className={`mb-2 px-3 py-2 rounded-md border text-xs font-mono cursor-grab ${
                      block.cat === "agent"
                        ? "border-primary/30 text-primary bg-primary/5"
                        : block.cat === "gate"
                          ? "border-success/30 text-success bg-success/5"
                          : "border-text-secondary/20 text-text-secondary bg-surface"
                    }`}
                  >
                    {block.label}
                  </motion.div>
                ))}
              </div>

              {/* Canvas preview */}
              <div className="p-6 flex items-center justify-center">
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  {["Extract", "Validate", "Analyze", "Respond"].map(
                    (node, i) => (
                      <motion.div
                        key={node}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.12 }}
                        className="flex items-center gap-3"
                      >
                        <div className="bg-code-bg border border-primary/40 rounded-lg px-4 py-3 font-mono text-xs text-primary">
                          {node}
                        </div>
                        {i < 3 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 + i * 0.12 }}
                            className="text-primary/50"
                          >
                            →
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Score preview */}
            <div className="border-t border-border p-4 bg-code-bg flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {[
                  { label: "Architecture", score: 40, max: 40 },
                  { label: "Resilience", score: 40, max: 40 },
                  { label: "Efficiency", score: 20, max: 20 },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-mono text-sm text-success font-bold">
                      {s.score}/{s.max}
                    </div>
                    <div className="text-text-secondary text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 font-mono text-sm text-success">
                <CheckCircle2 size={16} />
                100/100 — Perfect Score
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── ALL 21 EXERCISES ─────────────────────────────── */}
      <section id="exercises" className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="21 Exercises. 21 Agentic Patterns. One Complete Skill Set."
            subtitle="Each exercise teaches one pattern by having you build its architecture from scratch."
            decorator="$"
          />
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <span className="inline-flex items-center gap-2 font-mono text-sm border border-primary/30 text-primary rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />7 exercises
              open now
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-sm border border-accent/30 text-accent rounded-full px-4 py-1.5">
              <Lock size={12} />
              14 more · free with sign-up
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {GAMES.map((game, i) => (
              <GameCard
                key={game.slug}
                game={game}
                index={i}
                isSignedIn={isSignedIn}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── SIGN UP CTA ──────────────────────────────────── */}
      <section className="py-24 bg-code-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            title="Ready to Build Your First AI Agent?"
            subtitle="Sign up free and start practicing agentic design patterns in under a minute. No credit card. No catch."
            decorator="→"
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            {!isLoading && !isSignedIn ? (
              <>
                <a
                  href={`${MAIN}/signup`}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                >
                  Create Free Account
                  <ArrowRight size={18} />
                </a>
                <a
                  href={`${MAIN}/login`}
                  className="inline-flex items-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium text-base px-8 py-3.5 rounded-md transition-all"
                >
                  Already have an account? Log in
                </a>
              </>
            ) : !isLoading ? (
              <a
                href={`${MAIN}/patterns/prompt-chaining#build`}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Start Building Now
                <ArrowRight size={18} />
              </a>
            ) : null}
          </div>
          <p className="text-text-secondary/60 text-xs font-mono mt-6">
            100% free · No credit card · Unsubscribe anytime
          </p>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Common Questions" decorator="?" />
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA STRIP ─────────────────────────────── */}
      <section className="py-16 bg-surface/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-2xl md:text-3xl text-text-primary font-bold mb-4">
              Build the patterns. Build the intuition.
            </p>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              The best way to learn agentic design patterns is to build them
              yourself. 21 exercises. Zero theory walls. All practice.
            </p>
            {!isLoading && !isSignedIn && (
              <a
                href={`${MAIN}/signup`}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-10 py-4 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Sign Up Free — Start Building
                <ArrowRight size={18} />
              </a>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
