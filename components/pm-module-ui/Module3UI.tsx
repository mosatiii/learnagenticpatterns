"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExpandableCard from "./ExpandableCard";
import CalloutBox from "./CalloutBox";
import { ExternalLink } from "lucide-react";

const TOOLS = [
  {
    name: "Cursor",
    desc: "Full-featured IDE with AI agent mode",
    bestFor: "Web apps, APIs, complex prototypes",
    url: "https://cursor.com/",
  },
  {
    name: "Claude Code",
    desc: "Command-line agentic coding",
    bestFor: "Scripts, data analysis, CLI tools",
    url: "https://docs.anthropic.com/en/docs/claude-code",
  },
  {
    name: "v0",
    desc: "AI-generated React UI from text",
    bestFor: "UI mockups, landing pages, dashboards",
    url: "https://v0.dev/",
  },
  {
    name: "Lovable",
    desc: "Full-stack AI app builder",
    bestFor: "Deployable prototypes to share",
    url: "https://lovable.dev/",
  },
  {
    name: "Replit Agent",
    desc: "Build and deploy apps from descriptions",
    bestFor: "Shareable URL in minutes",
    url: "https://replit.com/",
  },
  {
    name: "Bolt.new",
    desc: "Instant full-stack web apps from prompts",
    bestFor: "Idea validation in under an hour",
    url: "https://bolt.new/",
  },
];

const WALKTHROUGH_STEPS = [
  {
    hour: 1,
    title: "Define the core user flow",
    body: "What is the one thing the user should be able to do? Write it as a single sentence. Open Cursor, describe the app in plain English, let the agent scaffold the project.",
  },
  {
    hour: 2,
    title: "Iterate on the UI",
    body: "Describe changes in natural language (sidebar, loading state, colors). Test the flow yourself.",
  },
  {
    hour: 3,
    title: "Add the AI component",
    body: "Connect to an LLM API. Describe the agent behavior (e.g. when the user submits a query, search the database and generate a summary).",
  },
  {
    hour: 4,
    title: "Polish and deploy",
    body: "Fix obvious bugs, add sample data, deploy to free hosting. You now have a shareable URL.",
  },
];

export function ToolsComparisonGrid() {
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-primary text-sm font-bold">
        The tools and what each is best for
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface border border-border rounded-lg p-4 hover:border-primary/30 transition-colors flex flex-col"
          >
            <span className="font-mono font-bold text-text-primary text-sm">
              {tool.name}
            </span>
            <p className="text-text-secondary text-sm mt-1 flex-1">{tool.desc}</p>
            <span className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-primary">
              Best for: {tool.bestFor}
              <ExternalLink size={10} />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function FourHourWalkthrough() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <h4 className="font-mono text-primary text-sm font-bold">
        Prototype an AI feature in 4 hours (Cursor)
      </h4>
      <div className="flex flex-col sm:flex-row gap-4">
        {WALKTHROUGH_STEPS.map((step) => (
          <div key={step.hour} className="flex-1">
            <button
              type="button"
              onClick={() =>
                setExpanded(expanded === step.hour ? null : step.hour)
              }
              className={`
                w-full text-left p-4 rounded-lg border transition-colors
                ${
                  expanded === step.hour
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }
              `}
            >
              <span className="font-mono text-primary text-sm font-bold">
                Hour {step.hour}
              </span>
              <p className="font-mono text-text-primary text-sm mt-1">
                {step.title}
              </p>
              <AnimatePresence>
                {expanded === step.hour && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 text-text-secondary text-sm leading-relaxed"
                  >
                    {step.body}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          </div>
        ))}
      </div>
      <CalloutBox variant="green">
        Estimated total cost: under $5 in API fees.
      </CalloutBox>
    </div>
  );
}

export function PrototypeVsPRDFlowchart() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({
    1: null,
    2: null,
    3: null,
  });
  const q1 = answers[1];
  const q2 = answers[2];
  const q3 = answers[3];
  const allAnswered = q1 !== null && q2 !== null && q3 !== null;
  const recommendPrototype =
    allAnswered &&
    (q1 === true || q2 === true) &&
    (q3 === false || (q1 === true && q2 === true));

  const questions = [
    {
      id: 1,
      q: "Do you need to test a hypothesis quickly or show stakeholders something tangible?",
    },
    {
      id: 2,
      q: "Is the idea ambiguous (a conversation would go in circles)?",
    },
    {
      id: 3,
      q: "Does the feature need deep integration with production systems or heavy compliance?",
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        When to prototype yourself vs. write a PRD
      </h4>
      <div className="space-y-4">
        {questions.map(({ id, q }) => (
          <div key={id}>
            <p className="text-text-secondary text-sm mb-2">{q}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setAnswers((a) => ({ ...a, [id]: true }))
                }
                className={`px-3 py-1.5 rounded font-mono text-xs border ${
                  answers[id] === true
                    ? "bg-success/10 border-success text-success"
                    : "border-border text-text-secondary hover:border-success/50"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() =>
                  setAnswers((a) => ({ ...a, [id]: false }))
                }
                className={`px-3 py-1.5 rounded font-mono text-xs border ${
                  answers[id] === false
                    ? "bg-amber-500/10 border-amber-500 text-amber-600"
                    : "border-border text-text-secondary hover:border-amber-500/50"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>
      {allAnswered && (
        <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="font-mono text-sm font-bold text-primary">
            {recommendPrototype
              ? "→ Prototype yourself first, then write the PRD from what you learned."
              : "→ Write a PRD; prototype is less critical for this case."}
          </p>
        </div>
      )}
    </div>
  );
}

export function VideoPlaceholder() {
  return (
    <div className="bg-surface border border-dashed border-border rounded-lg p-8 text-center">
      <p className="font-mono text-sm text-primary font-bold">
        Video coming soon
      </p>
      <p className="text-text-secondary text-sm mt-1">
        Watch a PM build an AI feature in 4 hours
      </p>
    </div>
  );
}
