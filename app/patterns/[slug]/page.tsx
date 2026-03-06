"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, ChevronRight, Home, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import ProgressCircle from "@/components/ProgressCircle";
import { patterns, getPatternBySlug } from "@/data/patterns";
import { formatPatternNumber } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { PatternArticleJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import AgentBuilder from "@/components/AgentBuilder/AgentBuilder";
import LessonFeedback from "@/components/LessonFeedback";
import { hasGameConfig } from "@/data/games";
import type { Pattern } from "@/data/patterns";

const baseTabs = [
  { id: "overview", label: "Overview" },
  { id: "code", label: "The Code" },
  { id: "mapping", label: "SWE Mapping" },
  { id: "production", label: "Production Notes" },
  { id: "takeaway", label: "Key Takeaway" },
];

export default function PatternDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const pattern = getPatternBySlug(slug);
  const [activeTab, setActiveTab] = useState("overview");
  const { user, readSlugs, markRead } = useAuth();

  // User can access if pattern is open by default OR user is signed in
  const canAccess = pattern ? pattern.isUnlocked || !!user : false;

  // Mark pattern as read after 5 seconds of viewing
  useEffect(() => {
    if (!canAccess || !pattern || !user) return;
    if (readSlugs.includes(pattern.slug)) return;

    const timer = setTimeout(() => {
      markRead(pattern.slug);
    }, 5000);

    return () => clearTimeout(timer);
  }, [canAccess, pattern, user, readSlugs, markRead]);

  if (!pattern) {
    return (
      <main className="relative z-10 pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-mono text-2xl text-text-primary mb-4">
            Pattern not found
          </h1>
          <Link href="/#curriculum" className="text-primary hover:underline font-mono text-sm">
            ← Back to Curriculum
          </Link>
        </div>
      </main>
    );
  }

  // Locked: show rich crawlable preview + signup CTA
  if (!canAccess) {
    return (
      <main className="relative z-10 pt-24 min-h-screen">
        <PatternArticleJsonLd pattern={pattern} />
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://learnagenticpatterns.com" },
            { name: "Curriculum", url: "https://learnagenticpatterns.com/#curriculum" },
            { name: pattern.name, url: `https://learnagenticpatterns.com/patterns/${pattern.slug}` },
          ]}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb patternName={pattern.name} />

          {/* Crawlable header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-primary text-sm">
                Pattern {formatPatternNumber(pattern.number)}
              </span>
            </div>
            <h1 className="font-mono text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-3">
              {pattern.name}
            </h1>
            <p className="font-mono text-text-secondary text-lg">
              ≈ {pattern.sweParallelFull}
            </p>
          </div>

          {/* Crawlable preview content */}
          <div className="space-y-6 mb-10">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="font-mono text-primary text-sm font-bold mb-3">
                {">"} Agentic Definition
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {pattern.agenticDefinition}
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="font-mono text-primary text-sm font-bold mb-3">
                {">"} Description
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {pattern.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="font-mono text-success text-sm font-bold mb-3">
                  ≈ How It Maps to {pattern.sweParallel}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {pattern.mapping.similarity}
                </p>
              </div>
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="font-mono text-accent text-sm font-bold mb-3">
                  ≠ Key Divergence
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {pattern.mapping.divergence}
                </p>
              </div>
            </div>

            <div className="bg-surface border border-primary/20 rounded-lg p-6 border-glow">
              <h2 className="font-mono text-primary text-sm font-bold mb-3">
                {">"} Key Takeaway
              </h2>
              <p className="text-text-primary leading-relaxed">
                {pattern.keyTakeaway}
              </p>
            </div>
          </div>

          {/* FAQ section -- crawlable on locked pages too */}
          <PatternFAQ pattern={pattern} />

          {/* Signup gate */}
          <div className="text-center py-10 bg-surface/50 border border-border rounded-xl">
            <Lock className="w-12 h-12 text-text-secondary/40 mx-auto mb-4" />
            <h3 className="font-mono text-xl text-text-primary font-bold mb-2">
              Sign up to unlock code examples &amp; production notes
            </h3>
            <p className="text-text-secondary mb-6 max-w-lg mx-auto text-sm">
              Get full access to all 21 patterns with code comparisons,
              production considerations, and architecture diagrams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Sign Up Free
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium px-8 py-3.5 rounded-md transition-all"
              >
                Already have an account? Log in
              </Link>
            </div>
            <p className="text-text-secondary/50 text-xs mt-4 font-mono">
              No credit card required.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const currentIndex = patterns.findIndex((p) => p.slug === slug);
  const nextPattern = patterns[currentIndex + 1];

  const gameAvailable = hasGameConfig(slug);
  const tabs = gameAvailable
    ? [...baseTabs, { id: "build", label: "Build" }]
    : baseTabs;

  return (
    <main className="relative z-10 pt-24">
      <PatternArticleJsonLd pattern={pattern} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://learnagenticpatterns.com" },
          { name: "Curriculum", url: "https://learnagenticpatterns.com/#curriculum" },
          { name: pattern.name, url: `https://learnagenticpatterns.com/patterns/${pattern.slug}` },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              {/* Progress circle */}
              {user && (
                <div className="mb-6 flex justify-center">
                  <ProgressCircle size={100} strokeWidth={6} />
                </div>
              )}

              <h4 className="font-mono text-xs text-primary mb-3">
                {">"} All Patterns
              </h4>
              {patterns.map((p) => {
                const pAccess = p.isUnlocked || !!user;
                const pRead = readSlugs.includes(p.slug);
                return (
                  <Link
                    key={p.slug}
                    href={pAccess ? `/patterns/${p.slug}` : "/signup"}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded text-xs font-mono transition-colors
                      ${
                        p.slug === slug
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : pAccess
                          ? "text-text-secondary hover:text-primary hover:bg-surface"
                          : "text-text-secondary/40"
                      }
                    `}
                  >
                    <span className="w-6 text-right flex-shrink-0">
                      {formatPatternNumber(p.number)}
                    </span>
                    <span className="truncate">{p.name}</span>
                    {pRead ? (
                      <CheckCircle2 size={10} className="ml-auto flex-shrink-0 text-success" />
                    ) : !pAccess ? (
                      <Lock size={10} className="ml-auto flex-shrink-0" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Main content */}
          <div>
            <Breadcrumb patternName={pattern.name} />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-primary text-sm">
                  Pattern {formatPatternNumber(pattern.number)}
                </span>
                {readSlugs.includes(pattern.slug) && (
                  <span className="inline-flex items-center gap-1 text-success text-xs font-mono bg-success/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} /> Read
                  </span>
                )}
              </div>
              <h1 className="font-mono text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-3">
                {pattern.name}
              </h1>
              <p className="font-mono text-text-secondary text-lg">
                ≈ {pattern.sweParallelFull}
              </p>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-1 mb-8 overflow-x-auto border-b border-border pb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-2.5 font-mono text-sm whitespace-nowrap transition-colors border-b-2 -mb-px
                    ${
                      activeTab === tab.id
                        ? tab.id === "build"
                          ? "border-accent text-accent"
                          : "border-primary text-primary"
                        : "border-transparent text-text-secondary hover:text-text-primary"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content -- all tabs rendered in HTML for crawlability, hidden with CSS */}
            <div>
              <div className={activeTab === "overview" ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="font-mono text-primary text-sm font-bold mb-3">
                      {">"} Agentic Definition
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {pattern.agenticDefinition}
                    </p>
                  </div>
                  <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="font-mono text-primary text-sm font-bold mb-3">
                      {">"} Description
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {pattern.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className={activeTab === "code" ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-mono text-text-secondary text-sm mb-3">
                      Before: {pattern.codeBeforeLabel}
                    </h3>
                    <CodeBlock
                      code={pattern.codeBefore}
                      title={pattern.codeBeforeLabel}
                      language={pattern.codeLanguage}
                    />
                  </div>
                  <div>
                    <h3 className="font-mono text-text-secondary text-sm mb-3">
                      After: {pattern.codeAfterLabel}
                    </h3>
                    <CodeBlock
                      code={pattern.codeAfter}
                      title={pattern.codeAfterLabel}
                      language={pattern.codeLanguage}
                    />
                  </div>
                </div>
              </div>

              <div className={activeTab === "mapping" ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="font-mono text-success text-sm font-bold mb-3">
                      ≈ Similarity
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {pattern.mapping.similarity}
                    </p>
                  </div>
                  <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="font-mono text-accent text-sm font-bold mb-3">
                      ≠ Divergence
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {pattern.mapping.divergence}
                    </p>
                  </div>
                </div>
              </div>

              <div className={activeTab === "production" ? "block" : "hidden"}>
                <div className="bg-surface border border-border rounded-lg p-6">
                  <h3 className="font-mono text-primary text-sm font-bold mb-4">
                    {">"} Production Considerations
                  </h3>
                  <ul className="space-y-3">
                    {pattern.productionNotes.map((note, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-text-secondary leading-relaxed"
                      >
                        <span className="font-mono text-primary text-xs mt-1 flex-shrink-0">
                          [{String(i + 1).padStart(2, "0")}]
                        </span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={activeTab === "takeaway" ? "block" : "hidden"}>
                <div className="bg-surface border border-primary/20 rounded-lg p-8 border-glow">
                  <h3 className="font-mono text-primary text-sm font-bold mb-4">
                    {">"} Key Takeaway
                  </h3>
                  <p className="text-text-primary text-lg leading-relaxed">
                    {pattern.keyTakeaway}
                  </p>
                </div>
              </div>

              {gameAvailable && (
                <div className={activeTab === "build" ? "block" : "hidden"}>
                  <AgentBuilder patternSlug={slug} />
                </div>
              )}
            </div>

            <LessonFeedback lessonSlug={slug} track="developer" />

            {/* FAQ section -- crawlable by AI engines */}
            <PatternFAQ pattern={pattern} />

            {/* Next pattern CTA */}
            {nextPattern && (
              <div className="mt-12 pt-8 border-t border-border">
                <Link
                  href={
                    nextPattern.isUnlocked || user
                      ? `/patterns/${nextPattern.slug}`
                      : "/signup"
                  }
                  className="flex items-center justify-between bg-surface border border-border rounded-lg p-6 hover:border-primary/30 transition-all group"
                >
                  <div>
                    <span className="font-mono text-xs text-text-secondary">
                      Next Pattern
                    </span>
                    <h4 className="font-mono text-text-primary font-bold mt-1 group-hover:text-primary transition-colors">
                      {formatPatternNumber(nextPattern.number)} ·{" "}
                      {nextPattern.name}
                    </h4>
                  </div>
                  <ArrowRight className="text-text-secondary group-hover:text-primary transition-colors" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Breadcrumb({ patternName }: { patternName: string }) {
  return (
    <nav className="flex items-center gap-2 text-xs font-mono text-text-secondary mb-6">
      <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home size={12} />
        Home
      </Link>
      <ChevronRight size={12} />
      <Link href="/#curriculum" className="hover:text-primary transition-colors">
        Curriculum
      </Link>
      <ChevronRight size={12} />
      <span className="text-text-primary">{patternName}</span>
    </nav>
  );
}

function buildPatternFaqs(pattern: Pattern) {
  return [
    {
      question: `When should I use the ${pattern.name} pattern?`,
      answer: pattern.agenticDefinition,
    },
    {
      question: `How does ${pattern.name} relate to ${pattern.sweParallelFull}?`,
      answer: `${pattern.mapping.similarity} However, there is a key divergence: ${pattern.mapping.divergence}`,
    },
    {
      question: `What are the production trade-offs of ${pattern.name}?`,
      answer: pattern.productionNotes.join(" "),
    },
  ];
}

function PatternFAQ({ pattern }: { pattern: Pattern }) {
  const faqs = buildPatternFaqs(pattern);

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <FAQPageJsonLd faqs={faqs} />
      <h2 className="font-mono text-lg font-bold text-text-primary mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-surface border border-border rounded-lg group">
            <summary className="px-6 py-4 cursor-pointer font-mono text-sm text-text-primary font-bold list-none flex items-center justify-between">
              {faq.question}
              <ChevronRight size={14} className="text-text-secondary group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
            </summary>
            <div className="px-6 pb-4">
              <p className="text-text-secondary leading-relaxed text-sm">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
