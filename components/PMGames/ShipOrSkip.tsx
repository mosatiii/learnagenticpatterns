"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, XCircle, ArrowRight, RotateCcw,
  Trophy, Lightbulb, Target,
} from "lucide-react";
import { shipOrSkipRounds } from "@/data/pm-games";
import type { ShipOrSkipOption } from "@/data/pm-games";
import { useAuth } from "@/contexts/AuthContext";

type Phase = "choosing" | "feedback" | "summary";

interface RoundResult {
  roundId: string;
  chosenId: string;
  correct: boolean;
}

export default function ShipOrSkip() {
  const { saveGameScore } = useAuth();
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("choosing");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [scoreSaved, setScoreSaved] = useState(false);

  const round = shipOrSkipRounds[currentRound];
  const totalRounds = shipOrSkipRounds.length;

  const handleSelect = useCallback((optionId: string) => {
    if (phase !== "choosing") return;
    setSelectedOption(optionId);

    const option = round.options.find((o) => o.id === optionId);
    const result: RoundResult = {
      roundId: round.id,
      chosenId: optionId,
      correct: option?.isCorrect ?? false,
    };
    setResults((prev) => [...prev, result]);
    setPhase("feedback");
  }, [phase, round]);

  const handleNext = useCallback(() => {
    if (currentRound + 1 >= totalRounds) {
      setPhase("summary");
    } else {
      setCurrentRound((prev) => prev + 1);
      setSelectedOption(null);
      setPhase("choosing");
    }
  }, [currentRound, totalRounds]);

  const handleReset = useCallback(() => {
    setCurrentRound(0);
    setPhase("choosing");
    setSelectedOption(null);
    setResults([]);
    setScoreSaved(false);
  }, []);

  // Save score when reaching summary
  const correctCount = results.filter((r) => r.correct).length;
  const scoreTotal = correctCount * 20;
  const scoreMax = totalRounds * 20;
  const percent = Math.round((scoreTotal / scoreMax) * 100);
  const passed = percent >= 60;

  if (phase === "summary" && !scoreSaved) {
    setScoreSaved(true);
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
          <p className={`mt-3 text-sm ${passed ? "text-success/80" : "text-text-secondary"}`}>
            {passed
              ? "Strong product instincts! You know when to ship, skip, or scale."
              : "Review the tradeoffs below — understanding 'why' is more important than getting it right."}
          </p>
        </motion.div>

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
                  <div>
                    <p className="text-text-primary text-sm font-medium">Round {i + 1}</p>
                    <p className="text-text-secondary text-xs mt-0.5">
                      You picked: <span className={result.correct ? "text-success" : "text-red-400"}>{chosen?.label}</span>
                      {!result.correct && (
                        <> · Best choice: <span className="text-success">{correct?.label}</span></>
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-text-secondary/70 text-xs leading-relaxed pl-5">
                  {roundData.tradeoffExplanation}
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

      {/* Scenario */}
      <div className="bg-surface border border-primary/20 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <Target size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-mono text-primary text-sm font-bold mb-2">Scenario</h3>
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

      {/* Tradeoff explanation — shown after selecting */}
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

  let borderClass = "border-border hover:border-primary/40";
  if (showFeedback && isSelected && isCorrect) borderClass = "border-success/50 bg-success/5";
  if (showFeedback && isSelected && !isCorrect) borderClass = "border-red-500/50 bg-red-500/5";
  if (showFeedback && !isSelected && isCorrect) borderClass = "border-success/30";

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => onSelect(option.id)}
      disabled={phase !== "choosing"}
      className={`w-full text-left p-4 rounded-lg border transition-all ${borderClass} ${
        phase === "choosing" ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="font-mono text-xs text-text-secondary/50 mt-0.5 w-5 text-center flex-shrink-0">
          {String.fromCharCode(65 + index)}
        </span>
        <div className="flex-1">
          <p className="text-text-primary font-medium text-sm mb-1">{option.label}</p>
          <p className="text-text-secondary text-xs leading-relaxed">{option.description}</p>

          {/* Feedback after selection */}
          <AnimatePresence>
            {showFeedback && (isSelected || isCorrect) && (
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
