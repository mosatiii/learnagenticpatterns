"use client";

export function AgentMetricsDashboardMockup() {
  const metrics = [
    { label: "Task completion rate", value: "94%", trend: "↑" },
    { label: "Quality score (LLM-as-Judge)", value: "4.2/5", trend: "→" },
    { label: "Hallucination rate", value: "1.2%", trend: "↓" },
    { label: "Cost per task", value: "$0.012", trend: "↓" },
    { label: "Latency P95", value: "8.2s", trend: "→" },
    { label: "Escalation rate", value: "5%", trend: "↓" },
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Agent metrics dashboard (example)
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-4 rounded-lg border border-border bg-surface/50"
          >
            <p className="font-mono text-xs text-text-secondary">{m.label}</p>
            <p className="font-mono text-lg font-bold text-text-primary mt-1">
              {m.value} <span className="text-primary text-sm">{m.trend}</span>
            </p>
          </div>
        ))}
      </div>
      <p className="text-text-secondary text-xs mt-4">
        Core metrics: completion rate, quality score, hallucination rate, cost per task, latency P50/P95, CSAT, escalation rate, error rate.
      </p>
    </div>
  );
}

export function EvalFlywheelDiagram() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        The eval flywheel
      </h4>
      <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
        <span className="px-3 py-2 rounded bg-primary/10 text-primary">Production</span>
        <span className="text-text-secondary">→</span>
        <span className="px-3 py-2 rounded border border-border">Failures</span>
        <span className="text-text-secondary">→</span>
        <span className="px-3 py-2 rounded border border-border">Test cases</span>
        <span className="text-text-secondary">→</span>
        <span className="px-3 py-2 rounded border border-border">Better agent</span>
        <span className="text-text-secondary">→</span>
        <span className="px-3 py-2 rounded border border-border">More usage</span>
        <span className="text-text-secondary">→</span>
        <span className="px-3 py-2 rounded border border-border">Edge cases</span>
        <span className="text-text-secondary">→</span>
        <span className="px-3 py-2 rounded bg-success/10 text-success">Better evals</span>
      </div>
      <p className="text-text-secondary text-xs mt-4 text-center">
        Every production failure becomes a test case. Better evals → better agent → more trust → more usage → more edge cases → better evals.
      </p>
    </div>
  );
}
