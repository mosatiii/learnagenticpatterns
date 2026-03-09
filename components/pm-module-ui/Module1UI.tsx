"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CalloutBox from "./CalloutBox";

const LEVELS = [
  { id: "L0", label: "L0 — Chatbot", desc: "Single-turn, no tools, no memory" },
  { id: "L1", label: "L1 — Tool-Calling", desc: "Fixed workflows, accesses external data" },
  { id: "L2", label: "L2 — Reasoning", desc: "Plans steps, chooses tools dynamically" },
  { id: "L3", label: "L3 — Persistent", desc: "Cross-session memory, personalization" },
  { id: "L4", label: "L4 — Multi-Agent", desc: "Specialized agents collaborate" },
];

const WAVES = [
  {
    id: "w1",
    title: "Wave 1 (2022–2023)",
    short: "LLMs",
    body: "LLMs showed AI could generate human-quality text and code. Products added summarization, chatbots, smart search.",
  },
  {
    id: "w2",
    title: "Wave 2 (2024–2025)",
    short: "Agents",
    body: "Wrapping LLMs in agentic loops created multi-step task completion. Agents could research, draft, and act.",
  },
  {
    id: "w3",
    title: "Wave 3 (2025–2026)",
    short: "MCP",
    body: "MCP gave agents a universal standard for connecting to real systems. One plug that works everywhere.",
  },
];

export function AutonomyStepper() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-2">
        Where is your product on the L0–L4 spectrum?
      </h4>
      <p className="text-text-secondary text-sm mb-4">
        Click a level — not scored, purely reflective.
      </p>
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            onClick={() => setSelected(selected === level.id ? null : level.id)}
            className={`
              px-4 py-2.5 rounded-lg font-mono text-sm border transition-colors
              ${
                selected === level.id
                  ? "bg-primary/15 border-primary text-primary"
                  : "bg-surface border-border text-text-secondary hover:border-primary/40"
              }
            `}
          >
            {level.label}
          </button>
        ))}
      </div>
      {selected && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-text-secondary text-sm"
        >
          {LEVELS.find((l) => l.id === selected)?.desc}
        </motion.p>
      )}
    </div>
  );
}

export function ThreeWavesTimeline() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        The Three Waves: LLMs → Agents → MCP
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {WAVES.map((wave) => (
          <button
            key={wave.id}
            type="button"
            onClick={() =>
              setExpanded(expanded === wave.id ? null : wave.id)
            }
            className={`
              text-left p-4 rounded-lg border transition-colors
              ${
                expanded === wave.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }
            `}
          >
            <span className="font-mono text-sm font-bold text-text-primary block mb-1">
              {wave.title}
            </span>
            <span className="font-mono text-xs text-primary">{wave.short}</span>
            {expanded === wave.id && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-text-secondary text-sm leading-relaxed"
              >
                {wave.body}
              </motion.p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SkillSetCallout() {
  return (
    <CalloutBox variant="blue" title="Bookmark this section">
      These six skills are referenced throughout the entire curriculum:
      cost model, loops not requests, design for uncertainty, safety stack,
      vocabulary, and trade-off evaluation.
    </CalloutBox>
  );
}
