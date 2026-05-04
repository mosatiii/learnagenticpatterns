"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, CheckCircle2, XCircle, Plus, X, RotateCcw, FileWarning, Lightbulb, Code } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { trackGameEvent } from "@/lib/game/analytics";
import { syncSaveDraft, syncLoadDraft, syncClearDraft } from "@/lib/game/draft-sync";
import GamePreviouslyCompleted from "./GamePreviouslyCompleted";
import type { PromptScenario, FixMove } from "@/data/pm-prompt-surgeon";

type Phase = "diagnosing" | "feedback" | "summary";

interface ScenarioResult {
  scenarioId: string;
  pickedMoveIds: string[];
  /** Score 0-100. */
  score: number;
  timeMs: number;
}

interface PSDraft {
  currentIdx: number;
  scenarioResults: ScenarioResult[];
}

interface PreviousResult {
  scoreTotal: number;
  scoreMax: number;
  passed: boolean;
  playedAt: string;
}

interface Props {
  scenarios: PromptScenario[];
  slug: string;
  title: string;
}

const PASS_PERCENT = 60;

function scoreSurgery(pickedIds: string[], moves: FixMove[]): number {
  // Score = % of (correct picks - wrong picks) over the optimal set, clamped 0-100.
  const optimalIds = new Set(moves.filter((m) => m.isOptimal).map((m) => m.id));
  const optimalCount = optimalIds.size;
  if (optimalCount === 0) return 0;
  let correct = 0;
  let wrong = 0;
  for (const id of pickedIds) {
    if (optimalIds.has(id)) correct += 1;
    else wrong += 1;
  }
  // Each correct pick is worth (100 / optimalCount) points.
  // Each wrong pick deducts half as much.
  const earnedPct = (correct / optimalCount) * 100;
  const penaltyPct = (wrong / optimalCount) * 50;
  return Math.max(0, Math.min(100, Math.round(earnedPct - penaltyPct)));
}

export default function PromptSurgeon({ scenarios, slug, title }: Props) {
  const { user, isLoading, gameScores, saveGameScore } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("diagnosing");
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [previousResult, setPreviousResult] = useState<PreviousResult | null>(null);
  const hydratedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  const scenario = scenarios[currentIdx];
  const totalScenarios = scenarios.length;

  useEffect(() => {
    if (isLoading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (user) {
      const row = gameScores.find((s) => s.pattern_slug === slug);
      if (row) {
        setPreviousResult({
          scoreTotal: row.score_total,
          scoreMax: row.score_max,
          passed: row.passed,
          playedAt: row.played_at,
        });
        return;
      }
    }
    syncLoadDraft<PSDraft>(slug, { authenticated: !!user }).then((draft) => {
      if (draft && draft.currentIdx > 0 && draft.currentIdx < scenarios.length) {
        setCurrentIdx(draft.currentIdx);
        setScenarioResults(draft.scenarioResults);
      }
    });
  }, [isLoading, user, gameScores, slug, scenarios.length]);

  useEffect(() => {
    if (scenarioResults.length > 0 && phase === "diagnosing") {
      syncSaveDraft<PSDraft>(slug, { currentIdx, scenarioResults }, { authenticated: !!user });
    }
  }, [currentIdx, scenarioResults, phase, user, slug]);

  useEffect(() => {
    trackGameEvent("pm_ps_started", { total_scenarios: totalScenarios });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPickedIds([]);
    startTimeRef.current = Date.now();
  }, [currentIdx]);

  const togglePick = (id: string) => {
    setPickedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const canSubmit = pickedIds.length >= 2 && pickedIds.length <= 4;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    const elapsed = Date.now() - startTimeRef.current;
    const score = scoreSurgery(pickedIds, scenario.fixMoves);
    setScenarioResults((prev) => [
      ...prev,
      { scenarioId: scenario.id, pickedMoveIds: [...pickedIds], score, timeMs: elapsed },
    ]);
    trackGameEvent("pm_ps_scenario_submitted", {
      scenario_id: scenario.id,
      score,
      moves_picked: pickedIds.length,
      elapsed_ms: elapsed,
    });
    setPhase("feedback");
  }, [canSubmit, pickedIds, scenario]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= totalScenarios) setPhase("summary");
    else { setCurrentIdx((i) => i + 1); setPhase("diagnosing"); }
  }, [currentIdx, totalScenarios]);

  const handleReset = useCallback(() => {
    trackGameEvent("pm_ps_retry", {
      previous_score: scenarioResults.length > 0
        ? Math.round(scenarioResults.reduce((s, r) => s + r.score, 0) / scenarioResults.length)
        : 0,
    });
    setCurrentIdx(0);
    setPhase("diagnosing");
    setPickedIds([]);
    setScenarioResults([]);
    setScoreSaved(false);
    setPreviousResult(null);
    syncClearDraft(slug, { authenticated: !!user });
  }, [scenarioResults, slug, user]);

  const totalScore = scenarioResults.reduce((s, r) => s + r.score, 0);
  const maxScore = totalScenarios * 100;
  const percent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const passed = percent >= PASS_PERCENT;

  if (phase === "summary" && !scoreSaved) {
    setScoreSaved(true);
    syncClearDraft(slug, { authenticated: !!user });
    trackGameEvent("pm_ps_completed", { score_percent: percent, passed });
    saveGameScore({
      patternSlug: slug,
      scoreTotal: totalScore,
      scoreMax: maxScore,
      architecture: Math.round(totalScore / 3),
      resilience: Math.round(totalScore / 3),
      efficiency: Math.round(totalScore / 3),
      passed,
    });
  }

  if (previousResult) {
    return (
      <GamePreviouslyCompleted
        title={title}
        scoreTotal={previousResult.scoreTotal}
        scoreMax={previousResult.scoreMax}
        passed={previousResult.passed}
        playedAt={previousResult.playedAt}
        onReplay={handleReset}
      />
    );
  }

  if (phase === "summary") {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-xl p-6 border text-center ${passed ? "bg-success/5 border-success/30" : "bg-red-500/5 border-red-500/30"}`}
        >
          <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-4">
            <Stethoscope size={26} className={passed ? "text-success" : "text-red-400"} />
          </div>
          <p className="font-mono text-xs text-text-secondary mb-1">Prompt Surgeon</p>
          <h2 className={`text-2xl font-bold mb-2 ${passed ? "text-success" : "text-red-400"}`}>
            {percent}% — {passed ? "Steady hands" : "Wrong instruments"}
          </h2>
          <p className="text-text-secondary text-sm">
            {totalScore} / {maxScore} points across {totalScenarios} prompts
          </p>
        </motion.div>

        <div className="space-y-3">
          <h4 className="font-mono text-sm text-text-secondary">Per-Scenario Score</h4>
          {scenarioResults.map((r, i) => {
            const sc = scenarios[i];
            return (
              <div key={r.scenarioId} className="bg-code-bg border border-border rounded-lg p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-text-primary text-sm font-semibold">{sc.category}</p>
                  <span className={`font-mono text-sm ${r.score >= 60 ? "text-success" : "text-red-400"}`}>
                    {r.score}/100
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleReset}
          className="w-full py-3 bg-accent/20 hover:bg-accent/30 text-accent font-mono text-sm rounded-lg border border-accent/30 transition-colors inline-flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} />
          Play again
        </button>
      </div>
    );
  }

  if (phase === "feedback") {
    const result = scenarioResults[scenarioResults.length - 1];
    const pickedSet = new Set(result?.pickedMoveIds ?? []);
    return (
      <div className="space-y-5">
        <div className={`rounded-xl p-5 border ${result && result.score >= 60 ? "bg-success/5 border-success/30" : "bg-red-500/5 border-red-500/30"}`}>
          <div className="flex items-center gap-3 mb-1">
            {result && result.score >= 60 ? (
              <CheckCircle2 size={22} className="text-success" />
            ) : (
              <XCircle size={22} className="text-red-400" />
            )}
            <p className={`text-lg font-bold ${result && result.score >= 60 ? "text-success" : "text-red-400"}`}>
              {result?.score ?? 0}/100 on this prompt
            </p>
          </div>
          <p className="text-text-secondary text-sm">Scenario {currentIdx + 1} of {totalScenarios}</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-mono text-sm text-text-primary">Move-by-move review</h4>
          {scenario.fixMoves.map((m) => {
            const wasPicked = pickedSet.has(m.id);
            // Show: all optimal moves + all picked moves. Hide unpicked distractors.
            if (!wasPicked && !m.isOptimal) return null;
            const status = wasPicked && m.isOptimal ? "right-pick"
              : wasPicked && !m.isOptimal ? "wrong-pick"
              : "missed-optimal";
            const cls = status === "right-pick"
              ? "border-success/40 bg-success/5"
              : status === "wrong-pick"
                ? "border-red-500/40 bg-red-500/5"
                : "border-amber-500/40 bg-amber-500/5";
            const iconColor = status === "right-pick"
              ? "text-success"
              : status === "wrong-pick"
                ? "text-red-400"
                : "text-amber-400";
            const label = status === "right-pick"
              ? "Good pick"
              : status === "wrong-pick"
                ? "Wrong pick"
                : "Missed (would have helped)";
            return (
              <div key={m.id} className={`rounded-lg border p-4 ${cls}`}>
                <div className="flex items-baseline justify-between mb-1">
                  <p className="text-sm font-semibold text-text-primary">{m.label}</p>
                  <span className={`font-mono text-xs ${iconColor}`}>{label}</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">{m.rationale}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <Lightbulb size={18} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-mono text-xs text-primary mb-1">Surgery lesson</p>
            <p className="text-text-primary text-sm leading-relaxed">{scenario.surgeryLesson}</p>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-mono text-sm rounded-lg transition-colors"
        >
          {currentIdx + 1 >= totalScenarios ? "See results" : "Next prompt"}
        </button>
      </div>
    );
  }

  // Diagnosing view
  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-xs text-text-secondary">
          Prompt {currentIdx + 1} / {totalScenarios}
        </p>
        <p className="font-mono text-xs text-text-secondary">Prompt Surgeon</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5">
        <p className="font-mono text-[11px] text-text-secondary uppercase tracking-wider mb-2">
          {scenario.category}
        </p>
        <h3 className="text-base font-bold text-text-primary mb-2">Goal</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{scenario.goal}</p>
        <p className="text-text-secondary text-xs leading-relaxed mt-2 italic">{scenario.context}</p>
      </div>

      <div className="bg-code-bg border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Code size={16} className="text-text-secondary" />
          <h4 className="font-mono text-sm text-text-primary">Current prompt (broken)</h4>
        </div>
        <pre className="text-text-primary text-xs leading-relaxed font-mono whitespace-pre-wrap bg-background border border-border rounded p-3">
{scenario.brokenPrompt}
        </pre>
      </div>

      <div className="bg-red-500/5 border border-red-500/30 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileWarning size={16} className="text-red-400" />
          <h4 className="font-mono text-sm text-text-primary">Failures it produces</h4>
        </div>
        <div className="space-y-3">
          {scenario.failures.map((f, i) => (
            <div key={i} className="border-l-2 border-red-500/40 pl-3">
              <p className="text-xs text-text-secondary mb-1"><span className="font-mono text-primary">Input:</span> {f.input}</p>
              <p className="text-xs text-text-secondary mb-1"><span className="font-mono text-red-400">Bad output:</span> {f.badOutput}</p>
              <p className="text-xs text-text-secondary italic"><span className="font-mono text-amber-400">Why:</span> {f.whyBad}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h4 className="font-mono text-sm text-text-primary">Pick 2-4 fix moves</h4>
          <span className={`font-mono text-xs ${pickedIds.length >= 2 && pickedIds.length <= 4 ? "text-success" : "text-text-secondary"}`}>
            {pickedIds.length} picked
          </span>
        </div>
        <div className="space-y-2">
          <AnimatePresence>
            {scenario.fixMoves.map((m) => {
              const picked = pickedIds.includes(m.id);
              return (
                <motion.button
                  key={m.id}
                  layout
                  onClick={() => togglePick(m.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    picked
                      ? "border-accent bg-accent/10"
                      : "border-border bg-surface hover:border-accent/40"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {picked ? (
                      <X size={14} className="text-accent mt-0.5 flex-shrink-0" />
                    ) : (
                      <Plus size={14} className="text-text-secondary mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">{m.label}</p>
                      <p className="text-xs text-text-secondary leading-snug mt-0.5">{m.description}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 font-mono text-sm rounded-lg transition-colors ${
          canSubmit
            ? "bg-accent hover:bg-accent/90 text-white"
            : "bg-surface border border-border text-text-secondary cursor-not-allowed"
        }`}
      >
        {canSubmit ? "Operate" : pickedIds.length < 2 ? "Pick at least 2 moves" : "Pick at most 4 moves"}
      </button>
    </div>
  );
}
