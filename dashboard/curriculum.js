// Authoritative slug universes. Keep in sync with
// ../data/patterns.ts and ../data/pm-curriculum.ts in the main app.
// The dashboard renders a warning if the DB has slugs not in this list.

export const DEV_SLUGS = [
  "evaluation-monitoring",
  "exception-handling-recovery",
  "exploration-discovery",
  "goal-setting-monitoring",
  "guardrails-safety",
  "human-in-the-loop",
  "inter-agent-communication",
  "knowledge-retrieval-rag",
  "learning-adaptation",
  "memory-management",
  "multi-agent-collaboration",
  "parallelization",
  "planning",
  "prioritization",
  "prompt-chaining",
  "reasoning-techniques",
  "reflection",
  "resource-aware-optimization",
  "routing",
  "state-management-mcp",
  "tool-use",
];

export const PM_SLUGS = [
  "ai-native-foundations",
  "ai-product-discovery",
  "intelligent-routing",
  "llmops-production",
  "maturity-roadmap",
  "measuring-success",
  "memory-personalization",
  "multi-agent-teams",
  "pm-prototyping-toolkit",
  "quality-self-correction",
  "rag-knowledge-systems",
  "safety-guardrails",
  "speed-at-scale",
  "task-orchestration",
  "tools-apis-mcp",
];

export const DEV_TOTAL = DEV_SLUGS.length;
export const PM_TOTAL = PM_SLUGS.length;
