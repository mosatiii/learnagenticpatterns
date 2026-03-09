"use client";

import { useState } from "react";
import ExpandableCard from "./ExpandableCard";

const LLMOPS_CHECKLIST = [
  "Prompt versioning and registry",
  "Prompt tested against eval suite before deploy",
  "Gradual rollout and rollback for prompts",
  "Multi-provider strategy (secondary LLM ready)",
  "Per-feature cost dashboards with alerts",
  "Model version pinned in production",
  "Every agent interaction logged with traceability",
  "Regression tests for new model versions",
];

export function LLMOpsChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const count = Object.values(checked).filter(Boolean).length;
  const total = LLMOPS_CHECKLIST.length;
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        LLMOps readiness checklist
      </h4>
      <ul className="space-y-2">
        {LLMOPS_CHECKLIST.map((item, i) => (
          <li key={i} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
              className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                checked[i] ? "bg-success border-success" : "border-border"
              }`}
            >
              {checked[i] && <span className="text-white text-xs">✓</span>}
            </button>
            <span className="text-text-secondary text-sm">{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="font-mono text-sm">
          Readiness: <strong>{count}/{total}</strong> ({percent}%)
        </p>
      </div>
    </div>
  );
}

export function CostDashboardMockup() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Cost dashboard (example)
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">Feature A (support agent)</span>
          <span className="font-mono">$1,240 / day</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Feature B (summarization)</span>
          <span className="font-mono">$320 / day</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Feature C (routing)</span>
          <span className="font-mono">$890 / day</span>
        </div>
      </div>
      <p className="text-text-secondary text-xs mt-4">
        Set per-feature budgets and alerts so a prompt change or viral launch doesn’t surprise you.
      </p>
    </div>
  );
}

export function IncidentPlaybook() {
  return (
    <ExpandableCard title="What to do when a model update breaks your agent">
      <ol className="list-decimal list-inside space-y-2">
        <li>Identify the regression (compare outputs before/after).</li>
        <li>Roll back to the previous model version in production.</li>
        <li>Run your eval suite on the new version to see which cases regressed.</li>
        <li>Re-tune prompts or add guardrails for the new behavior.</li>
        <li>Redeploy with the new version once evals pass.</li>
      </ol>
    </ExpandableCard>
  );
}
