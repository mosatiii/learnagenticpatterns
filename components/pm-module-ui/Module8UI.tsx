"use client";

import ExpandableCard from "./ExpandableCard";
import ComparisonCards from "./ComparisonCards";
import { Search, Database, Maximize2 } from "lucide-react";

const RAG_VS_OTHERS = [
  {
    title: "RAG",
    icon: Search,
    bullets: [
      "Knowledge changes frequently or is large",
      "You need traceable sources",
      "Retrieve then generate",
    ],
    bestFor: "Company docs, FAQs, internal knowledge",
  },
  {
    title: "Fine-tuning",
    icon: Database,
    bullets: [
      "Style, tone, or behavior that rarely changes",
      "Not ideal for factual knowledge",
      "Model weights updated",
    ],
    bestFor: "Brand voice, output format",
  },
  {
    title: "Large context window",
    icon: Maximize2,
    bullets: [
      "Knowledge fits in 200K+ tokens",
      "Relatively static",
      "No retrieval step",
    ],
    bestFor: "Single doc or small, fixed corpus",
  },
];

const FAILURE_MODES = [
  {
    title: "Stale data",
    body: "Knowledge base not updated; agent gives outdated answers. Test: change a doc and verify the agent reflects it after re-indexing.",
  },
  {
    title: "Missing context",
    body: "Relevant doc exists but wasn’t retrieved (chunking or embedding issue). Test: run recall on a golden set of Q&A pairs.",
  },
  {
    title: "Conflicting sources",
    body: "Two docs say different things; agent picks wrong one or hallucinates. Test: add conflicting snippets and check behavior.",
  },
  {
    title: "Over-retrieval",
    body: "Too many chunks retrieved; relevant signal diluted. Test: vary top-k and measure answer quality.",
  },
  {
    title: "Wrong chunk size",
    body: "Too small: no context. Too large: relevant part buried. Sweet spot often 200–500 words with overlap. Test: A/B chunk sizes.",
  },
];

export function RAGPipelineDiagram() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 overflow-x-auto">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        RAG pipeline
      </h4>
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="px-2 py-1.5 rounded bg-primary/10 text-primary">
          Documents
        </span>
        <span className="text-text-secondary">→</span>
        <span className="px-2 py-1.5 rounded border border-border">Chunking</span>
        <span className="text-text-secondary">→</span>
        <span className="px-2 py-1.5 rounded border border-border">Embedding</span>
        <span className="text-text-secondary">→</span>
        <span className="px-2 py-1.5 rounded border border-border">Vector DB</span>
        <span className="text-text-secondary">→</span>
        <span className="px-2 py-1.5 rounded border border-border">Query</span>
        <span className="text-text-secondary">→</span>
        <span className="px-2 py-1.5 rounded border border-border">Retrieval</span>
        <span className="text-text-secondary">→</span>
        <span className="px-2 py-1.5 rounded border border-border">LLM</span>
        <span className="text-text-secondary">→</span>
        <span className="px-2 py-1.5 rounded bg-success/10 text-success">
          Response
        </span>
      </div>
    </div>
  );
}

export function RAGVsFineTuningVsContext() {
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-primary text-sm font-bold">
        RAG vs. fine-tuning vs. large context window
      </h4>
      <ComparisonCards items={RAG_VS_OTHERS} columns={3} />
    </div>
  );
}

export function RAGFailureModes() {
  return (
    <div className="space-y-2">
      <h4 className="font-mono text-primary text-sm font-bold">
        Common RAG failures to test for
      </h4>
      {FAILURE_MODES.map((fm) => (
        <ExpandableCard key={fm.title} title={fm.title}>
          {fm.body}
        </ExpandableCard>
      ))}
    </div>
  );
}
