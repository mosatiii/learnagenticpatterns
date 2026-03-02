"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  ArrowRight,
  FileText,
  GitCompare,
  AlertTriangle,
  LayoutGrid,
  CheckCircle2,
  ChevronRight,
  Home,
  Lock,
} from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { patterns } from "@/data/patterns";
import { CheatSheetJsonLd } from "@/components/JsonLd";
import { useAuth } from "@/contexts/AuthContext";

const CHEATSHEET_PDF_URL =
  "/Agentic-Design-Architecture-A-Reskilling-Curriculum-for-the-AI-Native-Enterprise.pdf";

// ─── Pattern mapping data for the preview table ─────────────
const patternMappings = patterns.map((p) => ({
  number: p.number,
  name: p.name,
  sweParallel: p.sweParallel,
  slug: p.slug,
}));

// ─── What's inside cards ────────────────────────────────────
const insideCards = [
  {
    icon: <GitCompare className="text-primary" size={24} />,
    title: "The Pattern Bridge",
    body: "All 21 agentic AI patterns mapped side-by-side to their classical SWE equivalents. The Rosetta Stone for AI architecture.",
  },
  {
    icon: <LayoutGrid className="text-primary" size={24} />,
    title: "Decision Framework",
    body: "A visual flowchart: single-pass LLM, deterministic workflow, or multi-agent orchestration? Know which pattern to reach for.",
  },
  {
    icon: <AlertTriangle className="text-accent" size={24} />,
    title: "Anti-Patterns & Trade-Offs",
    body: "Agent Soup, Memory Hoarding, Reflection Loops — the mistakes that kill production agents, and how to avoid them.",
  },
  {
    icon: <FileText className="text-primary" size={24} />,
    title: "Production Guardrails",
    body: "Bounded autonomy, state control, failure recovery, and cost optimization checklists for real-world deployments.",
  },
];

// ─── FAQ data ───────────────────────────────────────────────
const faqs = [
  {
    q: "What are agentic AI design patterns?",
    a: "Agentic AI design patterns are reusable architectural blueprints for building AI systems that can perceive, reason, plan, and act autonomously. They include patterns like Prompt Chaining (sequential LLM calls), Reflection (self-correction loops), Tool Use (function calling), Planning (dynamic task decomposition), and Multi-Agent Collaboration (specialized agent teams). Each maps directly to classical software engineering patterns.",
  },
  {
    q: "Who is this cheat sheet for?",
    a: "Senior software engineers, architects, engineering managers, and technical leaders who already understand distributed systems, design patterns, and production software — and want to translate that expertise into agentic AI fluency. This is not a beginner's introduction to AI.",
  },
  {
    q: "Is this really free? What's the catch?",
    a: "No catch. Sign up for a free account (no credit card required) and the PDF is yours instantly. We ask for sign-up so we can notify you when new patterns are added. If you find it valuable, share it with your team.",
  },
  {
    q: "How is this different from Andrew Ng's agentic patterns?",
    a: "Andrew Ng identified 4 core agentic patterns in his landmark course. Our cheat sheet covers all 21 patterns from Antonio Gullí's comprehensive framework and uniquely maps each one to a classical software engineering equivalent — something no other resource does.",
  },
  {
    q: "Can I share this with my team?",
    a: "Absolutely — that's the point. The PDF is designed to be pinned to your wall during architecture reviews, shared in Slack channels, and referenced in design docs. Every page works as a standalone shareable image.",
  },
  {
    q: "Will you add more patterns in the future?",
    a: "Yes. The agentic AI space evolves rapidly. We continuously update the curriculum and cheat sheet as new patterns emerge and existing ones mature. Sign up for the free newsletter to get updates.",
  },
];

// ─── Stagger animation ─────────────────────────────────────
const stagger = {
  container: { transition: { staggerChildren: 0.1 } },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
};

export default function CheatSheetPage() {
  const { user, isLoading } = useAuth();

  return (
    <main className="relative z-10">
      <CheatSheetJsonLd />

      {/* BREADCRUMB */}
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center gap-2 text-xs font-mono text-text-secondary">
            <Link
              href="/"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Home size={12} />
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-text-primary">
              Agentic AI Design Patterns Cheat Sheet
            </span>
          </nav>
        </div>
      </div>

      {/* HERO */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={stagger.container}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={stagger.item}>
                <span className="inline-block font-mono text-xs text-accent border border-accent/30 rounded-full px-3 py-1 mb-6">
                  FREE PDF — Sign up to download
                </span>
              </motion.div>

              <motion.h1
                variants={stagger.item}
                className="font-mono text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6"
              >
                21 Agentic AI Patterns{" "}
                <span className="text-gradient">You Already Know</span>
              </motion.h1>

              <motion.p
                variants={stagger.item}
                className="text-text-secondary text-lg leading-relaxed mb-8 max-w-xl"
              >
                The free cheat sheet that maps every agentic AI design pattern to
                a software engineering concept you&apos;ve used for years.
                Prompt Chaining is Pipe &amp; Filter. Reflection is TDD.
                Multi-Agent is Microservices. Download the complete reference.
              </motion.p>

              <motion.div
                variants={stagger.item}
                className="flex flex-col sm:flex-row gap-4 mb-6"
              >
                {!isLoading && (
                  user ? (
                    <a
                      href={CHEATSHEET_PDF_URL}
                      download
                      className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      <Download size={18} />
                      Download PDF
                    </a>
                  ) : (
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      <Lock size={16} />
                      Sign Up Free to Download
                    </Link>
                  )
                )}
                <Link
                  href="/#curriculum"
                  className="inline-flex items-center justify-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium text-base px-8 py-3.5 rounded-md transition-all"
                >
                  Explore All 21 Patterns
                  <ArrowRight size={18} />
                </Link>
              </motion.div>

              <motion.p
                variants={stagger.item}
                className="text-text-secondary/60 text-sm font-mono"
              >
                {user
                  ? "Your PDF is ready · Share it with your team"
                  : "Free sign-up · No credit card · Instant download"
                }
              </motion.p>
            </motion.div>

            {/* PDF mockup preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="bg-surface border border-border rounded-xl p-8 shadow-2xl shadow-primary/5 transform hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="ml-2 font-mono text-xs text-text-secondary">
                      cheat-sheet.pdf
                    </span>
                  </div>
                  <div className="space-y-3">
                    {patternMappings.slice(0, 7).map((p) => (
                      <div
                        key={p.number}
                        className="flex items-center gap-3 text-sm font-mono"
                      >
                        <span className="text-primary w-6 text-right">
                          {String(p.number).padStart(2, "0")}
                        </span>
                        <span className="text-text-primary flex-1 truncate">
                          {p.name}
                        </span>
                        <span className="text-accent">→</span>
                        <span className="text-text-secondary flex-1 truncate">
                          {p.sweParallel}
                        </span>
                      </div>
                    ))}
                    <div className="text-center text-text-secondary/40 text-xs font-mono pt-2">
                      ... and 14 more patterns inside
                    </div>
                  </div>
                </div>
                {/* Decorative shadow card behind */}
                <div className="absolute inset-0 bg-surface border border-border rounded-xl -z-10 transform translate-x-3 translate-y-3 opacity-30" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What's Inside the Cheat Sheet"
            subtitle="Designed as a desk reference for architecture reviews, team onboarding, and design docs."
            decorator="📄"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insideCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-surface border border-border rounded-lg p-6 hover:border-primary/30 transition-all"
              >
                <div className="mb-4">{card.icon}</div>
                <h3 className="font-mono text-text-primary font-bold text-lg mb-2">
                  {card.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PATTERN MAPPING PREVIEW */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Pattern Mapping Preview: AI Meets Classical Engineering"
            subtitle="Every agentic pattern has a SWE ancestor. Here's the complete bridge."
            decorator="≈"
          />
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[3rem_1fr_2rem_1fr] gap-4 px-6 py-4 bg-code-bg border-b border-border">
              <span className="font-mono text-xs text-text-secondary">#</span>
              <span className="font-mono text-xs text-primary font-bold">
                Agentic AI Pattern
              </span>
              <span />
              <span className="font-mono text-xs text-accent font-bold">
                Classical SWE Parallel
              </span>
            </div>
            {/* Table rows */}
            {patternMappings.map((p, i) => (
              <Link
                key={p.number}
                href={`/patterns/${p.slug}`}
                className="grid grid-cols-[3rem_1fr_2rem_1fr] gap-4 px-6 py-3.5 border-b border-border/50 last:border-b-0 hover:bg-primary/5 transition-colors group"
              >
                <span className="font-mono text-xs text-text-secondary">
                  {String(p.number).padStart(2, "0")}
                </span>
                <span className="font-mono text-sm text-text-primary group-hover:text-primary transition-colors truncate">
                  {p.name}
                </span>
                <span className="text-accent text-center">→</span>
                <span className="font-mono text-sm text-text-secondary truncate">
                  {p.sweParallel}
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            {user ? (
              <a
                href={CHEATSHEET_PDF_URL}
                download
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                <Download size={18} />
                Download the Full PDF
              </a>
            ) : (
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                <Lock size={16} />
                Sign Up Free to Download
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* WHY SENIOR ENGINEERS LOVE THIS */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Senior Engineers Love This Reference"
            decorator=">"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Learn 10x Faster",
                body: "Skip the hype cycle. Map new concepts to patterns you've shipped in production for years. Agentic AI becomes an extension of your existing toolkit.",
              },
              {
                title: "Architecture-Ready",
                body: "Walk into design reviews speaking fluently about agentic systems using engineering vocabulary your team already understands.",
              },
              {
                title: "Pin It, Reference It",
                body: "Designed as a desk reference — print it, pin it to your monitor, share it in Slack. Every page works as a standalone shareable image.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-surface border border-border rounded-lg p-6"
              >
                <CheckCircle2 className="text-success mb-4" size={24} />
                <h3 className="font-mono text-text-primary font-bold text-lg mb-2">
                  {card.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE ALL 21 PATTERNS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="All 21 Agentic Patterns at a Glance"
            subtitle="Each pattern has a dedicated deep-dive page with code examples, SWE mappings, and production notes."
            decorator="$"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patterns.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Link
                  href={`/patterns/${p.slug}`}
                  className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3 hover:border-primary/40 transition-all group"
                >
                  <span className="font-mono text-primary text-xs w-6 text-right flex-shrink-0">
                    {String(p.number).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-text-primary text-sm group-hover:text-primary transition-colors block truncate">
                      {p.name}
                    </span>
                    <span className="font-mono text-text-secondary text-xs block truncate">
                      ≈ {p.sweParallel}
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-text-secondary/30 group-hover:text-primary transition-colors flex-shrink-0"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Frequently Asked Questions"
            decorator="?"
          />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-code-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            title="Get the Complete Reference Card"
            subtitle="21 agentic AI patterns. 21 classical SWE mappings. Architecture diagrams, decision frameworks, and anti-patterns. All in one free PDF."
            decorator="↓"
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            {user ? (
              <a
                href={CHEATSHEET_PDF_URL}
                download
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                <Download size={18} />
                Download Free PDF
              </a>
            ) : (
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                <Lock size={16} />
                Sign Up Free to Download
              </Link>
            )}
            <Link
              href="/#curriculum"
              className="inline-flex items-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium text-base px-8 py-3.5 rounded-md transition-all"
            >
              Explore All 21 Pattern Deep-Dives
              <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-text-secondary/60 text-xs font-mono mt-6">
            {user
              ? "Your PDF is ready · Share it with your team"
              : "Free sign-up · No credit card · Instant access"
            }
          </p>
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
