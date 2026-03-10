"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, XCircle, ArrowRight, RotateCcw,
  Trophy, Lightbulb, Target, Flame, Crown, Timer, Clock, Share2,
} from "lucide-react";
import { shipOrSkipRounds } from "@/data/pm-games";
import type { ShipOrSkipOption } from "@/data/pm-games";
import { useAuth } from "@/contexts/AuthContext";
import { trackGameEvent } from "@/lib/game/analytics";
import { saveDraft, loadDraft, clearDraft } from "@/lib/game/draft-storage";

type Confidence = "guessing" | "fairly-sure" | "very-confident";
type Phase = "choosing" | "confidence" | "feedback" | "summary";

interface RoundResult {
  roundId: string;
  chosenId: string;
  correct: boolean;
  confidence: Confidence | null;
  timeMs: number;
  category: string;
}

const CONFIDENCE_OPTIONS: { id: Confidence; label: string; color: string }[] = [
  { id: "guessing", label: "Guessing", color: "border-red-500/40 bg-red-500/10 text-red-400" },
  { id: "fairly-sure", label: "Fairly Sure", color: "border-accent/40 bg-accent/10 text-accent" },
  { id: "very-confident", label: "Very Confident", color: "border-success/40 bg-success/10 text-success" },
];

function longestStreak(results: RoundResult[]): number {
  let max = 0;
  let current = 0;
  for (const r of results) {
    if (r.correct) { current++; max = Math.max(max, current); }
    else { current = 0; }
  }
  return max;
}

interface SoSDraft {
  currentRound: number;
  results: RoundResult[];
}

const DRAFT_KEY = "pm-ship-or-skip";

export default function ShipOrSkip() {
  const { saveGameScore } = useAuth();
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("choosing");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [pendingConfidence, setPendingConfidence] = useState<Confidence | null>(null);
  const roundStartRef = useRef(Date.now());

  const [roundElapsed, setRoundElapsed] = useState(0);

  const round = shipOrSkipRounds[currentRound];
  const totalRounds = shipOrSkipRounds.length;

  // Restore draft on mount
  useEffect(() => {
    const draft = loadDraft<SoSDraft>(DRAFT_KEY);
    if (draft && draft.currentRound > 0 && draft.currentRound < shipOrSkipRounds.length) {
      setCurrentRound(draft.currentRound);
      setResults(draft.results);
    }
  }, []);

  // Save draft whenever round advances
  useEffect(() => {
    if (results.length > 0 && phase === "choosing") {
      saveDraft<SoSDraft>(DRAFT_KEY, { currentRound, results });
    }
  }, [currentRound, results, phase]);

  // Track game start on mount
  useEffect(() => {
    trackGameEvent("pm_sos_started", { total_rounds: totalRounds });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset round timer when advancing
  useEffect(() => {
    roundStartRef.current = Date.now();
    setRoundElapsed(0);
  }, [currentRound]);

  // Tick the visible timer while choosing
  useEffect(() => {
    if (phase !== "choosing") return;
    const id = setInterval(() => {
      setRoundElapsed(Date.now() - roundStartRef.current);
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  const handleSelect = useCallback((optionId: string) => {
    if (phase !== "choosing") return;
    setSelectedOption(optionId);
    setPhase("confidence");
  }, [phase]);

  const handleConfidence = useCallback((confidence: Confidence) => {
    if (!selectedOption) return;
    setPendingConfidence(confidence);
    const elapsed = Date.now() - roundStartRef.current;
    const option = round.options.find((o) => o.id === selectedOption);
    const result: RoundResult = {
      roundId: round.id,
      chosenId: selectedOption,
      correct: option?.isCorrect ?? false,
      confidence,
      timeMs: elapsed,
      category: round.category,
    };
    setResults((prev) => [...prev, result]);

    trackGameEvent("pm_sos_round_answered", {
      round_id: round.id,
      round_index: currentRound,
      chosen_id: selectedOption,
      is_correct: result.correct,
      confidence,
      time_to_answer_ms: elapsed,
      category: round.category,
    });

    setPhase("feedback");
  }, [selectedOption, round, currentRound]);

  const handleNext = useCallback(() => {
    if (currentRound + 1 >= totalRounds) {
      setPhase("summary");
    } else {
      setCurrentRound((prev) => prev + 1);
      setSelectedOption(null);
      setPendingConfidence(null);
      setPhase("choosing");
    }
  }, [currentRound, totalRounds]);

  const handleReset = useCallback(() => {
    trackGameEvent("pm_sos_retry", {
      previous_score: results.length > 0
        ? Math.round((results.filter((r) => r.correct).length / results.length) * 100)
        : 0,
    });
    setCurrentRound(0);
    setPhase("choosing");
    setSelectedOption(null);
    setPendingConfidence(null);
    setResults([]);
    setScoreSaved(false);
    clearDraft(DRAFT_KEY);
  }, [results]);

  const correctCount = results.filter((r) => r.correct).length;
  const scoreTotal = correctCount * 20;
  const scoreMax = totalRounds * 20;
  const percent = Math.round((scoreTotal / scoreMax) * 100);
  const passed = percent >= 60;
  const streak = longestStreak(results);
  const isPerfect = correctCount === totalRounds;

  // Save score + track completion
  if (phase === "summary" && !scoreSaved) {
    setScoreSaved(true);
    clearDraft(DRAFT_KEY);

    const avgTimeMs = results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.timeMs, 0) / results.length)
      : 0;
    const confCounts = results.reduce<Record<string, number>>((acc, r) => {
      if (r.confidence) acc[r.confidence] = (acc[r.confidence] || 0) + 1;
      return acc;
    }, {});

    trackGameEvent("pm_sos_completed", {
      score_percent: percent,
      correct_count: correctCount,
      total_rounds: totalRounds,
      passed,
      streak,
      avg_time_ms: avgTimeMs,
      confidence_distribution: confCounts,
    });

    saveGameScore({
      patternSlug: "pm-ship-or-skip",
      scoreTotal,
      scoreMax,
      architecture: correctCount * 8,
      resilience: correctCount * 8,
      efficiency: correctCount * 4,
      passed,
    });
  }

  // ─── Summary View ───
  if (phase === "summary") {
    const avgTimeMs = results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.timeMs, 0) / results.length)
      : 0;

    const confCorrect = results.filter((r) => r.confidence === "very-confident" && r.correct).length;
    const confTotal = results.filter((r) => r.confidence === "very-confident").length;

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
            {correctCount} / {totalRounds} correct decisions
          </p>

          {/* Badges */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {isPerfect && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/30 rounded-full px-3 py-1"
              >
                <Crown size={14} className="text-accent" />
                <span className="font-mono text-xs text-accent font-bold">Perfect Instincts</span>
              </motion.div>
            )}
            {streak >= 3 && !isPerfect && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1"
              >
                <Flame size={14} className="text-red-400" />
                <span className="font-mono text-xs text-red-400 font-bold">{streak}-Round Streak</span>
              </motion.div>
            )}
          </div>

          <p className={`mt-3 text-sm ${passed ? "text-success/80" : "text-text-secondary"}`}>
            {isPerfect
              ? "Flawless product judgment across every category."
              : passed
                ? "Strong product instincts! You know when to ship, skip, or scale."
                : "Review the tradeoffs below — understanding 'why' is more important than getting it right."}
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-code-bg border border-border rounded-lg p-2 sm:p-3 text-center">
            <Timer size={14} className="text-accent mx-auto mb-1" />
            <p className="font-mono text-base sm:text-lg font-bold text-text-primary">{(avgTimeMs / 1000).toFixed(1)}s</p>
            <p className="text-text-secondary text-[10px]">Avg Decision Time</p>
          </div>
          <div className="bg-code-bg border border-border rounded-lg p-2 sm:p-3 text-center">
            <Flame size={14} className="text-red-400 mx-auto mb-1" />
            <p className="font-mono text-base sm:text-lg font-bold text-text-primary">{streak}</p>
            <p className="text-text-secondary text-[10px]">Best Streak</p>
          </div>
          <div className="bg-code-bg border border-border rounded-lg p-2 sm:p-3 text-center">
            <Target size={14} className="text-primary mx-auto mb-1" />
            <p className="font-mono text-base sm:text-lg font-bold text-text-primary">
              {confTotal > 0 ? `${Math.round((confCorrect / confTotal) * 100)}%` : "—"}
            </p>
            <p className="text-text-secondary text-[10px]">Confident & Correct</p>
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
                    : data.correct > 0
                      ? "border-accent/30 bg-accent/5 text-accent"
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
            const roundData = shipOrSkipRounds[i];
            const chosen = roundData.options.find((o) => o.id === result.chosenId);
            const correct = roundData.options.find((o) => o.isCorrect);
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
                      You picked: <span className={result.correct ? "text-success" : "text-red-400"}>{chosen?.label}</span>
                      {!result.correct && (
                        <> · Best choice: <span className="text-success">{correct?.label}</span></>
                      )}
                    </p>
                  </div>
                  <span className="text-text-secondary/40 text-[10px] font-mono flex-shrink-0">
                    {(result.timeMs / 1000).toFixed(1)}s
                  </span>
                </div>
                <p className="text-text-secondary/70 text-xs leading-relaxed pl-5">
                  {roundData.tradeoffExplanation}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {passed && (
            <button
              onClick={() => {
                const text = `I scored ${percent}% on the Ship or Skip challenge on LearnAgenticPatterns! ${isPerfect ? "Perfect Instincts!" : ""}\n\nCan you beat my score? → practice.learnagenticpatterns.com`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
              }}
              className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary font-mono text-sm px-6 py-2.5 rounded-md transition-all border border-primary/30"
            >
              <Share2 size={14} />
              Share Score
            </button>
          )}
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
  const currentStreak = longestStreak(results.slice(-results.length));
  const liveStreak = (() => {
    let s = 0;
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i].correct) s++;
      else break;
    }
    return s;
  })();

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
        <div className="flex items-center gap-1.5 bg-code-bg border border-border rounded-md px-2 py-1 flex-shrink-0">
          <Clock size={11} className="text-accent" />
          <span className="font-mono text-xs text-accent tabular-nums">
            {(roundElapsed / 1000).toFixed(1)}s
          </span>
        </div>
        <span className="font-mono text-xs text-accent">{correctCount} ✓</span>
        {liveStreak >= 3 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1 text-red-400 font-mono text-xs"
          >
            <Flame size={12} /> {liveStreak}
          </motion.span>
        )}
      </div>

      {/* Scenario */}
      <div className="bg-surface border border-primary/20 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <Target size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-mono text-primary text-sm font-bold">Scenario</h3>
              <span className="font-mono text-[10px] text-text-secondary/60 border border-border rounded px-1.5 py-0.5">
                {round.category}
              </span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed mb-2">{round.scenario}</p>
            <p className="text-text-secondary text-xs leading-relaxed italic">{round.context}</p>
          </div>
        </div>
      </div>

      {/* Options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={round.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-3"
        >
          {round.options.map((option, i) => (
            <OptionCard
              key={option.id}
              option={option}
              index={i}
              phase={phase}
              isSelected={selectedOption === option.id}
              onSelect={handleSelect}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Confidence selector */}
      <AnimatePresence>
        {phase === "confidence" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface border border-accent/20 rounded-lg p-4">
              <p className="text-text-secondary text-xs font-mono mb-3">How confident are you?</p>
              <div className="flex gap-2">
                {CONFIDENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleConfidence(opt.id)}
                    className={`flex-1 font-mono text-xs px-3 py-2.5 rounded-md border transition-all hover:scale-[1.02] ${opt.color}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tradeoff explanation */}
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
                <Lightbulb size={12} /> Key Tradeoff
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                {round.tradeoffExplanation}
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

// ─── Option Card ─────────────────────────────────────────────────────────────

function OptionCard({
  option,
  index,
  phase,
  isSelected,
  onSelect,
}: {
  option: ShipOrSkipOption;
  index: number;
  phase: Phase;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const showFeedback = phase === "feedback";
  const isCorrect = option.isCorrect;
  const isLocked = phase === "confidence" || phase === "feedback";

  let borderClass = "border-border hover:border-primary/40";
  if ((phase === "confidence" || showFeedback) && isSelected) {
    borderClass = showFeedback
      ? isCorrect ? "border-success/50 bg-success/5" : "border-red-500/50 bg-red-500/5"
      : "border-accent/50 bg-accent/5";
  }
  if (showFeedback && !isSelected && isCorrect) borderClass = "border-success/30";
  if (showFeedback && !isSelected && !isCorrect) borderClass = "border-red-500/20 bg-red-500/[0.02]";

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => onSelect(option.id)}
      disabled={isLocked}
      className={`w-full text-left p-4 rounded-lg border transition-all ${borderClass} ${
        !isLocked ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="font-mono text-xs text-text-secondary/50 mt-0.5 w-5 text-center flex-shrink-0">
          {String.fromCharCode(65 + index)}
        </span>
        <div className="flex-1">
          <p className="text-text-primary font-medium text-sm mb-1">{option.label}</p>
          <p className="text-text-secondary text-xs leading-relaxed">{option.description}</p>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 pt-2 border-t border-border/30"
              >
                <div className="flex items-start gap-1.5">
                  {isCorrect ? (
                    <CheckCircle2 size={12} className="text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-xs leading-relaxed ${isCorrect ? "text-success/80" : "text-red-400/80"}`}>
                    {option.feedback}
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
