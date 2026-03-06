"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Brain, Lightbulb } from "lucide-react";
import type { ExplainChallenge as ExplainChallengeType } from "@/data/games";
import { trackGameEvent } from "@/lib/game/analytics";

interface ExplainChallengeProps {
  challenge: ExplainChallengeType;
  patternSlug: string;
  scorePercent: number;
}

export default function ExplainChallenge({
  challenge,
  patternSlug,
  scorePercent,
}: ExplainChallengeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const showTimeRef = useRef(Date.now());
  const trackedRef = useRef(false);

  useEffect(() => {
    showTimeRef.current = Date.now();
    trackGameEvent("game_explain_shown", {
      pattern: patternSlug,
      score_percent: scorePercent,
    });
  }, [patternSlug, scorePercent]);

  const handleSelect = (optionId: string) => {
    if (selectedId) return;
    setSelectedId(optionId);

    if (!trackedRef.current) {
      trackedRef.current = true;
      const chosen = challenge.options.find((o) => o.id === optionId);
      trackGameEvent("game_explain_answered", {
        pattern: patternSlug,
        chosen_option: optionId,
        is_correct: chosen?.isCorrect ?? false,
        time_to_answer_ms: Date.now() - showTimeRef.current,
      });
    }
  };

  const answered = selectedId !== null;
  const isCorrect = challenge.options.find((o) => o.id === selectedId)?.isCorrect ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-surface border border-primary/20 rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain size={16} className="text-primary" />
        <h4 className="font-mono text-sm text-primary font-bold">
          Explain Your Design
        </h4>
        {answered && isCorrect && (
          <span className="inline-flex items-center gap-1 bg-success/20 text-success text-xs font-mono px-2 py-0.5 rounded-full border border-success/30 ml-auto">
            <CheckCircle2 size={10} />
            Deep Understanding
          </span>
        )}
      </div>

      <p className="text-text-primary text-sm mb-4">{challenge.question}</p>

      <div className="space-y-2">
        {challenge.options.map((option, i) => {
          const isSelected = selectedId === option.id;
          const showCorrect = answered && option.isCorrect;
          const showWrong = answered && !option.isCorrect;

          let borderClass = "border-border hover:border-primary/40";
          if (showCorrect) borderClass = "border-success/50 bg-success/5";
          if (answered && isSelected && !option.isCorrect) borderClass = "border-red-500/50 bg-red-500/5";
          if (showWrong && !isSelected) borderClass = "border-red-500/20 bg-red-500/[0.02]";

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={answered}
              className={`w-full text-left p-3 rounded-lg border transition-all ${borderClass} ${
                !answered ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="font-mono text-xs text-text-secondary/50 mt-0.5 w-5 text-center flex-shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <span className="text-text-primary text-sm">{option.label}</span>
                    {showCorrect && <CheckCircle2 size={14} className="text-success flex-shrink-0 mt-0.5 ml-auto" />}
                    {answered && isSelected && !option.isCorrect && <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5 ml-auto" />}
                  </div>
                  <AnimatePresence>
                    {answered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-1.5"
                      >
                        <p className={`text-xs leading-relaxed ${option.isCorrect ? "text-success/80" : "text-red-400/80"}`}>
                          {option.explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Overall explanation after answering */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden mt-4"
          >
            <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
              <p className="text-primary text-xs font-mono mb-1 flex items-center gap-1.5">
                <Lightbulb size={12} /> Why this matters
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                {challenge.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
