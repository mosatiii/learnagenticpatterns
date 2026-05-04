"use client";

import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, Trophy } from "lucide-react";

interface Props {
  /** Title of the game ("Ship or Skip", "Stakeholder Simulator", etc.) */
  title: string;
  scoreTotal: number;
  scoreMax: number;
  passed: boolean;
  /** ISO timestamp from game_scores.played_at */
  playedAt: string;
  onReplay: () => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function GamePreviouslyCompleted({
  title, scoreTotal, scoreMax, passed, playedAt, onReplay,
}: Props) {
  const percent = scoreMax > 0 ? Math.round((scoreTotal / scoreMax) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto bg-surface border border-border rounded-2xl p-8 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-success/15 border border-success/40 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={26} className="text-success" />
      </div>

      <p className="font-mono text-xs text-text-secondary mb-1">
        You completed this game
      </p>
      <h2 className="text-xl font-bold text-text-primary mb-6">{title}</h2>

      <div className="grid grid-cols-3 gap-3 mb-6 text-left">
        <div className="bg-background/40 border border-border rounded-lg p-3">
          <p className="font-mono text-[10px] text-text-secondary uppercase tracking-wide mb-1">Score</p>
          <p className="text-lg font-bold text-text-primary">
            {scoreTotal}<span className="text-sm text-text-secondary">/{scoreMax}</span>
          </p>
        </div>
        <div className="bg-background/40 border border-border rounded-lg p-3">
          <p className="font-mono text-[10px] text-text-secondary uppercase tracking-wide mb-1">Percent</p>
          <p className="text-lg font-bold text-text-primary">{percent}%</p>
        </div>
        <div className="bg-background/40 border border-border rounded-lg p-3">
          <p className="font-mono text-[10px] text-text-secondary uppercase tracking-wide mb-1">Result</p>
          <p className={`text-lg font-bold ${passed ? "text-success" : "text-red-400"}`}>
            {passed ? "Pass" : "Fail"}
          </p>
        </div>
      </div>

      {playedAt && (
        <p className="font-mono text-[11px] text-text-secondary mb-6 flex items-center justify-center gap-1.5">
          <Trophy size={12} className="text-yellow-400/70" />
          Last played {formatDate(playedAt)}
        </p>
      )}

      <button
        onClick={onReplay}
        className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-mono text-sm px-6 py-2.5 rounded-lg transition-colors"
      >
        <RotateCcw size={14} />
        Play again
      </button>

      <p className="font-mono text-[11px] text-text-secondary/70 mt-4">
        Replaying records a new attempt — your best score is what shows on the leaderboard.
      </p>
    </motion.div>
  );
}
