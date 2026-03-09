"use client";

import { useState } from "react";
import ComparisonCards from "./ComparisonCards";
import { Layers, GitBranch } from "lucide-react";

const CHAIN_STEPS = [
  { name: "Classify ticket", latency: 0.5, cost: 0.002, validation: false },
  { name: "Retrieve docs", latency: 1, cost: 0.001, validation: true },
  { name: "Draft response", latency: 2, cost: 0.008, validation: false },
  { name: "Check accuracy", latency: 1, cost: 0.004, validation: true },
  { name: "Send or escalate", latency: 0.3, cost: 0.001, validation: false },
];

const FIXED_VS_DYNAMIC = [
  {
    title: "Fixed orchestration",
    icon: Layers,
    bullets: [
      "Predetermined sequence every time",
      "Simple, predictable, easy to debug",
      "Good for well-understood workflows",
    ],
    bestFor: "Stable, repeatable workflows",
  },
  {
    title: "Dynamic orchestration",
    icon: GitBranch,
    bullets: [
      "Agent decides steps based on input",
      "Flexible, handles edge cases",
      "Harder to predict cost and latency",
    ],
    bestFor: "Variable or exploratory tasks",
  },
];

export function ChainVisualizer() {
  const [clicked, setClicked] = useState<number | null>(null);
  const step = clicked !== null ? CHAIN_STEPS[clicked] : null;
  const totalLatency = CHAIN_STEPS.reduce((s, x) => s + x.latency, 0);
  const totalCost = CHAIN_STEPS.reduce((s, x) => s + x.cost, 0);

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Anatomy of an agent chain (example: support agent)
      </h4>
      <div className="flex flex-wrap gap-2 mb-4">
        {CHAIN_STEPS.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setClicked(clicked === i ? null : i)}
            className={`
              px-3 py-2 rounded font-mono text-xs border transition-colors
              ${
                clicked === i
                  ? "bg-primary/15 border-primary text-primary"
                  : "border-border text-text-secondary hover:border-primary/40"
              }
            `}
          >
            {i + 1}. {s.name}
          </button>
        ))}
      </div>
      {step && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm space-y-1">
          <p><strong>Latency:</strong> ~{step.latency}s</p>
          <p><strong>Cost:</strong> ~${step.cost.toFixed(3)}</p>
          <p><strong>Validation:</strong> {step.validation ? "Yes" : "No"}</p>
        </div>
      )}
      <div className="mt-4 flex gap-4 font-mono text-sm text-text-secondary">
        <span>Total: ~{totalLatency}s, ~${totalCost.toFixed(3)}</span>
      </div>
    </div>
  );
}

export function LatencyCalculator() {
  const [steps, setSteps] = useState(5);
  const [latencyPerStep, setLatencyPerStep] = useState(2);
  const total = steps * latencyPerStep;
  const threshold = total > 15 ? "high" : total > 5 ? "medium" : "low";

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Latency calculator
      </h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-mono text-xs text-text-secondary mb-1">
            Number of steps
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value) || 1)}
            className="w-full px-3 py-2 rounded border border-border bg-surface font-mono text-sm"
          />
        </div>
        <div>
          <label className="block font-mono text-xs text-text-secondary mb-1">
            Avg latency per step (s)
          </label>
          <input
            type="number"
            min={0.5}
            max={10}
            step={0.5}
            value={latencyPerStep}
            onChange={(e) =>
              setLatencyPerStep(Number(e.target.value) || 1)
            }
            className="w-full px-3 py-2 rounded border border-border bg-surface font-mono text-sm"
          />
        </div>
      </div>
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="font-mono text-sm">
          Total expected response time: <strong>{total}s</strong>
        </p>
        <p className="text-text-secondary text-xs mt-1">
          UX threshold: {threshold} (2s instant, 5s ok, 15s+ risk drop-off)
        </p>
      </div>
    </div>
  );
}

export function FixedVsDynamicCards() {
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-primary text-sm font-bold">
        Fixed vs. dynamic orchestration
      </h4>
      <ComparisonCards items={FIXED_VS_DYNAMIC} columns={2} />
    </div>
  );
}
