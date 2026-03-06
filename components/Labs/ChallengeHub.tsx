"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Blocks, Bug, MessageSquare, TrendingDown,
  ArrowLeft, Lock, CheckCircle2, ArrowRight,
} from "lucide-react";
import { getPatternBySlug } from "@/data/patterns";
import { hasGameConfig, getGameConfig } from "@/data/games";
import { hasPromptLabConfig } from "@/data/prompt-labs";
import { hasOptimizeLabConfig } from "@/data/optimize-labs";
import { useAuth } from "@/contexts/AuthContext";
import TierBadge from "./TierBadge";
import type { Tier } from "./TierBadge";

interface ChallengeHubProps {
  patternSlug: string;
}

interface LabCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tier: Tier;
  href: string;
  isAvailable: boolean;
  labType: string;
}

export default function ChallengeHub({ patternSlug }: ChallengeHubProps) {
  const pattern = getPatternBySlug(patternSlug);
  const { user, gameScores } = useAuth();

  if (!pattern) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary font-mono">Pattern not found.</p>
        <Link href="/practice/patterns" className="text-primary font-mono text-sm mt-4 inline-block hover:underline">
          Back to Patterns
        </Link>
      </div>
    );
  }

  const scores = (gameScores ?? []) as Array<{ pattern_slug: string; score_total: number; score_max: number; passed: boolean }>;
  const patternScores = scores.filter((s) => s.pattern_slug === patternSlug);
  const bestScore = patternScores.length > 0
    ? patternScores.reduce((best, s) => (s.score_total > best.score_total ? s : best))
    : null;
  const buildPct = bestScore ? Math.round((bestScore.score_total / bestScore.score_max) * 100) : 0;

  // Tier unlocking: Practitioner unlocks at 70% on Build, Architect at 70% on any Practitioner lab
  const practitionerUnlocked = buildPct >= 70;
  const architectUnlocked = practitionerUnlocked; // simplified: unlock architect when practitioner is unlocked

  const gameConfig = getGameConfig(patternSlug);
  const hasDebug = gameConfig?.debugChallenges && gameConfig.debugChallenges.length > 0;

  const labs: LabCard[] = [];

  if (hasGameConfig(patternSlug)) {
    labs.push({
      id: "build",
      name: "Build Lab",
      description: "Drag and drop agent blocks to build the correct architecture. Learn what components are needed and how they connect.",
      icon: <Blocks size={22} className="text-green-400" />,
      tier: "apprentice",
      href: `/practice/patterns/${patternSlug}/build`,
      isAvailable: true,
      labType: "build",
    });
  }

  if (hasDebug) {
    labs.push({
      id: "debug",
      name: "Debug Lab",
      description: "A broken pipeline is given to you. Diagnose the bugs — missing components, wrong order, unnecessary blocks — and fix it.",
      icon: <Bug size={22} className="text-red-400" />,
      tier: "practitioner",
      href: `/practice/patterns/${patternSlug}/debug`,
      isAvailable: practitionerUnlocked,
      labType: "debug",
    });
  }

  if (hasPromptLabConfig(patternSlug)) {
    labs.push({
      id: "prompt",
      name: "Prompt Lab",
      description: "Write the actual system prompt for an agent in this pattern. Your prompt is tested against real scenarios and graded by AI.",
      icon: <MessageSquare size={22} className="text-blue-400" />,
      tier: "practitioner",
      href: `/practice/patterns/${patternSlug}/prompt`,
      isAvailable: practitionerUnlocked,
      labType: "prompt",
    });
  }

  if (hasOptimizeLabConfig(patternSlug)) {
    labs.push({
      id: "optimize",
      name: "Optimize Lab",
      description: "The pipeline works but it's expensive. Swap models, toggle optimizations, and hit cost/quality/latency targets.",
      icon: <TrendingDown size={22} className="text-purple-400" />,
      tier: "architect",
      href: `/practice/patterns/${patternSlug}/optimize`,
      isAvailable: architectUnlocked,
      labType: "optimize",
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/practice/patterns"
        className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent font-mono text-xs mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        All Patterns
      </Link>

      {/* Pattern header */}
      <div className="mb-8">
        <span className="font-mono text-xs text-text-secondary">
          Pattern #{String(pattern.number).padStart(2, "0")}
        </span>
        <h1 className="text-3xl font-bold text-text-primary mt-1 mb-2">{pattern.name}</h1>
        <p className="text-text-secondary max-w-2xl text-sm leading-relaxed">
          {pattern.description}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <span className="font-mono text-xs text-text-secondary">
            SWE Parallel: <span className="text-primary">{pattern.sweParallel}</span>
          </span>
          {bestScore && (
            <span className={`font-mono text-xs ${bestScore.passed ? "text-success" : "text-accent"}`}>
              Best: {buildPct}%
            </span>
          )}
        </div>
      </div>

      {/* Tier progression bar */}
      <div className="flex items-center gap-2 mb-8 p-3 bg-surface/50 border border-border rounded-lg">
        <TierBadge tier="apprentice" size="md" />
        <div className={`flex-1 h-0.5 ${practitionerUnlocked ? "bg-blue-400" : "bg-border"}`} />
        <TierBadge tier="practitioner" locked={!practitionerUnlocked} size="md" />
        <div className={`flex-1 h-0.5 ${architectUnlocked ? "bg-purple-400" : "bg-border"}`} />
        <TierBadge tier="architect" locked={!architectUnlocked} size="md" />
      </div>

      {/* Lab cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {labs.map((lab, i) => (
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
          >
            {lab.isAvailable ? (
              <Link href={lab.href} className="group block h-full">
                <div className="relative h-full bg-surface border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start justify-between mb-3">
                    {lab.icon}
                    <TierBadge tier={lab.tier} />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {lab.name}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">{lab.description}</p>
                  <div className="flex items-center justify-end">
                    <ArrowRight size={16} className="text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="relative h-full bg-surface/50 border border-border/50 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="opacity-30">{lab.icon}</div>
                  <TierBadge tier={lab.tier} locked />
                </div>
                <h3 className="text-lg font-bold text-text-secondary/50 mb-2">{lab.name}</h3>
                <p className="text-text-secondary/40 text-sm leading-relaxed mb-4">{lab.description}</p>
                <div className="flex items-center gap-2 text-text-secondary/40 font-mono text-xs">
                  <Lock size={12} />
                  {lab.tier === "practitioner"
                    ? "Score 70%+ on Build Lab to unlock"
                    : "Score 70%+ on a Practitioner lab to unlock"}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Cross-link to learning content */}
      <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <p className="text-text-secondary text-sm">
          Need a refresher?{" "}
          <a
            href={`https://learnagenticpatterns.com/patterns/${patternSlug}`}
            className="text-primary hover:underline"
          >
            Read the {pattern.name} pattern guide →
          </a>
        </p>
      </div>
    </div>
  );
}
