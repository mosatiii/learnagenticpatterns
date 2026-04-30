"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Briefcase,
  Gamepad2,
  Sparkles,
  BookOpen,
  Trophy,
} from "lucide-react";
import PatternCard from "@/components/PatternCard";
import PMModuleCard from "@/components/PMModuleCard";
import SectionHeader from "@/components/SectionHeader";
import { patterns } from "@/data/patterns";
import { pmModules } from "@/data/pm-curriculum";

type Persona = "dev" | "pm";

export default function LandingPersonaSwitcher() {
  const [persona, setPersona] = useState<Persona>("dev");

  return (
    <>
      {/* Toggle pill */}
      <section className="pt-6 pb-2">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3">
            <p className="font-mono text-xs uppercase tracking-wider text-text-secondary/70">
              {">"} I&apos;m a
            </p>
            <div
              role="tablist"
              aria-label="Choose your track"
              className="inline-flex p-1 bg-surface border border-border rounded-full"
            >
              <PersonaTab
                active={persona === "dev"}
                onClick={() => setPersona("dev")}
                icon={<Code2 size={14} />}
                label="Developer"
              />
              <PersonaTab
                active={persona === "pm"}
                onClick={() => setPersona("pm")}
                icon={<Briefcase size={14} />}
                label="Product Manager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick start cards (persona aware) */}
      <section className="pt-8 pb-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {persona === "dev" ? (
              <motion.div
                key="dev-cards"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <QuickCard
                  href="https://practice.learnagenticpatterns.com/patterns/prompt-chaining"
                  external
                  accent="primary"
                  icon={<Gamepad2 size={24} />}
                  badge="Most played"
                  title="Build a Prompt Chaining Agent"
                  body="Drag and drop blocks to assemble a real customer support pipeline. One click in. No sign up."
                  cta="Open the builder"
                />
                <QuickCard
                  href="/patterns/prompt-chaining"
                  accent="primary"
                  icon={<BookOpen size={24} />}
                  badge="Free"
                  title="Read the 21 patterns"
                  body="Pseudocode, SWE mappings, production notes. 7 patterns open without a sign up."
                  cta="Start with pattern 01"
                />
              </motion.div>
            ) : (
              <motion.div
                key="pm-cards"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <QuickCard
                  href="https://practice.learnagenticpatterns.com/pm/ship-or-skip"
                  external
                  accent="accent"
                  icon={<Gamepad2 size={24} />}
                  badge="Most played"
                  title="Play Ship or Skip"
                  body="Pick the right architecture for real product scenarios. No code. Scored and ranked."
                  cta="Play now"
                />
                <QuickCard
                  href="/pm/ai-native-foundations"
                  accent="accent"
                  icon={<BookOpen size={24} />}
                  badge="Free"
                  title="Read the 15 PM modules"
                  body="Tradeoff frameworks, key decisions, and the questions to ask your engineering team."
                  cta="Start with Becoming AI Native"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secondary row: Will AI Replace Me + Leaderboard, persona neutral */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <Link
              href="/assessment"
              className="group bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm text-text-primary font-bold">
                  Will AI Replace Me?
                </p>
                <p className="text-text-secondary text-xs">
                  3 minute assessment. No sign up. Personalized action plan.
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-accent group-hover:translate-x-1 transition-transform flex-shrink-0"
              />
            </Link>
            <a
              href="https://practice.learnagenticpatterns.com/leaderboard"
              className="group bg-surface border border-border rounded-xl p-5 hover:border-primary/50 transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Trophy size={18} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm text-text-primary font-bold">
                  See the leaderboard
                </p>
                <p className="text-text-secondary text-xs">
                  Live scores across all 4 games. Compare yourself.
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-primary group-hover:translate-x-1 transition-transform flex-shrink-0"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Curriculum preview (persona aware) */}
      <section id="curriculum" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Preview the curriculum"
            subtitle={
              persona === "dev"
                ? "3 of 21 developer patterns shown. Sign up free to unlock the rest."
                : "3 of 15 PM modules shown. Sign up free to unlock the rest."
            }
            decorator="$"
          />

          <AnimatePresence mode="wait">
            {persona === "dev" ? (
              <motion.div
                key="dev-curriculum"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {patterns.slice(0, 3).map((pattern, i) => (
                  <PatternCard key={pattern.id} pattern={pattern} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="pm-curriculum"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {pmModules.slice(0, 3).map((mod) => (
                  <PMModulePreviewCard key={mod.id} module={mod} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mt-10">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              {persona === "dev"
                ? "Unlock all 21 patterns. Free."
                : "Unlock all 15 PM modules. Free."}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PersonaTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-full font-mono text-sm transition-all ${
        active
          ? "bg-primary text-white shadow"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function QuickCard({
  href,
  external,
  accent,
  icon,
  badge,
  title,
  body,
  cta,
}: {
  href: string;
  external?: boolean;
  accent: "primary" | "accent";
  icon: React.ReactNode;
  badge: string;
  title: string;
  body: string;
  cta: string;
}) {
  const accentClasses =
    accent === "primary"
      ? {
          border: "border-primary/30 hover:border-primary/60 hover:shadow-primary/10",
          iconWrap: "bg-primary/10 border-primary/20 text-primary",
          badge: "text-primary bg-primary/10 border-primary/20",
          cta: "text-primary",
        }
      : {
          border: "border-accent/30 hover:border-accent/60 hover:shadow-accent/10",
          iconWrap: "bg-accent/10 border-accent/20 text-accent",
          badge: "text-accent bg-accent/10 border-accent/20",
          cta: "text-accent",
        };

  const content = (
    <div className="flex items-start gap-4">
      <div
        className={`w-12 h-12 border rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${accentClasses.iconWrap}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="font-mono text-base text-text-primary font-bold">
            {title}
          </h3>
          <span
            className={`font-mono text-[10px] border rounded-full px-2 py-0.5 uppercase tracking-wider ${accentClasses.badge}`}
          >
            {badge}
          </span>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
        <span
          className={`inline-flex items-center gap-1 font-sans font-semibold text-sm mt-3 group-hover:translate-x-1 transition-transform ${accentClasses.cta}`}
        >
          {cta} <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );

  const className = `group bg-surface border rounded-xl p-6 transition-all hover:shadow-xl ${accentClasses.border}`;

  if (external) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

function PMModulePreviewCard({
  module,
}: {
  module: (typeof pmModules)[number];
}) {
  return (
    <Link
      href={`/pm/${module.slug}`}
      className="group block bg-surface border border-border rounded-lg p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-accent text-sm font-bold">
          {String(module.number).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10px] text-accent border border-accent/30 bg-accent/5 rounded-full px-2 py-0.5 uppercase tracking-wider">
          PM
        </span>
      </div>
      <h3 className="font-mono text-text-primary font-bold text-lg mb-2 group-hover:text-accent transition-colors">
        {module.title}
      </h3>
      <p className="text-text-secondary text-sm leading-snug">
        {module.subtitle.replace(/\s*[—–-]\s+/g, ". ")}
      </p>
    </Link>
  );
}
