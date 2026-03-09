"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Trophy,
  Medal,
  Gamepad2,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import PatternCard from "@/components/PatternCard";
import PMModuleCard from "@/components/PMModuleCard";
import ProgressCircle from "@/components/ProgressCircle";
import { patterns } from "@/data/patterns";
import { pmModules } from "@/data/pm-curriculum";
import type { PatternScore, LeaderboardEntry } from "@/contexts/AuthContext";

interface HomeDashboardProps {
  user: { id: number; email: string; firstName: string; role: string };
  readSlugs: string[];
  isProductManager: boolean;
  pmReadSlugs: string[];
  pmProgressPercent: number;
  gameScores: PatternScore[];
  totalAttempts: number;
  avgPercent: number;
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
}

// ─── Game Stats Section ─────────────────────────────────────
function GameStats({
  scores,
  totalAttempts,
  avgPercent,
  leaderboard,
  userRank,
  firstName,
}: {
  scores: PatternScore[];
  totalAttempts: number;
  avgPercent: number;
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  firstName: string;
}) {
  if (totalAttempts === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Agent Builder Scores"
            subtitle="Play the Build game on any pattern page to see your scores here."
            decorator="▶"
          />
          <div className="bg-surface border border-border rounded-xl p-10 text-center">
            <Gamepad2
              size={48}
              className="text-text-secondary/30 mx-auto mb-4"
            />
            <p className="text-text-secondary font-mono text-sm">
              No games played yet. Head to any pattern and try the{" "}
              <span className="text-accent font-bold">Build</span> tab!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const patternLookup = new Map(patterns.map((p) => [p.slug, p]));

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Agent Builder Scores"
          subtitle={`${totalAttempts} game${totalAttempts === 1 ? "" : "s"} played across ${scores.length} pattern${scores.length === 1 ? "" : "s"}.`}
          decorator="▶"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Avg Score",
              value: `${avgPercent}%`,
              accent: avgPercent >= 60,
            },
            {
              label: "Patterns Played",
              value: `${scores.length}/21`,
              accent: false,
            },
            {
              label: "Total Attempts",
              value: String(totalAttempts),
              accent: false,
            },
            {
              label: "Your Rank",
              value: userRank ? `#${userRank}` : "—",
              accent: userRank === 1,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-surface border rounded-lg p-4 text-center ${
                stat.accent ? "border-success/30" : "border-border"
              }`}
            >
              <p
                className={`font-mono text-2xl font-bold ${stat.accent ? "text-success" : "text-text-primary"}`}
              >
                {stat.value}
              </p>
              <p className="text-text-secondary text-xs font-mono mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
            <h3 className="font-mono text-sm text-text-secondary mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-primary" />
              Best Scores by Pattern
            </h3>
            <div className="space-y-2">
              {scores.map((s, i) => {
                const percent = Math.round(
                  (s.score_total / s.score_max) * 100,
                );
                const pattern = patternLookup.get(s.pattern_slug);
                const name = pattern
                  ? `${String(pattern.number).padStart(2, "0")}. ${pattern.name}`
                  : s.pattern_slug;

                return (
                  <motion.div
                    key={s.pattern_slug}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={`/patterns/${s.pattern_slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-code-bg transition-colors group"
                    >
                      <span
                        className={`font-mono text-lg font-bold w-12 text-right ${
                          percent === 100
                            ? "text-success"
                            : percent >= 60
                              ? "text-primary"
                              : "text-red-400"
                        }`}
                      >
                        {percent}%
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="h-2 bg-code-bg rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              percent === 100
                                ? "bg-success"
                                : percent >= 60
                                  ? "bg-primary"
                                  : "bg-red-400"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.6, delay: i * 0.04 }}
                          />
                        </div>
                        <p className="text-text-secondary text-xs font-mono mt-1 truncate group-hover:text-primary transition-colors">
                          {name}
                        </p>
                      </div>
                      {s.passed && (
                        <span className="text-success text-xs font-mono">
                          PASS
                        </span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-mono text-sm text-text-secondary mb-4 flex items-center gap-2">
              <Medal size={14} className="text-accent" />
              Leaderboard
            </h3>
            <div className="space-y-1">
              {leaderboard.map((entry, i) => {
                const isYou = entry.first_name === firstName;
                return (
                  <motion.div
                    key={`${entry.first_name}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                      isYou ? "bg-primary/10 border border-primary/20" : ""
                    }`}
                  >
                    <span
                      className={`font-mono text-sm font-bold w-6 text-right ${
                        i === 0
                          ? "text-yellow-400"
                          : i === 1
                            ? "text-gray-300"
                            : i === 2
                              ? "text-amber-600"
                              : "text-text-secondary"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-sm flex-1 truncate ${isYou ? "text-primary font-bold" : "text-text-primary"}`}
                    >
                      {entry.first_name}
                      {isYou ? " (you)" : ""}
                    </span>
                    <span className="font-mono text-xs text-text-secondary">
                      {entry.games_played} game
                      {entry.games_played === 1 ? "" : "s"}
                    </span>
                    <span
                      className={`font-mono text-sm font-bold ${
                        entry.avg_percent >= 80
                          ? "text-success"
                          : entry.avg_percent >= 60
                            ? "text-primary"
                            : "text-red-400"
                      }`}
                    >
                      {entry.avg_percent}%
                    </span>
                  </motion.div>
                );
              })}
              {leaderboard.length === 0 && (
                <p className="text-text-secondary/50 text-xs font-mono text-center py-6">
                  No players yet. Be the first!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PM Game Stats Section ──────────────────────────────────
const PM_GAME_LABELS: Record<string, string> = {
  "pm-ship-or-skip": "Ship or Skip",
  "pm-budget-builder": "Budget Builder",
  "pm-stakeholder-sim": "Stakeholder Simulator",
};

function PMGameStats({
  scores,
}: {
  scores: PatternScore[];
  totalAttempts: number;
}) {
  const pmScores = scores.filter((s) => s.pattern_slug.startsWith("pm-"));
  const pmAttempts = pmScores.length;

  if (pmAttempts === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Decision Game Scores"
            subtitle="Play Ship or Skip or Budget Builder inside any module to see your scores here."
            decorator="▶"
          />
          <div className="bg-surface border border-border rounded-xl p-10 text-center">
            <Gamepad2
              size={48}
              className="text-text-secondary/30 mx-auto mb-4"
            />
            <p className="text-text-secondary font-mono text-sm">
              No games played yet. Open any module and try the{" "}
              <span className="text-accent font-bold">decision games</span>!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const avgPercent = Math.round(
    pmScores.reduce(
      (sum, s) =>
        sum + (s.score_max > 0 ? (s.score_total / s.score_max) * 100 : 0),
      0,
    ) / pmScores.length,
  );

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Decision Game Scores"
          subtitle={`${pmScores.length} game${pmScores.length === 1 ? "" : "s"} played. Keep sharpening your product instincts!`}
          decorator="▶"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Avg Score",
              value: `${avgPercent}%`,
              accent: avgPercent >= 60,
            },
            {
              label: "Games Played",
              value: `${pmScores.length}/3`,
              accent: false,
            },
            {
              label: "Best Score",
              value: `${Math.max(...pmScores.map((s) => Math.round((s.score_total / s.score_max) * 100)))}%`,
              accent: true,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-surface border rounded-lg p-4 text-center ${
                stat.accent ? "border-accent/30" : "border-border"
              }`}
            >
              <p
                className={`font-mono text-2xl font-bold ${stat.accent ? "text-accent" : "text-text-primary"}`}
              >
                {stat.value}
              </p>
              <p className="text-text-secondary text-xs font-mono mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-mono text-sm text-text-secondary mb-4 flex items-center gap-2">
            <Trophy size={14} className="text-accent" />
            Best Scores by Game
          </h3>
          <div className="space-y-2">
            {pmScores.map((s, i) => {
              const percent = Math.round(
                (s.score_total / s.score_max) * 100,
              );
              const name = PM_GAME_LABELS[s.pattern_slug] ?? s.pattern_slug;

              return (
                <motion.div
                  key={s.pattern_slug}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-code-bg transition-colors"
                >
                  <span
                    className={`font-mono text-lg font-bold w-12 text-right ${
                      percent === 100
                        ? "text-success"
                        : percent >= 60
                          ? "text-accent"
                          : "text-red-400"
                    }`}
                  >
                    {percent}%
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="h-2 bg-code-bg rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          percent === 100
                            ? "bg-success"
                            : percent >= 60
                              ? "bg-accent"
                              : "bg-red-400"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6, delay: i * 0.04 }}
                      />
                    </div>
                    <p className="text-text-secondary text-xs font-mono mt-1 truncate">
                      {name}
                    </p>
                  </div>
                  {s.passed && (
                    <span className="text-success text-xs font-mono">
                      PASS
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Dashboard Component ───────────────────────────────
export default function HomeDashboard({
  user,
  readSlugs,
  isProductManager,
  pmReadSlugs,
  pmProgressPercent,
  gameScores,
  totalAttempts,
  avgPercent,
  leaderboard,
  userRank,
}: HomeDashboardProps) {
  const nextUnread = patterns.find((p) => !readSlugs.includes(p.slug));
  const nextUnreadPM = pmModules.find((m) => !pmReadSlugs.includes(m.slug));

  return (
    <main className="relative z-10">
      {/* Dashboard Hero */}
      <section className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            <div className="flex-1">
              <span className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1 mb-4">
                {isProductManager ? "Product Manager Track" : "Welcome back"}
              </span>
              <h1 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-4">
                {isProductManager ? (
                  <>
                    Your AI playbook,{" "}
                    <span className="text-gradient">{user.firstName}.</span>
                  </>
                ) : (
                  <>
                    Keep going,{" "}
                    <span className="text-gradient">{user.firstName}.</span>
                  </>
                )}
              </h1>

              {isProductManager ? (
                pmReadSlugs.length === 0 ? (
                  <p className="text-text-secondary text-lg mb-8 max-w-lg">
                    {pmModules.length} modules covering everything you need to make smart
                    product decisions about agentic AI — no code required.
                    Click any module below to dive in.
                  </p>
                ) : pmReadSlugs.length === pmModules.length ? (
                  <p className="text-text-secondary text-lg mb-8 max-w-lg">
                    You&apos;ve completed all {pmModules.length} modules. Revisit any module
                    to refresh your understanding.
                  </p>
                ) : (
                  <p className="text-text-secondary text-lg mb-8 max-w-lg">
                    You&apos;ve completed{" "}
                    <span className="text-primary font-mono font-bold">
                      {pmReadSlugs.length}
                    </span>{" "}
                    of {pmModules.length} modules. Pick up where you left off.
                  </p>
                )
              ) : readSlugs.length === 0 ? (
                <p className="text-text-secondary text-lg mb-8 max-w-lg">
                  You have all 21 patterns unlocked. Pick one below and start
                  building your agentic architecture mental model.
                </p>
              ) : readSlugs.length === patterns.length ? (
                <p className="text-text-secondary text-lg mb-8 max-w-lg">
                  You&apos;ve read all 21 patterns. Revisit any pattern to
                  refresh your understanding.
                </p>
              ) : (
                <p className="text-text-secondary text-lg mb-8 max-w-lg">
                  You&apos;ve completed{" "}
                  <span className="text-primary font-mono font-bold">
                    {readSlugs.length}
                  </span>{" "}
                  of 21 patterns. Pick up where you left off.
                </p>
              )}

              {isProductManager ? (
                nextUnreadPM ? (
                  <Link
                    href={`/pm/${nextUnreadPM.slug}`}
                    className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                  >
                    <Briefcase size={18} />
                    {pmReadSlugs.length === 0
                      ? "Start Module 01"
                      : `Continue: Module ${String(nextUnreadPM.number).padStart(2, "0")} · ${nextUnreadPM.title}`}
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <a
                    href="#pm-curriculum"
                    className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                  >
                    <Briefcase size={18} />
                    Review Modules
                    <ArrowRight size={18} />
                  </a>
                )
              ) : (
                nextUnread && (
                  <Link
                    href={`/patterns/${nextUnread.slug}`}
                    className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                  >
                    <BookOpen size={18} />
                    Continue: Pattern{" "}
                    {String(nextUnread.number).padStart(2, "0")} ·{" "}
                    {nextUnread.name}
                    <ArrowRight size={18} />
                  </Link>
                )
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isProductManager ? (
                <div className="relative w-44 h-44">
                  <svg viewBox="0 0 160 160" className="w-full h-full">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-border"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="text-accent"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 70 * (1 - pmProgressPercent / 100),
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      transform="rotate(-90 80 80)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-3xl text-accent font-bold">
                      {pmProgressPercent}%
                    </span>
                    <span className="text-text-secondary text-[10px] font-mono">
                      {pmReadSlugs.length}/{pmModules.length}
                    </span>
                  </div>
                </div>
              ) : (
                <ProgressCircle size={180} strokeWidth={12} />
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {isProductManager ? (
        <PMGameStats scores={gameScores} totalAttempts={totalAttempts} />
      ) : (
        <GameStats
          scores={gameScores}
          totalAttempts={totalAttempts}
          avgPercent={avgPercent}
          leaderboard={leaderboard}
          userRank={userRank}
          firstName={user.firstName}
        />
      )}

      {isProductManager && (
        <section id="pm-curriculum" className="py-16 bg-surface/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Your PM Curriculum"
              subtitle={
                pmReadSlugs.length === 0
                  ? `${pmModules.length} modules unlocked. Click any module to dive in and play the decision games.`
                  : `${pmReadSlugs.length} of ${pmModules.length} modules completed. Modules you've read are marked with a checkmark.`
              }
              decorator="PM"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pmModules.map((mod, i) => (
                <PMModuleCard key={mod.id} module={mod} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {!isProductManager && (
        <section id="curriculum" className="py-16 bg-surface/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Your Curriculum"
              subtitle="All 21 patterns unlocked. Patterns you've read are marked with a checkmark."
              decorator="$"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {patterns.map((pattern, i) => (
                <PatternCard key={pattern.id} pattern={pattern} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
