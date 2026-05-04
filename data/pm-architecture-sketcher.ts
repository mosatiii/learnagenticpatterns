/**
 * Architecture Sketcher game — type + content.
 *
 * Mechanic: see a use case. Pool of architecture blocks (Router, RAG, Tool Use,
 * Reflection, Guardrails, Eval, Caching, Memory, Human-in-Loop, etc.). Pick
 * 4-7 and order them. Score = coverage (right blocks present) + ordering
 * correctness vs expert architecture.
 *
 * Each block has a `role` field: "must-have" / "nice-to-have" / "wrong" for
 * this scenario. Picking must-haves earns full points, nice-to-haves earn
 * partial, wrongs subtract. Ordering matters when expert ordering is
 * specified (data dependencies must precede consumers).
 */

export interface ArchBlock {
  id: string;
  /** Short label shown on the chip. */
  label: string;
  /** What this architectural piece does. */
  description: string;
}

export interface ArchScenarioBlockRole {
  blockId: string;
  /** must-have: needed for the scenario. nice-to-have: helpful but optional. wrong: distractor that doesn't fit. */
  role: "must-have" | "nice-to-have" | "wrong";
  /** Why this block belongs (or doesn't) in this architecture. */
  rationale: string;
  /**
   * Expert ordering rank (1 = first in flow, 2 = second, etc.). Only set on
   * must-have blocks. Used to score ordering accuracy.
   */
  expertOrder?: number;
}

export interface ArchScenario {
  id: string;
  useCase: string;
  context: string;
  /** Pool of all blocks the player can choose from. Same pool used per scenario. */
  blockPool: ArchBlock[];
  /** Per-block roles for THIS scenario. */
  blockRoles: ArchScenarioBlockRole[];
  /** Wrap-up explaining the architectural pattern this scenario teaches. */
  designLesson: string;
  category: string;
}

// ─── Shared block pool (used across all scenarios in this format) ────────────

export const ARCH_BLOCK_POOL: ArchBlock[] = [
  { id: "router", label: "Router", description: "Classifies input and routes to one of N specialist paths." },
  { id: "rag", label: "RAG Retrieval", description: "Embeds the query, retrieves top-K relevant docs from a vector index." },
  { id: "reranker", label: "Reranker", description: "Cross-encoder that re-ranks the top-K retrieved chunks for precision." },
  { id: "tools", label: "Tool Use", description: "Agent can invoke external APIs (CRM, calendar, DB) via function calling." },
  { id: "reflection", label: "Reflection", description: "After generating, the model critiques and revises its own output." },
  { id: "guardrails", label: "Guardrails (input/output filter)", description: "Pre-generation input filter + post-generation output filter for safety." },
  { id: "eval", label: "Eval / LLM-as-Judge", description: "Scores production outputs against a rubric — for monitoring or gating." },
  { id: "cache", label: "Response Cache", description: "Caches responses for repeated identical or similar queries." },
  { id: "memory", label: "Long-term Memory", description: "Persists user-stated preferences across sessions, retrieved into context." },
  { id: "hil", label: "Human-in-Loop Approval", description: "High-stakes actions queue for human approval before execution." },
  { id: "fallback", label: "Confidence Fallback", description: "Low-confidence outputs escalate to a stronger model or human." },
  { id: "supervisor", label: "Supervisor / Orchestrator", description: "Top-level agent that decides which specialist agent to invoke." },
];

// ─── Module 10 (Multi-Agent Teams) — 5 scenarios ─────────────────────────────

export const archScenariosByModule: Record<string, ArchScenario[]> = {
  "multi-agent-teams": [
    {
      id: "as-customer-support",
      useCase: "Customer support multi-agent system: triage + billing + technical specialists, handles ~50K conversations/day",
      context:
        "Tier-1 support. Money-moving actions (refunds) possible. Strict SLA on response time. Wrong actions create real financial liability.",
      blockPool: ARCH_BLOCK_POOL,
      blockRoles: [
        {
          blockId: "supervisor",
          role: "must-have",
          rationale: "Multi-agent systems with specialists need a supervisor to route, coordinate, and provide a single source of truth for control flow. Without it, you get the 'flat multi-agent' anti-pattern: emergent behavior that's hard to debug.",
          expertOrder: 1,
        },
        {
          blockId: "router",
          role: "wrong",
          rationale: "Distractor for this scenario — the supervisor pattern subsumes routing. Adding a separate router IN ADDITION to the supervisor creates two control points and confused responsibility. Pick supervisor OR router, not both.",
        },
        {
          blockId: "rag",
          role: "must-have",
          rationale: "Specialists need access to the company's help docs and policies. Without RAG, agents hallucinate policy answers, which in support is the worst failure mode (wrong refund policy, wrong cancellation terms).",
          expertOrder: 2,
        },
        {
          blockId: "tools",
          role: "must-have",
          rationale: "Billing specialist needs to call the billing API; tech support needs to read customer logs. Tool use is the difference between an info chatbot and a real support agent.",
          expertOrder: 3,
        },
        {
          blockId: "hil",
          role: "must-have",
          rationale: "Money-moving actions (refunds, cancellations, account deletions) need human approval. Auto-issuing $500 refunds based on agent judgment is how AI products lose customer trust permanently.",
          expertOrder: 4,
        },
        {
          blockId: "guardrails",
          role: "nice-to-have",
          rationale: "Helpful for tone/PII filtering at scale, but the bigger risks (wrong actions, bad policy answers) are addressed by RAG + HIL. Worth adding once those are in place.",
          expertOrder: 5,
        },
        {
          blockId: "reranker",
          role: "nice-to-have",
          rationale: "Improves RAG quality from ~70% → 85% on retrieval. Worth adding for production support where wrong-answer cost is high. Not strictly required but a high-ROI addition.",
        },
        {
          blockId: "fallback",
          role: "nice-to-have",
          rationale: "When the agent's confidence is low (e.g., complex billing question), escalate to a stronger model or human. Cuts edge-case failures without blocking the bulk path.",
        },
        {
          blockId: "memory",
          role: "wrong",
          rationale: "Distractor. Customer support is mostly STATELESS — each ticket is a fresh interaction. Long-term memory adds privacy risk and complexity for marginal value (memory of previous tickets is in the CRM, not in the AI's memory layer). Skip.",
        },
        {
          blockId: "reflection",
          role: "wrong",
          rationale: "Doubles latency and cost. Customer support has tight SLAs; reflection is a quality-vs-speed tradeoff that doesn't fit. Use for slower-moving content (emails, reports), not real-time chat.",
        },
        {
          blockId: "cache",
          role: "wrong",
          rationale: "Customer support queries are too contextual (specific customer, specific account, specific issue) to benefit from response caching. Caching helps when the same INPUT recurs — rarely true for real conversations.",
        },
        {
          blockId: "eval",
          role: "nice-to-have",
          rationale: "Should exist for production monitoring (sample 5% of outputs, score for quality drift). Not part of the user-facing flow but operationally critical. Worth including in any production architecture.",
        },
      ],
      designLesson:
        "Production customer support architecture: supervisor + RAG + tools + HIL is the load-bearing core. Reflection and caching don't fit because they trade quality/cost for latency/staleness in a low-tolerance domain. The PM lesson: every architectural block has constraints — supervisor for debuggability, RAG for grounded answers, tools for real actions, HIL for sensitive ones. Forgetting any of those is the difference between a demo and production.",
      category: "Customer-facing multi-agent",
    },
    {
      id: "as-research-agent",
      useCase: "Research agent that produces ~3-page reports on topics by autonomously searching, reading, and synthesizing sources",
      context:
        "Internal tool for strategy team. Async — runs for minutes per report. Quality matters more than speed. Reports inform real decisions; hallucinated facts are catastrophic.",
      blockPool: ARCH_BLOCK_POOL,
      blockRoles: [
        {
          blockId: "supervisor",
          role: "must-have",
          rationale: "Research is multi-step (plan → search → read → synthesize → verify). A planner/supervisor decomposes the task, decides which sub-agent to invoke when, and assembles the final output. Without it, the agent loses focus mid-research.",
          expertOrder: 1,
        },
        {
          blockId: "tools",
          role: "must-have",
          rationale: "Search APIs, web fetchers, internal-docs APIs — the agent needs to actually retrieve information from the world. The 'research' part of research agent.",
          expertOrder: 2,
        },
        {
          blockId: "rag",
          role: "must-have",
          rationale: "Internal company docs and prior reports should be retrievable so the agent doesn't reinvent or contradict prior work. RAG over your own knowledge base is the difference between a useful research agent and one that lives in vacuum.",
          expertOrder: 3,
        },
        {
          blockId: "reflection",
          role: "must-have",
          rationale: "After drafting the report, the agent should critique it (does this support the claim? are there contradictions?) and revise. For multi-source synthesis, reflection cuts the hallucination rate substantially. Worth the latency cost in async work.",
          expertOrder: 4,
        },
        {
          blockId: "fallback",
          role: "nice-to-have",
          rationale: "When confidence on a key fact is low, fall back to citing it as 'unverified' or escalating to a human reviewer. Real research has 'I'm not sure' as a valid answer.",
        },
        {
          blockId: "eval",
          role: "nice-to-have",
          rationale: "For monitoring — sample reports, score for citation accuracy, claim grounding, source quality. Operationally critical but not in the user-facing flow.",
        },
        {
          blockId: "router",
          role: "wrong",
          rationale: "Research is sequential, not branched. There's no 'route to one of N paths' decision — the supervisor coordinates, the tools fetch, the synthesizer writes. Adding a router conflates control flow.",
        },
        {
          blockId: "guardrails",
          role: "nice-to-have",
          rationale: "PII filtering on inputs (don't research individuals without consent), citation requirements on outputs. Less critical than the core pipeline but worth adding for compliance.",
        },
        {
          blockId: "hil",
          role: "wrong",
          rationale: "For an internal research tool, requiring human approval kills the value (the human approves what the AI just researched — at which point why have the AI?). Use for action-taking agents, not synthesis ones.",
        },
        {
          blockId: "memory",
          role: "wrong",
          rationale: "Research is per-task, not per-user. The agent doesn't need to remember 'last week you researched X.' Caching of source content has merit but that's the cache block, not memory.",
        },
        {
          blockId: "cache",
          role: "nice-to-have",
          rationale: "Source content can be cached (don't re-fetch the same URL). Final reports cannot (no two reports are identical). Useful at the tools layer, not the response layer.",
        },
        {
          blockId: "reranker",
          role: "nice-to-have",
          rationale: "Pairs with RAG to improve retrieval quality. Helpful for the internal-docs RAG step. Same logic as customer support: high-ROI add when retrieval quality matters.",
        },
      ],
      designLesson:
        "Research agents: supervisor + tools + RAG + reflection is the core pattern. Reflection earns its keep here (unlike support) because async + quality-focused workflows can afford the latency cost. HIL doesn't fit because the human approving research nullifies the agent's value. The PM lesson: architecture choices flow from workflow shape (sync vs async, customer vs internal, decision-support vs action-taking).",
      category: "Synthesis / async multi-agent",
    },
    {
      id: "as-coding-assistant",
      useCase: "Coding assistant integrated into the IDE — autocomplete, code review on PRs, bug-fix suggestions",
      context:
        "Developer-facing. ~1M code-completion requests/day, ~50K PR-comment requests/day. Latency-sensitive (autocomplete needs <300ms). Quality matters but devs review every output.",
      blockPool: ARCH_BLOCK_POOL,
      blockRoles: [
        {
          blockId: "router",
          role: "must-have",
          rationale: "Three different use cases (autocomplete, PR review, bug fix) need different model tiers and prompts. Router classifies the request type and dispatches. Without it, you'd run autocomplete with the slow PR-review model or vice versa.",
          expertOrder: 1,
        },
        {
          blockId: "cache",
          role: "must-have",
          rationale: "Code completion has massive cache hit rates — common patterns (`for i in range(`, `if __name__`, etc.) repeat constantly. Even partial-match caching slashes costs and latency. The single highest-ROI block for this use case.",
          expertOrder: 2,
        },
        {
          blockId: "rag",
          role: "must-have",
          rationale: "Codebase-aware suggestions need RAG over the project's existing files (function signatures, types, conventions). Without it, the AI suggests code that doesn't fit the project. RAG is what makes 'AI that knows YOUR codebase' actually true.",
          expertOrder: 3,
        },
        {
          blockId: "fallback",
          role: "nice-to-have",
          rationale: "For complex bug fixes where the cheap fast model is uncertain, escalate to a stronger model. The bulk of requests stay fast/cheap; the genuinely hard ones get the firepower.",
        },
        {
          blockId: "guardrails",
          role: "must-have",
          rationale: "Filter against secrets-in-code (API keys in suggestions), license-conflicting code, and known-vulnerable patterns. Specific to coding assistants: prevent suggesting code that would introduce CVEs.",
          expertOrder: 4,
        },
        {
          blockId: "tools",
          role: "wrong",
          rationale: "Autocomplete and PR review don't need to call external APIs — they need to read code. Tool use here is over-architecture; reading the codebase is a RAG concern, not a tool concern. Don't conflate.",
        },
        {
          blockId: "supervisor",
          role: "wrong",
          rationale: "Single-step suggestions don't need multi-agent coordination. Supervisor is for systems where multiple specialists collaborate; an autocomplete is one model doing one thing fast.",
        },
        {
          blockId: "reflection",
          role: "wrong",
          rationale: "Doubles latency on a feature that lives or dies by being <300ms. Reflection on autocomplete makes the feature unusable. Save for slower workflows (PR review can afford it; autocomplete cannot).",
        },
        {
          blockId: "memory",
          role: "wrong",
          rationale: "Per-developer memory of past code is interesting but doesn't fit autocomplete's latency budget. Codebase context (RAG) is the relevant 'memory' here, not user preferences.",
        },
        {
          blockId: "hil",
          role: "wrong",
          rationale: "The developer IS the human in the loop — every suggestion is reviewed before acceptance. Adding a separate approval step is double-checking. The accept/reject keystroke IS the HIL.",
        },
        {
          blockId: "eval",
          role: "nice-to-have",
          rationale: "Ship/no-ship gating via eval suite is critical here because suggestion quality directly affects developer trust. Sample acceptance rates as the primary signal.",
        },
        {
          blockId: "reranker",
          role: "nice-to-have",
          rationale: "Codebase RAG benefits from reranking — surface the most-relevant function signatures first. Adds 50-100ms which is acceptable on PR review, marginal on autocomplete.",
        },
      ],
      designLesson:
        "Coding assistants: router + cache + RAG + guardrails. Cache is the dominant pattern (highest ROI in the stack); router enables differential treatment per request type. Reflection and HIL don't fit because the developer reviews everything inline. The PM lesson: latency-sensitive AI products have very different architecture shapes than quality-sensitive ones — don't import patterns from one into the other.",
      category: "Latency-critical AI",
    },
    {
      id: "as-rag-knowledge",
      useCase: "Internal knowledge-base AI: employees ask questions, AI answers from company docs (HR policies, eng wiki, product docs)",
      context:
        "All employees. ~10K queries/day. Trust matters more than speed (people will wait 3 seconds for a correct answer). Wrong policy answers create real liability.",
      blockPool: ARCH_BLOCK_POOL,
      blockRoles: [
        {
          blockId: "rag",
          role: "must-have",
          rationale: "The product IS RAG over the internal corpus. Without retrieval, the AI either hallucinates company policy or refuses to answer. Foundational.",
          expertOrder: 1,
        },
        {
          blockId: "reranker",
          role: "must-have",
          rationale: "Critical for internal docs where similar topics span many docs (HR policy version A vs B vs C). Reranker boosts retrieval precision from 70% to 90%+. Without it, the AI surfaces the wrong version of a policy.",
          expertOrder: 2,
        },
        {
          blockId: "guardrails",
          role: "must-have",
          rationale: "Filter for PII (employee names in queries), confidential-doc classification (this AI shouldn't surface board materials to ICs), and citation requirements. Compliance-load-bearing.",
          expertOrder: 3,
        },
        {
          blockId: "fallback",
          role: "nice-to-have",
          rationale: "When the AI's answer doesn't ground well in retrieved docs (low citation confidence), fall back to 'I'm not sure — check with HR'. Better than confidently wrong.",
        },
        {
          blockId: "cache",
          role: "must-have",
          rationale: "Internal-docs queries cluster heavily ('what's our PTO policy?' asked 50 times/week). Caching responses for popular queries cuts costs and latency for the common case. Cache is high-ROI for repeating-question patterns.",
          expertOrder: 4,
        },
        {
          blockId: "eval",
          role: "must-have",
          rationale: "When source docs change (HR updates a policy), the cached AND uncached answers can drift from truth. Production eval is essential to catch this. Should be wired into the doc-update pipeline.",
          expertOrder: 5,
        },
        {
          blockId: "tools",
          role: "wrong",
          rationale: "RAG over docs is the answer, not external tool use. Adding tools (e.g., 'call the HRIS') over-engineers and creates more failure surfaces than RAG-only.",
        },
        {
          blockId: "supervisor",
          role: "wrong",
          rationale: "Single-step Q&A doesn't need multi-agent coordination. Supervisor is for systems with specialists; this is one model retrieving and synthesizing.",
        },
        {
          blockId: "router",
          role: "nice-to-have",
          rationale: "Could route HR questions vs Eng-wiki questions to different RAG corpora for precision. Worth adding once the basic system works; not foundational.",
        },
        {
          blockId: "reflection",
          role: "nice-to-have",
          rationale: "Cuts hallucination rate by 5-10 points at the cost of doubling latency. Worth it for high-stakes answers (HR policy); skip for quick lookups (where's the lunch room).",
        },
        {
          blockId: "memory",
          role: "wrong",
          rationale: "Corporate Q&A is mostly stateless. Memory of 'this user asked about parental leave last week' is creepy and doesn't help the next answer. Skip.",
        },
        {
          blockId: "hil",
          role: "wrong",
          rationale: "Q&A is read-only — no action being taken that needs approval. HIL fits action-taking systems, not info systems.",
        },
      ],
      designLesson:
        "Internal knowledge bases: RAG + reranker + cache + eval is the production pattern. Cache is underweighted by most teams; for repeating-question patterns it's the highest-leverage cost reducer. The PM lesson: RAG-based products often look 'just like RAG' but production-quality ones layer reranker (precision) + cache (cost) + eval (drift detection) on top of basic RAG. Each layer addresses a specific failure mode.",
      category: "Knowledge / RAG-centric",
    },
    {
      id: "as-content-pipeline",
      useCase: "Content moderation pipeline: AI reviews user-generated content (posts, comments, images) and flags policy violations",
      context:
        "Consumer social product. ~5M items/day. Latency: under 500ms (real-time pre-publish). Quality: high (false positives anger creators, false negatives let harmful content through). Liability is the constraint.",
      blockPool: ARCH_BLOCK_POOL,
      blockRoles: [
        {
          blockId: "router",
          role: "must-have",
          rationale: "Different content types (text, image, video) need different specialist classifiers. Router dispatches by content type. Without it, you'd run image moderation on text inputs.",
          expertOrder: 1,
        },
        {
          blockId: "guardrails",
          role: "must-have",
          rationale: "The product IS guardrails — the entire pipeline exists to apply policy filters. Pre + post checks layered: input hash matching against known-bad content, output flag classification, severity scoring.",
          expertOrder: 2,
        },
        {
          blockId: "fallback",
          role: "must-have",
          rationale: "Edge cases (artistic nudity, satirical violence, contextual hate speech) where the classifier's confidence is low must escalate to human review. Without fallback, you either block too much (false positive flood) or let too much through (PR crisis).",
          expertOrder: 3,
        },
        {
          blockId: "hil",
          role: "must-have",
          rationale: "High-stakes flags (account bans, content removal) need human approval. Auto-banning users on AI judgment is how social products lose creator trust en masse. HIL on irreversible actions, AI auto-decides on reversible ones.",
          expertOrder: 4,
        },
        {
          blockId: "cache",
          role: "must-have",
          rationale: "The same image gets uploaded thousands of times. Hash-based caching of moderation decisions (hash → already-moderated decision) is a 100x speedup for re-uploads. Critical for scale.",
          expertOrder: 5,
        },
        {
          blockId: "eval",
          role: "must-have",
          rationale: "Adversaries adapt; policy interpretations drift; new content patterns emerge. Continuous eval against a held-out test set + human-labeled adversarial samples is non-negotiable for production moderation.",
          expertOrder: 6,
        },
        {
          blockId: "supervisor",
          role: "wrong",
          rationale: "Distractor. The router + per-type specialists already provide coordination; adding a supervisor on top creates two control layers. Multi-agent supervisor is for collaborative reasoning, not parallel classification.",
        },
        {
          blockId: "rag",
          role: "wrong",
          rationale: "Moderation isn't a 'look up the answer' task. Policies are baked into model fine-tuning + classifier rules, not retrieved per query. RAG over policy docs is over-architecture and slow.",
        },
        {
          blockId: "reranker",
          role: "wrong",
          rationale: "No retrieval to rerank — moderation is classification, not search. Including reranker confuses the architecture.",
        },
        {
          blockId: "tools",
          role: "wrong",
          rationale: "Moderation classifies content; it doesn't take external actions during the flow. Tool use is for agent systems that DO things, not classifier pipelines.",
        },
        {
          blockId: "reflection",
          role: "wrong",
          rationale: "Latency-prohibitive. 5M items/day at 500ms latency budget can't afford reflection's 2x cost. Quality is gated by the eval pipeline (offline), not per-call reflection.",
        },
        {
          blockId: "memory",
          role: "wrong",
          rationale: "Per-user moderation memory creates bias loops (a flagged user gets more flags). Use static reputation scores or trust-and-safety review queues, not memory layers.",
        },
      ],
      designLesson:
        "Moderation pipelines: router + guardrails + fallback + HIL + cache + eval. Six blocks because each addresses a specific safety failure mode. Notably absent: RAG, reflection, tools, supervisor — all are over-architecture for a classification task. The PM lesson: classification systems have very different shapes than agent systems; importing agent patterns (multi-agent, reflection, tool use) into classification adds cost and latency without value.",
      category: "Classification / safety pipeline",
    },
  ],
};

export function getArchSketcherGameFor(moduleSlug: string): ArchScenario[] | null {
  const scenarios = archScenariosByModule[moduleSlug];
  return scenarios && scenarios.length > 0 ? scenarios : null;
}
