"use client";

import { motion } from "framer-motion";
import { User, Trophy, Zap, Target, BarChart3, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SkillRadar from "@/components/Labs/SkillRadar";
import Link from "next/link";

export default function ProfilePage() {
  const { user, gameScores, totalAttempts, avgPercent, userRank } = useAuth();

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <User size={40} className="mx-auto mb-4 text-text-secondary/30" />
        <h2 className="text-xl font-bold text-text-primary mb-2">Sign in to view your profile</h2>
        <p className="text-text-secondary mb-6">Track your progress across all challenges.</p>
        <Link
          href="https://learnagenticpatterns.com/login?from=practice"
          className="inline-block bg-accent hover:bg-accent/90 text-white font-mono text-sm px-6 py-2.5 rounded-lg transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  const scores = gameScores ?? [];
  const passedCount = scores.filter((s: { passed: boolean }) => s.passed).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start gap-6 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
          <span className="font-mono text-2xl text-accent font-bold">
            {user.firstName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{user.firstName}</h1>
          <p className="text-text-secondary text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Rank", value: userRank ? `#${userRank}` : "—", icon: Trophy, color: "text-yellow-400" },
          { label: "Avg Score", value: `${avgPercent ?? 0}%`, icon: Target, color: "text-primary" },
          { label: "Challenges", value: totalAttempts ?? 0, icon: Zap, color: "text-accent" },
          { label: "Passed", value: passedCount, icon: BarChart3, color: "text-success" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-xl p-4"
          >
            <stat.icon size={16} className={`${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="font-mono text-xs text-text-secondary">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Skill Radar */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-primary" />
          Skill Breakdown
        </h2>
        <SkillRadar scores={scores} />
      </div>

      {/* Recent scores */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-accent" />
          Recent Activity
        </h2>
        {scores.length > 0 ? (
          <div className="space-y-2">
            {scores.slice(0, 10).map((s: { pattern_slug: string; score_total: number; score_max: number; passed: boolean; played_at: string }, i: number) => (
              <div key={`${s.pattern_slug}-${i}`} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <span className="text-text-primary text-sm capitalize">
                    {s.pattern_slug.replace(/-/g, " ")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-sm ${s.passed ? "text-success" : "text-red-400"}`}>
                    {Math.round((s.score_total / s.score_max) * 100)}%
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
    </div>
  );
}
