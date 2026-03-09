"use client";

import { useState } from "react";
import ComparisonCards from "./ComparisonCards";
import { Network, GitBranch, Users, Award } from "lucide-react";

const TOPOLOGIES = [
  {
    title: "Hub-and-spoke",
    icon: Network,
    bullets: [
      "Coordinator delegates to specialists",
      "Assembles results",
      "Single point of control",
    ],
    bestFor: "Complex tasks with clear roles",
  },
  {
    title: "Pipeline",
    icon: GitBranch,
    bullets: [
      "Agents pass work sequentially",
      "Researcher → writer → editor",
      "Predictable flow",
    ],
    bestFor: "Staged workflows",
  },
  {
    title: "Peer review",
    icon: Users,
    bullets: [
      "One agent generates, another critiques",
      "Generator revises",
      "Quality gate",
    ],
    bestFor: "High-quality output",
  },
  {
    title: "Competitive",
    icon: Award,
    bullets: [
      "Multiple agents generate options",
      "Judge picks best",
      "Diversity of solutions",
    ],
    bestFor: "Creative or varied outputs",
  },
];

export function TopologyCards() {
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-primary text-sm font-bold">
        Agent team topologies
      </h4>
      <ComparisonCards items={TOPOLOGIES} columns={2} />
    </div>
  );
}

export function MultiAgentCostCalculator() {
  const [agents, setAgents] = useState(3);
  const [tokensPerInteraction, setTokensPerInteraction] = useState(2000);
  const [interactionsPerTask, setInteractionsPerTask] = useState(5);
  const total = agents * tokensPerInteraction * interactionsPerTask;
  const singleAgent = tokensPerInteraction * interactionsPerTask;
  const multiplier = singleAgent > 0 ? (total / singleAgent).toFixed(1) : "—";

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Token cost comparison
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-mono text-xs text-text-secondary mb-1">Agents</label>
          <input
            type="number"
            min={1}
            max={10}
            value={agents}
            onChange={(e) => setAgents(Number(e.target.value) || 1)}
            className="w-full px-3 py-2 rounded border border-border bg-surface font-mono text-sm"
          />
        </div>
        <div>
          <label className="block font-mono text-xs text-text-secondary mb-1">Tokens per interaction</label>
          <input
            type="number"
            min={500}
            step={500}
            value={tokensPerInteraction}
            onChange={(e) => setTokensPerInteraction(Number(e.target.value) || 500)}
            className="w-full px-3 py-2 rounded border border-border bg-surface font-mono text-sm"
          />
        </div>
        <div>
          <label className="block font-mono text-xs text-text-secondary mb-1">Interactions per task</label>
          <input
            type="number"
            min={1}
            value={interactionsPerTask}
            onChange={(e) => setInteractionsPerTask(Number(e.target.value) || 1)}
            className="w-full px-3 py-2 rounded border border-border bg-surface font-mono text-sm"
          />
        </div>
      </div>
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm">
        <p>Multi-agent total tokens: <strong>{total.toLocaleString()}</strong></p>
        <p className="text-text-secondary text-xs mt-1">
          Can be {multiplier}x a single-agent flow if each agent sees full context.
        </p>
      </div>
    </div>
  );
}
