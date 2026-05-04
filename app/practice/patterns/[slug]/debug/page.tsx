"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Bug, Trophy, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { getPatternBySlug } from "@/data/patterns";
import { getGameConfig } from "@/data/games";
import DebugCanvas from "@/components/AgentBuilder/DebugCanvas";
import GamePreviouslyCompleted from "@/components/PMGames/GamePreviouslyCompleted";
import type { Score } from "@/lib/game/simulation-engine";
import { useAuth } from "@/contexts/AuthContext";

function DebugScoreCard({ score, onRetry }: { score: Score; onRetry: () => void }) {
  const pct = score.maxTotal > 0 ? Math.round((score.total / score.maxTotal) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl p-6 border ${score.passed ? "bg-success/5 border-success/30" : "bg-red-500/5 border-red-500/30"}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {score.passed ? <CheckCircle2 size={24} className="text-success" /> : <XCircle size={24} className="text-red-400" />}
        <div>
          <p className={`text-lg font-bold ${score.passed ? "text-success" : "text-red-400"}`}>
            {pct}% — {score.passed ? "Bug Fixed!" : "Not quite right"}
          </p>
          <p className="text-text-secondary text-xs font-mono">
            {score.total}/{score.maxTotal} points
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Architecture", value: score.architecture, max: 40 },
          { label: "Resilience", value: score.resilience, max: 40 },
          { label: "Efficiency", value: score.efficiency, max: 20 },
        ].map((cat) => (
          <div key={cat.label} className="bg-surface/50 rounded-lg p-3 text-center">
            <p className="text-text-primary font-bold font-mono">{cat.value}/{cat.max}</p>
            <p className="text-text-secondary text-[10px] font-mono">{cat.label}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-mono text-xs px-4 py-2 rounded-lg border border-border hover:border-primary/30 transition-colors"
      >
        <RotateCcw size={12} />
        Try Again
      </button>
    </motion.div>
  );
}

interface PreviousResult {
  scoreTotal: number;
  scoreMax: number;
  passed: boolean;
  playedAt: string;
}

const CHALLENGE_TYPE = "debug";

export default function DebugLabPage() {
  const params = useParams();
  const slug = params.slug as string;
  const pattern = getPatternBySlug(slug);
  const config = getGameConfig(slug);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState<Score | null>(null);
  const [previousResult, setPreviousResult] = useState<PreviousResult | null>(null);
  const hydratedRef = useRef(false);
  const savedRef = useRef(false);
  const { user, isLoading, challengeScores, saveChallengeScore } = useAuth();

  const debugChallenges = config?.debugChallenges ?? [];
  const challenge = debugChallenges[currentIdx];

  // Hydrate from DB: if this user already completed Debug for this slug,
  // surface their saved score with a Replay CTA.
  useEffect(() => {
    if (isLoading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (!user) return;
    const row = challengeScores.find(
      (s) => s.pattern_slug === slug && s.challenge_type === CHALLENGE_TYPE
    );
    if (row) {
      setPreviousResult({
        scoreTotal: row.score_total,
        scoreMax: row.score_max,
        passed: row.passed,
        playedAt: row.played_at,
      });
    }
  }, [isLoading, user, challengeScores, slug]);

  // Persist score to challenge_scores once when a debug attempt completes.
  useEffect(() => {
    if (!score || !user || savedRef.current) return;
    savedRef.current = true;
    saveChallengeScore({
      patternSlug: slug,
      challengeType: CHALLENGE_TYPE,
      difficulty: "practitioner",
      scoreTotal: score.total,
      scoreMax: score.maxTotal,
      passed: score.passed,
      metadata: { challengeIdx: currentIdx },
    });
  }, [score, user, slug, currentIdx, saveChallengeScore]);

  const handleComplete = useCallback((s: Score) => {
    setScore(s);
  }, []);

  const handleReplay = useCallback(() => {
    setPreviousResult(null);
    setScore(null);
    setCurrentIdx(0);
    savedRef.current = false;
  }, []);

  const handleNext = useCallback(() => {
    if (currentIdx < debugChallenges.length - 1) {
      setCurrentIdx((i) => i + 1);
      setScore(null);
      savedRef.current = false;
    }
  }, [currentIdx, debugChallenges.length]);

  if (!pattern || !config || debugChallenges.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary font-mono">No debug challenges available for this pattern.</p>
        <Link href={`/practice/patterns/${slug}`} className="text-primary font-mono text-sm mt-4 inline-block hover:underline">
          Back to {pattern?.name ?? "Pattern"}
        </Link>
      </div>
    );
  }

  if (previousResult) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          href={`/practice/patterns/${slug}`}
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent font-mono text-xs mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to {pattern.name}
        </Link>
        <GamePreviouslyCompleted
          title={`Debug — ${pattern.name}`}
          scoreTotal={previousResult.scoreTotal}
          scoreMax={previousResult.scoreMax}
          passed={previousResult.passed}
          playedAt={previousResult.playedAt}
          onReplay={handleReplay}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href={`/practice/patterns/${slug}`}
        className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent font-mono text-xs mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to {pattern.name}
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono text-[10px] uppercase tracking-wider border border-blue-500/20">
            Practitioner
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface text-text-secondary font-mono text-[10px] uppercase tracking-wider border border-border">
            Debug Lab
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Bug size={24} className="text-red-400" />
          Debug: {pattern.name}
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Challenge {currentIdx + 1} of {debugChallenges.length}
        </p>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
        <p className="text-text-primary text-sm font-mono">{challenge.diagnosisPrompt}</p>
      </div>

      {score ? (
        <div className="space-y-4">
          <DebugScoreCard score={score} onRetry={() => setScore(null)} />
          {currentIdx < debugChallenges.length - 1 && (
            <button
              onClick={handleNext}
              className="w-full py-3 bg-accent/20 hover:bg-accent/30 text-accent font-mono text-sm rounded-lg border border-accent/30 transition-colors"
            >
              Next Debug Challenge ({currentIdx + 2} of {debugChallenges.length})
            </button>
          )}
        </div>
      ) : (
        <DebugCanvas
          config={config}
          challenge={challenge}
          patternSlug={slug}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
