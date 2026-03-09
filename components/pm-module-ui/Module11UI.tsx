"use client";

import { useState } from "react";

const MEMORY_LAYERS = [
  { name: "Context window (working)", desc: "Current conversation, 128K–200K tokens, ephemeral" },
  { name: "Short-term", desc: "Session or task; multi-turn context" },
  { name: "Long-term semantic", desc: "Facts, preferences (e.g. dark mode, industry)" },
  { name: "Long-term episodic", desc: "Past interactions and events" },
];

export function MemoryArchitectureDiagram() {
  const [clicked, setClicked] = useState<number | null>(null);

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Memory layers
      </h4>
      <div className="space-y-2">
        {MEMORY_LAYERS.map((layer, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setClicked(clicked === i ? null : i)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
              clicked === i ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
            }`}
          >
            <span className="font-mono text-sm font-bold text-text-primary">
              {layer.name}
            </span>
            {clicked === i && (
              <p className="text-text-secondary text-sm mt-1">{layer.desc}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

const PRIVACY_ITEMS = [
  "What data is stored?",
  "Where is it stored?",
  "Who can access it?",
  "How long is it retained?",
  "Can users view, edit, delete their data?",
  "GDPR consent and right to deletion (EU)",
  "SOC 2 audit trails (enterprise)",
];

export function PrivacyChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Privacy-by-design checklist
      </h4>
      <ul className="space-y-2">
        {PRIVACY_ITEMS.map((item, i) => (
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
    </div>
  );
}
