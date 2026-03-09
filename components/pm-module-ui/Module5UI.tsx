"use client";

import { useState } from "react";
import CalloutBox from "./CalloutBox";

const PRICING_ROWS = [
  { name: "Claude 3.5 Haiku", input: "0.0008", output: "0.004" },
  { name: "Claude Sonnet", input: "0.003", output: "0.015" },
  { name: "Claude Opus", input: "0.015", output: "0.075" },
  { name: "GPT-4o mini", input: "0.00015", output: "0.0006" },
  { name: "GPT-4o", input: "0.0025", output: "0.01" },
  { name: "Gemini Flash", input: "0.000075", output: "0.0003" },
];

export function PricingTable() {
  const [dailyRequests, setDailyRequests] = useState(100000);

  return (
    <div className="bg-surface border border-border rounded-lg p-6 overflow-x-auto">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Approximate cost per 1K tokens (early 2026)
      </h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-text-secondary font-mono text-xs">
            <th className="pb-2 pr-4">Model</th>
            <th className="pb-2 pr-4">Input ($)</th>
            <th className="pb-2">Output ($)</th>
          </tr>
        </thead>
        <tbody>
          {PRICING_ROWS.map((row) => (
            <tr key={row.name} className="border-t border-border">
              <td className="py-2 pr-4 font-mono text-text-primary">{row.name}</td>
              <td className="py-2 pr-4 text-text-secondary">{row.input}</td>
              <td className="py-2 text-text-secondary">{row.output}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 pt-4 border-t border-border">
        <label className="block font-mono text-xs text-text-secondary mb-1">
          Est. daily requests
        </label>
        <input
          type="number"
          min={1000}
          step={10000}
          value={dailyRequests}
          onChange={(e) =>
            setDailyRequests(Number(e.target.value) || 1000)
          }
          className="w-32 px-3 py-2 rounded border border-border bg-surface font-mono text-sm"
        />
        <p className="text-text-secondary text-xs mt-2">
          With smart routing, 100K requests/day can save $50K–$200K annually vs.
          sending everything to a frontier model.
        </p>
      </div>
      <p className="text-text-secondary text-xs mt-3 italic">
        Prices change frequently; check provider pricing pages.
      </p>
    </div>
  );
}

export function FallbackChainDiagram() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Fallback chain
      </h4>
      <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
        <span className="px-3 py-2 rounded bg-primary/10 text-primary">
          Request
        </span>
        <span className="text-text-secondary">→</span>
        <span className="px-3 py-2 rounded border border-border">
          Classifier
        </span>
        <span className="text-text-secondary">→</span>
        <span className="px-3 py-2 rounded border border-border">
          Tier 1 / 2 / 3
        </span>
        <span className="text-text-secondary">→</span>
        <span className="text-text-secondary text-xs">quality check fails?</span>
        <span className="text-text-secondary">→</span>
        <span className="px-3 py-2 rounded bg-amber-500/10 text-amber-600">
          Escalate to next tier
        </span>
      </div>
      <p className="text-text-secondary text-xs mt-3">
        If the first model’s output doesn’t meet the bar, automatically try a
        more capable model. Not the same as reflection (same model retrying).
      </p>
    </div>
  );
}
