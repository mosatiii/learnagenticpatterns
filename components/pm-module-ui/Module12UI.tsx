"use client";

import { useState } from "react";
import ExpandableCard from "./ExpandableCard";

const SAFETY_LAYERS = [
  { id: 1, name: "Input guardrails", desc: "Filter harmful, off-topic, injection before agent" },
  { id: 2, name: "System prompt", desc: "Define what agent can and cannot do" },
  { id: 3, name: "Output guardrails", desc: "Check for PII, harmful content, off-brand, hallucination" },
  { id: 4, name: "Action guardrails", desc: "Approval for high-risk (email, data change, payments)" },
  { id: 5, name: "Monitoring", desc: "Detect patterns of unsafe behavior over time" },
];

const INCIDENTS = [
  {
    title: "Air Canada chatbot",
    body: "Chatbot fabricated a refund policy; company was held liable. Preventable with output guardrails and human review for policy claims.",
  },
  {
    title: "Chevrolet dealership chatbot",
    body: "Agreed to sell a car for $1. Preventable with action guardrails and approval gates for commitments.",
  },
  {
    title: "DPD customer service chatbot",
    body: "Cursed at customers. Preventable with output guardrails and tone checks.",
  },
];

export function SafetyStackDiagram() {
  const [clicked, setClicked] = useState<number | null>(null);

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        The safety stack (5 layers)
      </h4>
      <div className="space-y-2">
        {SAFETY_LAYERS.map((layer) => (
          <button
            key={layer.id}
            type="button"
            onClick={() => setClicked(clicked === layer.id ? null : layer.id)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
              clicked === layer.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
            }`}
          >
            <span className="font-mono text-sm font-bold text-text-primary">
              Layer {layer.id}: {layer.name}
            </span>
            {clicked === layer.id && (
              <p className="text-text-secondary text-sm mt-1">{layer.desc}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function IncidentCaseStudies() {
  return (
    <div className="space-y-2">
      <h4 className="font-mono text-primary text-sm font-bold">
        Real-world safety incidents
      </h4>
      {INCIDENTS.map((inc) => (
        <ExpandableCard key={inc.title} title={inc.title}>
          {inc.body}
        </ExpandableCard>
      ))}
    </div>
  );
}

const SAFETY_CHECKLIST_ITEMS = [
  "Input guardrails implemented",
  "Output guardrails (PII, tone, facts)",
  "Human approval for high-risk actions",
  "Error recovery and escalation path",
  "Audit trail for compliance",
];

export function SafetyAuditChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Safety audit checklist
      </h4>
      <ul className="space-y-2">
        {SAFETY_CHECKLIST_ITEMS.map((item, i) => (
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
      <p className="text-text-secondary text-xs mt-3">
        {Object.values(checked).filter(Boolean).length} of {SAFETY_CHECKLIST_ITEMS.length} checked.
      </p>
    </div>
  );
}
