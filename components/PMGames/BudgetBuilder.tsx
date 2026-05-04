"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, Gauge, Clock, Play, ArrowRight,
  RotateCcw, Trophy, CheckCircle2, XCircle, Target,
  Lightbulb, BadgeDollarSign, Shield, Share2,
} from "lucide-react";
import { calculateBudgetResult } from "@/data/pm-games";
import type { BudgetScenario } from "@/data/pm-games";
import { useAuth } from "@/contexts/AuthContext";
import { trackGameEvent } from "@/lib/game/analytics";
import { syncSaveDraft, syncLoadDraft, syncClearDraft } from "@/lib/game/draft-sync";
import GamePreviouslyCompleted from "./GamePreviouslyCompleted";

type Phase = "allocating" | "results" | "summary";

interface ScenarioResult {
  scenarioId: string;
  totalScore: number;
  maxScore: number;
  passed: boolean;
  withinBudget: boolean;
  meetsQuality: boolean;
  meetsLatency: boolean;
  monthlyCost: number;
  budgetRatio: number;
}

interface BBDraft {
  currentIdx: number;
  scenarioResults: ScenarioResult[];
}

interface PreviousResult {
  scoreTotal: number;
  scoreMax: number;
  passed: boolean;
  playedAt: string;
}

interface BudgetBuilderProps {
  scenarios: BudgetScenario[];
  /** Save slug for game_scores. Also used as draft key. */
  slug: string;
  /** Display title for the previously-completed view. */
  title: string;
}

export default function BudgetBuilder({ scenarios, slug, title }: BudgetBuilderProps) {
  const { user, isLoading, gameScores, saveGameScore } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("allocating");
  const [allocations, setAllocations] = useState<Record<string, string>>({});
  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [previousResult, setPreviousResult] = useState<PreviousResult | null>(null);
  const hydratedRef = useRef(false);

  const scenario = scenarios[currentIdx];
  const totalScenarios = scenarios.length;

  // Hydrate on mount: prefer DB-confirmed completion, fall back to localStorage draft.
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

    syncLoadDraft<BBDraft>(slug, { authenticated: !!user }).then((draft) => {
      if (draft && draft.currentIdx > 0 && draft.currentIdx < scenarios.length) {
        setCurrentIdx(draft.currentIdx);
        setScenarioResults(draft.scenarioResults);
      }
    });
  }, [isLoading, user, gameScores]);

  // Save draft whenever scenario advances (DB-synced if authed)
  useEffect(() => {
    if (scenarioResults.length > 0 && phase === "allocating") {
      syncSaveDraft<BBDraft>(slug, { currentIdx, scenarioResults }, { authenticated: !!user });
    }
  }, [currentIdx, scenarioResults, phase, user]);

  // Track game start on mount
  useEffect(() => {
    trackGameEvent("pm_bb_started", { total_scenarios: totalScenarios });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize allocations when scenario changes
  useMemo(() => {
    if (phase === "allocating" && Object.keys(allocations).length === 0) {
      const defaults: Record<string, string> = {};
      for (const comp of scenario.components) {
        defaults[comp.id] = "mid";
      }
      setAllocations(defaults);
    }
  }, [scenario, phase, allocations]);

  const liveResult = useMemo(
    () => calculateBudgetResult(allocations, scenario),
    [allocations, scenario],
  );

  const handleTierChange = useCallback((componentId: string, fromTier: string, toTier: string) => {
    setAllocations((prev) => ({ ...prev, [componentId]: toTier }));
    trackGameEvent("pm_bb_tier_changed", {
      component_id: componentId,
      from_tier: fromTier,
      to_tier: toTier,
      scenario_id: scenario.id,
    });
  }, [scenario.id]);

  const handleRun = useCallback(() => {
    const result = calculateBudgetResult(allocations, scenario);
    const budgetRatio = result.monthlyCost / scenario.monthlyBudget;
    setScenarioResults((prev) => [
      ...prev,
      {
        scenarioId: scenario.id,
        totalScore: result.totalScore,
        maxScore: result.maxScore,
        passed: result.passed,
        withinBudget: result.withinBudget,
        meetsQuality: result.meetsQuality,
        meetsLatency: result.meetsLatency,
        monthlyCost: result.monthlyCost,
        budgetRatio,
      },
    ]);

    trackGameEvent("pm_bb_scenario_submitted", {
      scenario_id: scenario.id,
      scenario_index: currentIdx,
      score: result.totalScore,
      within_budget: result.withinBudget,
      meets_quality: result.meetsQuality,
      meets_latency: result.meetsLatency,
      monthly_cost: result.monthlyCost,
      budget_ratio: budgetRatio,
      allocations,
    });

    setPhase("results");
  }, [allocations, scenario, currentIdx]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= totalScenarios) {
      setPhase("summary");
    } else {
      setCurrentIdx((prev) => prev + 1);
      setAllocations({});
      setPhase("allocating");
    }
  }, [currentIdx, totalScenarios]);

  const handleReset = useCallback(() => {
    trackGameEvent("pm_bb_retry", {
      previous_score: scenarioResults.length > 0
        ? Math.round(
            (scenarioResults.reduce((s, r) => s + r.totalScore, 0) /
              scenarioResults.reduce((s, r) => s + r.maxScore, 0)) * 100
          )
        : 0,
    });
    setCurrentIdx(0);
    setPhase("allocating");
    setAllocations({});
    setScenarioResults([]);
    setScoreSaved(false);
    setPreviousResult(null);
    syncClearDraft(slug, { authenticated: !!user });
  }, [scenarioResults]);

  const totalScoreSum = scenarioResults.reduce((sum, r) => sum + r.totalScore, 0);
  const totalMaxSum = scenarioResults.reduce((sum, r) => sum + r.maxScore, 0);
  const finalPercent = totalMaxSum > 0 ? Math.round((totalScoreSum / totalMaxSum) * 100) : 0;
  const finalPassed = finalPercent >= 60;

  const allTripleThreat = scenarioResults.length > 0 &&
    scenarioResults.every((r) => r.withinBudget && r.meetsQuality && r.meetsLatency);
  const budgetHawk = scenarioResults.length > 0 &&
    scenarioResults.every((r) => r.budgetRatio <= 0.7 && r.meetsQuality);

  // ─── Previously completed (DB-backed) — short-circuit before any save side effects ───
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

  // Save on summary
  if (phase === "summary" && !scoreSaved) {
    setScoreSaved(true);
    syncClearDraft(slug, { authenticated: !!user });
    const avgQuality = Math.round(totalScoreSum / totalScenarios);
    const scenariosPassed = scenarioResults.filter((r) => r.passed).length;

    trackGameEvent("pm_bb_completed", {
      total_score: totalScoreSum,
      total_max: totalMaxSum,
      percent: finalPercent,
      passed: finalPassed,
      scenarios_passed: scenariosPassed,
      total_scenarios: totalScenarios,
      triple_threat: allTripleThreat,
      budget_hawk: budgetHawk,
    });

    saveGameScore({
      patternSlug: slug,
      scoreTotal: totalScoreSum,
      scoreMax: totalMaxSum,
      architecture: Math.round(avgQuality * 0.4),
      resilience: Math.round(avgQuality * 0.4),
      efficiency: Math.round(avgQuality * 0.2),
      passed: finalPassed,
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
            finalPassed ? "border-success/30" : "border-red-500/30"
          }`}
        >
          <Trophy size={48} className={`mx-auto mb-3 ${finalPassed ? "text-success" : "text-red-400"}`} />
          <p className={`font-mono text-4xl font-bold mb-1 ${finalPassed ? "text-success" : "text-red-400"}`}>
            {finalPercent}%
          </p>
          <p className="text-text-secondary text-sm font-mono">
            {totalScoreSum} / {totalMaxSum} points across {totalScenarios} scenarios
          </p>

          {/* Badges */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {allTripleThreat && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="inline-flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-3 py-1"
              >
                <Shield size={14} className="text-success" />
                <span className="font-mono text-xs text-success font-bold">Triple Threat</span>
              </motion.div>
            )}
            {budgetHawk && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.4 }}
                className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/30 rounded-full px-3 py-1"
              >
                <BadgeDollarSign size={14} className="text-accent" />
                <span className="font-mono text-xs text-accent font-bold">Budget Hawk</span>
              </motion.div>
            )}
          </div>

          <p className={`mt-3 text-sm ${finalPassed ? "text-success/80" : "text-text-secondary"}`}>
            {allTripleThreat
              ? "Exceptional — you nailed cost, quality, and latency on every scenario."
              : finalPassed
                ? "Excellent budget sense! You balanced cost, quality, and speed like a pro."
                : "Budget optimization is an art. Review each scenario to see where you could improve."}
          </p>
        </motion.div>

        <div className="space-y-3">
          {scenarioResults.map((result, i) => (
            <motion.div
              key={result.scenarioId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 bg-code-bg border border-border rounded-lg px-4 py-3"
            >
              {result.passed ? (
                <CheckCircle2 size={14} className="text-success" />
              ) : (
                <XCircle size={14} className="text-red-400" />
              )}
              <span className="text-text-primary text-sm flex-1">{scenarios[i].title}</span>
              <div className="flex items-center gap-2">
                {result.withinBudget && result.meetsQuality && result.meetsLatency && (
                  <span className="text-[10px] font-mono text-success/60">3/3</span>
                )}
                <span className={`font-mono text-sm font-bold ${result.passed ? "text-success" : "text-red-400"}`}>
                  {result.totalScore}/{result.maxScore}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {finalPassed && (
            <button
              onClick={() => {
                const text = `I scored ${finalPercent}% on the Budget Builder challenge on LearnAgenticPatterns! ${allTripleThreat ? "Triple Threat badge!" : ""}\n\nCan you beat my score? → practice.learnagenticpatterns.com`;
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

  // ─── Results View (per-scenario) ───
  if (phase === "results") {
    const result = calculateBudgetResult(allocations, scenario);
    return (
      <div className="space-y-5">
        <SimulationResult result={result} scenario={scenario} allocations={allocations} />

        {/* Optimization Tip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-3"
        >
          <p className="text-accent text-xs font-mono mb-1 flex items-center gap-1.5">
            <Lightbulb size={12} /> Pro Tip
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {scenario.optimizationTip}
          </p>
        </motion.div>

        <div className="text-center">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-mono text-sm px-6 py-2.5 rounded-md transition-all"
          >
            {currentIdx + 1 >= totalScenarios ? "See Final Results" : "Next Scenario"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ─── Allocation View ───
  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-text-secondary">
          Scenario {currentIdx + 1}/{totalScenarios}
        </span>
        <div className="flex-1 h-1.5 bg-code-bg rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            animate={{ width: `${(currentIdx / totalScenarios) * 100}%` }}
          />
        </div>
      </div>

      {/* Scenario Brief */}
      <div className="bg-surface border border-primary/20 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <Target size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-mono text-primary text-sm font-bold mb-1">{scenario.title}</h3>
            <p className="text-text-primary text-sm leading-relaxed mb-2">{scenario.userStory}</p>
            <p className="text-text-secondary text-xs leading-relaxed italic">{scenario.context}</p>
          </div>
        </div>
      </div>

      {/* Budget + Targets */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-code-bg border border-border rounded-lg p-2 sm:p-3 text-center">
          <DollarSign size={16} className="text-accent mx-auto mb-1" />
          <p className="font-mono text-base sm:text-lg font-bold text-text-primary">${scenario.monthlyBudget.toLocaleString()}</p>
          <p className="text-text-secondary text-[10px]">Monthly Budget</p>
        </div>
        <div className="bg-code-bg border border-border rounded-lg p-2 sm:p-3 text-center">
          <Gauge size={16} className="text-primary mx-auto mb-1" />
          <p className="font-mono text-base sm:text-lg font-bold text-text-primary">{scenario.qualityThreshold}%+</p>
          <p className="text-text-secondary text-[10px]">Quality Target</p>
        </div>
        <div className="bg-code-bg border border-border rounded-lg p-2 sm:p-3 text-center">
          <Clock size={16} className="text-success mx-auto mb-1" />
          <p className="font-mono text-base sm:text-lg font-bold text-text-primary">{(scenario.latencyTarget / 1000).toFixed(1)}s</p>
          <p className="text-text-secondary text-[10px]">Latency Target</p>
        </div>
      </div>

      {/* Allocation Controls */}
      <div className="space-y-4">
        <h4 className="font-mono text-xs text-text-secondary">Assign a model tier to each component:</h4>
        {scenario.components.map((comp) => (
          <ComponentAllocator
            key={comp.id}
            component={comp}
            scenario={scenario}
            selectedTier={allocations[comp.id] || "mid"}
            onTierChange={handleTierChange}
          />
        ))}
      </div>

      {/* Live Preview */}
      <LivePreview result={liveResult} budget={scenario.monthlyBudget} />

      {/* Run Button */}
      <button
        onClick={handleRun}
        className="w-full inline-flex items-center justify-center gap-2 bg-success/20 hover:bg-success/30 text-success font-mono text-sm px-5 py-3 rounded-md transition-all border border-success/30"
      >
        <Play size={14} />
        Lock In & Simulate
      </button>
    </div>
  );
}

// ─── Component Allocator ─────────────────────────────────────────────────────

function ComponentAllocator({
  component,
  scenario,
  selectedTier,
  onTierChange,
}: {
  component: { id: string; name: string; description: string; requestsPerMonth: number };
  scenario: BudgetScenario;
  selectedTier: string;
  onTierChange: (componentId: string, fromTier: string, toTier: string) => void;
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="mb-3">
        <p className="text-text-primary text-sm font-medium">{component.name}</p>
        <p className="text-text-secondary text-xs">{component.description} · {component.requestsPerMonth}K req/mo</p>
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {scenario.modelTiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => onTierChange(component.id, selectedTier, tier.id)}
              className={`text-left p-2.5 rounded-md border transition-all text-xs ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/30 text-text-secondary"
              }`}
            >
              <p className={`font-medium mb-0.5 ${isSelected ? "text-primary" : "text-text-primary"}`}>
                {tier.name.split(" (")[0]}
              </p>
              <p className="text-[10px] leading-tight opacity-70">
                ${tier.costPer1k}/1K · Q:{tier.qualityScore} · {tier.latencyMs}ms
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Live Preview ────────────────────────────────────────────────────────────

function LivePreview({
  result,
  budget,
}: {
  result: ReturnType<typeof calculateBudgetResult>;
  budget: number;
}) {
  return (
    <div className="bg-code-bg border border-border/50 rounded-lg p-4">
      <p className="font-mono text-xs text-text-secondary mb-3">Live Estimate</p>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div>
          <p className={`font-mono text-base sm:text-lg font-bold ${result.withinBudget ? "text-success" : "text-red-400"}`}>
            ${result.monthlyCost.toLocaleString()}
          </p>
          <p className="text-text-secondary text-[10px]">
            of ${budget.toLocaleString()} budget
          </p>
        </div>
        <div>
          <p className={`font-mono text-base sm:text-lg font-bold ${result.meetsQuality ? "text-success" : "text-red-400"}`}>
            {result.avgQuality}%
          </p>
          <p className="text-text-secondary text-[10px]">Avg Quality</p>
        </div>
        <div>
          <p className={`font-mono text-base sm:text-lg font-bold ${result.meetsLatency ? "text-success" : "text-red-400"}`}>
            {(result.avgLatency / 1000).toFixed(1)}s
          </p>
          <p className="text-text-secondary text-[10px]">Avg Latency</p>
        </div>
      </div>
    </div>
  );
}

// ─── Simulation Result ───────────────────────────────────────────────────────

function SimulationResult({
  result,
  scenario,
  allocations,
}: {
  result: ReturnType<typeof calculateBudgetResult>;
  scenario: BudgetScenario;
  allocations: Record<string, string>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Score header */}
      <div className={`bg-surface border rounded-xl p-5 text-center ${
        result.passed ? "border-success/30" : "border-red-500/30"
      }`}>
        <p className={`font-mono text-3xl font-bold ${result.passed ? "text-success" : "text-red-400"}`}>
          {result.totalScore}/100
        </p>
        <p className="text-text-secondary text-xs font-mono mt-1">
          {result.passed ? "Budget allocation approved!" : "Budget needs optimization."}
        </p>
        {result.withinBudget && result.meetsQuality && result.meetsLatency && (
          <p className="text-success/60 text-[10px] font-mono mt-1">All 3 constraints met</p>
        )}
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: "Quality", score: result.qualityScore, max: 40, met: result.meetsQuality, icon: Gauge },
          { label: "Cost Efficiency", score: result.costScore, max: 40, met: result.withinBudget, icon: DollarSign },
          { label: "Latency", score: result.latencyScore, max: 20, met: result.meetsLatency, icon: Clock },
        ].map((cat) => (
          <div
            key={cat.label}
            className={`bg-code-bg border rounded-lg p-2 sm:p-3 text-center ${
              cat.met ? "border-success/20" : "border-red-500/20"
            }`}
          >
            <cat.icon size={14} className={`mx-auto mb-1 ${cat.met ? "text-success" : "text-red-400"}`} />
            <p className="font-mono text-lg font-bold text-text-primary">{cat.score}/{cat.max}</p>
            <p className="text-text-secondary text-[10px]">{cat.label}</p>
          </div>
        ))}
      </div>

      {/* Allocation summary */}
      <div className="bg-code-bg border border-border rounded-lg p-4">
        <h4 className="font-mono text-xs text-text-secondary mb-3">{">"} Your Allocations</h4>
        {scenario.components.map((comp) => {
          const tierId = allocations[comp.id];
          const tier = scenario.modelTiers.find((t) => t.id === tierId);
          const cost = tier ? Math.round((comp.requestsPerMonth * tier.costPer1k) / 1000) : 0;
          return (
            <div key={comp.id} className="flex items-center gap-3 py-1.5">
              <span className="text-text-primary text-xs flex-1">{comp.name}</span>
              <span className="font-mono text-xs text-primary">{tier?.name.split(" (")[0]}</span>
              <span className="font-mono text-xs text-text-secondary w-16 text-right">${cost}/mo</span>
            </div>
          );
        })}
        <div className="border-t border-border/30 mt-2 pt-2 flex items-center gap-3">
          <span className="text-text-primary text-xs font-bold flex-1">Total</span>
          <span className={`font-mono text-sm font-bold ${result.withinBudget ? "text-success" : "text-red-400"}`}>
            ${result.monthlyCost.toLocaleString()}/mo
          </span>
        </div>
      </div>
    </motion.div>
  );
}
