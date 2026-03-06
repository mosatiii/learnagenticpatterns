"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, ArrowRight, RotateCcw, Trophy,
  CheckCircle2, XCircle, Target, Lightbulb,
  AlertTriangle, Crown, Timer,
} from "lucide-react";
import { stakeholderRounds } from "@/data/pm-games";
import type { Stakeholder } from "@/data/pm-games";
import { useAuth } from "@/contexts/AuthContext";
import { trackGameEvent } from "@/lib/game/analytics";

type Phase = "choosing" | "feedback" | "summary";

interface RoundResult {
  roundId: string;
  chosenId: string;
  correct: boolean;
  timeMs: number;
  category: string;
}

const ROLE_COLORS: Record<string, string> = {
  "Engineering Lead": "border-primary/30 bg-primary/5",
  "VP of Sales": "border-accent/30 bg-accent/5",
  "CEO": "border-red-500/30 bg-red-500/5",
  "CFO": "border-success/30 bg-success/5",
  "General Counsel": "border-red-500/30 bg-red-500/5",
  "Data Team Lead": "border-primary/30 bg-primary/5",
};

const ROLE_ICONS: Record<string, string> = {
  "Engineering Lead": "🛠",
  "VP of Sales": "📈",
  "CEO": "👔",
  "CFO": "💰",
  "General Counsel": "⚖️",
  "Data Team Lead": "📊",
};

export default function StakeholderSimulator() {
  const { saveGameScore } = useAuth();
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("choosing");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [scoreSaved, setScoreSaved] = useState(false);
  const roundStartRef = useRef(Date.now());

  const round = stakeholderRounds[currentRound];
  const totalRounds = stakeholderRounds.length;

  useEffect(() => {
    trackGameEvent("pm_ss_started", { total_rounds: totalRounds });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    roundStartRef.current = Date.now();
  }, [currentRound]);

  const handleSelect = useCallback((stakeholderId: string) => {
    if (phase !== "choosing") return;
    const elapsed = Date.now() - roundStartRef.current;
    const stakeholder = round.stakeholders.find((s) => s.id === stakeholderId);
    const correct = stakeholder?.isOptimal ?? false;

    setSelectedId(stakeholderId);
    setResults((prev) => [
      ...prev,
      {
        roundId: round.id,
        chosenId: stakeholderId,
        correct,
        timeMs: elapsed,
        category: round.category,
      },
    ]);

    trackGameEvent("pm_ss_round_answered", {
      round_id: round.id,
      round_index: currentRound,
      chosen_id: stakeholderId,
      is_correct: correct,
      time_to_answer_ms: elapsed,
      category: round.category,
    });

    setPhase("feedback");
  }, [phase, round, currentRound]);

  const handleNext = useCallback(() => {
    if (currentRound + 1 >= totalRounds) {
      setPhase("summary");
    } else {
      setCurrentRound((prev) => prev + 1);
      setSelectedId(null);
      setPhase("choosing");
    }
  }, [currentRound, totalRounds]);

  const handleReset = useCallback(() => {
    trackGameEvent("pm_ss_retry", {
      previous_score: results.length > 0
        ? Math.round((results.filter((r) => r.correct).length / results.length) * 100)
        : 0,
    });
    setCurrentRound(0);
    setPhase("choosing");
    setSelectedId(null);
    setResults([]);
    setScoreSaved(false);
  }, [results]);

  const correctCount = results.filter((r) => r.correct).length;
  const scoreTotal = correctCount * 20;
  const scoreMax = totalRounds * 20;
  const percent = Math.round((scoreTotal / scoreMax) * 100);
  const passed = percent >= 60;
  const isDiplomatic = correctCount >= 4;

  if (phase === "summary" && !scoreSaved) {
    setScoreSaved(true);

    const avgTimeMs = results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.timeMs, 0) / results.length)
      : 0;

    trackGameEvent("pm_ss_completed", {
      score_percent: percent,
      correct_count: correctCount,
      total_rounds: totalRounds,
      passed,
      diplomatic_leader: isDiplomatic,
      avg_time_ms: avgTimeMs,
    });

    saveGameScore({
      patternSlug: "pm-stakeholder-sim",
      scoreTotal,
      scoreMax,
      architecture: correctCount * 8,
      resilience: correctCount * 6,
      efficiency: correctCount * 6,
      passed,
    });
  }

  // ─── Summary View ───
  if (phase === "summary") {
    const avgTimeMs = results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.timeMs, 0) / results.length)
      : 0;

    const categoryMap = new Map<string, { correct: number; total: number }>();
    for (const r of results) {
      const cat = categoryMap.get(r.category) || { correct: 0, total: 0 };
      cat.total++;
      if (r.correct) cat.correct++;
      categoryMap.set(r.category, cat);
    }

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`bg-surface border rounded-xl p-6 text-center ${
            passed ? "border-success/30" : "border-red-500/30"
          }`}
        >
          <Trophy size={48} className={`mx-auto mb-3 ${passed ? "text-success" : "text-red-400"}`} />
          <p className={`font-mono text-4xl font-bold mb-1 ${passed ? "text-success" : "text-red-400"}`}>
            {percent}%
          </p>
          <p className="text-text-secondary text-sm font-mono">
            {correctCount} / {totalRounds} optimal decisions
          </p>

          {isDiplomatic && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/30 rounded-full px-3 py-1 mt-4"
            >
              <Crown size={14} className="text-accent" />
              <span className="font-mono text-xs text-accent font-bold">Diplomatic Leader</span>
            </motion.div>
          )}

          <p className={`mt-3 text-sm ${passed ? "text-success/80" : "text-text-secondary"}`}>
            {isDiplomatic
              ? "Outstanding stakeholder management — you balanced competing priorities with clarity."
              : passed
                ? "Good strategic judgment. You can navigate most stakeholder conflicts effectively."
                : "Stakeholder management is nuanced. Review the rationale for each round to build intuition."}
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-code-bg border border-border rounded-lg p-3 text-center">
            <Timer size={14} className="text-accent mx-auto mb-1" />
            <p className="font-mono text-lg font-bold text-text-primary">{(avgTimeMs / 1000).toFixed(1)}s</p>
            <p className="text-text-secondary text-[10px]">Avg Decision Time</p>
          </div>
          <div className="bg-code-bg border border-border rounded-lg p-3 text-center">
            <Users size={14} className="text-primary mx-auto mb-1" />
            <p className="font-mono text-lg font-bold text-text-primary">{correctCount}/{totalRounds}</p>
            <p className="text-text-secondary text-[10px]">Optimal Choices</p>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h4 className="font-mono text-xs text-text-secondary mb-3">Score by Category</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(categoryMap.entries()).map(([cat, data]) => (
              <div
                key={cat}
                className={`px-3 py-1.5 rounded-md border text-xs font-mono ${
                  data.correct === data.total
                    ? "border-success/30 bg-success/5 text-success"
                    : "border-red-500/30 bg-red-500/5 text-red-400"
                }`}
              >
                {cat}: {data.correct}/{data.total}
              </div>
            ))}
          </div>
        </div>

        {/* Round-by-round review */}
        <div className="space-y-3">
          <h4 className="font-mono text-sm text-text-secondary">Round-by-Round Review</h4>
          {results.map((result, i) => {
            const roundData = stakeholderRounds[i];
            const chosen = roundData.stakeholders.find((s) => s.id === result.chosenId);
            const optimal = roundData.stakeholders.find((s) => s.isOptimal);
            return (
              <motion.div
                key={result.roundId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-code-bg border border-border rounded-lg p-4"
              >
                <div className="flex items-start gap-2 mb-2">
                  {result.correct ? (
                    <CheckCircle2 size={14} className="text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-text-primary text-sm font-medium">Round {i + 1}</p>
                      <span className="font-mono text-[10px] text-text-secondary/60 border border-border rounded px-1.5 py-0.5">
                        {roundData.category}
                      </span>
                    </div>
                    <p className="text-text-secondary text-xs mt-0.5">
                      You sided with: <span className={result.correct ? "text-success" : "text-red-400"}>{chosen?.name} ({chosen?.role})</span>
                      {!result.correct && (
                        <> · Optimal: <span className="text-success">{optimal?.name} ({optimal?.role})</span></>
                      )}
                    </p>
                  </div>
                  <span className="text-text-secondary/40 text-[10px] font-mono flex-shrink-0">
                    {(result.timeMs / 1000).toFixed(1)}s
                  </span>
                </div>
                <p className="text-text-secondary/70 text-xs leading-relaxed pl-5">
                  {roundData.optimalRationale}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent font-mono text-sm px-6 py-2.5 rounded-md transition-all border border-accent/30"
          >
            <RotateCcw size={14} />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Playing View ───
  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-text-secondary">
          Round {currentRound + 1}/{totalRounds}
        </span>
        <div className="flex-1 h-1.5 bg-code-bg rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            animate={{ width: `${((currentRound + (phase === "feedback" ? 1 : 0)) / totalRounds) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="font-mono text-xs text-accent">{correctCount} ✓</span>
      </div>

      {/* Situation */}
      <div className="bg-surface border border-primary/20 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <Target size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-mono text-primary text-sm font-bold">Situation</h3>
              <span className="font-mono text-[10px] text-text-secondary/60 border border-border rounded px-1.5 py-0.5">
                {round.category}
              </span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed mb-3">{round.situation}</p>
            <div className="flex items-start gap-2 bg-red-500/5 border border-red-500/20 rounded-md px-3 py-2">
              <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400/80 text-xs leading-relaxed">{round.tension}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholder Cards */}
      <div className="space-y-3">
        <h4 className="font-mono text-xs text-text-secondary">Choose which stakeholder&apos;s approach to follow:</h4>
        <AnimatePresence mode="wait">
          <motion.div
            key={round.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            {round.stakeholders.map((stakeholder, i) => (
              <StakeholderCard
                key={stakeholder.id}
                stakeholder={stakeholder}
                index={i}
                phase={phase}
                isSelected={selectedId === stakeholder.id}
                onSelect={handleSelect}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rationale + next */}
      <AnimatePresence>
        {phase === "feedback" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
              <p className="text-primary text-xs font-mono mb-1 flex items-center gap-1.5">
                <Lightbulb size={12} /> Optimal Rationale
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                {round.optimalRationale}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="mt-4 inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-mono text-sm px-6 py-2.5 rounded-md transition-all"
            >
              {currentRound + 1 >= totalRounds ? "See Results" : "Next Round"}
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Stakeholder Card ────────────────────────────────────────────────────────

function StakeholderCard({
  stakeholder,
  index,
  phase,
  isSelected,
  onSelect,
}: {
  stakeholder: Stakeholder;
  index: number;
  phase: Phase;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const showFeedback = phase === "feedback";
  const isOptimal = stakeholder.isOptimal;
  const isLocked = phase === "feedback";

  const colorClass = ROLE_COLORS[stakeholder.role] || "border-border bg-surface";
  const icon = ROLE_ICONS[stakeholder.role] || "👤";

  let borderOverride = "";
  if (showFeedback && isSelected) {
    borderOverride = isOptimal ? "!border-success/50 !bg-success/5" : "!border-red-500/50 !bg-red-500/5";
  }
  if (showFeedback && !isSelected && isOptimal) {
    borderOverride = "!border-success/30";
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => onSelect(stakeholder.id)}
      disabled={isLocked}
      className={`w-full text-left p-4 rounded-lg border transition-all ${colorClass} ${borderOverride} ${
        !isLocked ? "cursor-pointer hover:scale-[1.01]" : "cursor-default"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-text-primary font-medium text-sm">{stakeholder.name}</p>
            <span className="text-text-secondary/60 text-[10px] font-mono">{stakeholder.role}</span>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">{stakeholder.argument}</p>

          <AnimatePresence>
            {showFeedback && (isSelected || isOptimal) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 pt-2 border-t border-border/30"
              >
                <div className="flex items-start gap-1.5">
                  {isOptimal ? (
                    <CheckCircle2 size={12} className="text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-xs leading-relaxed ${isOptimal ? "text-success/80" : "text-red-400/80"}`}>
                    {stakeholder.feedback}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
}
