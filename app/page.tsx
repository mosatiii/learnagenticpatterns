"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, Eye, Target, Quote, Lock } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import PatternCard from "@/components/PatternCard";
import WaitlistForm from "@/components/WaitlistForm";
import MappingTable from "@/components/MappingTable";
import MaturityLevel from "@/components/MaturityLevel";
import { patterns } from "@/data/patterns";

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
        {/* Connection lines with animation */}
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

        {/* Nodes */}
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

// ─── FAQ Data ───────────────────────────────────────────────
const faqs = [
  {
    q: "Is this for beginners?",
    a: "No. This curriculum assumes you are a senior developer comfortable with distributed systems, APIs, and production software. We start from your existing knowledge.",
  },
  {
    q: "Is this about a specific framework?",
    a: "No. Patterns are framework-agnostic. We use pseudocode and real examples from LangChain, LangGraph, CrewAI, and AutoGen to illustrate — but the concepts apply universally.",
  },
  {
    q: "Is this free?",
    a: "The core curriculum is free. Advanced modules, code repos, and workshop access may have premium tiers in the future.",
  },
  {
    q: "How is this different from other AI courses?",
    a: "Most courses teach you to use AI tools. This curriculum teaches you to architect AI systems — treating agents as engineering constructs with well-defined design patterns.",
  },
  {
    q: "Is this really free?",
    a: "Yes — 7 patterns are open right now with no sign-up. Sign up for free (no credit card) to unlock all 21 patterns, code examples, and architecture diagrams.",
  },
  {
    q: "Who is Antonio Gullí?",
    a: "Antonio Gullí is an Engineering Leader at Google and author of 'Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems.' This curriculum is inspired by and builds upon his framework.",
  },
];

// ─── Main Page Component ────────────────────────────────────
export default function HomePage() {
  return (
    <main className="relative z-10">
      {/* ── SECTION 1: HERO ───────────────────────────────── */}
      <section className="min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
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
                A free curriculum for senior developers that maps 21 Agentic
                Design Patterns to the SWE concepts you already know. 7 patterns
                live now. No hype. Just architecture.
              </motion.p>

              <motion.div
                variants={stagger.item}
                className="flex flex-col sm:flex-row gap-4 mb-6"
              >
                <Link
                  href="#curriculum"
                  className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                >
                  Start Learning — Free
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="#signup"
                  className="inline-flex items-center justify-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium text-base px-8 py-3.5 rounded-md transition-all"
                >
                  Sign Up to Unlock All 21 →
                </Link>
              </motion.div>

              <motion.p
                variants={stagger.item}
                className="text-text-secondary/60 text-sm font-mono"
              >
                7 patterns open · 14 more free with sign-up · No credit card required
              </motion.p>
            </motion.div>

            {/* Right: Animated diagram */}
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

      {/* ── SECTION 2: THE PROBLEM ────────────────────────── */}
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

      {/* ── SECTION 3: THE BRIDGE (Mapping Table) ─────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Everything New Maps to Something You Already Know"
            decorator="≈"
          />
          <MappingTable />
        </div>
      </section>

      {/* ── SECTION 4: THE CURRICULUM (21 Patterns) ───────── */}
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
              14 more — free with sign-up
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {patterns.map((pattern, i) => (
              <PatternCard key={pattern.id} pattern={pattern} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: MATURITY MODEL ─────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Where Does Your System Sit?"
            subtitle="Five levels of agent autonomy — from zero-shot responses to fully autonomous multi-agent systems."
            decorator="L0→L4"
          />
          <MaturityLevel />
        </div>
      </section>

      {/* ── SECTION 6: ABOUT MOUSA ────────────────────────── */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Who Built This & Why" decorator="~" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Avatar placeholder */}
              <div className="w-24 h-24 rounded-full bg-surface border-2 border-primary/30 flex items-center justify-center mb-6">
                <span className="font-mono text-primary text-2xl font-bold">
                  M
                </span>
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
                  alien — I knew the gap wasn&apos;t skill. It was framing. Every
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

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "21", label: "Patterns Documented" },
                { value: "5", label: "Levels of Autonomy Mapped" },
                { value: "MBET", label: "University of Waterloo" },
                { value: "CSPO", label: "Scrum Alliance Certified" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface border border-border rounded-lg p-5 text-center"
                >
                  <div className="font-mono text-3xl text-primary font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-text-secondary text-xs">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: SIGN UP ─────────────────────────────── */}
      <section id="signup" className="py-24 bg-code-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Sign Up Free — Unlock All 21 Patterns"
            subtitle="Get instant access to the full curriculum, code examples, and architecture diagrams. No credit card. No catch. Unsubscribe anytime."
            decorator="→"
          />
          <WaitlistForm />
        </div>
      </section>

      {/* ── SECTION 8: MANIFESTO QUOTE ────────────────────── */}
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
              — Mousa
            </cite>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 9: FAQ ────────────────────────────────── */}
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

