"use client";

import CalloutBox from "./CalloutBox";
import ComparisonCards from "./ComparisonCards";
import ExpandableCard from "./ExpandableCard";
import { Bot, Cog, User } from "lucide-react";

const DECISION_MATRIX_ITEMS = [
  {
    title: "Agent",
    icon: Bot,
    bullets: [
      "Task requires judgment and patterns",
      "Handles ambiguity, not pure rules",
      "Best for: research, drafting, analysis",
    ],
    bestFor: "Judgment + pattern-based work",
  },
  {
    title: "Automation",
    icon: Cog,
    bullets: [
      "Rule-based, no ambiguity",
      "Zapier, n8n, scripts",
      "Best for: triggers, data sync, alerts",
    ],
    bestFor: "Deterministic workflows",
  },
  {
    title: "Human",
    icon: User,
    bullets: [
      "Empathy, creativity, legal accountability",
      "Keep human with AI assistance",
      "Best for: escalation, approval, nuance",
    ],
    bestFor: "High-stakes or subjective decisions",
  },
];

export function DiscoveryWarningCallout() {
  return (
    <CalloutBox variant="orange" title="Building is cheap now. Discovery is what separates successful AI products from expensive demos.">
      Use the workflow audit and 80% automation test before you build.
    </CalloutBox>
  );
}

export function AgentVsAutomationVsHuman() {
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-primary text-sm font-bold">
        Decision Matrix: Agent vs. Automation vs. Human
      </h4>
      <ComparisonCards items={DECISION_MATRIX_ITEMS} columns={3} />
    </div>
  );
}

export function CaseStudyExpandables() {
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-primary text-sm font-bold">
        Real-world examples
      </h4>
      <div className="space-y-2">
        <ExpandableCard title="Company that shipped an AI agent feature and succeeded">
          Example: A support team used an agent to triage and draft responses.
          They passed the 80% automation test, had low stakes and reversible
          actions, and added human review for edge cases. Result: 40% faster
          resolution, high CSAT.
        </ExpandableCard>
        <ExpandableCard title="Company that chose automation over an AI agent">
          Example: A team needed to sync form submissions to a CRM. The workflow
          was rule-based with no ambiguity. They used Zapier instead of an agent
          — cheaper, faster to ship, and easier to debug.
        </ExpandableCard>
        <ExpandableCard title="Company that shipped an agent feature that failed">
          Example: An agent was built for a high-stakes workflow without the
          trust litmus test. Users did not trust it; the feature was rarely used
          and later deprecated. Lesson: validate trust (stakes, reversibility,
          transparency) before building.
        </ExpandableCard>
      </div>
    </div>
  );
}
