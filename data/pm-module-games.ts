/**
 * Per-module PM game content registry.
 *
 * Every PM module's Play tab renders ONE game whose format is chosen by the
 * module's `gameType` (ship-or-skip | budget-builder | stakeholder-sim).
 * The actual rounds/scenarios live below, keyed by module slug.
 *
 * Save slug convention (used for game_scores): `pm-${moduleSlug}`. See
 * gameSlugForModule() in pm-curriculum.ts.
 *
 * Phase 1 ships 6 modules with content (3 repurposed legacy games + 3 fresh).
 * The other 9 modules are intentionally absent — UI shows "coming soon".
 */

import type {
  ShipOrSkipRound,
  BudgetScenario,
  StakeholderRound,
} from "./pm-games";
import {
  shipOrSkipRounds as legacyShipRounds,
  budgetScenarios as legacyBudgetScenarios,
  stakeholderRounds as legacyStakeholderRounds,
} from "./pm-games";

// ─── Ship or Skip games ──────────────────────────────────────────────────────
//
// Module 1 (Becoming AI-Native) — first Ship module. Repurposes the original
// generic Ship-or-Skip rounds (architectural decisions across pipelines/
// agents/RAG) which read as foundational "what shape of agent do I build?"
// material — exactly what the AI-Native Foundations module teaches.
//
// Module 5 (Intelligent Routing) — fresh content (Phase 1 sample, full
// quality bar). Tests when a router is the right shape, when not, and how
// to choose between routing strategies.

const SHIP_GAMES_BY_MODULE: Record<string, ShipOrSkipRound[]> = {
  "ai-native-foundations": legacyShipRounds.slice(0, 5),
  "intelligent-routing": [], // populated below
};

// ─── Budget Builder games ────────────────────────────────────────────────────
//
// Module 6 (Speed & Parallel Processing) — first Budget module. Repurposes
// the original generic Budget Builder scenarios (model-tier allocation
// across pipelines), which fit speed/cost-tradeoff thinking precisely.
//
// Module 14 (LLMOps & Production Realities) — fresh content (Phase 1 sample,
// full quality bar). Production cost/latency/quality tradeoffs at scale.

const BUDGET_GAMES_BY_MODULE: Record<string, BudgetScenario[]> = {
  "speed-at-scale": legacyBudgetScenarios.slice(0, 5),
  "llmops-production": [], // populated below
};

// ─── Stakeholder Simulator games ─────────────────────────────────────────────
//
// Module 4 (Task Orchestration) — first Stakeholder module. Repurposes the
// original generic Stakeholder Sim rounds (stakeholder pitches across
// product/eng/sales) which read as classic "who orchestrates what" tension.
//
// Module 10 (Multi-Agent Teams) — fresh content (Phase 1 sample, full
// quality bar). Stakeholder dynamics around multi-agent coordination.

const STAKEHOLDER_GAMES_BY_MODULE: Record<string, StakeholderRound[]> = {
  "task-orchestration": legacyStakeholderRounds.slice(0, 5),
  "multi-agent-teams": [], // populated below
};

// ─── Lookup helpers ──────────────────────────────────────────────────────────

export function getShipGameFor(moduleSlug: string): ShipOrSkipRound[] | null {
  const r = SHIP_GAMES_BY_MODULE[moduleSlug];
  return r && r.length > 0 ? r : null;
}

export function getBudgetGameFor(moduleSlug: string): BudgetScenario[] | null {
  const s = BUDGET_GAMES_BY_MODULE[moduleSlug];
  return s && s.length > 0 ? s : null;
}

export function getStakeholderGameFor(moduleSlug: string): StakeholderRound[] | null {
  const r = STAKEHOLDER_GAMES_BY_MODULE[moduleSlug];
  return r && r.length > 0 ? r : null;
}

/** True if ANY game (of any format) is wired for this module. */
export function hasGameFor(moduleSlug: string): boolean {
  return Boolean(
    SHIP_GAMES_BY_MODULE[moduleSlug]?.length ||
    BUDGET_GAMES_BY_MODULE[moduleSlug]?.length ||
    STAKEHOLDER_GAMES_BY_MODULE[moduleSlug]?.length
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Fresh content — Phase 1 samples
// ═════════════════════════════════════════════════════════════════════════════

// ─── Module 5: Intelligent Routing (Ship or Skip, 5 rounds) ──────────────────
//
// PM lens: routing is a *decision architecture* problem. Each round forces
// the player to choose between three plausible routing approaches under
// different constraints (cost, latency, quality, complexity). Wrong options
// are realistic mistakes a real PM would make.

SHIP_GAMES_BY_MODULE["intelligent-routing"] = [
  {
    id: "ir-classify-vs-llm",
    scenario:
      "Your customer support tool ingests inbound emails. You need to send each email to one of 4 specialist queues: Billing, Technical, Sales, or General. Volume is 12,000 emails/day. The team is debating how to do the routing.",
    context:
      "Emails are short (avg 80 words) and the categories are well-defined. Latency budget per email: under 500ms. The CFO is watching cloud spend.",
    options: [
      {
        id: "rules",
        label: "Hand-written keyword rules",
        description:
          "Build a rules engine: keywords like 'invoice', 'refund' → Billing; 'API', 'error' → Technical; etc. Fast, free, deterministic.",
        isCorrect: false,
        feedback:
          "Rules look cheap until you maintain them. You'll spend the next year adding edge cases ('invoice from a technical bug report'). Coverage will plateau around 70% accuracy and degrade as customers' language evolves. The rules engine becomes the most-touched, least-loved part of the codebase.",
      },
      {
        id: "fine-tuned-classifier",
        label: "Fine-tuned small classifier",
        description:
          "Train a small open-source classifier (e.g., DistilBERT) on 2,000 labeled examples. ~10ms inference, ~$0 ongoing cost after training.",
        isCorrect: true,
        feedback:
          "Correct. For a closed set of well-defined categories with high volume and short inputs, a fine-tuned small model is the right tool. It's faster and cheaper than calling an LLM, and accuracy on a well-scoped 4-class problem typically lands at 92%+. You spend a week labeling, then it just works.",
      },
      {
        id: "llm-router",
        label: "LLM-based router (GPT-4 with classification prompt)",
        description:
          "Send every email to GPT-4 with a prompt like 'Classify this email into one of: Billing, Technical, Sales, General.' Highest accuracy, simplest to build.",
        isCorrect: false,
        feedback:
          "Massive overkill. 12,000 emails × ~$0.005/call = $60/day on classification alone — $22K/year — for a problem a 50MB model solves for free. Latency is also 5-10× slower. LLM routing is right when the categories are fuzzy or the input is rich; not for 4 well-defined buckets on short emails.",
      },
    ],
    tradeoffExplanation:
      "The PM lesson: routing tool choice scales with input ambiguity, not vibes. Closed set + well-defined categories + high volume = train a classifier. Open set + fuzzy categories + low volume = LLM. Reach for an LLM router only when you'd otherwise need a rules engine bigger than your codebase.",
    category: "Routing tool selection",
  },
  {
    id: "ir-semantic-vs-keyword",
    scenario:
      "You're building an AI-powered help center. When a user asks a question, you need to route them to the right doc article (out of 800 articles). The current keyword search is failing — users phrase questions in ways that don't match doc titles ('my password isn't working' → never finds 'Resetting your account credentials').",
    context:
      "You have ~3,000 daily questions. The team has 4 weeks before launch. Articles are written in plain English, not technical jargon.",
    options: [
      {
        id: "expand-keywords",
        label: "Expand the keyword index with synonyms",
        description:
          "Add a synonym dictionary: 'password' → ['credentials', 'login', 'sign in']; 'error' → ['issue', 'problem', 'bug']. Tune until search hits improve.",
        isCorrect: false,
        feedback:
          "You'll spend 4 weeks building a synonym dictionary and ship something marginally better than what you had. Synonym maps don't capture intent — 'my login isn't working' and 'I forgot my password' need the same article but share zero keywords. This is a known failure mode of search circa 2018.",
      },
      {
        id: "embeddings-router",
        label: "Embeddings-based semantic router",
        description:
          "Embed all 800 articles once (one-time cost). At query time, embed the user's question and route to the nearest-neighbor article. Use a small cheap embedding model (e.g., text-embedding-3-small).",
        isCorrect: true,
        feedback:
          "Correct. This is exactly what semantic routing was built for: matching by meaning, not vocabulary. One-time cost to embed 800 articles is trivial (~$0.50). Query-time embedding is sub-cent and ~50ms. Accuracy on this kind of problem is typically 80%+ with no per-article tuning. You can ship in a week.",
      },
      {
        id: "llm-classifier",
        label: "LLM picks the article from a list of titles",
        description:
          "Send all 800 article titles + the user's question to GPT-4 in one prompt: 'Pick the article that answers this question.'",
        isCorrect: false,
        feedback:
          "Won't work as designed: 800 titles will blow past most context windows, and even chunked LLM 'pick from N options' degrades sharply past ~50 candidates. Also wildly expensive at 3,000/day. Embeddings handle the 'narrow 800 → top-3' step; if you want, you can THEN have an LLM pick from the top 3. Don't make the LLM do the search.",
      },
    ],
    tradeoffExplanation:
      "Semantic routing replaces keyword search whenever users phrase intent in ways that don't match your document vocabulary. Embeddings are the right primitive for 'match by meaning' at scale. LLMs are great at picking from a few candidates AFTER retrieval narrowed the set — they're bad at being the search.",
    category: "Semantic routing",
  },
  {
    id: "ir-router-or-fallback",
    scenario:
      "Your AI agent does three things: answer FAQs (fast, cheap), generate code samples (medium), and produce custom integration designs (slow, expensive). You currently send EVERY query through the expensive integration-design agent because it 'can do everything.' Your bill is exploding. The team is debating how to fix it.",
    context:
      "Query volume: 1M/month. Cost breakdown: 60% FAQ-shaped, 30% code-sample-shaped, 10% truly custom integration. Current monthly bill: $48K.",
    options: [
      {
        id: "no-router-cheaper-default",
        label: "Just downgrade everything to a cheaper model",
        description:
          "Switch the integration-design agent from GPT-4 to GPT-4o-mini. Same code, cheaper model.",
        isCorrect: false,
        feedback:
          "You'll cut costs ~70% but tank quality on the 10% of queries that genuinely need GPT-4. Custom-integration users will churn. You're optimizing one number (cost) by sabotaging another (quality on the work that matters most). Routing exists exactly to avoid this tradeoff.",
      },
      {
        id: "router-three-paths",
        label: "Add a routing layer that classifies into FAQ / Code / Integration",
        description:
          "Cheap classifier in front. FAQs go to a small model + cache. Code samples go to a mid-tier model. Custom integration designs go to GPT-4. Each path uses the right tool.",
        isCorrect: true,
        feedback:
          "Correct. This is textbook routing economics: 60% of traffic now costs ~5% of what it did, 30% costs ~30%, and 10% still gets the premium model. Bill drops to ~$10K/month and quality on the high-stakes 10% is unchanged. The routing layer pays for itself in the first hour of operation.",
      },
      {
        id: "human-router",
        label: "Add a 'task type' dropdown so users self-route",
        description:
          "Make users pick FAQ / Code / Integration before submitting. Each maps to a different backend model.",
        isCorrect: false,
        feedback:
          "Pushes the routing problem onto the user. Most won't pick correctly (or at all — they just leave). 'Make the user do it' looks cheap but raises support tickets, hurts conversion, and creates ambiguous data ('user said FAQ but actually wanted Integration'). Good UX hides routing; bad UX makes the user do it.",
      },
    ],
    tradeoffExplanation:
      "The PM lesson: routing buys you cost reduction WITHOUT sacrificing quality on the work that matters. A 60/30/10 traffic split where each tier needs a different model is the canonical 'router pays for itself' shape. Don't downgrade everything; route by intent.",
    category: "Cost via routing",
  },
  {
    id: "ir-router-confidence",
    scenario:
      "Your routing layer sends queries to one of three downstream agents. It's working — but ~8% of queries get routed wrong (e.g., a complex billing question goes to the simple-answer agent and produces a useless reply). Users are complaining. The team is debating how to handle low-confidence routing.",
    context:
      "Wrong routes are detectable: the downstream agent often produces a low-confidence response or asks for clarification. Volume is 30,000 queries/day.",
    options: [
      {
        id: "always-strongest",
        label: "Stop routing — send everything to the strongest agent",
        description:
          "Routing is broken 8% of the time, so kill it and route 100% to the most capable agent. Quality maxed.",
        isCorrect: false,
        feedback:
          "You traded an 8% bug for an 8x cost increase across 100% of traffic. The right framing is: routing is correct 92% of the time and saving real money. The job is to handle the 8% better, not throw away the 92%.",
      },
      {
        id: "confidence-threshold-fallback",
        label: "Route by intent, fallback to escalation when downstream confidence is low",
        description:
          "Keep the router. If the downstream agent's response confidence is below threshold OR it asks for clarification, automatically re-route the query to the strongest agent for a second attempt.",
        isCorrect: true,
        feedback:
          "Correct. Confidence-aware fallback is the right pattern: most queries hit the cheap path, the 8% that struggle escalate automatically. User sees a response that just works. Cost stays near the 'route everything cheap' floor because escalation is rare. This is how production routers handle messy real traffic.",
      },
      {
        id: "user-rerun-button",
        label: "Add a 'Try again with smarter model' button to bad responses",
        description:
          "When users see a bad response, they can click to re-run with the strongest agent. Costs only go up when users explicitly ask.",
        isCorrect: false,
        feedback:
          "Cost-effective in theory, terrible UX in practice. You're shipping the bad answer first, asking the user to recognize it as bad, and asking them to take action. Most won't — they'll just leave. The 8% wrong-route rate becomes an 8% churn driver. Confidence-based fallback is invisible to the user; the button is visible failure.",
      },
    ],
    tradeoffExplanation:
      "Routing isn't 'right or wrong' — it's a cost/accuracy tradeoff with a fallback path. The mark of a mature routing system is graceful degradation: when confidence is low, escalate automatically. Users should never see your routing layer; they should just see correct answers.",
    category: "Routing reliability",
  },
  {
    id: "ir-rebuild-vs-feature-flag",
    scenario:
      "Your product team wants to A/B test three different routing strategies (rule-based, embedding-based, LLM-based) over 4 weeks. Engineering says it's a 6-week build because they'll have to refactor the agent layer to support multiple routers. The team is debating how to ship the experiment.",
    context:
      "Each routing strategy has known tradeoffs. The team wants real production data to choose. The bigger AI roadmap is blocked until this is decided.",
    options: [
      {
        id: "build-all-three",
        label: "Build all three routers in parallel, A/B test live",
        description:
          "Eng spends 6 weeks building all three routing implementations. Run an A/B test for 4 weeks across them. Pick a winner.",
        isCorrect: false,
        feedback:
          "10 weeks until you have data. Two of the three implementations will be thrown away. The roadmap stays blocked the whole time. This is how teams burn quarters on infrastructure that should have been a 2-day prototype.",
      },
      {
        id: "feature-flag-router-interface",
        label: "Define a router interface, ship one default, feature-flag the others",
        description:
          "Spend a week defining a clean Router interface. Ship the simplest implementation (rules) as the default. Build the other two behind feature flags as you learn. Roll out one at a time and measure.",
        isCorrect: true,
        feedback:
          "Correct. The router interface is the load-bearing decision; the implementations are swappable. Ship something working in week 1, then iterate. A/B test sequentially using flags — you don't need three live in parallel to learn. Total time to first signal: 2 weeks. Total time to confident decision: 6-8 weeks, with the roadmap moving the whole time.",
      },
      {
        id: "delay-pick-one",
        label: "Pick the strategy you think is best, ship it, skip the test",
        description:
          "Pick one routing approach based on the team's gut. Ship in 2 weeks. Move on.",
        isCorrect: false,
        feedback:
          "Tempting and faster, but you've made an irreversible architectural decision based on intuition. If routing is the wrong shape (e.g., you picked rules and need semantic), you'll be paying that decision cost forever. Spending one extra week to make the choice sequential-flippable is worth it for any decision this load-bearing.",
      },
    ],
    tradeoffExplanation:
      "When the architectural shape matters more than the implementation, invest in the *interface*, not the *implementation count*. A router interface lets you ship one option, learn, and swap. A/B testing infra for AI architecture decisions is overkill; sequential feature-flag rollouts give you the same answer faster.",
    category: "Routing rollout strategy",
  },
];

// ─── Module 14: LLMOps & Production Realities (Budget Builder, 5 scenarios) ──
//
// PM lens: in production, every component is a cost/quality/latency
// tradeoff. Each scenario asks the player to allocate model tiers across
// the components of a production AI system, hitting cost/quality/latency
// constraints. Real production shapes — chatbots, RAG, agents, evals.

BUDGET_GAMES_BY_MODULE["llmops-production"] = [
  {
    id: "llmops-customer-chatbot",
    title: "Production Customer Chatbot",
    userStory:
      "Your B2C customer-facing chatbot handles 200K queries/month. It needs to feel snappy, give correct answers, and stay under budget. The CFO is watching.",
    context:
      "P95 latency must stay under 2 seconds. Quality (correct answers per the eval set) needs to be ≥85%. Monthly budget: $1,500.",
    monthlyBudget: 1500,
    components: [
      {
        id: "intent",
        name: "Intent Classifier",
        description: "Routes the query to FAQ, Account, or Sales path. Short input, well-defined classes.",
        requestsPerMonth: 200,
      },
      {
        id: "rag-retriever",
        name: "RAG Retrieval",
        description: "Embeds the query and pulls 3 relevant docs. Used on FAQ + Account paths (~150K calls/month).",
        requestsPerMonth: 150,
      },
      {
        id: "answer-gen",
        name: "Answer Generator",
        description: "Synthesizes the final answer from retrieved docs + the user's question.",
        requestsPerMonth: 200,
      },
      {
        id: "safety-check",
        name: "Safety / Tone Filter",
        description: "Quick check that the generated answer isn't off-policy or rude. Runs on every output.",
        requestsPerMonth: 200,
      },
    ],
    modelTiers: [
      { id: "frontier", name: "Frontier (GPT-4 / Claude Opus)", costPer1k: 30, qualityScore: 95, latencyMs: 2500 },
      { id: "mid", name: "Mid-Tier (GPT-4o-mini / Claude Sonnet)", costPer1k: 5, qualityScore: 82, latencyMs: 900 },
      { id: "small", name: "Small (GPT-3.5 / Llama 3-8B)", costPer1k: 0.5, qualityScore: 65, latencyMs: 350 },
    ],
    qualityThreshold: 85,
    latencyTarget: 2000,
    optimizationTip:
      "Most of your spend should sit on the answer generator — it's user-facing quality. Use small models for routing/safety where the bar is binary. The retriever isn't an LLM at all if you're using cheap embeddings; budget it as small-tier.",
  },
  {
    id: "llmops-rag-knowledge",
    title: "Internal Knowledge RAG",
    userStory:
      "Your internal knowledge base RAG serves 500 employees. Quality matters more than speed (people will wait 5 seconds for a correct answer). Cost matters because you're piloting it before company-wide rollout.",
    context:
      "P95 latency target: under 5 seconds (relaxed). Quality target: ≥90% (high — wrong answers create real liability). Monthly budget: $800. Volume: 25K queries/month.",
    monthlyBudget: 800,
    components: [
      {
        id: "query-rewrite",
        name: "Query Rewriter",
        description: "Expands the user's question into a richer search query. Improves retrieval recall.",
        requestsPerMonth: 25,
      },
      {
        id: "retrieval",
        name: "Vector Retrieval + Reranker",
        description: "Pulls top-20 docs, reranks to top-5 with a small cross-encoder. Embeddings + reranker.",
        requestsPerMonth: 25,
      },
      {
        id: "synthesizer",
        name: "Answer Synthesizer",
        description: "Generates the final answer from the top-5 docs + the user's question. Long context.",
        requestsPerMonth: 25,
      },
      {
        id: "citation-checker",
        name: "Citation Verifier",
        description: "Verifies every claim in the answer is grounded in the cited docs. Catches hallucinations.",
        requestsPerMonth: 25,
      },
    ],
    modelTiers: [
      { id: "frontier", name: "Frontier (GPT-4 / Claude Opus)", costPer1k: 30, qualityScore: 95, latencyMs: 3000 },
      { id: "mid", name: "Mid-Tier (GPT-4o-mini / Claude Sonnet)", costPer1k: 5, qualityScore: 82, latencyMs: 1200 },
      { id: "small", name: "Small (GPT-3.5 / Llama 3-8B)", costPer1k: 0.5, qualityScore: 65, latencyMs: 400 },
    ],
    qualityThreshold: 90,
    latencyTarget: 5000,
    optimizationTip:
      "When quality is the gating constraint, invest in the synthesizer + citation checker (the parts that determine 'is this answer right?'). Query rewriting and retrieval are mid-tier work — important but bounded. Citation verification is non-negotiable for liability-bearing systems.",
  },
  {
    id: "llmops-agentic-workflow",
    title: "Multi-Step Agentic Workflow",
    userStory:
      "An internal research agent takes a question and produces a 3-page report by autonomously searching, reading, and synthesizing. Used by your strategy team. ~2,000 reports/month.",
    context:
      "Latency: 'minutes are fine' (async, runs in background). Quality target: ≥88% (these reports inform real decisions). Budget: $3,500/month.",
    monthlyBudget: 3500,
    components: [
      {
        id: "planner",
        name: "Planner",
        description: "Breaks the question into a research plan: ~6 sub-questions to investigate.",
        requestsPerMonth: 2,
      },
      {
        id: "researcher",
        name: "Researcher Loop",
        description: "For each sub-question, searches + reads ~5 sources. Writes a summary. ~12 calls per report.",
        requestsPerMonth: 24,
      },
      {
        id: "synthesizer",
        name: "Synthesizer",
        description: "Takes all sub-summaries + writes the final report. Long context, high reasoning.",
        requestsPerMonth: 2,
      },
      {
        id: "fact-checker",
        name: "Fact Checker",
        description: "Reviews the final report against sources, flags unsupported claims. Critical for credibility.",
        requestsPerMonth: 2,
      },
    ],
    modelTiers: [
      { id: "frontier", name: "Frontier (GPT-4 / Claude Opus)", costPer1k: 30, qualityScore: 95, latencyMs: 4000 },
      { id: "mid", name: "Mid-Tier (GPT-4o-mini / Claude Sonnet)", costPer1k: 5, qualityScore: 82, latencyMs: 1500 },
      { id: "small", name: "Small (GPT-3.5 / Llama 3-8B)", costPer1k: 0.5, qualityScore: 65, latencyMs: 500 },
    ],
    qualityThreshold: 88,
    latencyTarget: 600000, // 10 minutes — async, latency is not the constraint
    optimizationTip:
      "Researcher loop volume (24 calls/report × 2K reports = 48K calls) dominates the bill. Use mid-tier here — small is too lossy for source-reading. Planner and synthesizer are the high-leverage steps; spend frontier-tier here. Fact-checker can be mid (it's a verification task, not generation).",
  },
  {
    id: "llmops-eval-pipeline",
    title: "Continuous Eval Pipeline",
    userStory:
      "Your AI features ship constantly. You need an automated eval pipeline that scores every prompt change against a golden set of 500 questions before it goes to prod. Runs on every PR.",
    context:
      "Latency per eval run: under 10 minutes (developers wait). Quality of eval scoring: ≥92% agreement with human reviewers. Budget: $1,200/month, ~50 eval runs/month.",
    monthlyBudget: 1200,
    components: [
      {
        id: "candidate-gen",
        name: "Candidate Answer Generator",
        description: "Runs the model under test against all 500 golden questions. The thing being evaluated.",
        requestsPerMonth: 25,
      },
      {
        id: "judge",
        name: "LLM-as-Judge",
        description: "Scores each candidate answer against the golden answer. Needs strong reasoning for nuanced grading.",
        requestsPerMonth: 25,
      },
      {
        id: "rubric-extractor",
        name: "Rubric Extractor",
        description: "For new test cases, extracts grading criteria from the expected answer. Runs occasionally.",
        requestsPerMonth: 1,
      },
      {
        id: "summary-report",
        name: "Summary Report Generator",
        description: "Compiles per-run scores into a markdown report posted to the PR. Short context.",
        requestsPerMonth: 1,
      },
    ],
    modelTiers: [
      { id: "frontier", name: "Frontier (GPT-4 / Claude Opus)", costPer1k: 30, qualityScore: 95, latencyMs: 3000 },
      { id: "mid", name: "Mid-Tier (GPT-4o-mini / Claude Sonnet)", costPer1k: 5, qualityScore: 82, latencyMs: 1200 },
      { id: "small", name: "Small (GPT-3.5 / Llama 3-8B)", costPer1k: 0.5, qualityScore: 65, latencyMs: 400 },
    ],
    qualityThreshold: 92,
    latencyTarget: 600000, // 10 min for whole batch
    optimizationTip:
      "The judge is the highest-leverage part — if your judge is wrong, your evals are wrong. Spend frontier-tier here. The candidate generator should be the model you're actually shipping (don't downgrade for eval cost). Rubric extractor + summary report are infrequent and short — cheap tier is fine.",
  },
  {
    id: "llmops-onboarding-batch",
    title: "Bulk Onboarding Document Processor",
    userStory:
      "Enterprise customers upload thousands of internal docs at signup. You parse, classify, summarize, and embed them so the AI agent has context day-one. Runs once per customer (peak 5 customers/day, ~5K docs/customer).",
    context:
      "Batch job — runs overnight, latency irrelevant. Per-customer quality target: ≥80% accurate classification. Budget per customer: $25 (~$3,750/month at peak).",
    monthlyBudget: 3750,
    components: [
      {
        id: "parser",
        name: "Document Parser",
        description: "Extracts text + structure from PDFs/DOCX. Some need OCR for scans.",
        requestsPerMonth: 750,
      },
      {
        id: "classifier",
        name: "Doc Classifier",
        description: "Classifies each doc into 12 categories (Policy, Contract, Manual, etc.). Short input, well-defined classes.",
        requestsPerMonth: 750,
      },
      {
        id: "summarizer",
        name: "Summary Generator",
        description: "Writes a 200-word summary of each doc for the agent's context window. Long input, short output.",
        requestsPerMonth: 750,
      },
      {
        id: "embedder",
        name: "Embedding Generator",
        description: "Embeds each doc + summary for semantic search. High volume, low per-call cost.",
        requestsPerMonth: 750,
      },
    ],
    modelTiers: [
      { id: "frontier", name: "Frontier (GPT-4 / Claude Opus)", costPer1k: 30, qualityScore: 95, latencyMs: 3000 },
      { id: "mid", name: "Mid-Tier (GPT-4o-mini / Claude Sonnet)", costPer1k: 5, qualityScore: 82, latencyMs: 1200 },
      { id: "small", name: "Small (GPT-3.5 / Llama 3-8B)", costPer1k: 0.5, qualityScore: 65, latencyMs: 400 },
    ],
    qualityThreshold: 80,
    latencyTarget: 28800000, // 8 hour overnight window
    optimizationTip:
      "Bulk batch jobs are where small-tier shines. Classifier + parser are mechanical work — small handles them. Summarizer is the only step that benefits from mid-tier (quality of summaries determines downstream agent performance). Embeddings aren't an LLM tier — budget separately. Don't reach for frontier here; bulk processing is a volume game.",
  },
];

// ─── Module 10: Multi-Agent Teams (Stakeholder Sim, 5 rounds) ────────────────
//
// PM lens: multi-agent systems involve cross-functional tension that mirrors
// stakeholder dynamics (each agent ≈ a team member with a role). Each round
// presents a real coordination question and three stakeholder pitches.

STAKEHOLDER_GAMES_BY_MODULE["multi-agent-teams"] = [
  {
    id: "ma-supervisor-vs-flat",
    situation:
      "Your team is building a multi-agent customer support system. You have 4 specialist agents (Triage, Billing, Tech Support, Escalation). The team is split on how they should coordinate.",
    tension:
      "If agents talk to each other freely, the system is flexible but hard to debug. If a supervisor agent orchestrates everything, debugging is easy but the supervisor becomes a bottleneck.",
    stakeholders: [
      {
        id: "eng-lead",
        role: "Engineering Lead",
        name: "Priya",
        argument:
          "Use a supervisor pattern: one orchestrator agent decides which specialist to invoke and in what order. It's a single source of truth for control flow. Every decision is loggable. When something goes wrong, we trace it back to one agent.",
        isOptimal: true,
        feedback:
          "Priya is right for this stage. Multi-agent systems with supervisor orchestration are dramatically easier to debug, monitor, and reason about. The orchestrator can be a smaller cheaper model since its job is routing, not generation. As the system stabilizes, you can selectively allow specialist-to-specialist handoffs in well-defined cases — but starting with supervisor is the right default.",
      },
      {
        id: "researcher",
        role: "AI Researcher",
        name: "Marcus",
        argument:
          "Flat multi-agent with peer-to-peer messaging is the future. Let agents discover each other and negotiate. Industry research papers (AutoGen, MetaGPT) show emergent coordination is more robust than centralized control. We should be on the frontier.",
        isOptimal: false,
        feedback:
          "Marcus is right that flat multi-agent is interesting research; he's wrong that it's a production pattern in 2025. Emergent coordination means non-deterministic behavior, which means you can't write reliable tests, can't debug failures, and can't promise customers consistency. Pick the pattern that gives your support team a fighting chance, not the pattern that wins ICML.",
      },
      {
        id: "support-lead",
        role: "Head of Support",
        name: "Janelle",
        argument:
          "Skip the multi-agent thing. One smart agent with access to all the tools (billing API, KB search, escalation queue) is simpler. Most tickets don't need specialization. We're over-engineering this.",
        isOptimal: false,
        feedback:
          "Janelle's right that single-agent is simpler and right for many cases. But she's underestimating where this product is going: tickets WILL get specialized as you scale, and refactoring a single-agent into multi-agent later is harder than starting with the right architecture. The supervisor pattern gives you single-agent simplicity NOW (one decision point) and multi-agent power LATER (specialists slot in).",
      },
    ],
    optimalRationale:
      "Adopt the supervisor pattern. It gives you the structural benefits of multi-agent (specialists per domain) with the operational benefits of single-agent (one decision point, deterministic flow, debuggable). Flat multi-agent is a research pattern; single-agent doesn't scale. Supervisor is the production-ready middle.",
    category: "Coordination architecture",
  },
  {
    id: "ma-shared-vs-isolated-state",
    situation:
      "Your multi-agent system needs each agent to know what the others have done in the conversation so far (e.g., the Tech Support agent shouldn't ask the user a question that the Triage agent already asked). The team is debating how to share state.",
    tension:
      "Shared global state is convenient but creates concurrency bugs. Isolated state per agent is safer but causes the 'Tech Support asks the same question Triage already asked' problem.",
    stakeholders: [
      {
        id: "eng-lead",
        role: "Engineering Lead",
        name: "Priya",
        argument:
          "Use a shared, append-only conversation log. Every agent reads the same log on each turn — no agent mutates another's writes, just appends. This avoids concurrency bugs entirely while giving every agent full context.",
        isOptimal: true,
        feedback:
          "Priya nailed it. Append-only shared logs are how production multi-agent systems handle state: no locks, no races, every agent sees the same history. It's also how you build replay/debugging for free. The key constraint — append-only, no mutation — is what makes it safe at scale.",
      },
      {
        id: "infra-lead",
        role: "Infra Lead",
        name: "Devon",
        argument:
          "Give each agent its own state and use message-passing. Agents send each other structured messages when they need info. It's a cleaner separation of concerns and matches how distributed systems actually work.",
        isOptimal: false,
        feedback:
          "Devon's pattern is correct for true distributed systems where agents run on different machines. For a multi-agent LLM system in one process, message passing adds enormous complexity (now every agent needs to know every other agent's API) without real isolation benefits. Append-only shared log is the same correctness with 10× less plumbing.",
      },
      {
        id: "researcher",
        role: "AI Researcher",
        name: "Marcus",
        argument:
          "Use a vector DB as shared memory. Every agent reads/writes embeddings, retrieves relevant context per turn. It scales infinitely and works for long conversations.",
        isOptimal: false,
        feedback:
          "Marcus is solving a different problem (long-term memory across sessions, where vector DBs are great). For within-conversation state, embeddings introduce lossy retrieval where you don't need it — every agent should be able to read every prior turn exactly. Vector retrieval for in-conversation state is cargo culting.",
      },
    ],
    optimalRationale:
      "Append-only shared conversation log. No locks, no races, full context for every agent, and replay/debug for free. This is how production systems (LangGraph, OpenAI Assistants threads) handle state. Vector DBs are for long-term memory; message passing is for distributed systems. For an in-process multi-agent LLM, append-only log is the answer.",
    category: "State sharing",
  },
  {
    id: "ma-agent-tool-permissions",
    situation:
      "Your specialist agents have access to different tools — the Billing agent can issue refunds, the Tech Support agent can read logs. A bug appeared: under certain prompts, the Triage agent can persuade the Billing agent to issue a refund when it shouldn't. The team is debating how to fix the permission model.",
    tension:
      "Trust between agents is convenient (lets them collaborate) but creates security holes via prompt injection. Tightening permissions makes the system safer but reduces flexibility.",
    stakeholders: [
      {
        id: "security-lead",
        role: "Security Lead",
        name: "Wei",
        argument:
          "Each agent's tools should require explicit human-or-policy approval, not agent-to-agent delegation. The Billing agent shouldn't issue refunds because another agent asked — refunds need a human approval or a tightly-scoped policy check. Strip the cross-agent permissions entirely.",
        isOptimal: true,
        feedback:
          "Wei is right. Cross-agent permission delegation is a known prompt-injection attack surface. The fix isn't 'better agent prompting' — it's removing the trust boundary entirely. Sensitive actions (refunds, escalations, data writes) should require explicit policy gates that don't depend on agent-to-agent persuasion. This is the multi-agent equivalent of zero-trust networking.",
      },
      {
        id: "eng-lead",
        role: "Engineering Lead",
        name: "Priya",
        argument:
          "Add a 'verifier' agent in front of every sensitive tool call. Before Billing issues a refund, a separate agent checks the request against policy. If it passes, the refund goes through. This preserves agent collaboration with a safety net.",
        isOptimal: false,
        feedback:
          "Priya's verifier is a reasonable defense-in-depth layer, but using it ALONE doesn't solve the root issue: the verifier itself is an LLM and can be prompt-injected via the request it's verifying. Verifiers help; they're not sufficient as the only control. Combine with explicit policy gates (Wei's answer) for sensitive actions.",
      },
      {
        id: "product-lead",
        role: "Product Lead",
        name: "Anna",
        argument:
          "It's an edge case. Add a length limit on inter-agent messages and call it done. Most prompt injections are long; capping at 200 chars makes the attack hard. Move on.",
        isOptimal: false,
        feedback:
          "Anna is treating a security boundary problem as a UX tweak. Length limits don't stop prompt injection — they just slow down lazy attackers. The right fix is structural (no cross-agent permission delegation for sensitive actions), not cosmetic. Treating security as a sprint goal you can ship quickly is how you end up in a postmortem.",
      },
    ],
    optimalRationale:
      "Strip cross-agent permission delegation for sensitive tools. Agents can collaborate on read-only operations freely, but write operations (refunds, sends, deletes) need explicit policy checks that don't depend on which agent is asking. This is a structural fix — verifier agents and length limits are bandaids over a real architectural hole.",
    category: "Permissions and security",
  },
  {
    id: "ma-handoff-loops",
    situation:
      "Your multi-agent system is in production. You're seeing a new failure mode: agents are handing off to each other in loops. The Tech Support agent passes the issue to Billing, which passes back to Tech Support, which passes back to Billing. The user waits 90 seconds while agents ping-pong before any response. The team is debating how to fix it.",
    tension:
      "Agent autonomy enables flexible handoffs (good when it works). Handoff limits prevent loops but reduce the system's ability to handle edge cases.",
    stakeholders: [
      {
        id: "eng-lead",
        role: "Engineering Lead",
        name: "Priya",
        argument:
          "Add a hard handoff budget — max 4 handoffs per user request. If we hit the limit, escalate to a human. Loops stop deterministically; we get an alert when the limit fires so we can debug the underlying confusion.",
        isOptimal: true,
        feedback:
          "Priya's right. Handoff budgets are the production safety net for multi-agent loops — same idea as max retry counts in distributed systems. The right number depends on your domain (typically 3-5). Hitting the limit isn't a failure mode to hide; it's a signal that the agents disagreed on ownership and you need to look at why.",
      },
      {
        id: "researcher",
        role: "AI Researcher",
        name: "Marcus",
        argument:
          "Use a planner agent that decides the full sequence upfront, no mid-flow handoffs. Triage → Billing → Resolution, all decided in step 0. No loops possible if there's no dynamic handoff.",
        isOptimal: false,
        feedback:
          "Marcus's plan-then-execute pattern is appropriate for some workflows but rigid for support: real conversations branch ('the user clarified, this is actually billing not tech'). Forbidding mid-flow handoffs trades one bug (loops) for a worse one (system can't recover from initial misclassification). Handoff budgets give you adaptive routing AND loop safety.",
      },
      {
        id: "support-lead",
        role: "Head of Support",
        name: "Janelle",
        argument:
          "Loops happen because the agents have ambiguous ownership. Just clarify which agent owns which scenario in the prompts. 'Billing handles refunds. Tech handles bugs. Don't hand off — escalate to human if unsure.' Done.",
        isOptimal: false,
        feedback:
          "Janelle's clarity-of-prompts approach helps but isn't sufficient — LLMs are non-deterministic, so even with clear prompts, agents will sometimes loop. Prompts reduce the probability of loops; budgets prevent the worst-case behavior when prompts fail. Belt and suspenders: clearer prompts AND a handoff budget.",
      },
    ],
    optimalRationale:
      "Add a hard handoff budget per request (typically 3-5). It's the deterministic safety net for an inherently non-deterministic system. Hitting the budget should fire an alert and escalate to a human — this gives you both reliability for users and a debugging signal for the team. Cleaner prompts are the second-order fix.",
    category: "Loop prevention",
  },
  {
    id: "ma-deploy-rollback",
    situation:
      "You're about to deploy a change to one specialist agent (the Billing agent's prompt). The change improves accuracy on edge cases but the team is nervous because the Billing agent is the only one allowed to issue refunds. The team is debating the rollout strategy.",
    tension:
      "Multi-agent systems mean a change to one agent can cause cascading changes in others (Triage might route differently, Escalation might trigger differently). You can't really 'A/B test one agent in isolation.'",
    stakeholders: [
      {
        id: "eng-lead",
        role: "Engineering Lead",
        name: "Priya",
        argument:
          "Shadow-deploy: run the new Billing agent in parallel with the old one for 1 week. The old agent's responses go to users; the new agent's responses are logged for comparison. Switch traffic only after we've seen 1,000+ side-by-side comparisons that look good.",
        isOptimal: true,
        feedback:
          "Priya nailed it. Shadow deployment is the right safety pattern for multi-agent changes: you get real production traffic against the new agent without exposing users to its mistakes. After enough side-by-side data, you can flip with confidence. The cost is running both agents in parallel for a week — cheap insurance for an agent that handles money.",
      },
      {
        id: "infra-lead",
        role: "Infra Lead",
        name: "Devon",
        argument:
          "Canary: send 5% of traffic to the new Billing agent, watch error rates for 24 hours, scale up gradually if metrics look good. It's the standard rollout pattern, no need to invent something special.",
        isOptimal: false,
        feedback:
          "Devon's canary approach is great for stateless API changes but weaker for agent changes. With a 5% canary, the agents in the other 95% are still the old version, so cross-agent interactions you're trying to test (Triage → new Billing) are partially counterfactual. Canary works for one-shot changes; shadow works better for multi-agent where you need to test interactions.",
      },
      {
        id: "researcher",
        role: "AI Researcher",
        name: "Marcus",
        argument:
          "Run an offline eval on a held-out set of historical conversations. If the new Billing agent scores higher, ship it. Production deployment is just the final step after the eval passes.",
        isOptimal: false,
        feedback:
          "Marcus's offline eval is necessary but not sufficient. Historical conversations don't capture how the new Billing agent will interact with the *current* Triage agent on *new* user phrasings. Multi-agent emergent behavior only shows up in live traffic. Offline eval is gate 1; shadow deploy is gate 2; rollout is gate 3.",
      },
    ],
    optimalRationale:
      "Shadow-deploy the new agent against live traffic. The old agent serves users; the new one logs side-by-side. Compare outcomes. Flip with confidence. This is the right safety pattern when you're changing an agent that interacts with other agents AND handles sensitive actions. Offline eval is necessary but doesn't catch emergent multi-agent behaviors.",
    category: "Deploy safety",
  },
];

// ─── Module 2: AI Product Discovery (Ship or Skip, 5 rounds) ─────────────────

SHIP_GAMES_BY_MODULE["ai-product-discovery"] = [
  {
    id: "apd-where-to-start",
    scenario:
      "Your CEO walks into your 1:1: 'Every competitor is shipping AI. We need an AI feature in 90 days.' No specific problem yet — just pressure. You have 1 squad and need to pick a starting point.",
    context:
      "Your product has 200K MAU on a workflow tool. Telemetry shows clear usage patterns. Engineering has zero LLM experience.",
    options: [
      {
        id: "survey",
        label: "Email-survey users about which AI features they want",
        description:
          "Send a survey to power users asking 'What AI features would make this product better?' Use the responses to prioritize.",
        isCorrect: false,
        feedback:
          "Surveys about hypothetical AI features produce hypothetical answers. Users will say 'AI summaries' and 'AI search' because those are the AI features they've heard of — not because those are their actual unmet needs. You'll build the obvious thing badly. Surveys discover demand for known features, not opportunities for new ones.",
      },
      {
        id: "interview-pain",
        label: "Run 5 interviews about workflow pain — no AI mentioned",
        description:
          "Talk to 5 power users about where their workflow breaks down today. Don't mention AI. Look for repetitive cognitive work, ambiguous decisions, or 'I always have to check X manually' moments.",
        isCorrect: true,
        feedback:
          "Correct. AI-fit problems are workflow problems where humans are doing pattern matching on text or making decisions from messy inputs. Those are visible in pain interviews — but only if you don't lead the witness. The CEO wants 'AI'; the user wants their job easier. Find the second, then check whether AI is the right tool.",
      },
      {
        id: "prototype-now",
        label: "Build a quick AI prototype against the most-used feature",
        description:
          "Pick the feature with highest usage, slap an LLM on it (e.g., 'AI-generated insights from your data'), put it behind a flag, see if engagement lifts.",
        isCorrect: false,
        feedback:
          "You'll spend 6 weeks building something with no problem hypothesis. If engagement doesn't lift, you don't know if the feature is wrong, the prompt is wrong, or the audience is wrong. 'Build first, ask why later' is how you ship a useless AI feature your CEO can demo and your users ignore.",
      },
    ],
    tradeoffExplanation:
      "AI product discovery looks like product discovery — you find unmet needs and verify them — but with one wrinkle: AI's strengths (pattern matching on messy inputs, drafting from context) are invisible if you ask users directly. Find the workflow pain first; check if AI is the right tool second.",
    category: "Discovery starting point",
  },
  {
    id: "apd-validate-feasibility",
    scenario:
      "You found your problem: PMs spend 2 hours/week writing release notes from PR descriptions. Your hypothesis: an AI agent can do this in 30 seconds. You have 2 weeks to validate before committing engineering.",
    context:
      "You have ~50 historical release notes (the ground-truth examples). Your eng team is willing to spend 2 weeks if the validation passes.",
    options: [
      {
        id: "build-mvp",
        label: "Build the MVP feature in product, ship it to a 5% rollout",
        description:
          "Spend 2 weeks building the actual feature with all the production plumbing. Roll out to 5%. Measure adoption.",
        isCorrect: false,
        feedback:
          "You're skipping validation in favor of execution. If the AI can't actually generate good release notes, you've burned 2 weeks before learning that. The 5% rollout doesn't tell you 'is the AI good enough' — it tells you 'do users notice'. Two different questions.",
      },
      {
        id: "manual-prompt-test",
        label: "Hand-test the prompt against the 50 historical release notes",
        description:
          "Spend 2 days writing prompts in Claude/ChatGPT directly, feeding in PR descriptions and comparing output to the historical release notes. Iterate the prompt. Measure quality with a simple rubric.",
        isCorrect: true,
        feedback:
          "Correct. This is the cheapest way to answer the load-bearing question: 'Can an LLM do this task at all?' Two days of prompt iteration tells you if the underlying capability exists before you spend two weeks on UI, integration, and eval infrastructure. If the LLM can't do it manually, no amount of product polish will save you.",
      },
      {
        id: "concierge",
        label: "Concierge MVP: you (the PM) write release notes from PRs for 2 weeks",
        description:
          "Wizard-of-Oz it. PRs get sent to you, you write the release note manually, send it back. Measure adoption and willingness to pay.",
        isCorrect: false,
        feedback:
          "Concierge MVPs are great for validating user demand, but you already know users want this (2hrs/week of pain is the validation). What you DON'T know is whether the AI can do it. Concierge tests the wrong assumption. It's the right move if your hypothesis was 'do users want this?'; it's the wrong move when the hypothesis is 'can AI do this well enough?'.",
      },
    ],
    tradeoffExplanation:
      "AI feature discovery has two assumptions to validate: (1) do users want this, and (2) can the AI actually do it? Concierge tests #1; prompt-engineering against ground truth tests #2. Pick the test that addresses the riskier assumption. For AI-first features, capability is usually the riskier one.",
    category: "Validation method",
  },
  {
    id: "apd-prompt-vs-finetune",
    scenario:
      "Your prompt-tested release-notes feature is at 70% quality (per your rubric). The team needs to decide: invest in prompt engineering, fine-tune a model on your historical examples, or accept 70% and ship.",
    context:
      "You have 50 historical release notes (small dataset). PM team is okay with 'AI generates a draft, I edit' workflow. Engineering bandwidth: 2 weeks.",
    options: [
      {
        id: "fine-tune",
        label: "Fine-tune a small model on the 50 historical examples",
        description:
          "Use the 50 historical release notes as training data. Fine-tune Llama 3 or a small open-source model. Self-host for privacy.",
        isCorrect: false,
        feedback:
          "50 examples is too few for fine-tuning to meaningfully outperform good few-shot prompting with the same examples. You'll spend 2 weeks on training infrastructure for marginal gain. Fine-tuning starts paying off around 500-1000+ examples; below that, prompt + few-shot wins on time-to-value.",
      },
      {
        id: "ship-edit-workflow",
        label: "Ship at 70% with an explicit 'AI draft, you edit' workflow",
        description:
          "Position the feature honestly: 'AI generates a draft release note from your PRs. Edit before sending.' The 70% is acceptable when the user does the final pass.",
        isCorrect: true,
        feedback:
          "Correct. 70% AI quality + human edit is the entire shape of useful AI products in 2025. The PM goes from 2 hours of writing to 15 minutes of editing — a 7x time savings — without you needing to chase the last 30%. Ship-and-iterate beats perfect-and-late, especially when the workflow tolerates an edit step.",
      },
      {
        id: "more-prompting",
        label: "Spend 2 weeks iterating the prompt to push quality to 90%+",
        description:
          "Hire a prompt engineer or spend 2 weeks of PM time iterating prompts, examples, and instructions until quality clears 90%.",
        isCorrect: false,
        feedback:
          "Diminishing returns trap. Going 70% → 90% takes 5x the effort of going 0% → 70% — and you don't know yet whether users care about the difference. They might be perfectly happy editing a 70% draft. Ship the 70% version, measure how much users edit, THEN decide if quality investment is justified.",
      },
    ],
    tradeoffExplanation:
      "AI quality has a long tail. Most products don't need to be on the right side of it — they need a workflow where 'good enough' AI plus human edit is faster than the status quo. Fine-tuning, prompt engineering, and quality investment all have a place — but only after you've measured whether users actually need higher quality or just need the workflow shipped.",
    category: "Quality investment timing",
  },
  {
    id: "apd-when-to-kill",
    scenario:
      "Six weeks into building an AI assistant for your product, the team is struggling. Hallucination rate is 12% (target was 3%). User testers are losing trust. The eng lead thinks another 2 sprints could fix it. Your VP is asking for a status update.",
    context:
      "$80K spent so far. 4-engineer team. The original problem (users wanting natural-language search) is real and unaddressed.",
    options: [
      {
        id: "double-down",
        label: "Push another 2 sprints — the team is close",
        description:
          "Trust the eng lead. Add guardrails, retrieval improvements, better evaluation. Ship in 6 more weeks.",
        isCorrect: false,
        feedback:
          "12% → 3% is not a 'close to done' situation; it's a 4x reduction. That requires solving structural problems (better retrieval, eval-driven iteration, possibly architecture changes), not polish. If the team's been struggling for 6 weeks, the next 6 are unlikely to be better. Sunk cost is whispering.",
      },
      {
        id: "kill-and-pivot",
        label: "Kill the assistant, ship a narrower feature that addresses 60% of the original problem reliably",
        description:
          "Pivot to a structured 'natural language → guided filter UI' that converts queries into your existing search filters. No generation, no hallucination — just classification + UX. Ship in 3 weeks.",
        isCorrect: true,
        feedback:
          "Correct. The PM lesson: 'kill the AI, keep the user problem.' Most AI features can be reframed as classification + structured UI when generation is too risky. You ship something users actually trust, in less time, and learn from their behavior. The original assistant might be the right move someday — but not from a position of 12% hallucination and lost trust.",
      },
      {
        id: "ship-with-disclaimer",
        label: "Ship the current version with a 'beta — verify outputs' disclaimer",
        description:
          "Ship to 100% of users behind a beta label. Users learn to verify outputs. Iterate based on real usage data.",
        isCorrect: false,
        feedback:
          "'Beta' disclaimers don't excuse 12% hallucination on a feature users rely on for decisions. Trust collapses fast and is hard to rebuild. Worse, you'll get noisy signal: did users abandon because the feature was bad or because they were 'just trying it'? Ship something good, even if narrow, instead of broad-but-broken with a disclaimer.",
      },
    ],
    tradeoffExplanation:
      "Knowing when to kill an AI feature is the hardest PM skill in this space — sunk cost is high, executive pressure is real, and the team's emotional investment is huge. The escape hatch is reframing: most AI features have a non-AI version that addresses 60-80% of the problem reliably. That version is often the right v1.",
    category: "Kill criteria",
  },
  {
    id: "apd-demo-vs-real",
    scenario:
      "Your AI feature is ready for the board demo next Friday. The eng lead admits the demo path works perfectly but adjacent flows (especially edge cases) still fail 20% of the time. The CEO wants to demo live. You have 5 days.",
    context:
      "If the live demo fails, the company's AI strategy gets re-questioned. If you fake it and someone notices, the credibility hit is worse. You can't realistically fix the edge cases in 5 days.",
    options: [
      {
        id: "scripted-demo",
        label: "Live demo on a tightly scripted path — practice it 50 times",
        description:
          "Pick the demo flow that works. Rehearse it. Have the CEO walk through exactly that path. Don't take questions in the demo; do Q&A separately afterward.",
        isCorrect: true,
        feedback:
          "Correct. This is the 'professional demo' answer. Every public AI launch in tech does this — the demo is the demo, not the product surface. You're not lying; you're showing the strongest evidence of what's possible. The Q&A separation lets you be honest about edge cases without the live failure mode wrecking the moment.",
      },
      {
        id: "show-edge-cases",
        label: "Demo live including edge cases — be transparent about failures",
        description:
          "Walk through the strong path, then deliberately show an edge-case failure to demonstrate honesty. Position it as 'we know about this, here's our roadmap.'",
        isCorrect: false,
        feedback:
          "Admirable but wrong audience. The board isn't the audience for nuanced engineering tradeoffs in a 15-minute demo. They'll remember 'the AI failed live' and miss the rest. Save the candid status update for a written follow-up. The demo is performance, not engineering review.",
      },
      {
        id: "fake-demo",
        label: "Pre-record the demo as a video so nothing can fail",
        description:
          "Record the perfect demo path in advance, play it as a video during the board meeting. Avoids any live-demo risk.",
        isCorrect: false,
        feedback:
          "Three problems. (1) Sophisticated boards can tell when you're showing video vs. live and discount it heavily. (2) If discovered, the credibility hit is severe — 'they faked the demo'. (3) You lose the energy of live interaction. The scripted-but-live answer threads the needle: real product, controlled path.",
      },
    ],
    tradeoffExplanation:
      "Demo strategy is its own PM skill, especially in AI where edge cases are loud. The pro move is to constrain the demo path tightly enough that nothing can fail, while staying honest in the surrounding conversation about what's not yet ready. Faking is a credibility loss; being too candid in the demo is a strategic loss; tight scripting is the middle ground every senior PM lands on eventually.",
    category: "Demo strategy",
  },
];

// ─── Module 3: PM Prototyping Toolkit (Ship or Skip, 5 rounds) ───────────────

SHIP_GAMES_BY_MODULE["pm-prototyping-toolkit"] = [
  {
    id: "ppt-tool-choice",
    scenario:
      "You're prototyping an AI-powered onboarding flow for your B2B product. You have 2 weeks before the design review. You need something stakeholders can click through and react to.",
    context:
      "Engineering bandwidth: zero (they're heads-down on a different launch). Your design partner can sketch but doesn't code. Stakeholders are non-technical execs.",
    options: [
      {
        id: "figma",
        label: "High-fidelity Figma prototype with linked screens",
        description:
          "Design partner creates pixel-perfect mockups. Wire them with click-throughs in Figma's prototyping mode. Stakeholders see exactly what V1 will look like.",
        isCorrect: false,
        feedback:
          "Figma click-throughs feel real until people interact. The moment a stakeholder asks 'what happens if I type something weird here?', the prototype falls apart. AI products especially fail in Figma because the magic IS the response, and Figma can't generate one. You'll pass the design review and lose the engineering review.",
      },
      {
        id: "vibecoding",
        label: "Vibecode it in a no-code tool like v0 or Lovable",
        description:
          "Use an AI-powered builder (v0.dev, Lovable, Replit Agent) to generate a working prototype with real LLM calls. Stakeholders can actually type and see real responses.",
        isCorrect: true,
        feedback:
          "Correct. AI prototypes need to be interactive with real model calls — that's the whole point. Vibecoding tools let a PM ship a clickable, talkable prototype in days, not weeks. The fidelity is good enough for stakeholder review and the response feels real because it IS real (just unscaled). This is the 2025 PM prototyping default.",
      },
      {
        id: "spec-doc",
        label: "Write a detailed PRD with example interactions",
        description:
          "Skip the prototype. Write a 10-page PRD with mock conversations, user flows, and acceptance criteria. Stakeholders read it before the design review.",
        isCorrect: false,
        feedback:
          "PRDs work for known shapes (a settings page, a button, a workflow). They don't work for AI features because nobody — including you — knows how the model will actually respond until you try. The PRD will be wrong in subtle ways that only become visible after the build. Build a working thing first, write the PRD against the working thing.",
      },
    ],
    tradeoffExplanation:
      "The PM prototyping toolkit changed in 2024-2025. For AI features specifically, click-through prototypes don't capture the load-bearing magic (the model response). Vibecoding tools let PMs build interactive prototypes with real LLM calls in hours. PRDs and Figma still have their place — but not as the FIRST artifact for an AI feature.",
    category: "Tool choice",
  },
  {
    id: "ppt-fidelity",
    scenario:
      "You're prototyping an AI assistant for your product. You can build it at three fidelities: rough sketch (1 day), functional prototype (1 week), or near-production polish (3 weeks). Which fidelity for the FIRST round of user testing?",
    context:
      "Goal: validate whether users find the assistant useful. You have 5 user testers booked next week. Engineering hasn't started yet.",
    options: [
      {
        id: "rough",
        label: "Rough sketch — paper or low-fi Figma",
        description:
          "Sketches show the concept without distracting users with polish. Let users react to the IDEA, not the visual.",
        isCorrect: false,
        feedback:
          "Sketches work for static UIs because users can imagine the interaction. AI features fail this test — the entire experience IS the interaction. A user shown a sketch of an AI assistant has no way to evaluate whether the assistant is actually useful. They'll politely say 'looks good' and you'll learn nothing.",
      },
      {
        id: "functional",
        label: "Functional prototype — real LLM calls, ugly UI",
        description:
          "Vibecode a working prototype with real model calls. UI is intentionally rough so users critique the AI, not the design. Build in 1 week.",
        isCorrect: true,
        feedback:
          "Correct. For AI features, FUNCTION matters more than form for first-round testing. Real LLM calls reveal whether users find the assistant trustworthy, useful, and worth their time. The ugly UI is a feature: users critique the substance, not the colors. Polish comes after you know the assistant is useful.",
      },
      {
        id: "polished",
        label: "Near-production polish — invest 3 weeks before testing",
        description:
          "Build the assistant with full design polish, smooth interactions, branded UI. When you test, users see what V1 will actually look like.",
        isCorrect: false,
        feedback:
          "Three problems. (1) You waited 3 weeks before learning anything. (2) Users will critique the polish ('the colors are off'), not the substance. (3) If the AI itself is wrong, you've baked 3 weeks of design work into something you'll throw away. Save polish for after the substance is validated.",
      },
    ],
    tradeoffExplanation:
      "AI prototype fidelity is inverted from typical UI work. For most features, low-fi works for first-round testing. For AI, you need real model calls (high functional fidelity) but can cut visual fidelity. Build the brain, skip the body, learn fast.",
    category: "Fidelity choice",
  },
  {
    id: "ppt-fake-vs-build",
    scenario:
      "Your prototype needs to demonstrate a feature where the AI 'remembers' user preferences across sessions. Building real memory is 2-3 weeks of eng work. The prototype is due Friday (5 days).",
    context:
      "You're trying to validate whether users find personalized AI valuable enough to commit to. The prototype is for a stakeholder demo, not user testing.",
    options: [
      {
        id: "build-real",
        label: "Build the real memory system in the prototype",
        description:
          "Use a vector store, real embeddings, real persistence. The prototype demonstrates the actual technology stack.",
        isCorrect: false,
        feedback:
          "You're solving an engineering problem instead of a product problem. The stakeholders can't evaluate vector store choice; they can evaluate whether 'AI that remembers' feels valuable. Building the real thing in 5 days will produce a buggy version of the real thing — worse signal than fake-but-working.",
      },
      {
        id: "fake-it",
        label: "Hard-code the 'memory' — preload examples that look personalized",
        description:
          "Bake in a few preferences that get 'remembered.' The demo flow shows the AI referencing them naturally. Stakeholders see the experience without you building the engine.",
        isCorrect: true,
        feedback:
          "Correct. This is the canonical 'fake it for the demo, build it if validated' move. Stakeholders evaluate the EXPERIENCE — does AI that remembers feel valuable? — not the implementation. If they say yes, you commit eng. If they say no, you saved 2-3 weeks. Faking is honest as long as you're transparent in the engineering followup.",
      },
      {
        id: "describe-it",
        label: "Skip the memory feature in the demo, describe it verbally",
        description:
          "The demo shows everything else. When you reach the memory feature, you say 'and in V1, the AI will remember preferences here.'",
        isCorrect: false,
        feedback:
          "Verbal descriptions are demo poison for AI features. The whole point of the demo is to make stakeholders FEEL the magic. Describing the magic verbally while not showing it produces 'sounds good, hard to evaluate' reactions. Show or don't bother.",
      },
    ],
    tradeoffExplanation:
      "Prototype fakery is a real PM skill. The rule: fake the parts where stakeholders evaluate the EXPERIENCE; build the parts where they evaluate FEASIBILITY. Memory, personalization, and learning are usually fake-able. Speed, accuracy, and integration are usually not.",
    category: "Fake vs build",
  },
  {
    id: "ppt-prompt-iteration",
    scenario:
      "Your AI prototype works but the response quality is inconsistent — sometimes brilliant, sometimes weird. You're iterating on the prompt. Eng wants to spend a sprint building proper prompt evaluation infrastructure. You have 2 weeks until the next stakeholder review.",
    context:
      "The prototype currently has a 12-line prompt. You change it ad-hoc and eyeball results. There are no tests.",
    options: [
      {
        id: "build-evals",
        label: "Build proper prompt-eval infrastructure now",
        description:
          "Create a test set of 20-30 example inputs. Build a script that runs each prompt variant against the set and scores outputs (manual or LLM-as-judge). Use it to compare prompt versions.",
        isCorrect: true,
        feedback:
          "Correct, even though it feels like overkill at the prototype stage. Without an eval set, prompt iteration is vibes — you'll convince yourself prompt v8 is 'better' when really it's just better on the 3 examples you happened to test. A 30-example eval set built once pays for itself within 2-3 prompt iterations and becomes the foundation for production quality work.",
      },
      {
        id: "vibe-iterate",
        label: "Just iterate the prompt by hand — eyeball outputs",
        description:
          "Skip the eval infrastructure. Try prompt variants in the chat UI, look at outputs, ship the version that 'feels right' to you.",
        isCorrect: false,
        feedback:
          "Vibe-iterating is fine for the first 2-3 changes. After that, you're confidently regressing on cases you forgot to test. By prompt v10, you've built a Frankenprompt that mysteriously fails on inputs that worked at v3. The prototype that 'felt good in testing' will collapse the moment a real user types something you didn't try.",
      },
      {
        id: "rfm",
        label: "Switch to a more capable model and skip prompt iteration",
        description:
          "Move from GPT-4o-mini to GPT-4 (or Claude Opus). The bigger model handles inconsistency better — less prompt engineering needed.",
        isCorrect: false,
        feedback:
          "Bigger models are more forgiving but the inconsistency problem follows you. You'll have a slightly more reliable prototype that's 6x more expensive in production. Prompt evaluation is what makes any model reliable. Solving it once works at every model tier; throwing model size at the problem scales costs not quality.",
      },
    ],
    tradeoffExplanation:
      "Eval-driven prompt iteration is the difference between AI prototypes that survive contact with real users and ones that don't. It feels like overkill at prototype stage, but the eval set you build becomes the asset that lets you iterate confidently from prototype to V1 to V5. Skip it and you'll re-build trust in your own prompts every sprint.",
    category: "Eval-driven prototyping",
  },
  {
    id: "ppt-prototype-handoff",
    scenario:
      "Your vibecoded prototype validated with users — they love it. Engineering is now picking it up to build the real version. They're asking 'should we keep your prototype code or rebuild from scratch?'",
    context:
      "The prototype is 800 lines of v0-generated React, no tests, no error handling, no auth, calls OpenAI directly from the client. Eng team has strong opinions about code quality.",
    options: [
      {
        id: "ship-prototype",
        label: "Ship the prototype to production with hardening",
        description:
          "Add auth, move API calls server-side, add error handling. Keep the 800-line prototype as the foundation. Faster path to launch.",
        isCorrect: false,
        feedback:
          "Vibecoded prototypes optimize for 'works on the demo path' — they're brittle, untested, and full of patterns that break under load. 'Hardening' a prototype usually takes longer than rebuilding because you're fighting the original code's shape the whole time. The prototype's value is the validated DESIGN, not the code.",
      },
      {
        id: "rebuild-with-design",
        label: "Rebuild from scratch using the prototype as the design spec",
        description:
          "Engineering writes production code from scratch. The prototype serves as the spec — every interaction, every prompt, every edge case is captured. Refer back, don't reuse.",
        isCorrect: true,
        feedback:
          "Correct. The right output of a prototype is a validated DESIGN, not production code. Treat the prototype as the most detailed PRD ever written: it shows exactly what to build, including the prompts, the UX edge cases, and the user feedback loops. Engineering rebuilds with proper architecture, tests, and observability — and gets there faster than they would from a written spec.",
      },
      {
        id: "throwaway",
        label: "Discard the prototype entirely, start eng from a written PRD",
        description:
          "Write a fresh PRD from scratch based on what you learned. Eng builds from the PRD. The prototype's job is done.",
        isCorrect: false,
        feedback:
          "You're throwing away the most valuable asset. Written PRDs lose 30-50% of the design context that's visible in the prototype — exact prompt wording, error states, animation timing, response format. A working prototype IS the spec. Reduce it to a PRD and you're forcing eng to re-discover what you already learned.",
      },
    ],
    tradeoffExplanation:
      "Prototypes prove a design works; production code is its own engineering discipline. The right handoff is 'rebuild from scratch using the prototype as the spec.' Shipping prototype code to prod creates technical debt; throwing it away loses design fidelity. The middle path keeps the design and ditches the code.",
    category: "Prototype-to-production handoff",
  },
];

// ─── Module 7: Quality & Self-Correction (Ship or Skip, 5 rounds) ────────────

SHIP_GAMES_BY_MODULE["quality-self-correction"] = [
  {
    id: "qsc-eval-when",
    scenario:
      "Your team is shipping an AI-powered code review assistant. Your manager wants you to ship now and 'add evals later.' Engineering wants to invest 3 weeks in eval infrastructure first. Volume will be ~500 reviews/day at launch.",
    context:
      "Without evals, you'll discover regressions only when users complain. Eval infrastructure means defining a test set, scoring criteria, and a CI gate.",
    options: [
      {
        id: "ship-evals-later",
        label: "Ship now, add evals after launch when you have real data",
        description:
          "Get to market faster. Use real user feedback to define what to measure. Build the eval pipeline in parallel.",
        isCorrect: false,
        feedback:
          "You'll learn what's broken when users tell you — which means trust damage that's hard to undo. 'Add evals later' is the AI equivalent of 'we'll add tests after launch.' It almost never happens because once the system is in production, eval set construction has to happen alongside firefighting. Ship without evals and you're shipping blind.",
      },
      {
        id: "evals-first",
        label: "Build evals first, even if it delays launch by 3 weeks",
        description:
          "Define a 100-example eval set with rubric scoring. Build a CI gate so prompt/model changes can't merge if eval scores drop. Then ship.",
        isCorrect: true,
        feedback:
          "Correct. Evals are infrastructure, not optimization. Without them, every future change is a guess and every regression is a customer-reported bug. 3 weeks of eval work makes the next 6 months 5x faster because you can iterate confidently. The teams that win at AI in production are the ones that built evals first; the ones that lose are the ones that planned to.",
      },
      {
        id: "human-eval",
        label: "Skip automated evals — use weekly manual review of 20 random samples",
        description:
          "Engineering reviews 20 random outputs each week. Discuss patterns. Iterate prompt. No infrastructure investment.",
        isCorrect: false,
        feedback:
          "Manual review catches obvious failures but misses regressions. Did the new prompt v12 break edge case X that worked in v3? You won't know unless edge case X appears in this week's 20 samples. Manual review is good for noticing trends; automated evals are required for confidence in changes.",
      },
    ],
    tradeoffExplanation:
      "Eval-driven development is the single highest-leverage practice in production AI. It turns prompt iteration from vibes into measured improvement, prevents silent regressions, and creates the data trail you need when something breaks. The cost is real (a sprint of work), but the alternative is operating blind in production.",
    category: "Eval timing",
  },
  {
    id: "qsc-self-correct",
    scenario:
      "Your AI agent generates customer-facing emails. Output quality is 80% — meaning ~20% have small issues (wrong tone, factual error, broken link). The team is debating: build a self-correction loop where the AI critiques and revises its own output, or accept 80% as the human-edit threshold.",
    context:
      "Self-correction adds 1 LLM call per email (cost: $0.005 → $0.010), latency goes from 2s to 4s. Volume: 5K emails/day. Currently emails go through human review before send.",
    options: [
      {
        id: "self-correct",
        label: "Add self-correction loop: AI critiques, then revises",
        description:
          "Two-step: generate email, then prompt 'critique this email for tone, accuracy, and clarity. List issues.' Then 'revise the email addressing those issues.' Costs and latency double; quality goes from 80% to ~92%.",
        isCorrect: true,
        feedback:
          "Correct. Self-correction is a real, measurable quality boost — typically 10-15 points — for 2x the cost and latency. At your volume ($0.005 → $0.010 = $25/day extra), the price is trivial relative to the human-review time you save. Self-correction works best for tasks where 'critique then improve' is a natural workflow, which email definitely is.",
      },
      {
        id: "accept-80",
        label: "Accept 80% — humans catch the 20% in review anyway",
        description:
          "The human reviewer is already there; let them do the quality check. Don't pay for self-correction when the safety net exists.",
        isCorrect: false,
        feedback:
          "Self-correction's value isn't quality alone — it's reviewer time. At 5K emails/day, even 30 extra seconds per problem-email costs your reviewers 8 hours of work daily. Self-correction lifts the floor from 80% to 92%, cutting reviewer load by 60%. The math favors the AI doing more.",
      },
      {
        id: "bigger-model",
        label: "Switch from GPT-4o-mini to GPT-4 — quality goes up without self-correction",
        description:
          "Bigger model out of the box improves quality. Skip the self-correction architecture; pay more per call but simpler system.",
        isCorrect: false,
        feedback:
          "GPT-4 is ~6x more expensive per call than mini at your volume — that's $750/day vs $25/day for self-correction. Bigger models also have a quality ceiling; self-correction can boost ANY model by reviewing its own output. Use the bigger model when generation is hard; use self-correction when refinement is hard. Email-writing is the second.",
      },
    ],
    tradeoffExplanation:
      "Self-correction is one of the most underused quality moves. Two LLM calls (generate + critique-and-revise) is dramatically cheaper than upgrading to a more expensive model AND tends to outperform it. The pattern works when the task has a natural 'review' step (writing, code, plans) and breaks down when it doesn't (factual lookup, classification).",
    category: "Self-correction tradeoff",
  },
  {
    id: "qsc-hallucination-tolerance",
    scenario:
      "You're shipping three AI features simultaneously: (1) AI-generated meeting summaries, (2) AI-extracted invoice numbers, (3) AI-suggested email replies. Engineering wants to apply a uniform hallucination guardrail (cite-or-don't-respond) to all three. Time-to-market is the tradeoff.",
    context:
      "Cite-or-don't-respond means the AI must show source quotes for every claim. Implementation is 2 weeks per feature. Without it, hallucination rate is ~5-8%.",
    options: [
      {
        id: "uniform",
        label: "Apply cite-or-don't-respond to all 3 features",
        description:
          "Consistent quality bar across the product. Users learn to trust the AI uniformly. 6 weeks of eng investment.",
        isCorrect: false,
        feedback:
          "Uniform standards sound right but waste engineering. Each feature has very different hallucination tolerance. Email reply suggestions can have 5% weirdness — users see them before sending. Invoice number extraction CANNOT — it goes straight to accounting. One-size-fits-all guardrails optimize for the easy case and fail the hard one.",
      },
      {
        id: "differential",
        label: "Differential guardrails — each feature gets the strictness it needs",
        description:
          "Invoice extraction: cite-or-don't-respond + high-confidence threshold (most strict). Meeting summaries: include source citations but don't block (medium). Email replies: simple draft for human review (least strict).",
        isCorrect: true,
        feedback:
          "Correct. Hallucination tolerance is per-use-case, not per-product. Invoice numbers have zero tolerance (wrong number = wrong payment). Email replies have high tolerance (human reviews before send). Meeting summaries are in the middle. Match the guardrail strictness to the consequence of being wrong, not to a uniform standard.",
      },
      {
        id: "skip-guardrails",
        label: "Skip guardrails — ship all 3, monitor for issues",
        description:
          "Guardrails add complexity. Ship without them. Add disclaimers ('AI-generated, verify before using'). Iterate based on user reports.",
        isCorrect: false,
        feedback:
          "Disclaimers are not guardrails. The invoice extractor will silently put wrong numbers into accounting and you'll learn about it from your CFO. Skipping guardrails on high-stakes features is how AI products lose customer trust permanently. The right question is 'which features need which guardrails,' not 'do we need any.'",
      },
    ],
    tradeoffExplanation:
      "Quality investment is per-feature, not per-product. The right framing: what's the cost of one wrong output? For invoice extraction, the cost is high — invest heavily in correctness. For email drafts with human review, the cost is low — ship simple. Uniform standards waste effort on easy cases and underprotect hard ones.",
    category: "Differential quality bars",
  },
  {
    id: "qsc-llm-as-judge",
    scenario:
      "Your eval pipeline uses LLM-as-judge to score outputs. The judge is GPT-4o-mini scoring outputs from your production model (also GPT-4o-mini). The team is debating: upgrade the judge to GPT-4 (better evaluation), or use the same model as production (cheaper, consistent).",
    context:
      "Eval volume: ~10K judgments per release. Cost difference: $50/release with mini, $300/release with GPT-4. Quality of judgments matters because they gate releases.",
    options: [
      {
        id: "upgrade-judge",
        label: "Upgrade judge to GPT-4 — judgments matter more than cost",
        description:
          "Better judge = more reliable evaluation = better release decisions. $300/release is fine for the gating signal.",
        isCorrect: true,
        feedback:
          "Correct. The judge is your truth source — if it's wrong, your evals are wrong, your release decisions are wrong, and your product quality drifts. The right model for the judge is the strongest one you can afford because judgment quality bounds everything downstream. $250/release more is trivial insurance against shipping a regressed model.",
      },
      {
        id: "same-model",
        label: "Use the same model — consistency between judge and judged",
        description:
          "Production runs on mini. Judge runs on mini. They have the same biases, so the eval represents 'how mini sees its own work' — most consistent signal.",
        isCorrect: false,
        feedback:
          "Same-model judging has a known failure mode: models tend to rate their own outputs more favorably. You'll get inflated quality scores that don't survive contact with real users. Better to have a stronger judge that catches mistakes the production model makes — that's the entire point of judgment.",
      },
      {
        id: "human-judge",
        label: "Use humans as judge — most reliable, no model bias",
        description:
          "Have engineers manually score 100 outputs per release. Slower but most accurate. No reliance on LLM judgment.",
        isCorrect: false,
        feedback:
          "Human judges are the gold standard for new test cases but don't scale to 10K judgments per release. You'll either skip evals (bad) or do shallow human review (also bad). Hybrid is the right answer: humans build the rubric and label a calibration set; LLM judge applies the rubric at scale. Don't fight the volume.",
      },
    ],
    tradeoffExplanation:
      "LLM-as-judge is the engine of eval-driven development at scale. The judge model should be stronger than the production model — it needs to catch mistakes the production model makes. Cost-optimizing the judge feels frugal but corrupts the signal that drives every release decision. Spend on the judge.",
    category: "Eval judge selection",
  },
  {
    id: "qsc-ship-threshold",
    scenario:
      "Your AI feature scored 78% on the eval rubric (target: 80%+). The team is split: ship now and iterate, or hold for 1-2 more sprints to clear the bar.",
    context:
      "Launch is publicly committed for next week. The 78% means ~22% of outputs have minor quality issues. There's no human-in-loop — outputs go directly to users.",
    options: [
      {
        id: "ship-now",
        label: "Ship at 78%, iterate post-launch",
        description:
          "Launch on schedule. The 78% is close enough — most outputs are good. Real-user signal will show what to fix.",
        isCorrect: false,
        feedback:
          "Pre-defined quality thresholds exist for a reason. 'Close enough' becomes 'we'll fix it next sprint' becomes 'we never fixed it.' Most importantly: 22% of users seeing quality issues is a brand-trust failure, not a 'minor.' First impressions of AI products are sticky — broken trust is hard to rebuild post-launch.",
      },
      {
        id: "hold",
        label: "Hold launch, push to clear 80% — eat the schedule slip",
        description:
          "Communicate the slip honestly. Spend 1-2 sprints on the gap (better prompts, retrieval, self-correction, or guardrails). Launch when the threshold is met.",
        isCorrect: true,
        feedback:
          "Correct. Eval thresholds aren't aspirations; they're commitments. If you set 80% and the work scored 78%, the right response is to do the work, not to lower the bar. Schedule slips are recoverable; trust losses are not. The teams that establish quality discipline at launch keep it; the ones that don't never recover.",
      },
      {
        id: "lower-bar",
        label: "Re-evaluate the rubric — maybe 78% is actually good enough",
        description:
          "Re-examine the eval criteria. Some of the issues might be edge cases that don't matter. Adjust the rubric and re-score. If it now passes 80%, ship.",
        isCorrect: false,
        feedback:
          "Adjusting the rubric to pass is the worst possible move. It's literally moving the goalposts. Two outcomes: (1) you ship a product you secretly know is below your real bar, or (2) the rubric becomes meaningless for future releases. Either way, you've broken the discipline that makes evals useful.",
      },
    ],
    tradeoffExplanation:
      "Quality thresholds are useful only if they're respected. The temptation to ship below threshold is constant — schedule pressure, marketing commitments, sunk cost. The best PMs treat quality bars like SLAs: holding them costs in the short term, but they compound into the trust that makes the product viable long-term.",
    category: "Quality threshold discipline",
  },
];

// ─── Module 8: RAG & Knowledge Systems (Ship or Skip, 5 rounds) ──────────────

SHIP_GAMES_BY_MODULE["rag-knowledge-systems"] = [
  {
    id: "rag-chunk-strategy",
    scenario:
      "You're building a RAG system over your company's 50K Confluence pages. Pages range from 100-words (meeting notes) to 10K-words (technical specs). The team is debating chunk strategy.",
    context:
      "Embedding model has 8K token context. Retrieval needs to surface the right ~3 chunks per query. Quality of retrieval is the load-bearing decision.",
    options: [
      {
        id: "fixed-size",
        label: "Fixed 500-token chunks across all docs",
        description:
          "Simplest strategy. Split every doc into 500-token windows with 50-token overlap. Embed each chunk. Easy to implement, predictable.",
        isCorrect: false,
        feedback:
          "Fixed-size chunking ignores document structure. A 500-token slice in the middle of a technical spec might cut a code example in half or split a definition across chunks — retrieval surfaces the right chunk but the LLM can't use it because context is missing. Works for homogeneous text; fails for mixed content like Confluence.",
      },
      {
        id: "semantic-chunks",
        label: "Semantic chunking — split by section/heading boundaries",
        description:
          "Use the doc's structure (headings, paragraphs, lists) to define chunk boundaries. A chunk is one logical section, ranging from 100 to 2000 tokens. Preserve semantic units.",
        isCorrect: true,
        feedback:
          "Correct. Semantic chunking respects how humans wrote the content — sections, paragraphs, examples — and produces chunks that are self-contained units of meaning. Retrieval surfaces a coherent chunk that the LLM can actually use. The variable size is fine; embedding models handle 100-2000 tokens equally well.",
      },
      {
        id: "whole-doc",
        label: "Embed each whole document — no chunking",
        description:
          "Embed each Confluence page as a single chunk. Retrieval surfaces relevant pages; LLM reads the full page in context.",
        isCorrect: false,
        feedback:
          "Two failures: (1) 10K-word docs blow past your embedding model's context. (2) Single-vector representations of long docs lose nuance — the embedding becomes an average of everything in the doc, so retrieval can't distinguish which part matched. Chunking is necessary; the question is HOW.",
      },
    ],
    tradeoffExplanation:
      "Chunk strategy is the most under-discussed RAG decision. Bad chunking caps the system's quality before any other optimization matters. Semantic chunking (respecting document structure) consistently outperforms fixed-size on heterogeneous corpora like internal docs. The work is in the parsing, not the embedding.",
    category: "Chunking strategy",
  },
  {
    id: "rag-embedding-choice",
    scenario:
      "You're picking an embedding model for a customer-support RAG. Three viable options: OpenAI text-embedding-3-small ($0.02/1M tokens), Voyage AI voyage-3 ($0.12/1M, slightly higher quality), or self-hosted BGE-large (free but you run it).",
    context:
      "Volume: 500K query embeddings/month, 2M doc embeddings (one-time). Latency target: under 100ms per query. Privacy is not a hard constraint (using OpenAI for generation already).",
    options: [
      {
        id: "openai-default",
        label: "OpenAI text-embedding-3-small",
        description:
          "Industry default. Cheap. Well-supported. Same vendor as your LLM. Total cost ~$50/month.",
        isCorrect: true,
        feedback:
          "Correct. For most production RAG systems, OpenAI's embeddings are the right default: cheap enough at scale, quality high enough for most use cases, and zero operational overhead. Match the model to your actual need — 'better embeddings' is real but rarely worth the cost or complexity at this scale.",
      },
      {
        id: "voyage-pricier",
        label: "Voyage AI voyage-3 — better quality, manageable cost",
        description:
          "6x the price but measurably better retrieval quality on benchmarks. ~$300/month for your volume.",
        isCorrect: false,
        feedback:
          "Voyage's edge over OpenAI on benchmarks is small (~3-5% retrieval@5 improvement) and may not translate to noticeable quality lift in your specific corpus. Pay the premium when (a) you've measured a real gap on your own evals, (b) the system is at scale where small quality lifts matter, OR (c) you're in a niche domain where Voyage's training data fits better. Default OpenAI; switch when you have evidence.",
      },
      {
        id: "self-host",
        label: "Self-host BGE-large on your infra",
        description:
          "Open-source, no API costs. Model runs on your GPU infrastructure. Total operational cost: GPU instance + maintenance.",
        isCorrect: false,
        feedback:
          "Self-hosting embeddings is rarely worth it. You're trading $50/month for a GPU instance ($300+/month), engineering maintenance time, and the headache of model versioning. The privacy/latency benefits don't apply to your use case (you're already using OpenAI for generation). Self-host only when API costs become punitive at scale (10x your current volume) or privacy is a hard constraint.",
      },
    ],
    tradeoffExplanation:
      "Embedding model choice is usually 'OpenAI default unless you have a specific reason otherwise.' The reasons that justify upgrading: measured quality gap on your own evals, scale where small lifts matter, or niche domain. The reasons that justify self-hosting: privacy, compliance, or genuinely massive volume. For everyone else, default OpenAI and move on to higher-leverage problems.",
    category: "Embedding model selection",
  },
  {
    id: "rag-reranker",
    scenario:
      "Your RAG system retrieves the top 20 chunks per query. The LLM gets all 20 in its context and synthesizes an answer. Quality is okay but you suspect the LLM is getting confused by irrelevant chunks. The team is debating whether to add a reranker.",
    context:
      "A reranker is a small model that scores how well each chunk matches the query, then keeps the top 3-5. Adds 200ms latency, $0.01/query. Currently you're at 65% answer-correctness on your eval set.",
    options: [
      {
        id: "add-reranker",
        label: "Add a reranker — cut 20 chunks down to top 3-5",
        description:
          "Use a cross-encoder reranker (e.g., Cohere Rerank or BGE-reranker). Scores each query/chunk pair. Pass only the top 3-5 to the LLM. Quality typically jumps 10-20 points.",
        isCorrect: true,
        feedback:
          "Correct. Rerankers are the highest-ROI RAG improvement after basic retrieval. They consistently lift answer quality by 10-20 points because the LLM stops getting distracted by irrelevant chunks. The 200ms latency is the right tradeoff for the quality gain. If you only do one RAG optimization beyond chunking, do this.",
      },
      {
        id: "more-chunks",
        label: "Increase top-K to 50 chunks — more context can't hurt",
        description:
          "Pass more chunks to the LLM, let it figure out which ones matter. More context = more chance of finding the answer.",
        isCorrect: false,
        feedback:
          "More context demonstrably hurts beyond a threshold. LLMs exhibit a 'lost in the middle' effect: chunks at positions 10-30 in a long context are heavily underweighted compared to chunks at the start or end. Going from 20 to 50 chunks often DECREASES answer quality even though the right chunk is in there. Less, well-ranked context beats more, raw context.",
      },
      {
        id: "better-llm",
        label: "Switch to GPT-4 — bigger model handles 20 chunks better",
        description:
          "Bigger model has more capacity to filter noise from the 20 chunks. Skip the reranker, pay more per call.",
        isCorrect: false,
        feedback:
          "GPT-4 is more robust to noisy context than mini, but the lost-in-the-middle effect persists at every model size. Plus you're now paying 6x per call to do work the reranker does for $0.01. Reranker first, bigger model second — they solve different problems.",
      },
    ],
    tradeoffExplanation:
      "RAG quality has three big levers: chunking, retrieval, and reranking. Most teams over-invest in retrieval (better embeddings, vector DB tuning) and under-invest in reranking. Adding a reranker is usually the single highest-impact RAG upgrade after baseline retrieval works.",
    category: "Reranker investment",
  },
  {
    id: "rag-hybrid-search",
    scenario:
      "Your customer-support RAG retrieves well on conceptual queries ('how do I reset my password') but poorly on specific identifier queries ('what does error code E-409 mean'). The team is debating semantic-only vs hybrid (semantic + keyword) search.",
    context:
      "Pure semantic retrieval misses exact-match needs (error codes, product SKUs, specific function names). Hybrid adds a BM25 keyword index alongside semantic. Implementation: 1 sprint.",
    options: [
      {
        id: "semantic-only",
        label: "Stick with semantic-only — embed harder",
        description:
          "Improve the semantic search by chunking smaller and using a better embedding model. Keep the architecture simple.",
        isCorrect: false,
        feedback:
          "Embedding-based retrieval is fundamentally bad at exact-match queries. Error codes, SKUs, specific identifiers — these need string matching. No amount of better embedding will reliably surface 'E-409' when the query is 'what does E-409 mean.' The architectural choice (semantic-only) is wrong, not the embedding model.",
      },
      {
        id: "hybrid",
        label: "Hybrid search — combine semantic + BM25 keyword",
        description:
          "Run both retrievers in parallel. Take the union of top-K from each, then rerank. Captures both semantic similarity AND exact matches. ~1 sprint to implement.",
        isCorrect: true,
        feedback:
          "Correct. Hybrid search is the standard for production RAG over heterogeneous content (concepts + identifiers). Semantic catches paraphrased queries; BM25 catches exact-match needs. The two are complementary, not redundant. Modern vector DBs (Weaviate, Qdrant, Postgres+pgvector) all support hybrid natively. Worth the sprint.",
      },
      {
        id: "two-systems",
        label: "Build a separate keyword search system for identifiers",
        description:
          "Detect identifier queries (regex for 'E-XXX' patterns) and route them to a separate keyword index. Conceptual queries go to semantic. Two retrievers, query-type routing.",
        isCorrect: false,
        feedback:
          "Adds complexity for marginal gain. Now you have two retrieval systems, a query classifier deciding which to call, and a maintenance burden in two places. Hybrid search achieves the same result with one system: BM25 just naturally weights heavily when the query has rare terms (identifiers). Don't build two systems when one handles both.",
      },
    ],
    tradeoffExplanation:
      "RAG over real-world content needs both semantic (for concepts) and keyword (for identifiers). Pure semantic is a common over-correction toward 'modern AI'; pure keyword is the legacy. Hybrid is the answer for production. The cost is one sprint of integration; the benefit is dramatic improvement on the queries semantic-only fails on.",
    category: "Hybrid search",
  },
  {
    id: "rag-vs-context",
    scenario:
      "Your AI assistant answers questions about user-uploaded documents. Documents range from 5K to 200K tokens. You're choosing between RAG (chunk and retrieve) vs putting the whole document in the LLM's context window (now possible with 200K+ context models).",
    context:
      "GPT-4 Turbo has 128K context, Claude has 200K. Per-query cost difference: RAG ~$0.01, full-context ~$0.50. Volume: 5K queries/day.",
    options: [
      {
        id: "long-context",
        label: "Skip RAG — use long-context models, send the whole doc",
        description:
          "Modern models handle 200K tokens. Just send the doc and the question. No retrieval complexity, no chunking decisions, simpler architecture.",
        isCorrect: false,
        feedback:
          "Three problems. (1) Cost: 5K queries × $0.50 = $2,500/day vs $50/day for RAG. (2) Latency: 200K-context calls take 10-30 seconds. (3) Quality: 'lost in the middle' effect means relevant info buried in 200K tokens gets underweighted. Long-context capability doesn't replace RAG; it enables fancier RAG variants.",
      },
      {
        id: "rag",
        label: "Stick with RAG — chunk, retrieve, synthesize",
        description:
          "Standard RAG: chunk the doc, retrieve top-K relevant chunks, pass only those to the LLM. Lower cost, faster, better focus.",
        isCorrect: true,
        feedback:
          "Correct. RAG isn't an 'old' technique that long-context replaces — it's the cost-effective way to give an LLM access to specific information. Even with 200K context, you should still retrieve and pass only the relevant chunks. Long-context is a useful capability for SOME workflows (cross-document synthesis, full-doc QA on small docs), not a wholesale replacement for retrieval.",
      },
      {
        id: "hybrid-rag-context",
        label: "Hybrid: small docs go full-context, big docs go RAG",
        description:
          "Docs under 30K tokens get sent in full. Docs over 30K go through RAG. Get the best of both based on doc size.",
        isCorrect: false,
        feedback:
          "Adds complexity for modest gain. The threshold-based routing means you're maintaining two paths for marginal cost optimization. The cost difference between full-context-30K and RAG is small enough that picking one approach (RAG) and applying it uniformly is cleaner. Worth doing only if you have a clear measured quality win on small docs.",
      },
    ],
    tradeoffExplanation:
      "Long-context models extend what's possible but don't replace RAG economics. RAG remains the default for production document QA: 50x cheaper, faster, and avoids the lost-in-the-middle problem. Use long-context for genuinely cross-document tasks (compare doc A to doc B) or as a fallback when retrieval fails. Default RAG.",
    category: "RAG vs long context",
  },
];

// ─── Module 9: Tools, APIs & MCP Integrations (Ship or Skip, 5 rounds) ───────

SHIP_GAMES_BY_MODULE["tools-apis-mcp"] = [
  {
    id: "tam-tool-count",
    scenario:
      "You're designing an AI agent for your sales team. The agent needs to access: Salesforce, Gmail, Google Calendar, internal pricing DB, contract templates DB, and competitive intel docs. The team is debating whether to expose all 6 tools to the agent at once.",
    context:
      "Each tool has 3-5 actions (search, get, create, update). Total: ~25 tool definitions. LLM tool-selection accuracy degrades as tool count grows.",
    options: [
      {
        id: "all-tools",
        label: "Expose all 25 tool definitions to the agent",
        description:
          "Maximum flexibility. The agent picks whatever tool it needs for any query. Simplest implementation.",
        isCorrect: false,
        feedback:
          "LLM tool selection accuracy drops sharply past ~10-15 tools. With 25 definitions, the agent will frequently pick the wrong tool, fail to call any tool when one exists, or invoke similar-looking tools incorrectly. 'Just give it everything' is the most common AI agent design mistake — flexibility costs reliability.",
      },
      {
        id: "scoped-tools",
        label: "Scope tools by intent — agent gets 5-7 tools per workflow",
        description:
          "Add an upstream router that classifies the query into a workflow (Lead Research, Email Composition, Contract Generation, etc.). Each workflow exposes only the relevant 5-7 tools.",
        isCorrect: true,
        feedback:
          "Correct. Tool scoping is the key to reliable agents. By restricting the tool set to what's relevant for each workflow, you keep selection accuracy above 95%. The router adds a step but eliminates the failure mode of 'agent ignores Salesforce because it got distracted by 24 other tools.' Production agents look like this; demo agents look like 'all tools always.'",
      },
      {
        id: "two-agents",
        label: "Build two specialist agents — Sales Ops and Sales Comms",
        description:
          "One agent handles all the data-lookup tools (Salesforce, pricing, contracts). Another handles communication (Gmail, Calendar, templates). Route queries to the right specialist.",
        isCorrect: false,
        feedback:
          "Workable but premature. Multi-agent systems add coordination overhead, debugging complexity, and inter-agent state management. With only 25 tools across 6 systems, intent-based scoping inside a single agent achieves the same reliability with less infrastructure. Multi-agent makes sense at higher tool counts (50+) or when specialization needs different prompts/models.",
      },
    ],
    tradeoffExplanation:
      "Tool count is the silent killer of agent reliability. The fix isn't 'better LLM' — it's tool scoping. Group tools by workflow intent and expose only the relevant subset per query. Most production agents end up with ≤10 tools per active context, often achieved through query routing or workflow detection.",
    category: "Tool surface area",
  },
  {
    id: "tam-mcp-vs-custom",
    scenario:
      "Your AI agent needs to integrate with 4 internal systems. Engineering is debating whether to build custom tool integrations (REST endpoints + tool wrappers) or adopt MCP (Model Context Protocol) servers.",
    context:
      "MCP is an emerging open standard for tool integration with growing ecosystem support (Anthropic, OpenAI, others). Custom integration: 1 sprint. MCP setup: 2 sprints initially, faster after.",
    options: [
      {
        id: "custom",
        label: "Build custom integrations — fastest to ship",
        description:
          "Each system gets a custom REST wrapper exposed as an LLM tool. Direct, simple, no protocol overhead.",
        isCorrect: false,
        feedback:
          "Faster for the first integration, slower for the next four. Each custom integration is its own auth flow, error handling, schema definition, and maintenance overhead. By integration #5, you've reinvented MCP badly. The early investment in MCP pays back across the integrations after.",
      },
      {
        id: "mcp",
        label: "Adopt MCP — invest in the standard for long-term gains",
        description:
          "Set up MCP servers for each system. Use Anthropic's MCP SDK for the agent. Trade 1 extra sprint of setup for a standard interface, ecosystem tooling, and easier multi-tool workflows.",
        isCorrect: true,
        feedback:
          "Correct. MCP is becoming the standard for LLM tool integration, similar to how REST won over SOAP. The 1-sprint upfront cost is the right tradeoff: future integrations are easier, you can adopt third-party MCP servers (databases, APIs, file systems) without writing wrappers, and your agent isn't locked into your custom protocol. Bet on the standard early.",
      },
      {
        id: "wait",
        label: "Build custom now, migrate to MCP later when it's mature",
        description:
          "Ship custom integrations now to meet the launch deadline. Plan a migration to MCP in 2-3 quarters when the ecosystem is more stable.",
        isCorrect: false,
        feedback:
          "Migration projects rarely happen. By Q3 your custom integrations have grown features, edge cases, and dependencies that make migration a quarter of work nobody wants to commit. The 'we'll migrate later' rationalization is how teams end up with proprietary tool layers they can't escape. Adopt MCP at the architecture decision point, not after.",
      },
    ],
    tradeoffExplanation:
      "Tool integration architecture is a load-bearing decision. Custom one-offs are faster individually but compound into a maintenance tax. Standards (MCP) cost more upfront and pay back across the lifecycle. Bet on the standard when the ecosystem is real (Anthropic + OpenAI + others adopting), not when it's mature.",
    category: "Integration protocol",
  },
  {
    id: "tam-tool-failure",
    scenario:
      "Your agent calls external tools (CRM, pricing API, etc.). Tools fail ~3% of the time (timeouts, 5xx errors, rate limits). The team is debating how the agent should handle tool failures.",
    context:
      "Currently when a tool fails, the agent silently returns 'I encountered an error.' Users get frustrated and re-ask. ~50% of tool failures could succeed on retry.",
    options: [
      {
        id: "retry-once",
        label: "Retry once with exponential backoff, then surface the error",
        description:
          "On any tool failure: wait 1s, retry. If still fails, return a structured error to the agent with context ('CRM lookup failed: timeout'). Agent decides whether to retry, use a workaround, or apologize.",
        isCorrect: true,
        feedback:
          "Correct. Single retry with backoff handles most transient failures (timeouts, rate limits) without user-visible disruption. Surfacing structured errors to the agent enables intelligent handling — the agent can try a different approach, ask the user for missing info, or gracefully apologize with specifics. This is the production-ready pattern.",
      },
      {
        id: "infinite-retry",
        label: "Retry until success — handle failures by persistence",
        description:
          "Keep retrying tool calls (with backoff) until they succeed. Users wait but always get an answer.",
        isCorrect: false,
        feedback:
          "Two failure modes: (1) some failures are permanent (the record doesn't exist, the API is decommissioned) and infinite retry loops forever. (2) Latency becomes unpredictable — sometimes 200ms, sometimes 30 seconds. Bounded retries with surfaced errors give the agent a chance to recover gracefully or ask the user.",
      },
      {
        id: "fail-silent",
        label: "Fail silently — pretend the tool succeeded with empty data",
        description:
          "If a tool fails, return empty/null data to the agent as if the call succeeded with no results. Agent continues its workflow.",
        isCorrect: false,
        feedback:
          "Recipe for hallucination. The agent thinks 'the user has no orders' when really 'the orders API was down.' It will then confidently tell the user 'I don't see any orders for you' when the orders exist. Failing silently produces wrong answers presented as correct ones — the worst possible failure mode for an AI product.",
      },
    ],
    tradeoffExplanation:
      "Tool failure handling separates demo agents from production agents. The right pattern: bounded retry for transient failures (handles 50%+ of issues invisibly) + structured error surfacing for permanent failures (lets the agent recover gracefully). Silent failures cause hallucinations; infinite retries cause unpredictable latency. Bounded + structured is the answer.",
    category: "Tool failure handling",
  },
  {
    id: "tam-tool-descriptions",
    scenario:
      "Your agent has 8 tools defined. Despite tool count being reasonable, the agent picks the wrong tool ~15% of the time. The team is debating whether the issue is tool descriptions, the LLM, or the architecture.",
    context:
      "Current tool descriptions are 1-line summaries: 'lookup_customer: looks up customer info by ID.' The LLM is GPT-4o-mini. Each tool has clear, distinct purpose.",
    options: [
      {
        id: "rewrite-descriptions",
        label: "Rewrite tool descriptions — verbose, with examples and when-not-to-use",
        description:
          "Expand each tool description: what it does, when to use it, when NOT to use it, example inputs/outputs, common confusions. Tool descriptions become 5-10 lines each.",
        isCorrect: true,
        feedback:
          "Correct. Tool descriptions are the agent's instructions for tool selection, and 1-line summaries are radically under-specified. Adding 'when to use' and 'when not to use' (especially distinguishing similar tools) typically cuts wrong-tool rates from 15% to under 3%. The work is content, not architecture. Cheapest, highest-leverage fix in agent design.",
      },
      {
        id: "upgrade-llm",
        label: "Upgrade to GPT-4 — bigger model, better tool selection",
        description:
          "Bigger model is better at distinguishing similar tools. Switch from mini to GPT-4. 6x cost increase but better routing.",
        isCorrect: false,
        feedback:
          "GPT-4 is better at tool selection, but the gap shrinks dramatically when descriptions are well-written. You'll spend 6x more per call to fix a problem that costs $0 to fix in the descriptions. Better descriptions first; bigger model only if descriptions don't close the gap.",
      },
      {
        id: "agent-loop",
        label: "Add a 'verify tool choice' agent loop",
        description:
          "After the agent picks a tool, run a second LLM call: 'Is this the right tool for this query?' If not, retry. Two LLM calls per tool selection.",
        isCorrect: false,
        feedback:
          "Solving an information problem with more LLM calls. The first agent picked the wrong tool because the descriptions didn't clarify the right one. A verifier agent with the same bad descriptions will often agree with the wrong choice. Fix the descriptions and the verifier becomes unnecessary.",
      },
    ],
    tradeoffExplanation:
      "Tool descriptions are the most undervalued part of agent design. Most teams treat them as documentation; they're actually the agent's prompt for tool selection. Verbose, comparative descriptions ('use this when X; use OTHER_TOOL when Y') cut error rates dramatically. Cheapest, highest-leverage fix in the toolkit.",
    category: "Tool description quality",
  },
  {
    id: "tam-when-no-tools",
    scenario:
      "You're building an AI assistant that answers questions about your product. The team has 20+ tool ideas (FAQ search, pricing lookup, account info, support tickets, billing data, etc.). They want to give the agent access to everything. Your gut says start smaller.",
    context:
      "Most user questions (~70% based on log analysis) are general 'how do I' questions answerable from documentation. ~30% need real-time data from your systems.",
    options: [
      {
        id: "rag-first-no-tools",
        label: "Start with RAG over docs, add tools only for specific high-value workflows",
        description:
          "First version: RAG over your help docs answers the 70%. Identify the 2-3 most valuable real-time workflows (account lookup, billing) and add tools for those. Skip the rest until proven needed.",
        isCorrect: true,
        feedback:
          "Correct. Tools are powerful but expensive (latency, complexity, failure modes). RAG handles informational queries cheaper, faster, and more reliably than tool-using agents. The right architecture: RAG by default; tools where structured data matters. Most production AI assistants end up here after starting with 'agent with all the tools' and rolling back.",
      },
      {
        id: "all-tools",
        label: "Give the agent all 20 tools — maximum capability",
        description:
          "Maximum flexibility from day one. Agent can answer any question with the right tool. RAG is unnecessary if every data source is a tool.",
        isCorrect: false,
        feedback:
          "Two problems. (1) 70% of queries are informational — a tool-calling agent will still call a tool (slowly, expensively) when RAG would be instant. (2) 20 tools blows up the selection-accuracy problem. The right architecture matches the query shape: RAG for 'how does X work', tools for 'what's MY current X'.",
      },
      {
        id: "no-tools-only-rag",
        label: "Skip tools entirely — RAG is enough",
        description:
          "Index everything (docs + data dumps) into RAG. Agent retrieves answers from the index. No tools needed.",
        isCorrect: false,
        feedback:
          "RAG handles informational queries well, but it's the wrong tool for real-time data. The user asking 'what's my current usage' needs LIVE data, not yesterday's index. The 30% that need real-time data deserve tools. The mistake is symmetrical: tools-everywhere AND no-tools-anywhere both ignore the query-shape question.",
      },
    ],
    tradeoffExplanation:
      "Tools and RAG are different solutions for different query shapes. Tools: real-time, structured, specific. RAG: informational, broad, cacheable. The most common production architecture is RAG-first (handles the bulk) with tools added selectively for high-value real-time workflows. 'Agent with all the tools' is a demo pattern, not a production pattern.",
    category: "Tools vs RAG",
  },
];

// ─── Module 11: Memory & Personalization (Stakeholder Sim, 5 rounds) ─────────

STAKEHOLDER_GAMES_BY_MODULE["memory-personalization"] = [
  {
    id: "mp-how-much",
    situation:
      "You're designing an AI assistant that gets better the more it knows about each user. The team is debating how much to remember by default — and three stakeholders have very different ideas.",
    tension:
      "More memory = better personalization (and stickiness). But more memory = more privacy risk, more user weirdness ('how does it know that?'), and more legal exposure.",
    stakeholders: [
      {
        id: "growth",
        role: "VP of Growth",
        name: "Maya",
        argument:
          "Remember everything. Every query, every preference, every clicked link. The competitor that personalizes most aggressively wins. Worry about privacy when regulators force us to.",
        isOptimal: false,
        feedback:
          "Maya's strategy was viable in 2018; in 2025 it produces three risks at once: regulatory (GDPR, EU AI Act, state laws stacking up), user trust (one creepy moment loses years of trust), and brand (you're the AI that 'knows too much'). Aggressive default-on memory is shipping with a future PR crisis built in.",
      },
      {
        id: "design-lead",
        role: "Design Lead",
        name: "Renata",
        argument:
          "Remember explicitly stated preferences only — things the user has said directly, like 'I prefer concise answers.' Everything else (search history, click patterns) stays session-scoped. Users see exactly what's remembered and can edit.",
        isOptimal: true,
        feedback:
          "Renata's approach is the production-mature default. Explicit memory (user-stated preferences) is high-value and low-creep. Implicit memory (behavior tracking) is low-value and high-creep. Showing the user a clear 'what I remember about you' panel makes memory a feature instead of a surveillance vector. Users opt INTO more memory when they see value; they don't opt out of less when they're surprised.",
      },
      {
        id: "legal",
        role: "General Counsel",
        name: "James",
        argument:
          "Don't remember anything. Stateless AI. Every conversation is fresh. Zero data retention, zero liability, zero risk.",
        isOptimal: false,
        feedback:
          "James's position eliminates risk but also eliminates one of AI's biggest UX wins. Stateless AI feels broken to users — they have to re-establish context every conversation. The right move isn't 'no memory' but 'transparent, limited, user-controlled memory.' Memory is a feature; absent memory is friction.",
      },
    ],
    optimalRationale:
      "Default to explicit memory only — what users have stated directly. Show users a transparent 'what I remember' panel they can edit. Behavior-based implicit memory should be opt-in with clear value, not opt-out by default. This threads the needle: real personalization users see and control, no creepy surveillance, regulatory posture defensible.",
    category: "Memory scope",
  },
  {
    id: "mp-default-stance",
    situation:
      "Your memory feature is built. Now: should it be ON by default for new users, or off until they explicitly turn it on?",
    tension:
      "On-by-default = higher adoption (most users never change defaults), better personalization, faster product-market fit. Off-by-default = better consent posture, lower regulatory risk, slower adoption.",
    stakeholders: [
      {
        id: "growth",
        role: "VP of Growth",
        name: "Maya",
        argument:
          "On by default. 'Privacy first, personalization later' loses. Users who try the personalized version stick; users who try the bare version don't. The defaults are the product.",
        isOptimal: false,
        feedback:
          "Maya's growth math is real but ignores the legal vector. EU GDPR and similar regimes require explicit consent for non-essential personalization data. Shipping 'on by default' in those markets is a fine waiting to happen. Worse, the press cycle when one privacy scandal breaks (and one always does) costs more than the adoption lift.",
      },
      {
        id: "compliance",
        role: "Compliance Lead",
        name: "Anya",
        argument:
          "Off by default everywhere. Every user explicitly opts in via a clear modal: 'Want a more personal experience? Here's exactly what we remember and why. Opt in.' Higher friction, lower adoption, but defensible everywhere.",
        isOptimal: true,
        feedback:
          "Anya's stance is the right production default in 2025. The opt-in friction reduces adoption maybe 30%, but the users who opt in are intentional users who give clearer feedback and have higher retention. More importantly: 'we always asked first' is a defensible posture across every regulatory regime, every PR cycle, and every customer trust survey. The ones that opt in become evangelists.",
      },
      {
        id: "design-lead",
        role: "Design Lead",
        name: "Renata",
        argument:
          "On by default but with a prominent 'You're using personalized mode' banner for the first 2 weeks. After that, the banner goes away. High adoption + visible disclosure.",
        isOptimal: false,
        feedback:
          "Renata's 'visible defaults' approach is creative but legally weaker than explicit consent. Banners are notice; they aren't consent under most privacy regimes. You'll get the adoption lift but not the legal protection. Pick one: full opt-in (Anya) or accept the legal risk (Maya). The middle isn't actually a middle.",
      },
    ],
    optimalRationale:
      "Off by default with a clear opt-in flow. Higher friction, lower initial adoption, but defensible across every regulatory regime and every PR cycle. The users who opt in are higher-value (intentional, give clearer feedback). The trust posture compounds — 'we always asked first' is a brand asset that scales with the business.",
    category: "Default consent",
  },
  {
    id: "mp-cross-product",
    situation:
      "Your company has three products. The data team wants to share user memory across them — what the user told the customer-support AI should be available to the sales-CRM AI and the analytics dashboard AI. The team is debating whether to enable cross-product memory.",
    tension:
      "Cross-product memory is genuinely useful (the AI 'knows you' everywhere). It's also where most privacy lawsuits originate — users consented to give data in ONE context and it appeared in another.",
    stakeholders: [
      {
        id: "data-lead",
        role: "Data Platform Lead",
        name: "Devon",
        argument:
          "Build a shared user-context service. Every product reads from and writes to the same memory. Users get a coherent experience across products. We've already built the infrastructure.",
        isOptimal: false,
        feedback:
          "Devon's 'one shared context' design is technically clean and legally treacherous. Most privacy regimes (GDPR, CCPA, COPPA) treat data shared across product contexts as a 'sale' or 'sharing' that requires separate consent. Even with consent, this creates one giant blast radius for any breach. The shared context is the database every adversary wants.",
      },
      {
        id: "compliance",
        role: "Compliance Lead",
        name: "Anya",
        argument:
          "Per-product memory. The customer-support AI knows what was said in customer-support conversations. The sales-CRM AI knows what was said there. Cross-product sharing requires explicit user opt-in and is logged.",
        isOptimal: true,
        feedback:
          "Anya's per-product memory boundaries match user mental models AND legal requirements. Users who consent to the support AI knowing about their billing issue do NOT necessarily consent to the analytics dashboard knowing. Per-product silos preserve trust, simplify consent flows, and limit breach blast radius. Cross-product as opt-in keeps the door open without making it the default.",
      },
      {
        id: "growth",
        role: "VP of Growth",
        name: "Maya",
        argument:
          "Compromise: share data within the same business unit, not across business units. Sales and CRM share; analytics and customer-support are separate. Practical lines.",
        isOptimal: false,
        feedback:
          "Maya's 'business unit' lines mean nothing to users — they see your company as one entity. Either you have product-level boundaries (Anya) or you don't (Devon). Internal org structure isn't a defensible legal or UX boundary. The user's mental model is product, not business unit.",
      },
    ],
    optimalRationale:
      "Per-product memory by default. Cross-product sharing as explicit opt-in with clear value proposition ('Allow your support context to inform your sales experience? Here's what gets shared and why.'). This respects user mental models, simplifies legal posture, and limits breach blast radius. The cross-product magic is opt-in, not default.",
    category: "Cross-product memory",
  },
  {
    id: "mp-deletion-semantics",
    situation:
      "A user asks you to delete their AI memory. The team is debating what 'delete' actually means: scrub it from the production memory store, or also from logs, training data, and derived analytics?",
    tension:
      "Real deletion is operationally complex (data is in many places). Soft deletion (just hide it) is cheap but legally weak. Users who ask for deletion expect it to be real.",
    stakeholders: [
      {
        id: "infra-lead",
        role: "Infrastructure Lead",
        name: "Devon",
        argument:
          "Delete from the active memory store. Done. Logs and training data are separate systems with their own retention rules. Saying 'all your data is gone' includes those is operationally impractical.",
        isOptimal: false,
        feedback:
          "Devon's 'just the active store' definition is exactly the gap that triggers regulatory action. GDPR Article 17 ('right to erasure') requires deletion across all systems. 'Operationally impractical' isn't a legal defense. If logs and training data are out of scope for deletion, you're collecting data you can't legally retain after a deletion request.",
      },
      {
        id: "compliance",
        role: "Compliance Lead",
        name: "Anya",
        argument:
          "Real deletion across all systems: active memory, logs (within retention windows), and any derived training data. Build the tooling to make it real, not theatrical. Document the process.",
        isOptimal: true,
        feedback:
          "Anya's position is the only legally defensible one. Real deletion means everywhere. The operational cost is significant — you have to know where every byte of user data lives — but it's a forcing function for good data hygiene. Logs get short retention windows. Training data gets versioned and re-derivable. The work is real but it's the work.",
      },
      {
        id: "ml-lead",
        role: "ML Lead",
        name: "Sasha",
        argument:
          "Anonymize instead of delete. Strip PII from logs and training data. The data stays useful for model improvement; the user is no longer identifiable. Best of both worlds.",
        isOptimal: false,
        feedback:
          "Anonymization is a known-broken legal defense. Modern re-identification techniques can recover identity from 'anonymized' data with surprisingly few signals. Worse: most regulators (GDPR especially) treat 'pseudonymized' data as still personal data subject to deletion rights. Anonymization is a useful defense in depth; it's not a substitute for actual deletion.",
      },
    ],
    optimalRationale:
      "Delete across all systems. Build the tooling to make it real. The cost is real but the legal alternative is worse. Anonymization is defense in depth, not a substitute. Theatrical deletion (just the active store) is the source of most privacy enforcement actions in 2024-2025.",
    category: "Deletion semantics",
  },
  {
    id: "mp-disclosure",
    situation:
      "Your AI now uses long-term memory to personalize responses. The team is debating how transparent to be about it: subtle ('responses are personalized'), explicit ('I remember you said X 3 weeks ago'), or invisible ('just feel personal without saying so').",
    tension:
      "Explicit memory references make personalization feel valuable. They also make it feel surveillance-y. Subtle is safe but reduces the perceived value of memory.",
    stakeholders: [
      {
        id: "design-lead",
        role: "Design Lead",
        name: "Renata",
        argument:
          "Explicit references when they're useful, no references when they're not. 'You mentioned last week you prefer Python — here's the example in Python.' That feels helpful, not creepy. But don't drop in 'I see you searched for X yesterday' — that's just surveillance theater.",
        isOptimal: true,
        feedback:
          "Renata's 'explicit when useful' framing is the production-tested answer. Memory references should always serve the user, never demonstrate the system. 'You prefer Python, here's the Python answer' is a personalization win. 'I noticed you visited the pricing page' is creepy because it's NOT serving the conversation. The discipline is asking 'does this reference make my answer better?' before using it.",
      },
      {
        id: "growth",
        role: "VP of Growth",
        name: "Maya",
        argument:
          "Make memory visible everywhere — 'Personalized for you' badges, 'Based on your history' callouts. Users SEE the personalization, perceive more value, retain better.",
        isOptimal: false,
        feedback:
          "Visibility for visibility's sake produces UX clutter and creep. 'Personalized for you' on every component trains users to ignore the badge OR to feel watched. The right visibility is contextual: explicit memory reference WHEN it improves the answer. Otherwise the personalization works invisibly.",
      },
      {
        id: "research-lead",
        role: "User Research Lead",
        name: "Yusuf",
        argument:
          "Invisible. Personalization should just feel like a smarter assistant. No callouts, no explicit references. Users will feel the magic without knowing why.",
        isOptimal: false,
        feedback:
          "Yusuf's 'invisible magic' is right MOST of the time but loses an important moment: when the personalization is genuinely valuable, surfacing 'I'm doing this BECAUSE I remembered Y' makes the personalization feel earned, not creepy. The discipline is 'invisible by default, explicit when it adds value.' Renata's nuance beats pure invisibility.",
      },
    ],
    optimalRationale:
      "Explicit memory references when they make the answer better; invisible personalization the rest of the time. The test: does referencing the memory improve THIS answer for THIS user? If yes, surface it. If no, work silently. Visible-everywhere produces clutter and creep; invisible-always misses moments where attribution adds trust.",
    category: "Personalization disclosure",
  },
];

// ─── Module 12: Safety, Guardrails & Human Oversight (Stakeholder Sim, 5) ────

STAKEHOLDER_GAMES_BY_MODULE["safety-guardrails"] = [
  {
    id: "sg-pre-vs-post",
    situation:
      "Your AI generates customer-facing responses. The team needs to add safety guardrails. Should checks happen BEFORE generation (filter the input) or AFTER generation (filter the output)?",
    tension:
      "Pre-generation filtering catches issues early but can refuse legitimate requests. Post-generation filtering catches actual problems but wastes the generation cost.",
    stakeholders: [
      {
        id: "safety-lead",
        role: "Trust & Safety Lead",
        name: "Wei",
        argument:
          "Both. Pre-generation checks for obvious abuse (prompt injection patterns, banned topics). Post-generation checks for what actually came out (PII, off-topic content, harmful suggestions). The defenses overlap on purpose.",
        isOptimal: true,
        feedback:
          "Wei's defense-in-depth answer is the production standard. Pre-generation catches 60-70% of issues cheaply. Post-generation catches what slips through — including emergent issues the pre-filter doesn't anticipate. Either layer alone has gaps; the overlap is the point. Cost is real but small relative to the cost of one viral safety failure.",
      },
      {
        id: "eng-lead",
        role: "Engineering Lead",
        name: "Priya",
        argument:
          "Post-generation only. Pre-filtering blocks legitimate edge cases (a user asking about violence in literature class gets refused). Post-filtering checks the actual output — only block what's actually harmful. Cleaner UX.",
        isOptimal: false,
        feedback:
          "Priya's right that pre-filtering causes false refusals — but post-only also fails: you've burned the generation cost AND you're now showing the user 'I generated something but I won't show it,' which is more confusing than 'I won't help with that.' Pre-filtering for obvious cases (prompt injection, banned topics) saves cost AND latency. Post-filtering catches the rest.",
      },
      {
        id: "growth",
        role: "VP of Growth",
        name: "Maya",
        argument:
          "Skip both — most of our users are well-intentioned. Add safety filtering only when we see actual abuse patterns. Don't over-engineer.",
        isOptimal: false,
        feedback:
          "Maya is right that most users are well-intentioned. She's wrong that you can wait. The first viral safety failure (a screenshot of your AI saying something harmful) is a brand crisis that's expensive to recover from. Safety filtering is one of those investments where you build it BEFORE you need it, not after. The cost of false alarms is far less than the cost of one viral failure.",
      },
    ],
    optimalRationale:
      "Defense in depth — both pre and post. Pre-generation catches obvious abuse patterns cheaply. Post-generation catches what slips through. Either alone has known gaps; the overlap is the point. Cost is small relative to the cost of one viral safety failure that defines your brand.",
    category: "Pre vs post filtering",
  },
  {
    id: "sg-human-loop",
    situation:
      "Your AI agent takes actions in user accounts (refunds, plan changes, data exports). The team is debating how often a human should be in the loop: never (full autonomy), always (human approves every action), or selectively (only for high-stakes actions).",
    tension:
      "Full autonomy is fastest and feels most like 'AI does it for you.' Always-approve negates the AI's value. Selectively requires defining 'high-stakes' clearly.",
    stakeholders: [
      {
        id: "support-lead",
        role: "Head of Support",
        name: "Janelle",
        argument:
          "Selective. Read-only actions (fetch info, look up status) are autonomous. Reversible writes (change preferences, update info) are autonomous with notification. Irreversible or money-moving actions (refunds, plan downgrades, data deletion) need human approval.",
        isOptimal: true,
        feedback:
          "Janelle's three-tier model is the production-standard pattern. Read-only actions are safe to autonomize completely. Reversible writes are safe with logged notifications. Irreversible/money actions need human approval because mistakes have permanent consequences. The cost of approval friction on 5% of actions is tiny vs the cost of one wrongly-issued $50K refund.",
      },
      {
        id: "growth",
        role: "VP of Growth",
        name: "Maya",
        argument:
          "Full autonomy. Users want AI that just does things. Human-in-loop ruins the magic. Trust the AI; if something goes wrong, fix it after.",
        isOptimal: false,
        feedback:
          "Maya's 'trust the AI' approach is great until the first wrongly-issued refund. Money-moving actions create financial liability. Data deletion creates user trust failures. 'Fix it after' for these cases is expensive AND damaging — refunded $50K is hard to recover, deleted user data may be unrecoverable. Selective autonomy gets you most of the magic without the worst-case downside.",
      },
      {
        id: "ops-lead",
        role: "Operations Lead",
        name: "Sasha",
        argument:
          "Always-approve. Every action the AI takes goes through a human reviewer. Slower but maximum oversight, no surprises.",
        isOptimal: false,
        feedback:
          "Sasha's always-approve negates 80% of the AI's value. If a human reviews every action, why have an AI agent at all? You've turned the agent into a fancy form filler. The right discipline is to identify which actions actually NEED human eyes — usually money-moving or irreversible — and let the rest fly.",
      },
    ],
    optimalRationale:
      "Selective human-in-loop, tiered by reversibility. Read-only: full autonomy. Reversible writes: autonomous with notification. Irreversible/money-moving: requires human approval. This preserves the AI's value where it's safe and adds friction precisely where mistakes have permanent consequences. The 5% friction cost is far less than one bad action's cost.",
    category: "Human oversight tiers",
  },
  {
    id: "sg-jailbreak",
    situation:
      "A security researcher publishes a way to make your AI assistant ignore its safety prompts via a specific phrasing pattern. The exploit is now circulating on Twitter. The team has 24 hours before it goes viral. What's the response strategy?",
    tension:
      "Patching the prompt fast is reactive and fragile (the next jailbreak waits). Architectural fixes are slow but durable. Public response affects how the press treats the incident.",
    stakeholders: [
      {
        id: "safety-lead",
        role: "Trust & Safety Lead",
        name: "Wei",
        argument:
          "Two-track: (1) Ship a prompt patch in 4 hours that blocks the specific exploit. (2) Start an architectural fix this week — output classifier that runs after generation regardless of what the prompt did. Acknowledge publicly that we're working on both.",
        isOptimal: true,
        feedback:
          "Wei's two-track response is the right pattern. Prompt patches buy you immediate relief; architectural fixes (output classifiers, layered checks) make the next exploit class harder. Acknowledging both publicly converts a 'they got hacked' story into a 'they responded responsibly' story. This is how mature AI products handle incidents.",
      },
      {
        id: "eng-lead",
        role: "Engineering Lead",
        name: "Priya",
        argument:
          "Patch the prompt now, ship in 1 hour. Don't talk about it publicly — that just draws attention. Hope the news cycle moves on.",
        isOptimal: false,
        feedback:
          "Priya's silent patching strategy backfires when the patch fails or another exploit emerges. The press finds out anyway, and now the story is 'they tried to hide it.' Modern AI companies that handle incidents well are loud about responsible response. Silence is suspicious; transparency is reassuring.",
      },
      {
        id: "comms-lead",
        role: "Comms Lead",
        name: "Diana",
        argument:
          "Don't patch — issue a statement that 'the AI works as designed, this is a known limitation.' Set expectations. Move on. Patching just confirms there was a problem.",
        isOptimal: false,
        feedback:
          "Diana's 'this is by design' framing is corporate communications malpractice for an actual safety issue. It signals you don't take safety seriously, which costs more long-term trust than the incident itself. Patch fast, communicate honestly, and use the incident as proof of responsible response capability.",
      },
    ],
    optimalRationale:
      "Two-track response: ship a prompt patch immediately for the specific exploit AND start architectural work (output classifier, layered checks) for the next exploit class. Acknowledge publicly. This converts 'they got hacked' into 'they responded responsibly.' Silence and dismissal are both more expensive than transparent action.",
    category: "Jailbreak response",
  },
  {
    id: "sg-output-scope",
    situation:
      "Your AI agent occasionally produces outputs that are technically accurate but inappropriate for context (e.g., suggesting a competitor's product, citing controversial sources, using slang in a formal context). The team is debating how broad output filtering should be.",
    tension:
      "Narrow filtering catches obvious harm but lets context-inappropriate content through. Broad filtering reduces inappropriate output but blocks legitimate variety.",
    stakeholders: [
      {
        id: "design-lead",
        role: "Design Lead",
        name: "Renata",
        argument:
          "Filter for harm narrowly (PII, sexual content, violence, legal liability). Manage tone/context with the prompt itself: 'You are a professional support agent. Use formal language. Never recommend competitors.' Prompt + filter = layered.",
        isOptimal: true,
        feedback:
          "Renata's separation is right: filters for harm (where the output should be blocked entirely), prompts for tone/context (where the output should be different). Conflating these into one broad filter produces over-refusal and brittle behavior. The discipline: filters say 'never,' prompts say 'usually.' Both have a place; they're solving different problems.",
      },
      {
        id: "safety-lead",
        role: "Trust & Safety Lead",
        name: "Wei",
        argument:
          "Broad filtering — block anything potentially inappropriate including competitor mentions, casual tone, anything that could embarrass the brand. Better safe than sorry.",
        isOptimal: false,
        feedback:
          "Wei's 'better safe than sorry' filtering produces an AI that refuses too much. Users hit refusal walls on benign requests, get frustrated, and leave. The filter for 'could embarrass the brand' is a vague enough criterion that it'll catch many legitimate outputs. Broad filtering is a known UX killer for AI products.",
      },
      {
        id: "growth",
        role: "VP of Growth",
        name: "Maya",
        argument:
          "Minimal filtering — let the AI be free, fix individual cases when they emerge. Broad filtering ruins the personality.",
        isOptimal: false,
        feedback:
          "Maya's minimal-filter stance is right that personality matters but wrong about the tradeoff. Even narrow harm filtering (PII, violence, legal liability) is non-negotiable. The right move is narrow filtering + good prompting for tone — Renata's answer. 'Minimal' is too minimal for production.",
      },
    ],
    optimalRationale:
      "Filter narrowly for harm (PII, sexual content, violence, legal liability). Manage tone, brand voice, and context with the prompt itself. The two have different jobs: filters are 'never,' prompts are 'usually.' Conflating them produces over-refusal. Separating them produces an AI that's safe AND has personality.",
    category: "Filter scope",
  },
  {
    id: "sg-escalation-trigger",
    situation:
      "Your AI customer-service agent handles most issues but should escalate to a human when stuck. The team is debating how to detect 'stuck' — explicit user request, AI confidence threshold, conversation length, or sentiment analysis?",
    tension:
      "Each trigger catches some escalation cases and misses others. Combining triggers reduces miss rate but increases over-escalation.",
    stakeholders: [
      {
        id: "support-lead",
        role: "Head of Support",
        name: "Janelle",
        argument:
          "Combination: (1) explicit user request always escalates immediately, (2) AI low-confidence on its own response triggers escalation, (3) conversation length over 8 turns triggers a 'should I get someone?' offer. Three signals, each catches a different stuck pattern.",
        isOptimal: true,
        feedback:
          "Janelle's combination is right because the failure modes are different. Explicit request catches users who know they need a human. Low confidence catches the AI when it knows it doesn't know. Length-based offer catches conversations that drag without anyone realizing. Each trigger alone has gaps; together they cover the realistic escalation cases.",
      },
      {
        id: "ops-lead",
        role: "Operations Lead",
        name: "Sasha",
        argument:
          "Just explicit request. Users know when they want a human. Don't second-guess them. Anything else is paternalistic.",
        isOptimal: false,
        feedback:
          "Sasha's explicit-only is too narrow. Many users don't know they should ask for a human — they assume the AI can handle it and either give up or get frustrated. The AI knowing 'I don't have a confident answer to this' should escalate proactively. Paternalism cuts both ways: ignoring AI uncertainty is also paternalism.",
      },
      {
        id: "ml-lead",
        role: "ML Lead",
        name: "Sasha",
        argument:
          "Sentiment analysis on user messages. When sentiment turns negative, escalate. The user's emotion is the most reliable signal.",
        isOptimal: false,
        feedback:
          "Sentiment analysis is noisy and lagging. By the time sentiment turns clearly negative, the user has had several frustrating turns. Worse, sentiment varies by personality (some users sound polite when frustrated; others sound annoyed when fine). It's a useful signal as PART of the mix, not as the primary trigger. Multi-signal escalation beats single-signal.",
      },
    ],
    optimalRationale:
      "Combine three signals: explicit user request (immediate), low AI confidence (proactive), and conversation length (offer). Each catches a different stuck pattern. Sentiment analysis can refine the mix but shouldn't be the primary trigger — too noisy and lagging. The combination achieves high recall on actual escalation needs without over-escalating routine conversations.",
    category: "Escalation triggers",
  },
];

// ─── Module 13: Measuring Agent Success (Budget Builder, 5 scenarios) ────────

BUDGET_GAMES_BY_MODULE["measuring-success"] = [
  {
    id: "ms-eval-pipeline",
    title: "Production Eval Pipeline",
    userStory:
      "You're building the eval infrastructure for an AI feature. It needs to score every prompt change against a 500-question golden set, run in CI, and gate releases. The team is building it from scratch this quarter.",
    context:
      "Latency: under 15 minutes per run (developers wait). Quality of judgments: ≥90% agreement with human reviewers. Budget: $1,000/month, ~80 eval runs/month.",
    monthlyBudget: 1000,
    components: [
      {
        id: "candidate-gen",
        name: "Candidate Answer Generator",
        description: "Runs the model under test against all 500 golden questions per release.",
        requestsPerMonth: 40,
      },
      {
        id: "judge",
        name: "LLM-as-Judge",
        description: "Scores each candidate against the golden answer. Needs strong reasoning.",
        requestsPerMonth: 40,
      },
      {
        id: "diff-summarizer",
        name: "Release Diff Summarizer",
        description: "Compares this run's scores to the previous release. Generates a markdown diff posted to the PR.",
        requestsPerMonth: 1,
      },
      {
        id: "regression-classifier",
        name: "Regression Classifier",
        description: "Identifies which test cases regressed and clusters by failure type. Triages bugs.",
        requestsPerMonth: 10,
      },
    ],
    modelTiers: [
      { id: "frontier", name: "Frontier (GPT-4 / Claude Opus)", costPer1k: 30, qualityScore: 95, latencyMs: 3000 },
      { id: "mid", name: "Mid-Tier (GPT-4o-mini / Claude Sonnet)", costPer1k: 5, qualityScore: 82, latencyMs: 1200 },
      { id: "small", name: "Small (GPT-3.5 / Llama 3-8B)", costPer1k: 0.5, qualityScore: 65, latencyMs: 400 },
    ],
    qualityThreshold: 90,
    latencyTarget: 900000, // 15 min batch
    optimizationTip:
      "The judge is the load-bearing component — wrong judgments mean wrong release decisions. Spend frontier-tier here. Candidate generator should match production's actual model (don't downgrade for eval cost). Diff summarizer is a small task — small tier is fine. Regression classifier needs mid-tier (clustering failures requires real reasoning).",
  },
  {
    id: "ms-observability",
    title: "Production AI Observability",
    userStory:
      "Your AI feature is in production. You need observability that tells you what's happening: per-call cost, latency, output quality (sampled), failure modes. Plus an alert system for anomalies.",
    context:
      "Volume: 500K calls/month. Quality sampling target: 5% of calls auto-scored. Anomaly detection runs hourly. Budget: $2,000/month.",
    monthlyBudget: 2000,
    components: [
      {
        id: "log-ingest",
        name: "Log Ingest + Storage",
        description: "Captures every AI call (input, output, metadata). Streams to an analytics DB.",
        requestsPerMonth: 500,
      },
      {
        id: "quality-sampler",
        name: "Quality Sampler (5%)",
        description: "Samples 5% of production outputs. Auto-scores them with LLM-as-judge against rubric.",
        requestsPerMonth: 25,
      },
      {
        id: "anomaly-detector",
        name: "Anomaly Detector",
        description: "Hourly batch: detects unusual quality drops, cost spikes, latency regressions. Alerts on-call.",
        requestsPerMonth: 1,
      },
      {
        id: "failure-classifier",
        name: "Failure Mode Classifier",
        description: "Groups failed/low-quality outputs into failure clusters. Helps prioritize fixes.",
        requestsPerMonth: 5,
      },
    ],
    modelTiers: [
      { id: "frontier", name: "Frontier (GPT-4 / Claude Opus)", costPer1k: 30, qualityScore: 95, latencyMs: 3000 },
      { id: "mid", name: "Mid-Tier (GPT-4o-mini / Claude Sonnet)", costPer1k: 5, qualityScore: 82, latencyMs: 1200 },
      { id: "small", name: "Small (GPT-3.5 / Llama 3-8B)", costPer1k: 0.5, qualityScore: 65, latencyMs: 400 },
    ],
    qualityThreshold: 85,
    latencyTarget: 60000,
    optimizationTip:
      "Log ingest isn't an LLM — budget separately as a small tier. Quality sampler at 5% (25K calls) is the dominant LLM cost — use mid-tier (the judge needs reasoning but not frontier-level). Anomaly detector and failure classifier are infrequent — frontier tier is fine because volume is tiny. Don't sample at 100%; the cost-per-insight curve flattens fast.",
  },
  {
    id: "ms-ab-test",
    title: "A/B Test Instrumentation",
    userStory:
      "You're running an A/B test comparing two prompt versions for an AI feature. Need infrastructure to assign users to arms, capture per-arm outputs, and compute statistical significance over a 2-week test.",
    context:
      "Volume: 100K calls/month, split 50/50 across arms. Quality scoring on 10% of each arm's outputs. Statistical significance computed daily. Budget: $1,500/month.",
    monthlyBudget: 1500,
    components: [
      {
        id: "assignment",
        name: "User Assignment Service",
        description: "Sticky-routes users to A or B based on hash. Logs assignment.",
        requestsPerMonth: 100,
      },
      {
        id: "arm-logger",
        name: "Per-Arm Output Logger",
        description: "Captures full call details (input, output, latency, cost) tagged with arm.",
        requestsPerMonth: 100,
      },
      {
        id: "quality-judge",
        name: "Quality Judge (10% sample)",
        description: "Auto-scores 10% of each arm's outputs. Used to compute quality lift between arms.",
        requestsPerMonth: 10,
      },
      {
        id: "stats-engine",
        name: "Daily Statistics Engine",
        description: "Computes significance, effect size, confidence intervals daily. Outputs a report.",
        requestsPerMonth: 1,
      },
    ],
    modelTiers: [
      { id: "frontier", name: "Frontier (GPT-4 / Claude Opus)", costPer1k: 30, qualityScore: 95, latencyMs: 3000 },
      { id: "mid", name: "Mid-Tier (GPT-4o-mini / Claude Sonnet)", costPer1k: 5, qualityScore: 82, latencyMs: 1200 },
      { id: "small", name: "Small (GPT-3.5 / Llama 3-8B)", costPer1k: 0.5, qualityScore: 65, latencyMs: 400 },
    ],
    qualityThreshold: 88,
    latencyTarget: 60000,
    optimizationTip:
      "Assignment + logger aren't LLMs — small tier is generous. Quality judge at 10% sample is the dominant cost — use mid-tier with a clear rubric. Stats engine is a daily one-off — frontier is fine; the calc itself isn't an LLM call. Don't over-sample for quality; 10% is enough for statistical power on volume this size.",
  },
  {
    id: "ms-feedback-collector",
    title: "User Feedback Collection",
    userStory:
      "You want structured feedback on AI outputs — thumbs up/down, free-text comments, plus an LLM that helps users articulate WHY they didn't like an output. Use the data to improve the model.",
    context:
      "200K AI outputs/month. Expected feedback rate: 5% (10K feedbacks). Of those, ~40% have free text that needs categorization. Budget: $400/month.",
    monthlyBudget: 400,
    components: [
      {
        id: "feedback-ui",
        name: "Feedback Collection UI",
        description: "Thumbs up/down + comment box on every AI output. Backend stores in DB.",
        requestsPerMonth: 200,
      },
      {
        id: "guided-feedback",
        name: "Guided Feedback Prompt",
        description: "When user clicks thumbs-down, brief LLM-driven prompt: 'What was wrong? (a) Inaccurate (b) Off-topic (c) Tone (d) Other'",
        requestsPerMonth: 5,
      },
      {
        id: "categorizer",
        name: "Free-Text Categorizer",
        description: "Categorizes free-text feedback into ~15 issue types. Helps prioritize fixes.",
        requestsPerMonth: 4,
      },
      {
        id: "weekly-digest",
        name: "Weekly Trend Report",
        description: "Summarizes feedback trends, ranks top failure modes, suggests priorities. Posted to Slack.",
        requestsPerMonth: 1,
      },
    ],
    modelTiers: [
      { id: "frontier", name: "Frontier (GPT-4 / Claude Opus)", costPer1k: 30, qualityScore: 95, latencyMs: 3000 },
      { id: "mid", name: "Mid-Tier (GPT-4o-mini / Claude Sonnet)", costPer1k: 5, qualityScore: 82, latencyMs: 1200 },
      { id: "small", name: "Small (GPT-3.5 / Llama 3-8B)", costPer1k: 0.5, qualityScore: 65, latencyMs: 400 },
    ],
    qualityThreshold: 75,
    latencyTarget: 30000,
    optimizationTip:
      "Feedback UI isn't an LLM — small tier (it's just storage). Guided feedback prompt is brief and structured — small tier handles it. Categorizer at 4K calls is the volume — small tier with good few-shot examples works. Weekly digest is the high-leverage step — mid or frontier here. Quality threshold is intentionally lower (75%) because feedback categorization isn't life-critical and human reviewers will spot-check.",
  },
  {
    id: "ms-regression-system",
    title: "Regression Detection System",
    userStory:
      "Your AI feature has shipped. You need a system that catches quality regressions WITHOUT waiting for users to complain. Compare every day's outputs against a baseline.",
    context:
      "Daily batch: replay yesterday's traffic against current model + baseline model. Alert on quality drops >3 points. Budget: $1,200/month, ~30 days/month.",
    monthlyBudget: 1200,
    components: [
      {
        id: "traffic-replay",
        name: "Traffic Replay Engine",
        description: "Captures yesterday's representative inputs (~1K samples). Replays through both current and baseline models.",
        requestsPerMonth: 30,
      },
      {
        id: "baseline-runner",
        name: "Baseline Model Runner",
        description: "Runs the baseline (last known good) model on the same 1K samples. For comparison.",
        requestsPerMonth: 30,
      },
      {
        id: "quality-comparator",
        name: "Quality Comparator (LLM-judge)",
        description: "Pairwise judges current vs baseline on each sample. Computes win rate + average quality score.",
        requestsPerMonth: 30,
      },
      {
        id: "alert-classifier",
        name: "Alert Severity Classifier",
        description: "When quality drops, classifies severity and which test categories regressed. Routes alert to owner.",
        requestsPerMonth: 5,
      },
    ],
    modelTiers: [
      { id: "frontier", name: "Frontier (GPT-4 / Claude Opus)", costPer1k: 30, qualityScore: 95, latencyMs: 3000 },
      { id: "mid", name: "Mid-Tier (GPT-4o-mini / Claude Sonnet)", costPer1k: 5, qualityScore: 82, latencyMs: 1200 },
      { id: "small", name: "Small (GPT-3.5 / Llama 3-8B)", costPer1k: 0.5, qualityScore: 65, latencyMs: 400 },
    ],
    qualityThreshold: 90,
    latencyTarget: 14400000, // 4-hour overnight batch
    optimizationTip:
      "Traffic replay + baseline runner cost the same as production calls (use the production model tier). Quality comparator is the most important — pairwise judging is hard, use frontier. Alert classifier is light — mid is fine. The 90% quality threshold reflects how high the bar is for trustworthy regression detection: a noisy regression alert is worse than no alert because teams stop trusting it.",
  },
];

// ─── Module 15: Your Agentic AI Roadmap (Stakeholder Sim, 5 rounds) ──────────

STAKEHOLDER_GAMES_BY_MODULE["maturity-roadmap"] = [
  {
    id: "rm-where-to-start",
    situation:
      "Your CEO has approved a year-long agentic AI initiative for your B2B SaaS company. You have 6 engineers, ~$2M budget, and 12 months. Three executives want to invest in radically different first projects.",
    tension:
      "Year-one decisions compound. Pick the right starter project and you build momentum + capability. Pick the wrong one and you waste a year proving the wrong thing.",
    stakeholders: [
      {
        id: "ceo",
        role: "CEO",
        name: "Diana",
        argument:
          "Build the moonshot: an autonomous agent that does what 3 of our customer-success roles do. If it works, we transform the business. If it doesn't, we'll have learned a lot.",
        isOptimal: false,
        feedback:
          "Diana's moonshot has a low probability of working in year 1 with 6 engineers and no agentic AI history. It's a $2M lesson with no fallback product. The companies that succeed at agentic AI start with 'augment one workflow' and earn the right to autonomize via demonstrated capability. Moonshots are year 3 work, not year 1.",
      },
      {
        id: "cpo",
        role: "Chief Product Officer",
        name: "Marcus",
        argument:
          "Pick ONE high-volume internal workflow (like ticket triage or data entry). Build an AI co-pilot that does 70% of the work, humans review. Ship in 3 months. Use it as the foundation to learn, then expand.",
        isOptimal: true,
        feedback:
          "Marcus's pitch is the canonical year-1 strategy. High-volume internal workflow has clear success metrics (time saved, throughput), low brand risk (internal users), real customer (your own team), and you keep humans in the loop. You build agentic capability without betting the company. This is how every successful AI-first company started — not with moonshots.",
      },
      {
        id: "cfo",
        role: "CFO",
        name: "Eleanor",
        argument:
          "Don't build. Buy off-the-shelf agentic tools (Glean, Decagon, etc.). Test what works. Save the engineering budget for things you can't buy.",
        isOptimal: false,
        feedback:
          "Eleanor's right that buying validates demand cheaply, but she's wrong that building is unnecessary. Year 1 is when you build the team's capability — prompt engineering, eval, agent design. If you only buy, you have no internal expertise when the buy/build line shifts. Buy for non-strategic workflows (calendaring, doc Q&A); build for the workflows that matter.",
      },
    ],
    optimalRationale:
      "Pick a high-volume internal workflow and ship a 70%-autonomous co-pilot in 3 months. Internal users tolerate iteration. The win is dual: real productivity gains AND the team learns agentic AI on a low-stakes problem. Year 1 is for building capability and earning permission to autonomize, not moonshots.",
    category: "Roadmap starting point",
  },
  {
    id: "rm-build-vs-buy",
    situation:
      "You've identified 6 AI use cases for next year. The team is debating which to build vs buy. Three executives have different stances on the build/buy decision.",
    tension:
      "Build = strategic differentiation, hard to replicate, but expensive. Buy = fast time-to-value, no engineering cost, but you depend on the vendor and can't differentiate.",
    stakeholders: [
      {
        id: "cpo",
        role: "Chief Product Officer",
        name: "Marcus",
        argument:
          "Build the use cases that are core to YOUR product (the ones customers see, that affect your moat). Buy the use cases that are core to your OPERATIONS but not visible (internal docs Q&A, calendar AI, code review co-pilot). Build = customer-facing differentiation; buy = internal productivity.",
        isOptimal: true,
        feedback:
          "Marcus's framing is the right rule of thumb. Anything customer-facing that affects your moat (custom workflows for your domain, your-product-specific intelligence) deserves building — vendors will catch up but starting first matters. Anything that's commodity productivity (Q&A over docs, code completion) is buy — vendors will be better than you can be. The framework: build where you have data + domain advantage; buy where you don't.",
      },
      {
        id: "cto",
        role: "CTO",
        name: "Priya",
        argument:
          "Build everything. Vendors lock you in, change pricing, get acquired. Owning your AI stack means owning your future. Yes, it's more expensive in year 1 — but in year 3 we own a moat.",
        isOptimal: false,
        feedback:
          "Priya's right that vendor risk is real, but building everything spreads the team across too many projects. You'll have 6 mediocre AI capabilities instead of 2 excellent ones. The right discipline is to build the 1-2 things that are strategic AND buy the 4-5 that aren't. Building everything is how AI initiatives die from over-scope.",
      },
      {
        id: "cfo",
        role: "CFO",
        name: "Eleanor",
        argument:
          "Buy everything. Building AI is expensive and risky in year 1. Vendors are mature enough now. Use the engineering budget for things AI can't replace.",
        isOptimal: false,
        feedback:
          "Eleanor's right that vendors are increasingly viable, but buying everything means having no internal AI capability. When a strategic moment arrives — a competitor builds something specific that wins their customers — you have no team that can respond. Internal AI capability is a strategic asset that buying-everything actively prevents.",
      },
    ],
    optimalRationale:
      "Build the customer-facing, moat-affecting use cases (where your data + domain matter). Buy the internal productivity use cases (commodity AI like docs Q&A, code review). The framework: build where you have advantage; buy where you don't. This focuses engineering on differentiation and accepts vendor leverage on commodity work.",
    category: "Build vs buy",
  },
  {
    id: "rm-team-structure",
    situation:
      "Your AI initiative is growing. You're hiring 4 more engineers. The team is debating organization: dedicated AI team, AI engineers embedded in product squads, or a center-of-excellence model that supports both?",
    tension:
      "Dedicated AI team = deep specialization, clear ownership, but creates 'us vs them' with product. Embedded = product-aware AI, but no shared learning. Center-of-excellence = shared learning, but adds coordination overhead.",
    stakeholders: [
      {
        id: "cto",
        role: "CTO",
        name: "Priya",
        argument:
          "Hybrid: small core AI team (3-4 engineers) for shared infrastructure, evals, model decisions. The other engineers embed in product squads where they need to ship AI features. Core team supports embedded engineers; embedded engineers ship features.",
        isOptimal: true,
        feedback:
          "Priya's hybrid is the production-tested pattern. Pure dedicated teams ship great prototypes that don't integrate with the actual product. Pure embedded creates 6 different prompt-engineering practices and no shared evals. Hybrid combines the strengths: shared infrastructure + evaluation discipline from the core, real product integration from the embedded. Most successful AI-first orgs land here.",
      },
      {
        id: "vp-eng",
        role: "VP Engineering",
        name: "Sasha",
        argument:
          "All-in on dedicated AI team. Build a 7-person AI org that owns every AI feature. Product squads request capabilities; AI team builds them. Clean ownership.",
        isOptimal: false,
        feedback:
          "Sasha's dedicated team creates the worst dynamic in AI: features ship that the product team didn't help design and don't fully understand. The AI team optimizes for technical elegance; product loses ownership of the user experience. 'Clean ownership' on paper, fragmented experience for users.",
      },
      {
        id: "head-product",
        role: "Head of Product",
        name: "Renata",
        argument:
          "Pure embedded — AI engineers join product squads, no core team. Each squad owns its AI end-to-end including infrastructure choices. Maximum product autonomy.",
        isOptimal: false,
        feedback:
          "Renata's pure embedded approach guarantees three different vector DBs, two prompt-eval frameworks, and zero shared learning. Each squad re-invents AI infrastructure poorly. The premium for shared evals + infrastructure is real and only a small core team can provide it. Pure embedded scales technical debt linearly with team count.",
      },
    ],
    optimalRationale:
      "Hybrid: small core AI team owns shared infrastructure (evals, prompt management, model choices, observability). Embedded AI engineers in product squads own feature delivery. Core supports embedded; embedded ships product. This combines specialized depth with product integration. Pure dedicated teams ship disconnected; pure embedded fragments infrastructure.",
    category: "Team structure",
  },
  {
    id: "rm-risk-appetite",
    situation:
      "Your AI feature is ready for launch. The team is debating rollout strategy: full launch to all users, gradual rollout (5% → 25% → 100%), or beta-only behind opt-in. Each represents a different risk appetite.",
    tension:
      "Full launch maximizes learning speed and demonstrates confidence. Gradual rollout reduces blast radius. Beta-only minimizes risk but slows adoption.",
    stakeholders: [
      {
        id: "growth",
        role: "VP of Growth",
        name: "Maya",
        argument:
          "Full launch. The market is moving fast. Bold launches define brand momentum. Show the world you're shipping serious AI.",
        isOptimal: false,
        feedback:
          "Maya's bold launch is right ONLY if you're sure the feature works at scale. With AI, scale reveals failure modes that controlled testing missed (edge cases in real prompts, cost spikes at volume, latency under load). One viral failure on launch day defines the feature for months. Bold launches are for confidence built through gradual rollout, not for de novo confidence.",
      },
      {
        id: "vp-eng",
        role: "VP Engineering",
        name: "Sasha",
        argument:
          "Gradual rollout: 5% for one week, watch metrics, expand to 25%, watch again, then 100%. Each gate is real — we hold if metrics go sideways. The discipline matters.",
        isOptimal: true,
        feedback:
          "Sasha's gradual rollout is the production-mature pattern for AI. 5% gives you real production signal at limited blast radius. The gate metrics (quality samples, cost per call, latency, support tickets) tell you if the next expansion is safe. Gates that are real (sometimes you HOLD at 5%) build credibility. The 3-week timeline is fast enough; the discipline is the asset.",
      },
      {
        id: "cpo",
        role: "Chief Product Officer",
        name: "Marcus",
        argument:
          "Beta opt-in only. Power users who opt in expect rough edges. Iterate based on their feedback. Wait until polish is high before broader rollout.",
        isOptimal: false,
        feedback:
          "Marcus's opt-in beta is appropriate for some features but slow for AI. Beta users self-select — they're tolerant, technical, and have unrepresentative usage patterns. You'll get great signal on edge cases and miss the failure modes that occur with general users. Gradual rollout to representative samples beats opt-in beta for production AI confidence.",
      },
    ],
    optimalRationale:
      "Gradual rollout (5% → 25% → 100%) with real gates between each step. Each gate is metrics-based and you hold if metrics go sideways. This balances learning speed with blast-radius control. Bold launches are for retroactive confidence; opt-in betas are too slow and unrepresentative. Gradual rollout with discipline is how mature AI products ship.",
    category: "Rollout risk appetite",
  },
  {
    id: "rm-sequencing",
    situation:
      "You have 3 high-priority AI projects for next year. The team is debating whether to build them sequentially (one at a time, learning from each), in parallel (faster, but less learning), or sequenced based on dependencies (some need to ship before others).",
    tension:
      "Sequential = safest, slowest. Parallel = fastest, no shared learning. Dependency-sequenced = fastest path to total value but requires planning.",
    stakeholders: [
      {
        id: "head-product",
        role: "Head of Product",
        name: "Renata",
        argument:
          "Dependency-sequenced. Project A (eval infrastructure) is a prereq for B (feature 1) and C (feature 2). Build A first, then B and C in parallel — they share infrastructure. Total time: 9 months instead of 12 sequential or 7 parallel-but-fragile.",
        isOptimal: true,
        feedback:
          "Renata's dependency-sequencing is the right discipline. Eval infrastructure is the load-bearing prerequisite for any reliable AI feature work. Building it once and reusing across two parallel features is faster AND more reliable than building features in parallel without shared eval. The 9-month timeline reflects real engineering reality: shared infrastructure compounds value across projects.",
      },
      {
        id: "vp-eng",
        role: "VP Engineering",
        name: "Sasha",
        argument:
          "Parallel — split the team into 3 pods, ship all 3 by Q4. Speed matters. Each pod owns end-to-end. Maximum throughput.",
        isOptimal: false,
        feedback:
          "Sasha's pure parallelism guarantees 3 incompatible eval frameworks, 3 different observability setups, and 3 sets of architectural mistakes. The first project to need to leverage another's work hits a wall. Pure parallelism in AI is faster on paper, slower in reality once you account for infrastructure debt and rework.",
      },
      {
        id: "cto",
        role: "CTO",
        name: "Priya",
        argument:
          "Sequential. Ship project 1 fully, learn, ship project 2 with the lessons, ship project 3. Slow but every project benefits from the previous one's learning.",
        isOptimal: false,
        feedback:
          "Priya's sequential approach is too conservative. Most AI infrastructure (evals, observability, prompt management) doesn't need to be SHIPPED before reuse — it just needs to EXIST. Building it as part of project 1 then reusing in projects 2 and 3 (via dependency-sequencing) gets the learning AND the speed. Pure sequential leaves time on the table.",
      },
    ],
    optimalRationale:
      "Dependency-sequence the projects: identify shared infrastructure (eval, observability, prompt management), build it once as part of the highest-leverage project, then parallelize the dependent projects with that shared base. Pure parallelism creates infrastructure debt; pure sequential is too slow. Dependency-sequencing combines the benefits of both.",
    category: "Project sequencing",
  },
];

