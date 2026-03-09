"use client";

import CalloutBox from "./CalloutBox";

export function BeforeAfterReflection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-surface border border-border rounded-lg p-5">
        <h4 className="font-mono text-primary text-sm font-bold mb-2">
          Without reflection (first draft)
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Example: Agent drafts a support reply. Minor tone issue, one factual
          inaccuracy, and a missing step. User would need to correct it.
        </p>
      </div>
      <div className="bg-surface border border-success/20 rounded-lg p-5">
        <h4 className="font-mono text-success text-sm font-bold mb-2">
          After one reflection cycle
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Same agent reviews its output, fixes tone and fact, adds the missing
          step. Quality improves ~15–30%; latency roughly doubles for that step.
        </p>
      </div>
    </div>
  );
}

export function EvalCriteriaCallout() {
  return (
    <CalloutBox variant="green" title="Eval-driven development">
      Write evaluation criteria (what does good output look like?) and 20–50
      test cases before building the feature. Use them to measure quality before
      and after every change. The PM owns the criteria; engineering owns the
      eval infrastructure.
    </CalloutBox>
  );
}
