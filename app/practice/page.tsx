"use client";

import { motion } from "framer-motion";
import {
  Blocks, Briefcase, Trophy, ArrowRight, Zap,
  Bug, MessageSquare, TrendingDown, Target, BarChart3,
  GitBranch, Layers, RefreshCw, Wrench, Map, Users, Calendar,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import SkillRadar from "@/components/Labs/SkillRadar";

const MAIN = "https://learnagenticpatterns.com";

const stagger = {
  container: { transition: { staggerChildren: 0.08 } },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  },
};

const LAB_TYPES = [
  {
    icon: <Blocks size={20} />,
    name: "Build Lab",
    tier: "Apprentice",
    tierColor: "text-green-400 bg-green-500/10 border-green-500/20",
    description: "Drag-and-drop architecture building with real-time simulation.",
  },
  {
    icon: <Bug size={20} />,
    name: "Debug Lab",
    tier: "Practitioner",
    tierColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    description: "Fix broken pipelines. Diagnose missing components and wrong orders.",
  },
  {
    icon: <MessageSquare size={20} />,
    name: "Prompt Lab",
    tier: "Practitioner",
    tierColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    description: "Write real prompts, test against scenarios, get AI-graded feedback.",
  },
  {
    icon: <TrendingDown size={20} />,
    name: "Optimize Lab",
    tier: "Architect",
    tierColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    description: "Swap models and toggle optimizations to hit cost/quality/latency targets.",
  },
];

const FEATURED_PATTERNS = [
  { slug: "prompt-chaining", name: "Prompt Chaining", icon: <GitBranch size={16} /> },
  { slug: "routing", name: "Routing", icon: <GitBranch size={16} className="rotate-90" /> },
  { slug: "parallelization", name: "Parallelization", icon: <Layers size={16} /> },
  { slug: "reflection", name: "Reflection", icon: <RefreshCw size={16} /> },
  { slug: "tool-use", name: "Tool Use", icon: <Wrench size={16} /> },
  { slug: "planning", name: "Planning", icon: <Map size={16} /> },
  { slug: "multi-agent-collaboration", name: "Multi-Agent", icon: <Users size={16} /> },
];

/* ─── Dashboard for signed-in users ─── */
function PracticeDashboard() {
  const { user, gameScores, totalAttempts, avgPercent, userRank, leaderboard } = useAuth();
  const scores = gameScores ?? [];
  const passedCount = scores.filter((s) => s.passed).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-5 mb-10"
      >
        <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
          <span className="font-mono text-xl text-accent font-bold">
            {user!.firstName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Welcome back, {user!.firstName}
          </h1>
          <p className="text-text-secondary text-sm">
            Pick up where you left off or try something new.
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
      >
        {[
          { label: "Rank", value: userRank ? `#${userRank}` : "—", icon: Trophy, color: "text-yellow-400" },
          { label: "Avg Score", value: `${avgPercent ?? 0}%`, icon: Target, color: "text-primary" },
          { label: "Challenges", value: totalAttempts ?? 0, icon: Zap, color: "text-accent" },
          { label: "Passed", value: passedCount, icon: BarChart3, color: "text-success" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-xl p-4">
            <stat.icon size={16} className={`${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-text-primary font-mono">{stat.value}</p>
            <p className="font-mono text-xs text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Two-column: Quick actions + Skill radar */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {/* Quick actions */}
        <div className="space-y-4">
          <Link href="/practice/patterns" className="group block">
            <div className="bg-surface border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Blocks size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-text-primary font-bold text-sm group-hover:text-primary transition-colors">
                    Pattern Labs
                  </h3>
                  <p className="text-text-secondary text-xs">21 patterns &middot; 4 lab types</p>
                </div>
                <ArrowRight size={16} className="text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          <Link href="/practice/pm" className="group block">
            <div className="bg-surface border border-border rounded-xl p-5 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Briefcase size={20} className="text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-text-primary font-bold text-sm group-hover:text-accent transition-colors">
                    PM Decision Labs
                  </h3>
                  <p className="text-text-secondary text-xs">3 decision-making games</p>
                </div>
                <ArrowRight size={16} className="text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          <Link href="/practice/leaderboard" className="group block">
            <div className="bg-surface border border-border rounded-xl p-5 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Trophy size={20} className="text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-text-primary font-bold text-sm group-hover:text-yellow-400 transition-colors">
                    Leaderboard
                  </h3>
                  <p className="text-text-secondary text-xs">
                    {userRank ? `You're ranked #${userRank}` : "See top practitioners"}
                  </p>
                </div>
                <ArrowRight size={16} className="text-text-secondary group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          <Link href="/practice/profile" className="group block">
            <div className="bg-surface border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <BarChart3 size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-text-primary font-bold text-sm group-hover:text-primary transition-colors">
                    Your Profile
                  </h3>
                  <p className="text-text-secondary text-xs">Full stats &amp; activity history</p>
                </div>
                <ArrowRight size={16} className="text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        </div>

        {/* Skill radar */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            Skill Breakdown
          </h2>
          <SkillRadar scores={scores} />
        </div>
      </div>

      {/* Bottom row: Recent activity + Leaderboard preview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-accent" />
            Recent Activity
          </h2>
          {scores.length > 0 ? (
            <div className="space-y-2">
              {scores.slice(0, 6).map((s, i) => (
                <div key={`${s.pattern_slug}-${i}`} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-text-primary text-sm capitalize">
                    {s.pattern_slug.replace(/-/g, " ")}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-sm ${s.passed ? "text-success" : "text-red-400"}`}>
                      {s.score_max > 0 ? Math.round((s.score_total / s.score_max) * 100) : 0}%
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      s.passed ? "bg-success/10 text-success" : "bg-red-500/10 text-red-400"
                    }`}>
                      {s.passed ? "PASS" : "FAIL"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm text-center py-8">
              No challenges completed yet. Start practicing!
            </p>
          )}
        </div>

        {/* Leaderboard preview */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Trophy size={18} className="text-yellow-400" />
              Top Practitioners
            </h2>
            <Link
              href="/practice/leaderboard"
              className="text-primary font-mono text-xs hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight size={12} />
            </Link>
          </div>
          {leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div key={`${entry.first_name}-${i}`} className="flex items-center gap-4 px-3 py-2 rounded-lg bg-surface/50">
                  <span className="font-mono text-xs text-text-secondary w-6 text-center">{i + 1}</span>
                  <span className="text-text-primary text-sm flex-1">{entry.first_name}</span>
                  <span className="font-mono text-xs text-primary">{entry.avg_percent}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm text-center py-8">
              No scores yet. Be the first to compete!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Marketing landing for visitors ─── */
function MarketingLanding() {
  const { leaderboard } = useAuth();

  return (
    <div className="relative">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-mono text-xs border border-accent/20 mb-6">
            <Zap size={12} />
            4 Lab Types x 21 Patterns x 3 Difficulty Tiers
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 tracking-tight">
            Practice Agentic AI
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Build architectures, debug broken pipelines, write real prompts, and optimize costs.
            Go beyond reading — prove you can build.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href={`${MAIN}/signup?from=practice`}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-mono text-sm px-6 py-3 rounded-lg transition-colors"
            >
              Sign Up Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/practice/patterns"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-mono text-sm px-6 py-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              Browse Challenges
            </Link>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-8 mt-12 flex-wrap"
        >
          {[
            { label: "Patterns", value: "21" },
            { label: "Lab Types", value: "4" },
            { label: "Difficulty Tiers", value: "3" },
            { label: "AI-Graded", value: "Yes" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-primary font-mono">{stat.value}</p>
              <p className="text-text-secondary text-xs font-mono">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Two Tracks */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pattern Labs card */}
          <Link href="/practice/patterns" className="group block">
            <div className="h-full bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Blocks size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                    Pattern Labs
                  </h2>
                  <p className="text-text-secondary text-xs">Developer Track</p>
                </div>
              </div>
              <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                21 agentic design patterns, each with 4 lab types: Build, Debug, Prompt, and Optimize.
                Three difficulty tiers from Apprentice to Architect.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {FEATURED_PATTERNS.slice(0, 4).map((p) => (
                  <span key={p.slug} className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/5 text-primary text-xs font-mono border border-primary/10">
                    {p.icon}
                    {p.name}
                  </span>
                ))}
                <span className="px-2 py-1 text-text-secondary/50 text-xs font-mono">+17 more</span>
              </div>
              <div className="flex items-center gap-2 text-primary font-mono text-sm">
                Explore Patterns
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* PM Labs card */}
          <Link href="/practice/pm" className="group block">
            <div className="h-full bg-surface border border-border rounded-2xl p-6 hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Briefcase size={24} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors">
                    PM Decision Labs
                  </h2>
                  <p className="text-text-secondary text-xs">Product Manager Track</p>
                </div>
              </div>
              <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                3 decision-making games that test your ability to make ship-or-skip calls,
                allocate budgets, and navigate stakeholder disagreements.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { icon: <Target size={12} />, name: "Ship or Skip" },
                  { icon: <TrendingDown size={12} />, name: "Budget Builder" },
                  { icon: <Users size={12} />, name: "Stakeholder Sim" },
                ].map((g) => (
                  <span key={g.name} className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent/5 text-accent text-xs font-mono border border-accent/10">
                    {g.icon}
                    {g.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-accent font-mono text-sm">
                Explore PM Labs
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Lab Types showcase */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
          4 Ways to Practice Each Pattern
        </h2>
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {LAB_TYPES.map((lab) => (
            <motion.div key={lab.name} variants={stagger.item}>
              <div className="bg-surface border border-border rounded-xl p-5 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-primary">{lab.icon}</div>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider border ${lab.tierColor}`}>
                    {lab.tier}
                  </span>
                </div>
                <h3 className="text-text-primary font-bold text-sm mb-2">{lab.name}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{lab.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Leaderboard preview */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Trophy size={20} className="text-yellow-400" />
              Top Practitioners
            </h2>
            <Link
              href="/practice/leaderboard"
              className="text-primary font-mono text-xs hover:underline flex items-center gap-1"
            >
              Full Leaderboard
              <ArrowRight size={12} />
            </Link>
          </div>
          {leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div key={`${entry.first_name}-${i}`} className="flex items-center gap-4 px-3 py-2 rounded-lg bg-surface/50">
                  <span className="font-mono text-xs text-text-secondary w-6 text-center">{i + 1}</span>
                  <span className="text-text-primary text-sm flex-1">{entry.first_name}</span>
                  <span className="font-mono text-xs text-primary">{entry.avg_percent}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm text-center py-8">
              No scores yet. Be the first to compete!
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Stop reading. Start building.
        </h2>
        <p className="text-text-secondary mb-6 max-w-lg mx-auto">
          Every challenge mirrors real AI engineering work. Build architectures, write prompts, optimize pipelines.
        </p>
        <Link
          href={`${MAIN}/signup?from=practice`}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-mono text-sm px-8 py-3 rounded-lg transition-colors"
        >
          Sign Up Free
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}

/* ─── Page entry: show dashboard or marketing landing ─── */
export default function PracticeLanding() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <PracticeDashboard />;
  return <MarketingLanding />;
}
