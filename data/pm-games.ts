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
  category: string;
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
  qualityThreshold: number;
  latencyTarget: number;
  optimizationTip: string;
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
    category: "Architecture",
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
    category: "Cost",
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
    category: "Latency",
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
    category: "Quality",
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
    category: "Safety",
  },
  {
    id: "sos-rag-vs-finetune",
    scenario: "Your AI product needs to answer questions about your company's internal knowledge base — 50,000 documents covering policies, procedures, and product specs. The knowledge changes weekly.",
    context: "Users complain the AI 'makes things up' when asked about company-specific info. Engineering has proposed three approaches. Your knowledge base updates every week with new policies.",
    options: [
      {
        id: "fine-tune",
        label: "Fine-Tune a Custom Model",
        description: "Train a fine-tuned model on all 50K documents. Re-train weekly as documents change. Estimated cost: $2K per training run.",
        isCorrect: false,
        feedback: "Fine-tuning bakes knowledge into model weights — great for style/format, terrible for frequently changing facts. Weekly re-training is expensive ($100K/year) and each run risks overwriting previous learning. When the knowledge changes often, fine-tuning can't keep up.",
      },
      {
        id: "rag-pipeline",
        label: "Build a RAG Pipeline",
        description: "Index documents in a vector database. On each query, retrieve the top-K relevant chunks, then generate an answer grounded in those documents.",
        isCorrect: true,
        feedback: "Correct! RAG keeps knowledge separate from the model. When documents change, you re-index (minutes, not hours). The model generates answers grounded in retrieved context, dramatically reducing hallucination. Cost scales with queries, not training runs.",
      },
      {
        id: "mega-prompt",
        label: "Stuff Documents Into the Prompt",
        description: "For each query, find relevant documents and paste them directly into a mega-prompt with instructions like 'Answer based only on the following context.'",
        isCorrect: false,
        feedback: "This is a primitive version of RAG without the 'R.' Context windows have limits (even large ones). Stuffing raw documents wastes tokens on irrelevant content and costs 10-50x more per query than a proper retrieval + generation pipeline. It works for prototypes but collapses at scale.",
      },
    ],
    tradeoffExplanation: "Fine-tuning = teaching the model a skill (tone, format, reasoning style). RAG = giving the model a reference book. When knowledge changes frequently, RAG wins because you update the reference book, not the brain. The PM question: 'Does this knowledge change?' If yes → RAG. If it's a stable skill → fine-tuning.",
    category: "Architecture",
  },
  {
    id: "sos-eval-monitoring",
    scenario: "Your AI chatbot has been live for 3 months serving 10K conversations/day. Customer satisfaction scores dropped from 88% to 71% over the last 4 weeks. Engineering says 'nothing changed on our side.'",
    context: "The model provider released a minor version update 5 weeks ago. Your team has no automated quality monitoring. The CEO wants answers by Friday.",
    options: [
      {
        id: "rollback-model",
        label: "Rollback to the Previous Model Version",
        description: "Contact the model provider and request a rollback to the version from 5 weeks ago. If the update caused it, this fixes it immediately.",
        isCorrect: false,
        feedback: "You're guessing at the cause. The model update is suspicious timing, but correlation isn't causation. Maybe user patterns changed, maybe your prompts drifted, maybe a data source went stale. Rolling back without evidence means you might break things that actually improved — and you still won't know the root cause.",
      },
      {
        id: "build-eval-pipeline",
        label: "Build an Eval Pipeline First",
        description: "Create an LLM judge + metrics tracker. Score recent conversations for correctness, faithfulness, and tone. Compare last 4 weeks against the baseline. Then decide what to fix.",
        isCorrect: true,
        feedback: "Correct! You can't fix what you can't measure. An eval pipeline tells you exactly what degraded (correctness? tone? faithfulness?), when it started, and whether it correlates with the model update. This turns a crisis into a data-driven investigation. Takes 3-5 days but gives you the right answer.",
      },
      {
        id: "throw-money",
        label: "Upgrade to a Bigger Model",
        description: "Switch from GPT-4o-mini to GPT-4 for all conversations. More powerful model should produce better results across the board.",
        isCorrect: false,
        feedback: "A bigger model costs 6x more but might not fix the actual problem. If the issue is stale context data, a bad prompt, or changed user patterns, GPT-4 will give you the same wrong answers more eloquently. You're spending $50K+/month to avoid diagnosing the root cause.",
      },
    ],
    tradeoffExplanation: "When quality drops, the instinct is to act fast — rollback, upgrade, hotfix. But without eval data, every fix is a guess. The PM skill is resisting panic and investing in observability first. Build the eval pipeline, find the root cause, then apply the targeted fix. It takes longer upfront but prevents recurring blind spots.",
    category: "Quality",
  },
  {
    id: "sos-multi-agent-creep",
    scenario: "Your team built a 3-step prompt chain that handles customer onboarding: collect info → validate → generate welcome package. It works well at 500 users/day. The CTO read a blog post and wants to 'make it agentic' with 4 specialized agents and an orchestrator.",
    context: "Current system handles 500 users/day with 96% success rate, 4-second latency, and $800/month cost. The CTO's proposal would add a Coordinator Agent, Validation Agent, Personalization Agent, and QA Agent.",
    options: [
      {
        id: "go-agentic",
        label: "Build the Multi-Agent System",
        description: "Implement the CTO's vision: Coordinator → Info Collector → Validator → Personalizer → QA Agent. More sophisticated architecture for better results.",
        isCorrect: false,
        feedback: "The current system has 96% success rate at $800/month. A 5-agent system means 5x the LLM calls ($4K+/month), 3-4x the latency (15-20 seconds), and months of engineering time. You're optimizing a system that's already working. The CTO is solving a problem that doesn't exist.",
      },
      {
        id: "keep-chain",
        label: "Keep the Chain, Propose Criteria for When to Upgrade",
        description: "Document that the current chain handles the use case well. Define clear triggers for upgrading: >2K users/day, success rate drops below 90%, or new requirements that need dynamic routing.",
        isCorrect: true,
        feedback: "Correct! The best architecture is the simplest one that solves the problem. Instead of over-engineering now, set measurable thresholds that would justify the complexity. This gives the CTO a data-driven framework ('we'll go agentic when X happens') instead of a flat 'no.'",
      },
      {
        id: "compromise",
        label: "Add Just One Agent (Personalization)",
        description: "Meet the CTO halfway. Add a Personalization Agent to the existing chain to make it feel more 'agentic' without the full orchestration overhead.",
        isCorrect: false,
        feedback: "Compromising on architecture to satisfy politics is a trap. Adding one agent to a chain that doesn't need it creates a franken-architecture — half chain, half agent — that's harder to debug and maintain than either approach alone. Architecture decisions should be driven by requirements, not org politics.",
      },
    ],
    tradeoffExplanation: "Multi-agent systems are powerful but expensive in cost, latency, and complexity. The PM's job is to resist 'architecture hype' and advocate for the simplest solution that meets requirements. Define clear, measurable criteria for when to upgrade — this turns a political argument into a data-driven decision.",
    category: "Architecture",
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
    optimizationTip: "The Ticket Classifier handles 100% of volume but only needs to categorize — a small model handles this at pennies. Spend your budget on the Response Drafter where quality directly impacts customer experience. The RAG retriever sits in the middle: mid-tier balances relevance with cost.",
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
    optimizationTip: "Blog posts are your premium product — clients judge quality by these. Use the frontier model here. Social media is high-volume, low-stakes content: a small model generates acceptable tweets at 60x less cost. Emails sit in between: personalization needs decent reasoning, so mid-tier is the sweet spot.",
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
    optimizationTip: "Security vulnerabilities are the most expensive to miss — a single CVE in production can cost millions. Use the frontier model here even if it strains the budget. Bug detection needs good reasoning (mid-tier). Style checking is purely mechanical: a small model enforces naming conventions just fine.",
  },
  {
    id: "bb-sales-assistant",
    title: "AI Sales Assistant",
    userStory: "Build an AI assistant for a 50-person sales team that qualifies leads, handles objections in real-time, and generates custom proposals.",
    context: "Each rep has ~200 conversations/month. Lead qualification is high-volume but binary (qualified/not). Objection handling needs nuance and real-time speed. Proposals are client-facing documents where quality directly affects close rates.",
    monthlyBudget: 4000,
    components: [
      { id: "lead-qualifier", name: "Lead Qualifier", description: "Scores inbound leads on fit, intent, and budget signals", requestsPerMonth: 500 },
      { id: "objection-handler", name: "Objection Handler", description: "Suggests real-time responses to common sales objections", requestsPerMonth: 200 },
      { id: "proposal-gen", name: "Proposal Generator", description: "Creates customized proposals with pricing, timelines, and case studies", requestsPerMonth: 100 },
    ],
    modelTiers: MODEL_TIERS,
    qualityThreshold: 80,
    latencyTarget: 2500,
    optimizationTip: "Lead qualification is a scoring task — binary output, high volume. A small model handles it cheaply. Objection handling needs real-time speed AND nuance: mid-tier gives acceptable quality at low latency. Proposals are client-facing and directly impact revenue — this is where frontier quality pays for itself.",
  },
  {
    id: "bb-legal-analyzer",
    title: "Legal Document Analyzer",
    userStory: "Build an AI tool for a law firm that extracts key clauses from contracts, scores risk exposure, and generates executive summaries for partners.",
    context: "The firm processes ~2,000 documents/month. Missing a liability clause or misscoring risk can lead to malpractice suits. Partners need concise summaries but won't tolerate errors. Accuracy is non-negotiable.",
    monthlyBudget: 6000,
    components: [
      { id: "clause-extractor", name: "Clause Extractor", description: "Identifies and extracts key clauses (liability, indemnity, termination, IP)", requestsPerMonth: 2000 },
      { id: "risk-scorer", name: "Risk Scorer", description: "Evaluates extracted clauses for financial and legal risk exposure", requestsPerMonth: 2000 },
      { id: "summary-gen", name: "Summary Generator", description: "Produces partner-ready executive summaries with risk highlights", requestsPerMonth: 2000 },
    ],
    modelTiers: MODEL_TIERS,
    qualityThreshold: 90,
    latencyTarget: 4000,
    optimizationTip: "In legal tech, accuracy trumps everything — a missed liability clause can cost more than the entire AI budget. Both Clause Extractor and Risk Scorer need frontier models because errors compound: bad extraction leads to bad risk scoring. The Summary Generator can potentially use mid-tier since it summarizes already-validated data, but only if the 90% quality threshold is still met.",
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

// ─── Stakeholder Simulator Types ─────────────────────────────────────────────

export interface Stakeholder {
  id: string;
  role: string;
  name: string;
  argument: string;
  isOptimal: boolean;
  feedback: string;
}

export interface StakeholderRound {
  id: string;
  situation: string;
  tension: string;
  stakeholders: Stakeholder[];
  optimalRationale: string;
  category: string;
}

// ─── Stakeholder Simulator Rounds ────────────────────────────────────────────

export const stakeholderRounds: StakeholderRound[] = [
  {
    id: "ss-feature-scope",
    situation: "Your company is launching its first AI-powered feature — a customer-facing chatbot that answers questions about your product. Three stakeholders have very different ideas about what V1 should look like.",
    tension: "The board meeting is in 6 weeks. Whatever you ship needs to demonstrate real value. But over-scoping means you ship nothing.",
    stakeholders: [
      {
        id: "eng",
        role: "Engineering Lead",
        name: "Sarah",
        argument: "Let's ship a focused RAG chatbot that answers questions from our existing help docs. It's a 3-week build, low risk, and we can validate whether users actually want AI help before investing more. We can always add complexity later.",
        isOptimal: true,
        feedback: "Sarah's approach minimizes risk while maximizing learning. A focused RAG chatbot validates the core hypothesis ('do users want AI help?') in 3 weeks. You get real usage data before committing to a larger architecture.",
      },
      {
        id: "sales",
        role: "VP of Sales",
        name: "Marcus",
        argument: "Enterprise clients are asking for a full AI assistant — not just docs. We need multi-agent: one for product questions, one for billing, one for technical support, plus Slack and email integrations. I have 3 deals worth $1.2M waiting on this.",
        isOptimal: false,
        feedback: "Marcus's vision is the right V3, not V1. An 8-integration multi-agent system takes 4-6 months to build properly. The deals will close on a compelling demo, not a half-finished system that crashes during the call.",
      },
      {
        id: "ceo",
        role: "CEO",
        name: "Diana",
        argument: "The board needs to see something impressive. Can't we just use GPT-4 with a nice UI? Slap our branding on it, connect it to our docs, and ship it. My nephew built something like this in a weekend.",
        isOptimal: false,
        feedback: "Diana's 'weekend project' approach produces a demo that works in controlled settings but fails in production. No retrieval means hallucinated answers. No guardrails means brand risk. A polished prototype that gives wrong answers is worse than no product.",
      },
    ],
    optimalRationale: "Ship the focused RAG chatbot. It validates user demand in 3 weeks, generates real data for the board, and creates a foundation for Marcus's enterprise vision. The key PM insight: the fastest way to build the right V3 is to ship V1 and learn.",
    category: "Scope",
  },
  {
    id: "ss-model-selection",
    situation: "Your AI product is going enterprise. Fortune 500 clients are evaluating it. The team needs to decide on the model strategy — and three departments have strong, conflicting opinions.",
    tension: "Enterprise clients require data privacy guarantees. But they also expect state-of-the-art quality. And your CFO is watching the cloud bill triple every quarter.",
    stakeholders: [
      {
        id: "eng",
        role: "Engineering Lead",
        name: "Sarah",
        argument: "We should use open-source models (Llama 3, Mistral) hosted on our own infrastructure. Enterprise clients need data privacy — we can guarantee their data never leaves our servers. Plus, we control the model lifecycle.",
        isOptimal: false,
        feedback: "Full open-source is the right answer for data-sensitive operations, but using it for everything sacrifices quality on complex reasoning tasks. Enterprise clients will notice when the AI struggles with nuanced questions that GPT-4 handles easily.",
      },
      {
        id: "sales",
        role: "VP of Sales",
        name: "Marcus",
        argument: "Clients ask 'do you use GPT-4?' in every demo. It's become a proxy for quality. We should use GPT-4 for everything — it's what the market expects. The privacy concerns are overblown; OpenAI's enterprise tier has good enough guarantees.",
        isOptimal: false,
        feedback: "Using GPT-4 for everything costs 60x more than a small model for simple tasks. At enterprise scale, that's $200K+/month in API costs. And 'good enough' privacy guarantees won't pass Fortune 500 security reviews for sensitive data processing.",
      },
      {
        id: "cfo",
        role: "CFO",
        name: "James",
        argument: "We need a tiered approach. Route sensitive data through our self-hosted open-source models. Use GPT-4 for complex reasoning where quality matters. Use a cheap model for simple classification and formatting. Match the model to the task.",
        isOptimal: true,
        feedback: "James's tiered approach satisfies all three constraints: privacy (self-hosted for sensitive data), quality (GPT-4 for complex tasks), and cost (cheap models for simple work). This is the routing pattern applied to business strategy.",
      },
    ],
    optimalRationale: "A tiered model strategy is the only approach that satisfies enterprise privacy requirements, maintains quality where it matters, and keeps costs sustainable. The PM insight: model selection isn't one decision — it's a routing problem where different data types flow to different models.",
    category: "Model",
  },
  {
    id: "ss-safety-deadline",
    situation: "Your AI agent can now draft and send customer communications. Legal wants a full safety review. Sales needs it live for a massive deal. Engineering has a pragmatic middle ground.",
    tension: "A $500K enterprise deal closes next Friday. The prospect wants to see the AI sending real communications during the final demo. But the product hasn't been through legal safety review.",
    stakeholders: [
      {
        id: "legal",
        role: "General Counsel",
        name: "Patricia",
        argument: "No customer-facing AI communications without a complete safety review. That's 6 weeks minimum: prompt injection testing, PII leak analysis, tone evaluation, compliance check. One bad email to a client could be a lawsuit.",
        isOptimal: false,
        feedback: "Patricia's concerns are valid, but a blanket 6-week block kills a $500K deal and sets a precedent that legal can veto any launch indefinitely. The risk of one bad email is real — but so is the risk of losing the deal and the revenue to fund the safety team.",
      },
      {
        id: "sales",
        role: "VP of Sales",
        name: "Marcus",
        argument: "We need this live by Friday. The prospect explicitly asked to see real AI-generated communications. I'll take personal responsibility for reviewing every email the AI sends during the demo. We can do the full safety review after the deal closes.",
        isOptimal: false,
        feedback: "Marcus manually reviewing AI emails is not a scalable safety strategy. If the demo goes well and 10 more enterprise clients want the same thing, Marcus can't review 500 emails/day. And 'we'll add safety later' is a debt that compounds — it never happens.",
      },
      {
        id: "eng",
        role: "Engineering Lead",
        name: "Sarah",
        argument: "Ship it Friday with guardrails: input filter for prompt injection, PII scanner on all outputs, human-in-the-loop approval for anything over $1K or to external parties. Run the full legal safety review in parallel — results by week 3, patches by week 4.",
        isOptimal: true,
        feedback: "Sarah's approach balances speed and safety. Guardrails + human approval handle the highest-risk scenarios immediately. The parallel safety review means you're not choosing between the deal and compliance — you get both, just on different timelines.",
      },
    ],
    optimalRationale: "Ship with guardrails, review in parallel. This is the human-in-the-loop pattern applied to a business constraint. High-risk actions (large amounts, external communications) get human gates. Low-risk actions flow through. The safety review runs concurrently instead of sequentially.",
    category: "Safety",
  },
  {
    id: "ss-scaling-decision",
    situation: "Your AI product just landed 3 enterprise clients. Usage is growing 40% month-over-month. The team needs to decide how to handle infrastructure scaling before costs spiral.",
    tension: "Current monthly infra cost: $12K. At current growth, it'll be $50K in 4 months. Each department has a different scaling philosophy.",
    stakeholders: [
      {
        id: "eng",
        role: "Engineering Lead",
        name: "Sarah",
        argument: "Let's provision dedicated GPU clusters now. I've seen this movie before — auto-scaling fails during traffic spikes and we get outages. Enterprise clients need guaranteed uptime. Pre-provisioning costs more upfront but we'll need it in 6 months anyway.",
        isOptimal: false,
        feedback: "Pre-provisioning for projected traffic 6 months out means paying for capacity you may never need. Growth projections are often wrong — one churned client changes the math entirely. At $50K+/month in committed GPU costs, you're betting the runway on a forecast.",
      },
      {
        id: "cfo",
        role: "CFO",
        name: "James",
        argument: "Pay-as-you-go with auto-scaling. Set up cloud auto-scaling that provisions resources based on actual demand. Add a cost monitoring dashboard with alerts at 60% and 80% utilization. Revisit dedicated infrastructure when we hit sustained 70% utilization.",
        isOptimal: true,
        feedback: "James's approach minimizes waste while maintaining a clear upgrade path. Auto-scaling handles traffic spikes without over-provisioning. The utilization alerts give you a data-driven trigger for when to commit to dedicated infrastructure — based on reality, not projections.",
      },
      {
        id: "sales",
        role: "VP of Sales",
        name: "Marcus",
        argument: "Enterprise clients are asking about SLAs and uptime guarantees. We need to guarantee 99.9% uptime in our contracts. That requires dedicated infrastructure — you can't promise SLAs on auto-scaling. I need this for the next 5 deals in the pipeline.",
        isOptimal: false,
        feedback: "Marcus is right that enterprise clients want SLAs, but 99.9% uptime doesn't require dedicated hardware — it requires good architecture (multi-region, failover, load balancing). Auto-scaling with proper redundancy can meet SLAs at a fraction of the cost of permanent over-provisioning.",
      },
    ],
    optimalRationale: "Start with pay-as-you-go, invest in monitoring, and set data-driven thresholds for upgrading. The PM insight: infrastructure decisions should be reversible. Committing $50K/month to GPUs based on 4-month projections is an irreversible bet. Auto-scaling lets you scale up AND down based on reality.",
    category: "Scale",
  },
  {
    id: "ss-quality-regression",
    situation: "Customer satisfaction dropped 17 points over 4 weeks. Support tickets mentioning 'wrong answers' tripled. Three teams have different theories and different fix proposals — and the CEO wants answers by end of week.",
    tension: "Revenue is at risk: two enterprise clients are threatening to churn citing quality. The team doesn't have an automated eval system, so no one actually knows what changed or when.",
    stakeholders: [
      {
        id: "eng",
        role: "Engineering Lead",
        name: "Sarah",
        argument: "The model provider pushed a minor update 5 weeks ago. Timing matches exactly. Let's roll back to the previous model version. If quality recovers, we know the cause. Fast fix, minimal engineering effort.",
        isOptimal: false,
        feedback: "The timing is suspicious but circumstantial. The model update, prompt changes, data source staleness, and user pattern shifts all happened in the same window. Rolling back without evidence might mask the real issue — or make it worse if the new model actually fixed other problems.",
      },
      {
        id: "sales",
        role: "VP of Sales",
        name: "Marcus",
        argument: "Upgrade everything to GPT-4. Two clients are about to churn — we can't afford a 3-week investigation. Throw the best model at it, stabilize quality, and figure out root cause later. The cost increase is cheaper than losing $400K in ARR.",
        isOptimal: false,
        feedback: "Upgrading models is the AI equivalent of 'have you tried turning it off and on again.' GPT-4 costs 6x more and might not fix the problem if the root cause is stale data, bad prompts, or changed user patterns. You'd spend $50K+/month extra without knowing if it worked.",
      },
      {
        id: "data",
        role: "Data Team Lead",
        name: "Priya",
        argument: "We need an eval pipeline before we change anything. Build an LLM judge that scores recent conversations on correctness, faithfulness, and tone. Compare the last 4 weeks against the baseline. We'll have root cause by Wednesday and a targeted fix by Friday.",
        isOptimal: true,
        feedback: "Priya's approach turns panic into data. An eval pipeline identifies exactly what degraded, when it started, and whether it correlates with the model update, data changes, or something else entirely. This gives you the right fix instead of an expensive guess.",
      },
    ],
    optimalRationale: "Measure before you fix. An eval pipeline is the AI equivalent of APM (Application Performance Monitoring) — you'd never debug a production outage without logs. The PM insight: investing 3 days in diagnosis saves months of wrong fixes and wasted model spend.",
    category: "Quality",
  },
];
