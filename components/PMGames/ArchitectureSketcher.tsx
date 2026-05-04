"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Boxes, CheckCircle2, XCircle, Plus, X, RotateCcw, Lightbulb,
  ArrowDown, MoveUp, MoveDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { trackGameEvent } from "@/lib/game/analytics";
import { syncSaveDraft, syncLoadDraft, syncClearDraft } from "@/lib/game/draft-sync";
import GamePreviouslyCompleted from "./GamePreviouslyCompleted";
import type { ArchScenario, ArchScenarioBlockRole } from "@/data/pm-architecture-sketcher";

type Phase = "designing" | "feedback" | "summary";

interface ScenarioResult {
  scenarioId: string;
  pickedBlockIds: string[];
  /** Score 0-100. */
  score: number;
  timeMs: number;
}

interface ASDraft {
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
  scenarios: ArchScenario[];
  slug: string;
  title: string;
}

const PASS_PERCENT = 60;

function scoreArchitecture(picked: string[], roles: ArchScenarioBlockRole[]): number {
  // Coverage: each must-have picked = +(60/mustHaveCount) points.
  // Bonus: each nice-to-have picked = +(20/niceCount) points.
  // Penalty: each wrong-block picked = -10 points (capped).
  // Ordering: optional small bonus for getting must-haves in expert order (up to 20).
  const mustHaves = roles.filter((r) => r.role === "must-have");
  const niceHaves = roles.filter((r) => r.role === "nice-to-have");
  const wrongs = new Set(roles.filter((r) => r.role === "wrong").map((r) => r.blockId));

  const pickedSet = new Set(picked);
  const mustPicked = mustHaves.filter((r) => pickedSet.has(r.blockId)).length;
  const nicePicked = niceHaves.filter((r) => pickedSet.has(r.blockId)).length;
  const wrongPicked = picked.filter((id) => wrongs.has(id)).length;

  const coverage = mustHaves.length > 0 ? (mustPicked / mustHaves.length) * 60 : 0;
  const niceBonus = niceHaves.length > 0 ? (nicePicked / niceHaves.length) * 20 : 0;
  const wrongPenalty = Math.min(wrongPicked * 10, 30);

  // Ordering bonus: count how many must-have-picked blocks are in correct expert order.
  const pickedMustOrdered = picked
    .map((id) => mustHaves.find((m) => m.blockId === id))
    .filter((r): r is ArchScenarioBlockRole => !!r);
  let orderingBonus = 0;
  if (pickedMustOrdered.length >= 2) {
    let inOrder = 0;
    for (let i = 1; i < pickedMustOrdered.length; i++) {
      const prev = pickedMustOrdered[i - 1].expertOrder ?? 0;
      const curr = pickedMustOrdered[i].expertOrder ?? 0;
      if (prev > 0 && curr > 0 && curr > prev) inOrder += 1;
    }
    orderingBonus = (inOrder / (pickedMustOrdered.length - 1)) * 20;
  }

  return Math.max(0, Math.min(100, Math.round(coverage + niceBonus + orderingBonus - wrongPenalty)));
}

export default function ArchitectureSketcher({ scenarios, slug, title }: Props) {
  const { user, isLoading, gameScores, saveGameScore } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("designing");
  /** Ordered list of block ids the player has placed in their architecture. */
  const [placed, setPlaced] = useState<string[]>([]);
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
    syncLoadDraft<ASDraft>(slug, { authenticated: !!user }).then((draft) => {
      if (draft && draft.currentIdx > 0 && draft.currentIdx < scenarios.length) {
        setCurrentIdx(draft.currentIdx);
        setScenarioResults(draft.scenarioResults);
      }
    });
  }, [isLoading, user, gameScores, slug, scenarios.length]);

  useEffect(() => {
    if (scenarioResults.length > 0 && phase === "designing") {
      syncSaveDraft<ASDraft>(slug, { currentIdx, scenarioResults }, { authenticated: !!user });
    }
  }, [currentIdx, scenarioResults, phase, user, slug]);

  useEffect(() => {
    trackGameEvent("pm_as_started", { total_scenarios: totalScenarios });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPlaced([]);
    startTimeRef.current = Date.now();
  }, [currentIdx]);

  const addBlock = (id: string) => {
    if (placed.includes(id)) return;
    if (placed.length >= 7) return; // cap
    setPlaced((prev) => [...prev, id]);
  };

  const removeBlock = (id: string) => {
    setPlaced((prev) => prev.filter((x) => x !== id));
  };

  const moveUp = (id: string) => {
    setPlaced((prev) => {
      const i = prev.indexOf(id);
      if (i <= 0) return prev;
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const moveDown = (id: string) => {
    setPlaced((prev) => {
      const i = prev.indexOf(id);
      if (i < 0 || i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const canSubmit = placed.length >= 3;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    const elapsed = Date.now() - startTimeRef.current;
    const score = scoreArchitecture(placed, scenario.blockRoles);
    setScenarioResults((prev) => [
      ...prev,
      { scenarioId: scenario.id, pickedBlockIds: [...placed], score, timeMs: elapsed },
    ]);
    trackGameEvent("pm_as_scenario_submitted", {
      scenario_id: scenario.id,
      score,
      blocks_placed: placed.length,
      elapsed_ms: elapsed,
    });
    setPhase("feedback");
  }, [canSubmit, placed, scenario]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= totalScenarios) setPhase("summary");
    else { setCurrentIdx((i) => i + 1); setPhase("designing"); }
  }, [currentIdx, totalScenarios]);

  const handleReset = useCallback(() => {
    trackGameEvent("pm_as_retry", {
      previous_score: scenarioResults.length > 0
        ? Math.round(scenarioResults.reduce((s, r) => s + r.score, 0) / scenarioResults.length)
        : 0,
    });
    setCurrentIdx(0);
    setPhase("designing");
    setPlaced([]);
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
    trackGameEvent("pm_as_completed", { score_percent: percent, passed });
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
            <Boxes size={26} className={passed ? "text-success" : "text-red-400"} />
          </div>
          <p className="font-mono text-xs text-text-secondary mb-1">Architecture Sketcher</p>
          <h2 className={`text-2xl font-bold mb-2 ${passed ? "text-success" : "text-red-400"}`}>
            {percent}% — {passed ? "Sound architect" : "Re-think the topology"}
          </h2>
          <p className="text-text-secondary text-sm">
            {totalScore} / {maxScore} points across {totalScenarios} architectures
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
    const placedSet = new Set(result?.pickedBlockIds ?? []);
    const allRolesById = new Map(scenario.blockRoles.map((r) => [r.blockId, r]));
    const allBlocksById = new Map(scenario.blockPool.map((b) => [b.id, b]));
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
              {result?.score ?? 0}/100 on this architecture
            </p>
          </div>
          <p className="text-text-secondary text-sm">Scenario {currentIdx + 1} of {totalScenarios}</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-mono text-sm text-text-primary">Block-by-block review</h4>
          {scenario.blockRoles.map((r) => {
            const wasPicked = placedSet.has(r.blockId);
            // Show: all must-haves + all picks. Hide unpicked nice-to-haves and unpicked wrongs.
            if (!wasPicked && r.role === "nice-to-have") return null;
            if (!wasPicked && r.role === "wrong") return null;
            const block = allBlocksById.get(r.blockId);
            if (!block) return null;
            const status =
              wasPicked && r.role === "must-have" ? "right-must"
                : wasPicked && r.role === "nice-to-have" ? "right-nice"
                  : wasPicked && r.role === "wrong" ? "wrong-pick"
                    : "missed-must";
            const cls =
              status === "right-must" ? "border-success/40 bg-success/5"
                : status === "right-nice" ? "border-success/30 bg-success/5"
                  : status === "wrong-pick" ? "border-red-500/40 bg-red-500/5"
                    : "border-amber-500/40 bg-amber-500/5";
            const labelText =
              status === "right-must" ? "Right call (must-have)"
                : status === "right-nice" ? "Bonus (nice-to-have)"
                  : status === "wrong-pick" ? "Wrong fit"
                    : "Missed (would have been required)";
            const labelColor =
              status === "right-must" ? "text-success"
                : status === "right-nice" ? "text-success/80"
                  : status === "wrong-pick" ? "text-red-400"
                    : "text-amber-400";
            return (
              <div key={r.blockId} className={`rounded-lg border p-4 ${cls}`}>
                <div className="flex items-baseline justify-between mb-1">
                  <p className="text-sm font-semibold text-text-primary">{block.label}</p>
                  <span className={`font-mono text-xs ${labelColor}`}>{labelText}</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">{r.rationale}</p>
              </div>
            );
          })}
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
          {currentIdx + 1 >= totalScenarios ? "See results" : "Next architecture"}
        </button>
      </div>
    );
  }

  // ─── Designing view ──────────────────────────────────────────────────────
  const allBlocksById = new Map(scenario.blockPool.map((b) => [b.id, b]));
  const placedSet = new Set(placed);
  const available = scenario.blockPool.filter((b) => !placedSet.has(b.id));

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-xs text-text-secondary">
          Architecture {currentIdx + 1} / {totalScenarios}
        </p>
        <p className="font-mono text-xs text-text-secondary">Architecture Sketcher</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5">
        <p className="font-mono text-[11px] text-text-secondary uppercase tracking-wider mb-2">
          {scenario.category}
        </p>
        <h3 className="text-base font-bold text-text-primary mb-2">{scenario.useCase}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{scenario.context}</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="font-mono text-xs text-primary mb-1">Sketch the architecture</p>
        <p className="text-text-primary text-sm leading-relaxed">
          Pick 3-7 blocks from the pool, ordered by data flow (top = first step in request).
          Score reflects coverage (right blocks present), bonus for nice-to-haves, penalty for
          wrong fits, and a small bonus for correct ordering.
        </p>
      </div>

      {/* Player's flow */}
      <div className="bg-code-bg border border-border rounded-xl p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h4 className="font-mono text-sm text-text-primary">Your architecture (top → bottom)</h4>
          <span className="font-mono text-xs text-text-secondary">{placed.length} / 7</span>
        </div>
        {placed.length === 0 ? (
          <p className="text-text-secondary text-sm py-4 text-center">
            Add blocks from the pool below.
          </p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {placed.map((id, i) => {
                const block = allBlocksById.get(id);
                if (!block) return null;
                return (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="flex items-center gap-3 bg-background border border-accent/30 rounded-lg p-3"
                  >
                    <span className="font-mono text-xs text-accent flex-shrink-0">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">{block.label}</p>
                      <p className="text-xs text-text-secondary line-clamp-1">{block.description}</p>
                    </div>
                    <button
                      onClick={() => moveUp(id)}
                      disabled={i === 0}
                      className="p-1.5 text-text-secondary hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move up"
                    >
                      <MoveUp size={14} />
                    </button>
                    <button
                      onClick={() => moveDown(id)}
                      disabled={i === placed.length - 1}
                      className="p-1.5 text-text-secondary hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move down"
                    >
                      <MoveDown size={14} />
                    </button>
                    <button
                      onClick={() => removeBlock(id)}
                      className="p-1.5 text-text-secondary hover:text-red-400 transition-colors"
                      aria-label="Remove"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {placed.length >= 2 && (
              <div className="flex items-center justify-center py-1">
                <ArrowDown size={14} className="text-text-secondary/50" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pool */}
      {available.length > 0 && (
        <div>
          <h4 className="font-mono text-sm text-text-secondary mb-3">Block pool</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {available.map((b) => (
              <button
                key={b.id}
                onClick={() => addBlock(b.id)}
                className="text-left bg-surface border border-border hover:border-accent/40 rounded-lg p-3 transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <Plus size={14} className="text-text-secondary group-hover:text-accent mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{b.label}</p>
                    <p className="text-xs text-text-secondary leading-snug mt-0.5">{b.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 font-mono text-sm rounded-lg transition-colors ${
          canSubmit
            ? "bg-accent hover:bg-accent/90 text-white"
            : "bg-surface border border-border text-text-secondary cursor-not-allowed"
        }`}
      >
        {canSubmit ? "Submit architecture" : "Place at least 3 blocks"}
      </button>
    </div>
  );
}
