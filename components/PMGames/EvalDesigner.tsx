"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Plus, X, RotateCcw, Target, Lightbulb } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { trackGameEvent } from "@/lib/game/analytics";
import { syncSaveDraft, syncLoadDraft, syncClearDraft } from "@/lib/game/draft-sync";
import GamePreviouslyCompleted from "./GamePreviouslyCompleted";
import type { EvalScenario, EvalCriterion } from "@/data/pm-eval-designer";

type Phase = "designing" | "feedback" | "summary";

interface ScenarioResult {
  scenarioId: string;
  /** Map of criterion.id → player's weight (0-100). */
  playerRubric: Record<string, number>;
  /** Score 0-100 for this scenario. */
  score: number;
  timeMs: number;
}

interface EDDraft {
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
  scenarios: EvalScenario[];
  /** Save slug (e.g., "pm-quality-self-correction"). Also draft key. */
  slug: string;
  /** Display title for the previously-completed view. */
  title: string;
}

const PASS_PERCENT = 60;

function computeScenarioScore(
  playerRubric: Record<string, number>,
  criteria: EvalCriterion[],
): number {
  // Score = 100 - sum(|playerWeight - expertWeight|), clamped to [0, 100].
  let totalDiff = 0;
  for (const c of criteria) {
    const player = playerRubric[c.id] ?? 0;
    totalDiff += Math.abs(player - c.expertWeight);
  }
  return Math.max(0, Math.min(100, Math.round(100 - totalDiff / 2)));
}

export default function EvalDesigner({ scenarios, slug, title }: Props) {
  const { user, isLoading, gameScores, saveGameScore } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("designing");
  /** Map of criterion.id → weight 0-100 the player has assigned. */
  const [draftRubric, setDraftRubric] = useState<Record<string, number>>({});
  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [previousResult, setPreviousResult] = useState<PreviousResult | null>(null);
  const hydratedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  const scenario = scenarios[currentIdx];
  const totalScenarios = scenarios.length;

  // ─── Hydrate from DB or draft ─────────────────────────────────────────────
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
    syncLoadDraft<EDDraft>(slug, { authenticated: !!user }).then((draft) => {
      if (draft && draft.currentIdx > 0 && draft.currentIdx < scenarios.length) {
        setCurrentIdx(draft.currentIdx);
        setScenarioResults(draft.scenarioResults);
      }
    });
  }, [isLoading, user, gameScores, slug, scenarios.length]);

  // ─── Draft persistence on scenario advance ────────────────────────────────
  useEffect(() => {
    if (scenarioResults.length > 0 && phase === "designing") {
      syncSaveDraft<EDDraft>(slug, { currentIdx, scenarioResults }, { authenticated: !!user });
    }
  }, [currentIdx, scenarioResults, phase, user, slug]);

  // ─── Track game start once ────────────────────────────────────────────────
  useEffect(() => {
    trackGameEvent("pm_ed_started", { total_scenarios: totalScenarios });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Reset draft state when scenario changes ──────────────────────────────
  useEffect(() => {
    setDraftRubric({});
    startTimeRef.current = Date.now();
  }, [currentIdx]);

  const totalWeight = Object.values(draftRubric).reduce((a, b) => a + b, 0);
  const usedCriteriaCount = Object.values(draftRubric).filter((w) => w > 0).length;
  const canSubmit = totalWeight === 100 && usedCriteriaCount >= 2;

  const handleAddCriterion = (criterionId: string) => {
    if (draftRubric[criterionId] !== undefined) return; // already added
    setDraftRubric((prev) => ({ ...prev, [criterionId]: 0 }));
  };

  const handleRemoveCriterion = (criterionId: string) => {
    setDraftRubric((prev) => {
      const next = { ...prev };
      delete next[criterionId];
      return next;
    });
  };

  const handleWeightChange = (criterionId: string, weight: number) => {
    setDraftRubric((prev) => ({ ...prev, [criterionId]: Math.max(0, Math.min(100, weight)) }));
  };

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    const elapsed = Date.now() - startTimeRef.current;
    const score = computeScenarioScore(draftRubric, scenario.criteria);
    setScenarioResults((prev) => [
      ...prev,
      {
        scenarioId: scenario.id,
        playerRubric: { ...draftRubric },
        score,
        timeMs: elapsed,
      },
    ]);
    trackGameEvent("pm_ed_scenario_submitted", {
      scenario_id: scenario.id,
      score,
      criteria_used: usedCriteriaCount,
      elapsed_ms: elapsed,
    });
    setPhase("feedback");
  }, [canSubmit, draftRubric, scenario, usedCriteriaCount]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= totalScenarios) {
      setPhase("summary");
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase("designing");
    }
  }, [currentIdx, totalScenarios]);

  const handleReset = useCallback(() => {
    trackGameEvent("pm_ed_retry", {
      previous_score: scenarioResults.length > 0
        ? Math.round(scenarioResults.reduce((s, r) => s + r.score, 0) / scenarioResults.length)
        : 0,
    });
    setCurrentIdx(0);
    setPhase("designing");
    setDraftRubric({});
    setScenarioResults([]);
    setScoreSaved(false);
    setPreviousResult(null);
    syncClearDraft(slug, { authenticated: !!user });
  }, [scenarioResults, slug, user]);

  const totalScore = scenarioResults.reduce((s, r) => s + r.score, 0);
  const maxScore = totalScenarios * 100;
  const percent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const passed = percent >= PASS_PERCENT;

  // ─── Save score on summary entry ──────────────────────────────────────────
  if (phase === "summary" && !scoreSaved) {
    setScoreSaved(true);
    syncClearDraft(slug, { authenticated: !!user });
    trackGameEvent("pm_ed_completed", {
      score_percent: percent,
      passed,
      total_scenarios: totalScenarios,
    });
    saveGameScore({
      patternSlug: slug,
      scoreTotal: totalScore,
      scoreMax: maxScore,
      // Eval Designer doesn't have arch/resilience/efficiency dimensions —
      // map total score equally across the existing schema columns.
      architecture: Math.round(totalScore / 3),
      resilience: Math.round(totalScore / 3),
      efficiency: Math.round(totalScore / 3),
      passed,
    });
  }

  // ─── Previously completed view ────────────────────────────────────────────
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

  // ─── Summary view ─────────────────────────────────────────────────────────
  if (phase === "summary") {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-xl p-6 border text-center ${passed ? "bg-success/5 border-success/30" : "bg-red-500/5 border-red-500/30"}`}
        >
          <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-4">
            <Target size={26} className={passed ? "text-success" : "text-red-400"} />
          </div>
          <p className="font-mono text-xs text-text-secondary mb-1">Eval Designer</p>
          <h2 className={`text-2xl font-bold mb-2 ${passed ? "text-success" : "text-red-400"}`}>
            {percent}% — {passed ? "Rubric Architect" : "Calibrate Further"}
          </h2>
          <p className="text-text-secondary text-sm">
            {totalScore} / {maxScore} points across {totalScenarios} scenarios
          </p>
        </motion.div>

        <div className="space-y-3">
          <h4 className="font-mono text-sm text-text-secondary">Per-Scenario Breakdown</h4>
          {scenarioResults.map((r, i) => {
            const sc = scenarios[i];
            return (
              <div key={r.scenarioId} className="bg-code-bg border border-border rounded-lg p-4">
                <div className="flex items-baseline justify-between mb-2">
                  <p className="text-text-primary text-sm font-semibold">{sc.useCase}</p>
                  <span className={`font-mono text-sm ${r.score >= 60 ? "text-success" : "text-red-400"}`}>
                    {r.score}/100
                  </span>
                </div>
                <p className="font-mono text-[11px] text-text-secondary">{sc.category}</p>
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

  // ─── Feedback view (after submitting current scenario's rubric) ──────────
  if (phase === "feedback") {
    const currentResult = scenarioResults[scenarioResults.length - 1];
    const playerRubric = currentResult?.playerRubric ?? {};
    const score = currentResult?.score ?? 0;
    return (
      <div className="space-y-6">
        <div className={`rounded-xl p-5 border ${score >= 60 ? "bg-success/5 border-success/30" : "bg-red-500/5 border-red-500/30"}`}>
          <div className="flex items-center gap-3 mb-2">
            {score >= 60 ? (
              <CheckCircle2 size={22} className="text-success" />
            ) : (
              <XCircle size={22} className="text-red-400" />
            )}
            <p className={`text-lg font-bold ${score >= 60 ? "text-success" : "text-red-400"}`}>
              {score}/100 on this scenario
            </p>
          </div>
          <p className="text-text-secondary text-sm">
            Scenario {currentIdx + 1} of {totalScenarios}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-5">
          <h4 className="font-mono text-sm text-primary mb-3">Your rubric vs. expert rubric</h4>
          <div className="space-y-3">
            {scenario.criteria.map((c) => {
              const playerWeight = playerRubric[c.id] ?? 0;
              const expertWeight = c.expertWeight;
              const wasUsedByPlayer = playerWeight > 0;
              const wasUsedByExpert = expertWeight > 0;
              if (!wasUsedByPlayer && !wasUsedByExpert) return null; // skip irrelevant distractors
              const diff = Math.abs(playerWeight - expertWeight);
              const status = diff <= 5 ? "good" : diff <= 15 ? "okay" : "off";
              return (
                <div key={c.id} className="border-l-2 border-border pl-3">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm font-semibold text-text-primary">{c.name}</span>
                    <span className="font-mono text-xs">
                      <span className={
                        status === "good" ? "text-success" : status === "okay" ? "text-accent" : "text-red-400"
                      }>
                        you: {playerWeight}%
                      </span>
                      <span className="text-text-secondary"> · expert: {expertWeight}%</span>
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed">{c.rationale}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <Lightbulb size={18} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-mono text-xs text-primary mb-1">Design lesson</p>
            <p className="text-text-primary text-sm leading-relaxed">{scenario.designLesson}</p>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-mono text-sm rounded-lg transition-colors"
        >
          {currentIdx + 1 >= totalScenarios ? "See results" : "Next scenario"}
        </button>
      </div>
    );
  }

  // ─── Designing view (the main game) ──────────────────────────────────────
  const usedIds = new Set(Object.keys(draftRubric));
  const availableCriteria = scenario.criteria.filter((c) => !usedIds.has(c.id));

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-xs text-text-secondary">
          Scenario {currentIdx + 1} / {totalScenarios}
        </p>
        <p className="font-mono text-xs text-text-secondary">
          Eval Designer
        </p>
      </div>

      {/* Scenario card */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <p className="font-mono text-[11px] text-text-secondary uppercase tracking-wider mb-2">
          {scenario.category}
        </p>
        <h3 className="text-lg font-bold text-text-primary mb-2">{scenario.useCase}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{scenario.context}</p>
      </div>

      {/* Instructions */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="font-mono text-xs text-primary mb-1">Build the eval rubric</p>
        <p className="text-text-primary text-sm leading-relaxed">
          Pick 2-5 criteria from the pool. Assign each a weight. Total weights must sum to 100%.
          Your rubric will be scored against the expert rubric for this use case.
        </p>
      </div>

      {/* Player's rubric */}
      <div className="bg-code-bg border border-border rounded-xl p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h4 className="font-mono text-sm text-text-primary">Your rubric</h4>
          <span className={`font-mono text-sm ${totalWeight === 100 ? "text-success" : "text-text-secondary"}`}>
            {totalWeight}% / 100%
          </span>
        </div>
        {Object.keys(draftRubric).length === 0 ? (
          <p className="text-text-secondary text-sm py-4 text-center">
            Add criteria from the pool below to start building your rubric.
          </p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {Object.keys(draftRubric).map((id) => {
                const c = scenario.criteria.find((x) => x.id === id);
                if (!c) return null;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="flex items-center gap-3 bg-background border border-border rounded-lg p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{c.name}</p>
                      <p className="text-xs text-text-secondary line-clamp-1">{c.description}</p>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={draftRubric[id]}
                      onChange={(e) => handleWeightChange(id, parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1.5 bg-code-bg border border-border rounded text-text-primary font-mono text-sm text-right focus:outline-none focus:border-primary"
                    />
                    <span className="font-mono text-sm text-text-secondary">%</span>
                    <button
                      onClick={() => handleRemoveCriterion(id)}
                      className="p-1.5 text-text-secondary hover:text-red-400 transition-colors"
                      aria-label={`Remove ${c.name}`}
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Pool of available criteria */}
      {availableCriteria.length > 0 && (
        <div>
          <h4 className="font-mono text-sm text-text-secondary mb-3">Criterion pool</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableCriteria.map((c) => (
              <button
                key={c.id}
                onClick={() => handleAddCriterion(c.id)}
                className="text-left bg-surface border border-border hover:border-accent/40 rounded-lg p-3 transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <Plus size={14} className="text-text-secondary group-hover:text-accent mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{c.name}</p>
                    <p className="text-xs text-text-secondary leading-snug mt-0.5">{c.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 font-mono text-sm rounded-lg transition-colors ${
          canSubmit
            ? "bg-accent hover:bg-accent/90 text-white"
            : "bg-surface border border-border text-text-secondary cursor-not-allowed"
        }`}
      >
        {canSubmit
          ? "Submit rubric"
          : totalWeight !== 100
            ? `Adjust weights to total 100% (currently ${totalWeight}%)`
            : "Pick at least 2 criteria"}
      </button>
    </div>
  );
}
