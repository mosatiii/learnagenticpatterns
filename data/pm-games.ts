// ─── Ship or Skip Types ──────────────────────────────────────────────────────

export interface ShipOrSkipOption {
  id: string;
  label: string;
  description: string;
  isCorrect: boolean;
  feedback: string;
}

export interface ShipOrSkipRound {
  id: string;
  scenario: string;
  context: string;
  options: ShipOrSkipOption[];
  tradeoffExplanation: string;
}

// ─── Budget Builder Types ────────────────────────────────────────────────────

export interface ModelTier {
  id: string;
  name: string;
  costPer1k: number; // $ per 1,000 requests
  qualityScore: number; // 0–100
  latencyMs: number;
}

export interface BudgetComponent {
  id: string;
  name: string;
  description: string;
  requestsPerMonth: number; // in thousands
}

export interface BudgetScenario {
  id: string;
  title: string;
  userStory: string;
  context: string;
  monthlyBudget: number;
  components: BudgetComponent[];
  modelTiers: ModelTier[];
  qualityThreshold: number; // min avg quality (0–100) to pass
  latencyTarget: number; // max acceptable avg latency in ms
}

// ─── Ship or Skip Scenarios ──────────────────────────────────────────────────

export const shipOrSkipRounds: ShipOrSkipRound[] = [
  {
    id: "sos-support-pipeline",
    scenario: "Your SaaS product gets 2,000 support tickets/day. You want AI to auto-classify, route, and draft responses before a human reviews them.",
    context: "Current average resolution time: 4 hours. Target: under 30 minutes. Budget is moderate.",
    options: [
      {
        id: "mega-prompt",
        label: "Single Mega-Prompt",
        description: "One large prompt that classifies, analyzes, and drafts a response all at once.",
        isCorrect: false,
        feedback: "A mega-prompt tries to do too much. It'll hallucinate classifications, miss edge cases, and you can't validate intermediate steps. When step 1 (classification) is wrong, the entire response is wrong — and you won't know which part failed.",
      },
      {
        id: "three-step-chain",
        label: "3-Step Prompt Chain",
        description: "Step 1: Classify ticket type + urgency. Step 2: Retrieve relevant KB articles (RAG). Step 3: Draft response using context.",
        isCorrect: true,
        feedback: "Correct! A 3-step chain gives you validation gates between steps, clear debugging points, and the ability to use different models per step (cheap classifier → RAG retrieval → smart drafter). Each step has a single responsibility.",
      },
      {
        id: "multi-agent",
        label: "5-Agent Multi-Agent System",
        description: "Classifier Agent → Researcher Agent → Writer Agent → Tone Checker Agent → QA Agent, all coordinated by an Orchestrator.",
        isCorrect: false,
        feedback: "Massively over-engineered for this use case. 5 agents means 5+ LLM calls per ticket × 2,000 tickets/day = 10,000+ LLM calls daily. The inter-agent communication adds latency and cost without proportional quality gain. A simple chain handles this cleanly.",
      },
    ],
    tradeoffExplanation: "The key tradeoff here is complexity vs. reliability. A 3-step chain gives you enough structure to validate at each stage without the cost/latency explosion of multi-agent. For high-volume, relatively structured tasks like support tickets, chains beat multi-agent systems.",
  },
  {
    id: "sos-cost-optimization",
    scenario: "Your AI feature handles 50,000 requests/day. 70% are simple FAQ lookups, 20% need moderate reasoning, and 10% are complex multi-step analyses. Your monthly AI bill is $15,000 and the CEO wants it under $5,000.",
    context: "All requests currently use GPT-4. Response quality satisfaction is 92%. You can't let it drop below 85%.",
    options: [
      {
        id: "downgrade-all",
        label: "Switch Everything to a Cheap Model",
        description: "Move all requests to GPT-3.5-turbo or a small open-source model to cut costs by 90%.",
        isCorrect: false,
        feedback: "This cuts costs but will tank quality on the 30% of requests that need reasoning. Your satisfaction will drop well below 85%. Users doing complex analyses will get terrible results and churn.",
      },
      {
        id: "tiered-routing",
        label: "Intelligent Tiered Routing",
        description: "Use a cheap classifier to route FAQs to a small model ($0.001/req), moderate requests to GPT-3.5 ($0.005/req), and complex ones to GPT-4 ($0.03/req).",
        isCorrect: true,
        feedback: "Correct! Tiered routing cuts your bill by ~70% while preserving quality where it matters. 70% of traffic goes to the cheapest tier, 20% to mid-tier, and only 10% hits the expensive model. Quality stays high because complex requests still get the best model.",
      },
      {
        id: "cache-everything",
        label: "Cache All Responses",
        description: "Build a semantic cache that stores and retrieves previous responses for similar queries, avoiding LLM calls entirely for repeat questions.",
        isCorrect: false,
        feedback: "Caching helps but can't be the primary strategy. It works for exact FAQ repeats but fails for anything with user-specific context. You'd still need a model for cache misses (which could be 40-60% of traffic). Good as a complement to routing, but not a standalone solution.",
      },
    ],
    tradeoffExplanation: "The fundamental PM decision: where does quality matter vs. where can you save? Routing is the #1 cost lever because it applies the right resource to the right task. It's the 'right tool for the right job' principle applied to AI spending.",
  },
  {
    id: "sos-latency-ux",
    scenario: "You're building a real-time document analysis feature. Users upload a contract and expect a summary, risk analysis, and key clause extraction. The current prototype takes 45 seconds end-to-end.",
    context: "User research shows users abandon after 15 seconds of waiting. The three analysis tasks are independent of each other.",
    options: [
      {
        id: "sequential",
        label: "Keep It Sequential, Add a Loading Bar",
        description: "Run summary → risk analysis → clause extraction one after another. Show a nice progress indicator.",
        isCorrect: false,
        feedback: "A loading bar doesn't fix a 45-second wait. User research already told you: users leave after 15 seconds. Even the best loading animation won't save a 3x-too-slow experience. You need to actually reduce the latency.",
      },
      {
        id: "parallel",
        label: "Run All Three in Parallel",
        description: "Launch summary, risk analysis, and clause extraction simultaneously. Stream results as each completes.",
        isCorrect: true,
        feedback: "Correct! Since the three tasks are independent, running them in parallel cuts latency from ~45s to ~15s (the time of the slowest task). Streaming results as they arrive makes it feel even faster. Cost stays the same — you're paying for the same work, just faster.",
      },
      {
        id: "precompute",
        label: "Pre-compute Everything on Upload",
        description: "Run all analyses in the background as soon as the file is uploaded, before the user asks. Results are instant when they click 'Analyze.'",
        isCorrect: false,
        feedback: "Pre-computing wastes resources on documents users may never analyze (common in upload-heavy products). It also means stale results if the analysis criteria change. Parallel execution on-demand is more efficient and just as fast from the user's perspective.",
      },
    ],
    tradeoffExplanation: "When tasks are independent, parallelization is a free speed win — same cost, dramatically lower latency. The PM skill is recognizing which tasks have dependencies (must be sequential) vs. which are independent (can be parallel). Always ask: 'Does step B need the output of step A?'",
  },
  {
    id: "sos-quality-vs-speed",
    scenario: "Your AI writing assistant generates marketing copy for enterprise clients. Clients report that ~15% of outputs contain factual errors or off-brand tone. The current system generates in 3 seconds with no self-check.",
    context: "Enterprise clients pay $50K/year. One bad piece of copy shared externally could damage brand trust. Current churn is 8%/quarter.",
    options: [
      {
        id: "no-reflection",
        label: "Ship Faster, Fix Manually",
        description: "Keep the 3-second generation. Add a disclaimer that outputs should be human-reviewed. Focus engineering time on other features.",
        isCorrect: false,
        feedback: "At $50K/year per client, 8% churn from quality issues costs real revenue. A disclaimer pushes the work back onto the user — exactly what they're paying to avoid. Enterprise clients expect reliability, not speed.",
      },
      {
        id: "one-reflection",
        label: "Add One Reflection Cycle",
        description: "After generating copy, run a critique step that checks for factual accuracy, brand tone, and compliance. Re-generate if issues found. Adds ~4 seconds.",
        isCorrect: true,
        feedback: "Correct! One reflection cycle typically catches 80-90% of issues. Going from 3s to 7s is acceptable for enterprise use cases where quality matters more than speed. The cost of one extra LLM call is trivial compared to $50K/year client retention.",
      },
      {
        id: "five-reflections",
        label: "Add Five Reflection Cycles",
        description: "Run the output through 5 different critique agents (fact-check, tone, grammar, compliance, brand voice). Ensures near-perfect quality.",
        isCorrect: false,
        feedback: "Diminishing returns. Each cycle after the first catches fewer errors but adds the same latency and cost. Five cycles means ~20-25 seconds per generation and 6x the token cost. One well-designed reflection prompt catches most issues. Over-engineering quality checks is a real trap.",
      },
    ],
    tradeoffExplanation: "Reflection follows the law of diminishing returns. The first cycle gives the biggest quality lift. Each additional cycle catches fewer errors but costs the same. As a PM, you define 'good enough' based on the business impact of errors, not the theoretical maximum quality.",
  },
  {
    id: "sos-safety-decision",
    scenario: "Your AI agent can search internal databases, draft emails, and schedule meetings on behalf of executives. The VP of Sales wants to add 'auto-send emails' so the agent can follow up with leads without manual approval.",
    context: "The agent handles 200 executive interactions/day. Email mistakes have high reputational risk. The VP says manual approval 'slows everything down.'",
    options: [
      {
        id: "full-auto",
        label: "Enable Full Auto-Send",
        description: "Let the agent send emails autonomously. Add a guardrail that checks for profanity and PII, but no human approval needed.",
        isCorrect: false,
        feedback: "An email sent to a wrong client, with wrong pricing, or an inappropriate tone can damage deals worth millions. Basic guardrails catch profanity but not strategic errors like 'offering a 50% discount when policy is 10%.' The downside risk massively outweighs the convenience gain.",
      },
      {
        id: "hitl-with-smart-routing",
        label: "Human-in-the-Loop with Smart Escalation",
        description: "Auto-send low-risk emails (meeting confirmations, thank-yous) but require human approval for anything involving pricing, commitments, or external clients. Use a risk classifier to decide.",
        isCorrect: true,
        feedback: "Correct! This balances speed and safety. ~60% of emails (confirmations, scheduling) are low-risk and can be auto-sent. The 40% involving commitments, pricing, or external parties get human review. The risk classifier adds minimal latency while preventing catastrophic mistakes.",
      },
      {
        id: "block-it",
        label: "Block Auto-Send Entirely",
        description: "Refuse the request. Emails are too risky for AI to send without approval. Require human review for every email.",
        isCorrect: false,
        feedback: "Too conservative. Not every email carries the same risk. Requiring human approval for 'Meeting confirmed for 2pm' wastes executive time and undermines the product's value proposition. Blanket rules ignore that risk is a spectrum, not binary.",
      },
    ],
    tradeoffExplanation: "Safety isn't binary — it's a spectrum. The PM skill is defining risk tiers and applying proportional controls. Low-risk actions can be automated. High-risk actions need human gates. The key question: 'What's the worst-case outcome if this action is wrong?' If the answer involves money, reputation, or legal liability — add human oversight.",
  },
];

// ─── Budget Builder Scenarios ────────────────────────────────────────────────

export const MODEL_TIERS: ModelTier[] = [
  { id: "frontier", name: "Frontier (GPT-4 / Claude Opus)", costPer1k: 30, qualityScore: 95, latencyMs: 3000 },
  { id: "mid", name: "Mid-Tier (GPT-4o-mini / Claude Sonnet)", costPer1k: 5, qualityScore: 82, latencyMs: 1200 },
  { id: "small", name: "Small (GPT-3.5 / Llama 3)", costPer1k: 0.5, qualityScore: 65, latencyMs: 400 },
];

export const budgetScenarios: BudgetScenario[] = [
  {
    id: "bb-support-bot",
    title: "Customer Support Bot",
    userStory: "Build an AI support bot that handles 100K customer queries per month. It must classify tickets, retrieve help docs, and draft responses.",
    context: "Your support team currently costs $40K/month. The AI bot needs to handle at least 60% of tickets autonomously with ≥80% quality. Remaining 40% escalate to humans.",
    monthlyBudget: 3000,
    components: [
      { id: "classifier", name: "Ticket Classifier", description: "Categorizes incoming tickets by type and urgency", requestsPerMonth: 100 },
      { id: "retriever", name: "Doc Retriever + RAG", description: "Searches knowledge base and retrieves relevant articles", requestsPerMonth: 60 },
      { id: "responder", name: "Response Drafter", description: "Generates human-quality responses using retrieved context", requestsPerMonth: 60 },
    ],
    modelTiers: MODEL_TIERS,
    qualityThreshold: 80,
    latencyTarget: 3000,
  },
  {
    id: "bb-content-platform",
    title: "Content Generation Platform",
    userStory: "Build a content platform that generates blog posts, social media copy, and email campaigns for 500 small business clients.",
    context: "Each client generates ~200 content requests/month. Blog posts need high quality (brand voice matters). Social posts can be simpler. Email campaigns need medium quality with personalization.",
    monthlyBudget: 5000,
    components: [
      { id: "blog-writer", name: "Blog Post Writer", description: "Long-form content with brand voice consistency", requestsPerMonth: 50 },
      { id: "social-writer", name: "Social Media Writer", description: "Short-form social posts across platforms", requestsPerMonth: 300 },
      { id: "email-writer", name: "Email Campaign Writer", description: "Personalized marketing emails with CTA optimization", requestsPerMonth: 150 },
    ],
    modelTiers: MODEL_TIERS,
    qualityThreshold: 78,
    latencyTarget: 4000,
  },
  {
    id: "bb-code-reviewer",
    title: "Code Review Assistant",
    userStory: "Build an AI code review tool for a 200-person engineering org. It reviews every PR for bugs, security issues, and style violations.",
    context: "The org produces ~800 PRs/month. Security reviews need the highest accuracy (missed vulnerabilities are expensive). Style checks are simple. Bug detection needs good reasoning.",
    monthlyBudget: 2000,
    components: [
      { id: "security-reviewer", name: "Security Reviewer", description: "Scans for vulnerabilities, injection risks, auth issues", requestsPerMonth: 800 },
      { id: "bug-detector", name: "Bug Detector", description: "Identifies logic errors, edge cases, race conditions", requestsPerMonth: 800 },
      { id: "style-checker", name: "Style Checker", description: "Enforces code style, naming conventions, documentation", requestsPerMonth: 800 },
    ],
    modelTiers: MODEL_TIERS,
    qualityThreshold: 82,
    latencyTarget: 5000,
  },
];

// ─── Scoring Helpers ─────────────────────────────────────────────────────────

export function calculateBudgetResult(
  allocations: Record<string, string>, // componentId → modelTierId
  scenario: BudgetScenario
) {
  let totalCost = 0;
  let totalQuality = 0;
  let totalLatency = 0;
  let componentCount = 0;

  for (const comp of scenario.components) {
    const tierId = allocations[comp.id];
    const tier = scenario.modelTiers.find((t) => t.id === tierId);
    if (!tier) continue;

    totalCost += (comp.requestsPerMonth * tier.costPer1k) / 1000;
    totalQuality += tier.qualityScore;
    totalLatency += tier.latencyMs;
    componentCount++;
  }

  const avgQuality = componentCount > 0 ? Math.round(totalQuality / componentCount) : 0;
  const avgLatency = componentCount > 0 ? Math.round(totalLatency / componentCount) : 0;
  const monthlyCost = Math.round(totalCost);

  const withinBudget = monthlyCost <= scenario.monthlyBudget;
  const meetsQuality = avgQuality >= scenario.qualityThreshold;
  const meetsLatency = avgLatency <= scenario.latencyTarget;

  // Scoring (out of 100)
  // Quality: 40pts — meets threshold? bonus for exceeding
  const qualityScore = meetsQuality
    ? 30 + Math.min(10, Math.round((avgQuality - scenario.qualityThreshold) / 2))
    : Math.max(0, Math.round((avgQuality / scenario.qualityThreshold) * 20));

  // Cost efficiency: 40pts — within budget? bonus for underspending
  const costScore = withinBudget
    ? 30 + Math.min(10, Math.round(((scenario.monthlyBudget - monthlyCost) / scenario.monthlyBudget) * 10))
    : Math.max(0, Math.round((scenario.monthlyBudget / monthlyCost) * 15));

  // Latency: 20pts — meets target? bonus for being faster
  const latencyScore = meetsLatency
    ? 15 + Math.min(5, Math.round(((scenario.latencyTarget - avgLatency) / scenario.latencyTarget) * 5))
    : Math.max(0, Math.round((scenario.latencyTarget / avgLatency) * 10));

  const totalScore = qualityScore + costScore + latencyScore;
  const passed = totalScore >= 60;

  return {
    monthlyCost,
    avgQuality,
    avgLatency,
    withinBudget,
    meetsQuality,
    meetsLatency,
    qualityScore,
    costScore,
    latencyScore,
    totalScore,
    maxScore: 100,
    passed,
  };
}
