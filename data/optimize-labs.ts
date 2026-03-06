export interface PipelineStep {
  id: string;
  name: string;
  defaultModel: string;
  inputTokensPerRun: number;
  outputTokensPerRun: number;
}

export interface ModelOption {
  id: string;
  name: string;
  costPerMillionInput: number;
  costPerMillionOutput: number;
  qualityScore: number;
  latencyMs: number;
}

export interface OptimizationOption {
  id: string;
  name: string;
  description: string;
  costMultiplier: number;
  qualityMultiplier: number;
  latencyMultiplier: number;
  applicableTo: string[];
}

export interface OptimizeLabConfig {
  patternSlug: string;
  title: string;
  scenario: string;
  pipeline: PipelineStep[];
  availableModels: ModelOption[];
  optimizations: OptimizationOption[];
  constraints: {
    maxCostPerRun: number;
    minQuality: number;
    maxLatency: number;
  };
  hints: string[];
}

const SHARED_MODELS: ModelOption[] = [
  { id: "gpt-4o", name: "GPT-4o", costPerMillionInput: 2.50, costPerMillionOutput: 10.00, qualityScore: 95, latencyMs: 800 },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", costPerMillionInput: 0.15, costPerMillionOutput: 0.60, qualityScore: 82, latencyMs: 350 },
  { id: "claude-sonnet", name: "Claude 3.5 Sonnet", costPerMillionInput: 3.00, costPerMillionOutput: 15.00, qualityScore: 96, latencyMs: 900 },
  { id: "claude-haiku", name: "Claude 3.5 Haiku", costPerMillionInput: 0.25, costPerMillionOutput: 1.25, qualityScore: 80, latencyMs: 300 },
  { id: "gemini-pro", name: "Gemini 2.5 Pro", costPerMillionInput: 1.25, costPerMillionOutput: 10.00, qualityScore: 93, latencyMs: 700 },
  { id: "gemini-flash", name: "Gemini 2.5 Flash", costPerMillionInput: 0.15, costPerMillionOutput: 0.60, qualityScore: 85, latencyMs: 250 },
];

const SHARED_OPTIMIZATIONS: OptimizationOption[] = [
  {
    id: "semantic-cache",
    name: "Semantic Caching",
    description: "Cache similar queries to avoid redundant LLM calls. ~40% hit rate on typical workloads.",
    costMultiplier: 0.60,
    qualityMultiplier: 1.0,
    latencyMultiplier: 0.70,
    applicableTo: ["all"],
  },
  {
    id: "prompt-compression",
    name: "Prompt Compression",
    description: "Compress prompts by removing filler tokens. Reduces input tokens ~30% with minimal quality loss.",
    costMultiplier: 0.70,
    qualityMultiplier: 0.97,
    latencyMultiplier: 0.85,
    applicableTo: ["all"],
  },
  {
    id: "batch-requests",
    name: "Batch API Requests",
    description: "Batch multiple requests into a single API call. 50% cost reduction but adds latency.",
    costMultiplier: 0.50,
    qualityMultiplier: 1.0,
    latencyMultiplier: 1.40,
    applicableTo: ["all"],
  },
  {
    id: "streaming",
    name: "Streaming Responses",
    description: "Stream tokens as they're generated. Reduces perceived latency but no cost change.",
    costMultiplier: 1.0,
    qualityMultiplier: 1.0,
    latencyMultiplier: 0.60,
    applicableTo: ["all"],
  },
];

const optimizeLabConfigs: OptimizeLabConfig[] = [
  {
    patternSlug: "prompt-chaining",
    title: "Optimize a Support Pipeline",
    scenario:
      "Your 4-step customer support pipeline uses GPT-4o for every step. It's accurate but costs $14.20 per 1,000 runs and takes 3.2 seconds. Cut costs by 60% while keeping quality above 85% and latency under 4 seconds.",
    pipeline: [
      { id: "extraction", name: "Extraction Agent", defaultModel: "gpt-4o", inputTokensPerRun: 500, outputTokensPerRun: 200 },
      { id: "validation", name: "Validation Gate", defaultModel: "gpt-4o", inputTokensPerRun: 300, outputTokensPerRun: 100 },
      { id: "analysis", name: "Analysis Agent", defaultModel: "gpt-4o", inputTokensPerRun: 600, outputTokensPerRun: 300 },
      { id: "response", name: "Response Agent", defaultModel: "gpt-4o", inputTokensPerRun: 800, outputTokensPerRun: 500 },
    ],
    availableModels: SHARED_MODELS,
    optimizations: SHARED_OPTIMIZATIONS,
    constraints: { maxCostPerRun: 0.0057, minQuality: 85, maxLatency: 4000 },
    hints: [
      "Not every step needs the smartest model. Validation is mostly structural checking.",
      "The Response Agent interacts with the customer — quality matters most here.",
      "Semantic caching works great for the Extraction step since many tickets are similar.",
    ],
  },
  {
    patternSlug: "routing",
    title: "Optimize a Request Router",
    scenario:
      "Your routing system uses Claude 3.5 Sonnet for classification and three specialist agents. The classifier runs on every request but most requests are simple. Monthly cost: $8,500. Target: under $3,400.",
    pipeline: [
      { id: "classifier", name: "Intent Classifier", defaultModel: "claude-sonnet", inputTokensPerRun: 400, outputTokensPerRun: 100 },
      { id: "billing", name: "Billing Agent", defaultModel: "claude-sonnet", inputTokensPerRun: 600, outputTokensPerRun: 400 },
      { id: "technical", name: "Technical Agent", defaultModel: "claude-sonnet", inputTokensPerRun: 800, outputTokensPerRun: 500 },
      { id: "general", name: "General Agent", defaultModel: "claude-sonnet", inputTokensPerRun: 400, outputTokensPerRun: 300 },
    ],
    availableModels: SHARED_MODELS,
    optimizations: SHARED_OPTIMIZATIONS,
    constraints: { maxCostPerRun: 0.0048, minQuality: 83, maxLatency: 3500 },
    hints: [
      "The classifier runs on EVERY request. Making it cheaper has the biggest impact.",
      "General inquiries don't need a powerful model — they're mostly FAQ-type questions.",
      "Technical issues need accuracy. Keep quality high there.",
    ],
  },
  {
    patternSlug: "parallelization",
    title: "Optimize Parallel Analysis",
    scenario:
      "Your parallel document analysis runs 3 analyzers simultaneously, all on GPT-4o. It's fast due to parallelism but expensive. Each document costs $0.025. Target: under $0.010 per document while keeping quality above 80%.",
    pipeline: [
      { id: "sentiment", name: "Sentiment Analyzer", defaultModel: "gpt-4o", inputTokensPerRun: 500, outputTokensPerRun: 200 },
      { id: "entities", name: "Entity Extractor", defaultModel: "gpt-4o", inputTokensPerRun: 500, outputTokensPerRun: 300 },
      { id: "topics", name: "Topic Classifier", defaultModel: "gpt-4o", inputTokensPerRun: 500, outputTokensPerRun: 150 },
    ],
    availableModels: SHARED_MODELS,
    optimizations: SHARED_OPTIMIZATIONS,
    constraints: { maxCostPerRun: 0.0100, minQuality: 80, maxLatency: 2000 },
    hints: [
      "Sentiment analysis is well-understood — smaller models handle it well.",
      "Entity extraction benefits from a stronger model to avoid missing entities.",
      "Since these run in parallel, total latency = max(individual latencies), not sum.",
    ],
  },
  {
    patternSlug: "reflection",
    title: "Optimize a Reflection Loop",
    scenario:
      "Your code generation pipeline runs Generator + Critic in a loop, averaging 2.5 iterations. Both use GPT-4o. Each code generation costs $0.035. Target: under $0.015 while maintaining quality above 88%.",
    pipeline: [
      { id: "generator", name: "Code Generator", defaultModel: "gpt-4o", inputTokensPerRun: 800, outputTokensPerRun: 600 },
      { id: "critic", name: "Code Critic", defaultModel: "gpt-4o", inputTokensPerRun: 1000, outputTokensPerRun: 400 },
    ],
    availableModels: SHARED_MODELS,
    optimizations: SHARED_OPTIMIZATIONS,
    constraints: { maxCostPerRun: 0.0150, minQuality: 88, maxLatency: 5000 },
    hints: [
      "The Generator needs high quality — it writes the actual code. Keep it strong.",
      "The Critic mostly checks patterns. A good smaller model can spot obvious bugs.",
      "Prompt compression helps a lot here since context grows with each iteration.",
    ],
  },
  {
    patternSlug: "tool-use",
    title: "Optimize a Tool-Calling Agent",
    scenario:
      "Your research agent uses GPT-4o for decision-making and tool dispatch. Average query involves 3 tool calls. Total cost: $0.020 per query. Target: under $0.008 while keeping quality above 82%.",
    pipeline: [
      { id: "planner", name: "Query Planner", defaultModel: "gpt-4o", inputTokensPerRun: 600, outputTokensPerRun: 200 },
      { id: "tool-dispatch", name: "Tool Dispatcher", defaultModel: "gpt-4o", inputTokensPerRun: 400, outputTokensPerRun: 150 },
      { id: "synthesizer", name: "Result Synthesizer", defaultModel: "gpt-4o", inputTokensPerRun: 1000, outputTokensPerRun: 500 },
    ],
    availableModels: SHARED_MODELS,
    optimizations: SHARED_OPTIMIZATIONS,
    constraints: { maxCostPerRun: 0.0080, minQuality: 82, maxLatency: 4000 },
    hints: [
      "Tool dispatch is mostly structured JSON — a fast model handles it fine.",
      "The synthesizer produces the final answer the user sees — quality matters.",
      "Caching works well for the planner since many queries follow similar patterns.",
    ],
  },
  {
    patternSlug: "planning",
    title: "Optimize a Task Planner",
    scenario:
      "Your planning agent decomposes tasks in two steps: high-level planning then detailed subtask generation. Both use Claude 3.5 Sonnet. Cost: $0.018 per plan. Target: under $0.008.",
    pipeline: [
      { id: "high-level", name: "High-Level Planner", defaultModel: "claude-sonnet", inputTokensPerRun: 500, outputTokensPerRun: 400 },
      { id: "detail", name: "Detail Generator", defaultModel: "claude-sonnet", inputTokensPerRun: 700, outputTokensPerRun: 600 },
    ],
    availableModels: SHARED_MODELS,
    optimizations: SHARED_OPTIMIZATIONS,
    constraints: { maxCostPerRun: 0.0080, minQuality: 84, maxLatency: 3500 },
    hints: [
      "High-level planning benefits from a strong model — it sets the strategy.",
      "Detail generation is more mechanical and can use a cheaper model.",
      "Prompt compression reduces the growing context as plans get detailed.",
    ],
  },
  {
    patternSlug: "multi-agent-collaboration",
    title: "Optimize a Content Team",
    scenario:
      "Your Writer → Editor → Fact-Checker pipeline averages 2 revision cycles. All use GPT-4o. Cost per article: $0.045. Target: under $0.020 while keeping quality above 86%.",
    pipeline: [
      { id: "writer", name: "Writer Agent", defaultModel: "gpt-4o", inputTokensPerRun: 800, outputTokensPerRun: 1000 },
      { id: "editor", name: "Editor Agent", defaultModel: "gpt-4o", inputTokensPerRun: 1200, outputTokensPerRun: 400 },
      { id: "fact-checker", name: "Fact-Checker Agent", defaultModel: "gpt-4o", inputTokensPerRun: 1200, outputTokensPerRun: 300 },
    ],
    availableModels: SHARED_MODELS,
    optimizations: SHARED_OPTIMIZATIONS,
    constraints: { maxCostPerRun: 0.0200, minQuality: 86, maxLatency: 6000 },
    hints: [
      "The Writer produces the core content — quality matters most here.",
      "Editing is style-focused. A decent model with good instructions works.",
      "Fact-checking needs accuracy but produces short outputs — cost is input-heavy.",
    ],
  },
];

const configMap = new Map(optimizeLabConfigs.map((c) => [c.patternSlug, c]));

export function getOptimizeLabConfig(slug: string): OptimizeLabConfig | undefined {
  return configMap.get(slug);
}

export function hasOptimizeLabConfig(slug: string): boolean {
  return configMap.has(slug);
}

export function calculatePipelineCost(
  pipeline: PipelineStep[],
  modelChoices: Record<string, string>,
  enabledOptimizations: string[],
  models: ModelOption[],
  optimizations: OptimizationOption[],
): { cost: number; quality: number; latency: number } {
  const modelMap = new Map(models.map((m) => [m.id, m]));

  let totalCost = 0;
  let totalQuality = 0;
  let maxLatency = 0;

  for (const step of pipeline) {
    const modelId = modelChoices[step.id] || step.defaultModel;
    const model = modelMap.get(modelId);
    if (!model) continue;

    const inputCost = (step.inputTokensPerRun / 1_000_000) * model.costPerMillionInput;
    const outputCost = (step.outputTokensPerRun / 1_000_000) * model.costPerMillionOutput;
    totalCost += inputCost + outputCost;
    totalQuality += model.qualityScore;
    maxLatency = Math.max(maxLatency, model.latencyMs);
  }

  totalQuality = totalQuality / pipeline.length;

  let costMultiplier = 1;
  let qualityMultiplier = 1;
  let latencyMultiplier = 1;

  for (const optId of enabledOptimizations) {
    const opt = optimizations.find((o) => o.id === optId);
    if (!opt) continue;
    costMultiplier *= opt.costMultiplier;
    qualityMultiplier *= opt.qualityMultiplier;
    latencyMultiplier *= opt.latencyMultiplier;
  }

  return {
    cost: totalCost * costMultiplier,
    quality: Math.min(100, totalQuality * qualityMultiplier),
    latency: maxLatency * latencyMultiplier,
  };
}

export { optimizeLabConfigs };
