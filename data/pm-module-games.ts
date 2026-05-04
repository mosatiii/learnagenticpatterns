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
