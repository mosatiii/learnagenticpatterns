"use client";

import { useState } from "react";
import Link from "next/link";
import { pmModules } from "@/data/pm-curriculum";

const LEVELS = ["L0", "L1", "L2", "L3", "L4"];

export function RoadmapBuilder() {
  const [current, setCurrent] = useState("L1");
  const [target, setTarget] = useState("L2");
  const [timeline, setTimeline] = useState("3");

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Roadmap builder
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-mono text-xs text-text-secondary mb-1">Current level</label>
          <select
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full px-3 py-2 rounded border border-border bg-surface font-mono text-sm"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-xs text-text-secondary mb-1">Target level</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full px-3 py-2 rounded border border-border bg-surface font-mono text-sm"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-xs text-text-secondary mb-1">Timeline (months)</label>
          <input
            type="number"
            min={1}
            max={12}
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="w-full px-3 py-2 rounded border border-border bg-surface font-mono text-sm"
          />
        </div>
      </div>
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm">
        <p className="font-mono text-primary font-bold">
          Focus on: Modules {current === "L0" ? "1–3" : current === "L1" ? "4–7" : current === "L2" ? "8–11" : "12–14"} for your current level.
        </p>
        <p className="text-text-secondary text-xs mt-2">
          Moving one level typically takes 2–4 months. Prioritize by user value, not technical complexity.
        </p>
      </div>
    </div>
  );
}

export function NinetyDayPlanTemplate() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        90-day quick win plan
      </h4>
      <ul className="space-y-3 text-sm text-text-secondary">
        <li>
          <strong className="text-text-primary">Month 1:</strong> Ship one L1 feature (agent with tool access for a single workflow). Measure quality and cost.
        </li>
        <li>
          <strong className="text-text-primary">Month 2:</strong> Add routing to optimize cost; add reflection to improve quality.
        </li>
        <li>
          <strong className="text-text-primary">Month 3:</strong> Expand to 2–3 workflows. Add RAG for knowledge grounding. Capture feedback loop.
        </li>
      </ul>
    </div>
  );
}

export function CurriculumMap() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        All 15 modules by phase
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-mono text-primary text-xs mb-2">Phase 1: Foundation (1–3)</p>
          <ul className="space-y-1 text-text-secondary">
            {pmModules.slice(0, 3).map((m) => (
              <li key={m.slug}>{m.number}. {m.title}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-primary text-xs mb-2">Phase 2: Architecture (4–8)</p>
          <ul className="space-y-1 text-text-secondary">
            {pmModules.slice(3, 8).map((m) => (
              <li key={m.slug}>{m.number}. {m.title}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-primary text-xs mb-2">Phase 3: Integration (9–11)</p>
          <ul className="space-y-1 text-text-secondary">
            {pmModules.slice(8, 11).map((m) => (
              <li key={m.slug}>{m.number}. {m.title}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-primary text-xs mb-2">Phase 4: Production (12–15)</p>
          <ul className="space-y-1 text-text-secondary">
            {pmModules.slice(11, 15).map((m) => (
              <li key={m.slug}>{m.number}. {m.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function CompletionCTA() {
  return (
    <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 text-center">
      <h4 className="font-mono text-text-primary font-bold text-lg mb-2">
        You’ve reached the end of the PM curriculum
      </h4>
      <p className="text-text-secondary text-sm mb-4">
        Share your completion, download your roadmap, and practice with the decision games.
      </p>
      <Link
        href="https://practice.learnagenticpatterns.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold px-6 py-3 rounded-md transition-all"
      >
        Go to Practice
      </Link>
    </div>
  );
}
