"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  GitBranch, Layers, RefreshCw, Wrench, Map, Users, Brain,
  BarChart3, Blocks, Shield, Zap, ArrowRight, Lock,
} from "lucide-react";
import { patterns } from "@/data/patterns";
import { hasGameConfig } from "@/data/games";
import { hasPromptLabConfig } from "@/data/prompt-labs";
import { hasOptimizeLabConfig } from "@/data/optimize-labs";
import { useAuth } from "@/contexts/AuthContext";
import ProgressRing from "./ProgressRing";

const ICON_MAP: Record<string, React.ReactNode> = {
  "prompt-chaining": <GitBranch size={18} />,
  routing: <GitBranch size={18} className="rotate-90" />,
  parallelization: <Layers size={18} />,
  reflection: <RefreshCw size={18} />,
  "tool-use": <Wrench size={18} />,
  planning: <Map size={18} />,
  "multi-agent-collaboration": <Users size={18} />,
  "memory-management": <Brain size={18} />,
  "learning-adaptation": <BarChart3 size={18} />,
  "state-management-mcp": <Blocks size={18} />,
  "goal-setting-monitoring": <BarChart3 size={18} />,
  "exception-handling-recovery": <Shield size={18} />,
  "human-in-the-loop": <Users size={18} />,
  "knowledge-retrieval-rag": <Brain size={18} />,
  "inter-agent-communication": <GitBranch size={18} />,
  "resource-aware-optimization": <Zap size={18} />,
  "reasoning-techniques": <Brain size={18} />,
  "guardrails-safety": <Shield size={18} />,
  "evaluation-monitoring": <BarChart3 size={18} />,
  prioritization: <Layers size={18} />,
  "exploration-discovery": <Map size={18} />,
};

const stagger = {
  container: { transition: { staggerChildren: 0.04 } },
  item: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  },
};

export default function PatternChallengeGrid() {
  const { user, gameScores } = useAuth();
  const scores = (gameScores ?? []) as Array<{ pattern_slug: string; score_total: number; score_max: number; passed: boolean }>;

  const getBestScore = (slug: string) => {
    const matching = scores.filter((s) => s.pattern_slug === slug);
    if (matching.length === 0) return null;
    return matching.reduce((best, s) =>
      s.score_total > best.score_total ? s : best
    );
  };

  const getLabCount = (slug: string) => {
    let count = 0;
    if (hasGameConfig(slug)) count++;
    if (hasGameConfig(slug)) count++; // debug uses same config
    if (hasPromptLabConfig(slug)) count++;
    if (hasOptimizeLabConfig(slug)) count++;
    return count;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Blocks size={20} className="text-primary" />
          <span className="font-mono text-xs text-primary uppercase tracking-wider">Pattern Labs</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">21 Agentic Design Patterns</h1>
        <p className="text-text-secondary max-w-2xl">
          Each pattern has up to 4 challenge types across 3 difficulty tiers.
          Build architectures, debug broken pipelines, write prompts, and optimize costs.
        </p>
      </div>

      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="visible"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {patterns.map((pattern) => {
          const best = getBestScore(pattern.slug);
          const progress = best ? Math.round((best.score_total / best.score_max) * 100) : 0;
          const labCount = getLabCount(pattern.slug);
          const isLocked = !pattern.isUnlocked && !user;

          return (
            <motion.div key={pattern.slug} variants={stagger.item}>
              <Link
                href={isLocked ? "https://learnagenticpatterns.com/signup" : `/practice/patterns/${pattern.slug}`}
                className="group block"
              >
                <div className={`relative bg-surface border rounded-xl p-4 transition-all duration-300 ${
                  isLocked
                    ? "border-border/50 opacity-60"
                    : "border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        {ICON_MAP[pattern.slug] ?? <Blocks size={18} />}
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-text-secondary">
                          #{String(pattern.number).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <ProgressRing progress={progress} size={36} strokeWidth={3} />
                      <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-text-secondary">
                        {progress > 0 ? `${progress}` : ""}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">
                    {pattern.name}
                  </h3>
                  <p className="text-text-secondary text-xs line-clamp-2 mb-3 leading-relaxed">
                    {pattern.description.slice(0, 100)}...
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-text-secondary">
                      {labCount} labs
                    </span>
                    {best?.passed ? (
                      <span className="text-[10px] font-mono text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20">
                        PASSED
                      </span>
                    ) : (
                      <ArrowRight size={14} className="text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    )}
                  </div>

                  {isLocked && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                      <div className="flex items-center gap-1.5 text-text-secondary/60 font-mono text-xs">
                        <Lock size={12} />
                        Sign up
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
