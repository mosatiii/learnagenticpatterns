"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight, ChevronRight, Home, Check,
  Layers, Compass, Zap, ShieldCheck, Plug, Users,
  Brain, BarChart3, GitBranch, Search, Terminal,
  ListChecks, MessageCircleQuestion,
} from "lucide-react";
import Link from "next/link";
import { pmModules, getPMModuleBySlug } from "@/data/pm-curriculum";
import { useAuth } from "@/contexts/AuthContext";
import PMGameSection from "@/components/PMGames/PMGameSection";

const iconMap = {
  layers: Layers,
  compass: Compass,
  zap: Zap,
  "shield-check": ShieldCheck,
  plug: Plug,
  users: Users,
  brain: Brain,
  "bar-chart": BarChart3,
  "git-branch": GitBranch,
  search: Search,
  terminal: Terminal,
} as const;

const tabs = [
  { id: "learn", label: "Learn" },
  { id: "decisions", label: "Decisions" },
  { id: "play", label: "Play", accent: true },
];

export default function PMModulePage() {
  const params = useParams();
  const slug = params.slug as string;
  const mod = getPMModuleBySlug(slug);
  const [activeTab, setActiveTab] = useState("learn");
  const { user, readSlugs, markRead } = useAuth();

  useEffect(() => {
    if (!mod || !user) return;
    if (readSlugs.includes(mod.slug)) return;

    const timer = setTimeout(() => {
      markRead(mod.slug);
    }, 5000);

    return () => clearTimeout(timer);
  }, [mod, user, readSlugs, markRead]);

  if (!mod) {
    return (
      <main className="relative z-10 pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-mono text-2xl text-text-primary mb-4">Module not found</h1>
          <Link href="/#pm-curriculum" className="text-primary hover:underline font-mono text-sm">
            ← Back to Curriculum
          </Link>
        </div>
      </main>
    );
  }

  if (!user && !mod.isFree) {
    return (
      <main className="relative z-10 pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="font-mono text-2xl text-text-primary mb-4">{mod.title}</h1>
          <p className="text-text-secondary mb-6">Sign up free to access the PM curriculum.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold px-8 py-3.5 rounded-md transition-all"
          >
            Sign Up Free <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  const Icon = iconMap[mod.icon] || Layers;
  const currentIndex = pmModules.findIndex((m) => m.slug === slug);
  const nextModule = pmModules[currentIndex + 1];

  return (
    <main className="relative z-10 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <h4 className="font-mono text-xs text-primary mb-3">{">"} PM Modules</h4>
              {pmModules.map((m) => {
                const isModRead = readSlugs.includes(m.slug);
                return (
                  <Link
                    key={m.slug}
                    href={`/pm/${m.slug}`}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded text-xs font-mono transition-colors
                      ${
                        m.slug === slug
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-text-secondary hover:text-primary hover:bg-surface"
                      }
                    `}
                  >
                    <span className="w-6 text-right flex-shrink-0">
                      {isModRead ? (
                        <Check size={12} className="text-success inline" />
                      ) : (
                        String(m.number).padStart(2, "0")
                      )}
                    </span>
                    <span className="truncate">{m.title}</span>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Main content */}
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-mono text-text-secondary mb-6">
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <Home size={12} /> Home
              </Link>
              <ChevronRight size={12} />
              <Link href="/#pm-curriculum" className="hover:text-primary transition-colors">
                PM Curriculum
              </Link>
              <ChevronRight size={12} />
              <span className="text-text-primary">{mod.title}</span>
            </nav>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-primary text-sm">
                  Module {String(mod.number).padStart(2, "0")}
                </span>
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <Icon size={14} className="text-primary" />
                </div>
              </div>
              <h1 className="font-mono text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-3">
                {mod.title}
              </h1>
              <p className="text-text-secondary text-lg">
                {mod.subtitle}
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
                        ? tab.accent
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

            {/* Tab content */}
            <div>
              {/* Learn Tab */}
              <div className={activeTab === "learn" ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="font-mono text-primary text-sm font-bold mb-3">
                      {">"} Overview
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  <div className="bg-surface border border-primary/20 rounded-lg p-6 border-glow">
                    <h3 className="font-mono text-primary text-sm font-bold mb-3">
                      {">"} Why This Matters for Your Product
                    </h3>
                    <p className="text-text-primary leading-relaxed">
                      {mod.whyItMatters}
                    </p>
                  </div>

                  {/* Long-form sections (for deep-dive modules) */}
                  {mod.sections?.map((section, sIdx) => (
                    <motion.div
                      key={sIdx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.35, delay: sIdx * 0.03 }}
                      className="bg-surface border border-border rounded-lg p-6"
                    >
                      <h3 className="font-mono text-primary text-sm font-bold mb-3">
                        {">"} {section.heading}
                      </h3>
                      <p className="text-text-secondary leading-relaxed mb-4">
                        {section.body}
                      </p>
                      {section.bullets && section.bullets.length > 0 && (
                        <ul className="space-y-2">
                          {section.bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="flex items-start gap-3 text-text-secondary text-sm leading-relaxed"
                            >
                              <span className="font-mono text-primary/60 text-xs mt-0.5 flex-shrink-0">•</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ))}

                  {/* Related engineering patterns */}
                  <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="font-mono text-text-secondary text-sm font-bold mb-3">
                      Related Engineering Patterns
                    </h3>
                    <p className="text-text-secondary text-sm mb-3">
                      These are the technical patterns your engineering team will implement.
                      Understanding them helps you have better conversations.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mod.relatedPatterns.map((name) => (
                        <span
                          key={name}
                          className="inline-block font-mono text-xs text-primary/80 bg-primary/5 border border-primary/15 rounded-full px-3 py-1.5"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decisions Tab */}
              <div className={activeTab === "decisions" ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div className="bg-surface border border-border rounded-lg p-6">
                    <h3 className="font-mono text-accent text-sm font-bold mb-4 flex items-center gap-2">
                      <ListChecks size={16} />
                      Key Product Decisions
                    </h3>
                    <ul className="space-y-3">
                      {mod.keyDecisions.map((decision, i) => (
                        <li key={i} className="flex items-start gap-3 text-text-secondary leading-relaxed">
                          <span className="font-mono text-accent text-xs mt-1 flex-shrink-0">
                            [{String(i + 1).padStart(2, "0")}]
                          </span>
                          {decision}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-surface border border-success/20 rounded-lg p-6">
                    <h3 className="font-mono text-success text-sm font-bold mb-4 flex items-center gap-2">
                      <MessageCircleQuestion size={16} />
                      Ask Your Engineering Team
                    </h3>
                    <ul className="space-y-3">
                      {mod.questionsForEngineering.map((q, i) => (
                        <li key={i} className="flex items-start gap-3 text-text-secondary leading-relaxed">
                          <span className="font-mono text-success text-xs mt-1 flex-shrink-0">→</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Play Tab */}
              <div className={activeTab === "play" ? "block" : "hidden"}>
                <PMGameSection />
              </div>
            </div>

            {/* Sign-up CTA for unauthenticated users on free modules */}
            {!user && mod.isFree && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 text-center">
                  <h4 className="font-mono text-text-primary font-bold text-lg mb-2">
                    Want the full PM curriculum?
                  </h4>
                  <p className="text-text-secondary text-sm mb-4 max-w-md mx-auto">
                    This module is free. Sign up to unlock all {pmModules.length} modules, interactive
                    decision games, and the Developer track with 21 engineering patterns.
                  </p>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                  >
                    Sign Up Free <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            )}

            {/* Next module CTA */}
            {nextModule && (
              <div className={`${!user && mod.isFree ? "mt-6" : "mt-12"} pt-8 border-t border-border`}>
                <Link
                  href={`/pm/${nextModule.slug}`}
                  className="flex items-center justify-between bg-surface border border-border rounded-lg p-6 hover:border-primary/30 transition-all group"
                >
                  <div>
                    <span className="font-mono text-xs text-text-secondary">Next Module</span>
                    <h4 className="font-mono text-text-primary font-bold mt-1 group-hover:text-primary transition-colors">
                      {String(nextModule.number).padStart(2, "0")} · {nextModule.title}
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
