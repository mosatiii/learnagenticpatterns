"use client";

import { motion } from "framer-motion";
import { Trophy, RotateCcw, CheckCircle2, XCircle, AlertTriangle, Zap, Timer } from "lucide-react";
import type { Score } from "@/lib/game/simulation-engine";
import type { BlockDefinition, SimulationEvent, ExplainChallenge as ExplainChallengeType } from "@/data/games";
import ExplainChallenge from "./ExplainChallenge";

interface ScoreCardProps {
  score: Score;
  events: SimulationEvent[];
  successMessage: string;
  blockMap: Map<string, BlockDefinition>;
  onRetry: () => void;
  elapsedMs?: number;
  patternSlug?: string;
  explainChallenge?: ExplainChallengeType;
}

const SCORE_CATEGORIES = [
  { key: "architecture" as const, label: "Architecture", description: "Correct components" },
  { key: "resilience" as const, label: "Resilience", description: "Correct order" },
  { key: "efficiency" as const, label: "Efficiency", description: "No unnecessary blocks" },
];

const SPEED_DEMON_THRESHOLD_MS = 30_000;

function formatTime(ms: number): string {
  const secs = ms / 1000;
  const mins = Math.floor(secs / 60);
  const remainder = secs % 60;
  return mins > 0
    ? `${mins}:${remainder.toFixed(1).padStart(4, "0")}`
    : `${remainder.toFixed(1)}s`;
}

export default function ScoreCard({
  score,
  events,
  successMessage,
  blockMap,
  onRetry,
  elapsedMs,
  patternSlug,
  explainChallenge,
}: ScoreCardProps) {
  const percent = Math.round((score.total / score.maxTotal) * 100);
  const passed = score.passed;
  const isSpeedDemon = elapsedMs != null && elapsedMs < SPEED_DEMON_THRESHOLD_MS && passed;

  return (
    <div className="space-y-6">
      {/* Main score */}
      <div className={`bg-surface border rounded-xl p-6 text-center ${
        passed ? "border-success/30" : "border-red-500/30"
      }`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Trophy
            size={48}
            className={`mx-auto mb-3 ${passed ? "text-success" : "text-red-400"}`}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`font-mono text-4xl font-bold mb-1 ${
            passed ? "text-success" : "text-red-400"
          }`}
        >
          {percent}%
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-text-secondary text-sm font-mono"
        >
          {score.total} / {score.maxTotal} points
        </motion.p>

        {/* Speed run time */}
        {elapsedMs != null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-center gap-2 mt-2"
          >
            <Timer size={14} className="text-accent" />
            <span className="font-mono text-sm text-accent">
              {formatTime(elapsedMs)}
            </span>
            {isSpeedDemon && (
              <span className="inline-flex items-center gap-1 bg-accent/20 text-accent text-xs font-mono px-2 py-0.5 rounded-full border border-accent/30">
                <Zap size={10} />
                Speed Demon
              </span>
            )}
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-4 text-sm leading-relaxed max-w-lg mx-auto ${
            passed ? "text-success/80" : "text-text-secondary"
          }`}
        >
          {passed ? successMessage : "Not quite right — review the simulation log below and try again."}
        </motion.p>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {SCORE_CATEGORIES.map((cat, i) => {
          const value = score[cat.key];
          const max = cat.key === "architecture" ? 40 : cat.key === "resilience" ? 40 : 20;
          const full = value === max;
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`bg-code-bg border rounded-lg p-3 text-center ${
                full ? "border-success/30" : "border-border"
              }`}
            >
              <p className="font-mono text-lg font-bold text-text-primary">
                {value}/{max}
              </p>
              <p className={`font-mono text-xs mt-0.5 ${full ? "text-success" : "text-text-secondary"}`}>
                {cat.label}
              </p>
              <p className="text-text-secondary/50 text-[10px]">{cat.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Explain Your Design challenge */}
      {explainChallenge && patternSlug && (
        <ExplainChallenge
          challenge={explainChallenge}
          patternSlug={patternSlug}
          scorePercent={percent}
        />
      )}

      {/* Simulation log */}
      <div className="bg-code-bg border border-border rounded-lg p-4">
        <h4 className="font-mono text-xs text-text-secondary mb-3">{">"} Simulation Log</h4>
        <div className="space-y-2">
          {events.map((event, i) => {
            const block = blockMap.get(event.nodeId);
            const StatusIcon =
              event.status === "pass" ? CheckCircle2 :
              event.status === "fail" ? XCircle :
              AlertTriangle;
            const statusColor =
              event.status === "pass" ? "text-success" :
              event.status === "fail" ? "text-red-400" :
              "text-yellow-400";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2"
              >
                <StatusIcon size={12} className={`${statusColor} flex-shrink-0 mt-0.5`} />
                <div>
                  <span className={`font-mono text-xs font-bold ${statusColor}`}>
                    {block?.label ?? event.nodeId}
                  </span>
                  <p className="text-text-secondary text-[11px] leading-tight">
                    {event.message}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Retry button */}
      <div className="text-center">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent font-mono text-sm px-6 py-2.5 rounded-md transition-all border border-accent/30"
        >
          <RotateCcw size={14} />
          Try Again
        </button>
      </div>
    </div>
  );
}
