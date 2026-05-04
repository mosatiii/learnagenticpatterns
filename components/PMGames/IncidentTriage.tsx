"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, RotateCcw, FileText, Activity, Lightbulb } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { trackGameEvent } from "@/lib/game/analytics";
import { syncSaveDraft, syncLoadDraft, syncClearDraft } from "@/lib/game/draft-sync";
import GamePreviouslyCompleted from "./GamePreviouslyCompleted";
import type { IncidentScenario } from "@/data/pm-incident-triage";

type Phase = "diagnosing" | "feedback" | "summary";

interface ScenarioResult {
  scenarioId: string;
  chosenOptionId: string;
  correct: boolean;
  timeMs: number;
}

interface ITDraft {
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
  scenarios: IncidentScenario[];
  slug: string;
  title: string;
}

const PASS_PERCENT = 60;

export default function IncidentTriage({ scenarios, slug, title }: Props) {
  const { user, isLoading, gameScores, saveGameScore } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("diagnosing");
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [previousResult, setPreviousResult] = useState<PreviousResult | null>(null);
  const hydratedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  const scenario = scenarios[currentIdx];
  const totalScenarios = scenarios.length;

  // Hydrate
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
    syncLoadDraft<ITDraft>(slug, { authenticated: !!user }).then((draft) => {
      if (draft && draft.currentIdx > 0 && draft.currentIdx < scenarios.length) {
        setCurrentIdx(draft.currentIdx);
        setScenarioResults(draft.scenarioResults);
      }
    });
  }, [isLoading, user, gameScores, slug, scenarios.length]);

  // Draft persistence
  useEffect(() => {
    if (scenarioResults.length > 0 && phase === "diagnosing") {
      syncSaveDraft<ITDraft>(slug, { currentIdx, scenarioResults }, { authenticated: !!user });
    }
  }, [currentIdx, scenarioResults, phase, user, slug]);

  useEffect(() => {
    trackGameEvent("pm_it_started", { total_scenarios: totalScenarios });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setChosenId(null);
    startTimeRef.current = Date.now();
  }, [currentIdx]);

  const handleSubmit = useCallback(() => {
    if (!chosenId) return;
    const opt = scenario.options.find((o) => o.id === chosenId);
    if (!opt) return;
    const elapsed = Date.now() - startTimeRef.current;
    setScenarioResults((prev) => [
      ...prev,
      { scenarioId: scenario.id, chosenOptionId: chosenId, correct: opt.isCorrect, timeMs: elapsed },
    ]);
    trackGameEvent("pm_it_diagnosis_submitted", {
      scenario_id: scenario.id,
      correct: opt.isCorrect,
      elapsed_ms: elapsed,
    });
    setPhase("feedback");
  }, [chosenId, scenario]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= totalScenarios) setPhase("summary");
    else { setCurrentIdx((i) => i + 1); setPhase("diagnosing"); }
  }, [currentIdx, totalScenarios]);

  const handleReset = useCallback(() => {
    trackGameEvent("pm_it_retry", {
      previous_score: scenarioResults.length > 0
        ? Math.round((scenarioResults.filter((r) => r.correct).length / scenarioResults.length) * 100)
        : 0,
    });
    setCurrentIdx(0);
    setPhase("diagnosing");
    setChosenId(null);
    setScenarioResults([]);
    setScoreSaved(false);
    setPreviousResult(null);
    syncClearDraft(slug, { authenticated: !!user });
  }, [scenarioResults, slug, user]);

  const correctCount = scenarioResults.filter((r) => r.correct).length;
  const scoreTotal = correctCount * 20;
  const scoreMax = totalScenarios * 20;
  const percent = Math.round((scoreTotal / scoreMax) * 100);
  const passed = percent >= PASS_PERCENT;

  if (phase === "summary" && !scoreSaved) {
    setScoreSaved(true);
    syncClearDraft(slug, { authenticated: !!user });
    trackGameEvent("pm_it_completed", { score_percent: percent, passed, correct_count: correctCount });
    saveGameScore({
      patternSlug: slug,
      scoreTotal,
      scoreMax,
      architecture: correctCount * 7,
      resilience: correctCount * 7,
      efficiency: correctCount * 6,
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
            <Activity size={26} className={passed ? "text-success" : "text-red-400"} />
          </div>
          <p className="font-mono text-xs text-text-secondary mb-1">Incident Triage</p>
          <h2 className={`text-2xl font-bold mb-2 ${passed ? "text-success" : "text-red-400"}`}>
            {percent}% — {correctCount} of {totalScenarios} diagnoses correct
          </h2>
          <p className="text-text-secondary text-sm">
            {passed ? "Solid root-cause instinct." : "Re-read the resolutions; the patterns repeat in production."}
          </p>
        </motion.div>

        <div className="space-y-3">
          <h4 className="font-mono text-sm text-text-secondary">Per-Incident Review</h4>
          {scenarioResults.map((r, i) => {
            const sc = scenarios[i];
            return (
              <div key={r.scenarioId} className="bg-code-bg border border-border rounded-lg p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-text-primary text-sm font-semibold">{sc.headline}</p>
                  <span className={`font-mono text-xs ${r.correct ? "text-success" : "text-red-400"}`}>
                    {r.correct ? "Correct" : "Misdiagnosed"}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-text-secondary mt-1">{sc.category}</p>
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
    const chosen = scenario.options.find((o) => o.id === result?.chosenOptionId);
    const correctOpt = scenario.options.find((o) => o.isCorrect);
    return (
      <div className="space-y-5">
        <div className={`rounded-xl p-5 border ${result?.correct ? "bg-success/5 border-success/30" : "bg-red-500/5 border-red-500/30"}`}>
          <div className="flex items-center gap-3 mb-1">
            {result?.correct ? <CheckCircle2 size={22} className="text-success" /> : <XCircle size={22} className="text-red-400" />}
            <p className={`text-lg font-bold ${result?.correct ? "text-success" : "text-red-400"}`}>
              {result?.correct ? "Correct diagnosis" : "Misdiagnosed"}
            </p>
          </div>
          <p className="text-text-secondary text-sm">Scenario {currentIdx + 1} of {totalScenarios}</p>
        </div>

        {chosen && !chosen.isCorrect && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <p className="font-mono text-xs text-red-400 mb-1">Your diagnosis: {chosen.label}</p>
            <p className="text-text-primary text-sm leading-relaxed">{chosen.feedback}</p>
          </div>
        )}

        {correctOpt && (
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <p className="font-mono text-xs text-success mb-1">Actual root cause: {correctOpt.label}</p>
            <p className="text-text-primary text-sm leading-relaxed">{correctOpt.feedback}</p>
          </div>
        )}

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <Lightbulb size={18} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-mono text-xs text-primary mb-1">Resolution & lesson</p>
            <p className="text-text-primary text-sm leading-relaxed">{scenario.resolution}</p>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-mono text-sm rounded-lg transition-colors"
        >
          {currentIdx + 1 >= totalScenarios ? "See results" : "Next incident"}
        </button>
      </div>
    );
  }

  // Diagnosing view
  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-xs text-text-secondary">
          Incident {currentIdx + 1} / {totalScenarios}
        </p>
        <p className="font-mono text-xs text-text-secondary">Incident Triage</p>
      </div>

      <div className="bg-red-500/5 border border-red-500/30 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[11px] text-text-secondary uppercase tracking-wider mb-1">
              {scenario.category}
            </p>
            <h3 className="text-base font-bold text-text-primary mb-2">{scenario.headline}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{scenario.context}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5">
        <h4 className="font-mono text-sm text-text-primary mb-3">Symptoms</h4>
        <ul className="space-y-2">
          {scenario.symptoms.map((s, i) => (
            <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
              <span className="text-accent mt-1">›</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-code-bg border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-text-secondary" />
          <h4 className="font-mono text-sm text-text-primary">Evidence</h4>
        </div>
        <div className="space-y-3">
          {scenario.evidence.map((e, i) => (
            <div key={i} className="border-l-2 border-border pl-3">
              <p className="font-mono text-xs text-primary mb-1">{e.label}</p>
              <p className="text-text-secondary text-sm leading-relaxed font-mono whitespace-pre-wrap">{e.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-mono text-sm text-text-primary mb-3">What&apos;s the root cause?</h4>
        <div className="space-y-2">
          {scenario.options.map((opt) => {
            const selected = chosenId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setChosenId(opt.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selected
                    ? "border-accent bg-accent/10"
                    : "border-border bg-surface hover:border-accent/40"
                }`}
              >
                <p className="text-sm font-semibold text-text-primary mb-1">{opt.label}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{opt.hypothesis}</p>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!chosenId}
        className={`w-full py-3 font-mono text-sm rounded-lg transition-colors ${
          chosenId
            ? "bg-accent hover:bg-accent/90 text-white"
            : "bg-surface border border-border text-text-secondary cursor-not-allowed"
        }`}
      >
        {chosenId ? "Submit diagnosis" : "Pick a diagnosis"}
      </button>
    </div>
  );
}
