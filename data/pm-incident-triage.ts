/**
 * Incident Triage game — type + content.
 *
 * Mechanic: player sees an incident report (symptoms, logs, metrics),
 * picks the most likely root cause from 4 plausible options. Each wrong
 * option is a realistic misdiagnosis. Reveals expert reasoning after submit.
 */

export interface DiagnosisOption {
  id: string;
  label: string;
  /** What the diagnosis claims is happening. */
  hypothesis: string;
  isCorrect: boolean;
  /** Why this diagnosis is right or wrong. */
  feedback: string;
}

export interface IncidentScenario {
  id: string;
  /** One-line incident headline. */
  headline: string;
  /** Production context — who's affected, when it started, severity. */
  context: string;
  /** Concrete symptoms the player is given to diagnose. */
  symptoms: string[];
  /** Snippets of logs, metrics, user reports — the "evidence". */
  evidence: { label: string; content: string }[];
  options: DiagnosisOption[];
  /** Wrap-up: what the right move is once you have the diagnosis. */
  resolution: string;
  category: string;
}

// ─── Module 14 (LLMOps & Production) — 5 scenarios ───────────────────────────

export const incidentScenariosByModule: Record<string, IncidentScenario[]> = {
  "llmops-production": [
    {
      id: "it-cost-spike",
      headline: "AI feature cost tripled overnight — no traffic increase",
      context:
        "Production AI assistant has been running stable at $40/day for 2 months. Yesterday's bill: $128. Traffic volume on Datadog is unchanged. Pages on-call. Severity: P1 (budget alert fired).",
      symptoms: [
        "Daily LLM API spend jumped from $40 → $128 with no deploy in 48 hours",
        "Request count is unchanged (~12K/day)",
        "P50 latency is up from 1.4s → 4.2s",
        "User reports of 'AI is slower today' starting to come in",
      ],
      evidence: [
        {
          label: "OpenAI dashboard breakdown",
          content:
            "Last 7 days: input tokens 14M → 14M (flat). OUTPUT tokens 3M → 9.8M (3.2x). No model changes.",
        },
        {
          label: "Sample recent log",
          content:
            "User: 'reset password please' → Assistant: [response of 8,400 tokens explaining password reset, security best practices, common pitfalls, alternative methods, related FAQs, and next steps...]",
        },
        {
          label: "Recent change log",
          content:
            "No code deploys. ConfigMap updated 2 days ago: max_output_tokens raised from 800 → 4096 for 'less truncated responses'.",
        },
      ],
      options: [
        {
          id: "model-issue",
          label: "Underlying model changed (vendor pushed a regression)",
          hypothesis: "OpenAI silently shipped a model update that produces longer responses.",
          isCorrect: false,
          feedback:
            "Tempting to blame the vendor, but the evidence points elsewhere: input tokens are flat, output tokens 3x'd, and there's a recent config change literally raising the output ceiling. Vendor changes would also affect input/output ratios in unpredictable ways. The cause is in your config, not theirs.",
        },
        {
          id: "config-change",
          label: "Recent ConfigMap change raised max_output_tokens",
          hypothesis:
            "Two days ago you raised max_output_tokens from 800 to 4096. Model is now producing the longer responses it's allowed to. Cost is proportional to output tokens.",
          isCorrect: true,
          feedback:
            "Correct. Output tokens 3.2x'd from a config change that gave the model permission to be verbose. The 8,400-token response to 'reset password please' is the smoking gun — that's a model with no length constraint generating everything it could think of. Roll back the ConfigMap or add explicit length instructions in the system prompt.",
        },
        {
          id: "prompt-injection",
          label: "Prompt-injection attack inflating responses",
          hypothesis:
            "Someone is sending malicious prompts that cause the AI to generate enormous responses.",
          isCorrect: false,
          feedback:
            "Possible but inconsistent with the evidence. Prompt-injection attacks usually show up as anomalous INPUT patterns or specific user accounts driving cost spikes. Here the increase is uniform across users and the input volume is flat. Plus a real injection attack would also show up in user reports of weird behavior, not just slowness.",
        },
        {
          id: "cache-miss",
          label: "Caching layer broke — every request hitting the model fresh",
          hypothesis:
            "Previously cached responses now bypass cache, so every request is a fresh LLM call.",
          isCorrect: false,
          feedback:
            "If this were the cause, INPUT tokens would also jump (cached responses skip tokenizing the input again). But input tokens are flat. Cache misses produce input AND output token increases together; you're seeing only output. Wrong diagnosis.",
        },
      ],
      resolution:
        "Roll back the ConfigMap. Add an explicit instruction in the system prompt ('Keep responses under 200 words unless asked for detail'). Set up a per-call cost budget alert that fires on individual outliers, not just daily totals. The deeper lesson: configuration changes that seem benign (raising a limit, not lowering one) can produce gradual cost regressions that take days to notice without per-call observability.",
      category: "Cost regression",
    },
    {
      id: "it-quality-drift",
      headline: "User satisfaction dropped 18% week-over-week",
      context:
        "AI customer-support bot. Quality metric: thumbs-up/down on resolved tickets. Past 4 weeks: 82% positive. This week: 64% positive. No major code changes. Volume normal. Pages on-call.",
      symptoms: [
        "Thumbs-up rate dropped 18 points week-over-week",
        "Free-text complaints mention 'wrong info' and 'this didn't work'",
        "No latency change, no cost change",
        "Staging environment shows normal quality on the eval set",
      ],
      evidence: [
        {
          label: "Sample bad responses (this week)",
          content:
            "User: 'how do I cancel my subscription?' → Bot: 'Go to Settings → Billing → Cancel. You'll be refunded for the remaining period.' (Note: refund policy is no-refund-after-trial; bot is hallucinating.)",
        },
        {
          label: "Eval set scores (CI)",
          content:
            "Production prompt vs eval set: 89% pass rate. Same as last week. CI is green.",
        },
        {
          label: "Recent changes",
          content:
            "No app code deploys. Help-doc team updated 47 articles last Tuesday including refunds, cancellation, and billing policies.",
        },
      ],
      options: [
        {
          id: "model-update",
          label: "OpenAI shipped a model regression",
          hypothesis: "The underlying model degraded silently.",
          isCorrect: false,
          feedback:
            "Plausible but doesn't fit. If the model degraded, the eval set scores in CI would also drop — they didn't (still 89%). Model regressions show up uniformly across all queries; this drop is concentrated in specific topics (cancellation, refunds, billing).",
        },
        {
          id: "rag-stale",
          label: "RAG knowledge base out of sync with updated help docs",
          hypothesis:
            "Help-doc team updated 47 articles. RAG index is still serving the old chunks. Bot is confidently citing outdated information.",
          isCorrect: true,
          feedback:
            "Correct. The smoking gun is the cancellation example — the bot's answer matches the OLD policy, not the new one. CI passes because the eval set wasn't updated to reflect the new policies. The RAG re-indexing job didn't run after the doc updates (or ran on the old version). This is the most common silent quality regression in RAG systems: source-of-truth drift.",
        },
        {
          id: "prompt-degradation",
          label: "Prompt degradation from accumulated context",
          hypothesis:
            "The system prompt has grown over months and is now confusing the model into wrong answers.",
          isCorrect: false,
          feedback:
            "Possible cause for general quality drift but doesn't explain the localized topic pattern. Prompt degradation produces uniformly mediocre answers; here you have specific topics (cancellation, billing) systematically wrong while other topics work fine. The pattern points to a data issue, not a prompt issue.",
        },
        {
          id: "user-shift",
          label: "User base shifted — new users have different needs",
          hypothesis:
            "An influx of new users is asking questions the bot wasn't designed for.",
          isCorrect: false,
          feedback:
            "Doesn't match the evidence. The complaints aren't 'the bot doesn't know' (which would be the failure mode for new query types); they're 'the bot is wrong' on KNOWN topics. The bot has answers — they're just outdated. User-base shifts cause gaps in coverage, not factual errors on covered topics.",
        },
      ],
      resolution:
        "Re-index the RAG knowledge base immediately (force a fresh ingestion of the updated docs). Add a CI step that verifies the RAG index is in sync with the source-of-truth doc system on every release. Update the eval set so it tests against current policies, not stale ones. The deeper lesson: in RAG systems, source-of-truth changes upstream of your AI can silently regress quality without any code change. Doc updates should trigger eval-set updates AND re-indexing as part of the same workflow.",
      category: "Quality drift",
    },
    {
      id: "it-latency-tail",
      headline: "P99 latency 12x normal; P50 unchanged",
      context:
        "AI feature P50 latency: 1.2s (normal). P99 latency: 14s (was 1.1s yesterday). Total volume normal. Some users report 'AI is broken' but others say it's fine. Pages on-call.",
      symptoms: [
        "P50 latency unchanged at 1.2s",
        "P99 latency jumped from 1.1s to 14s — 12x normal",
        "No error rate change",
        "Tail latency users skew toward enterprise tier (large accounts)",
      ],
      evidence: [
        {
          label: "Latency by request type",
          content:
            "Standard requests: 1.2s P99 (normal). 'Search across history' requests: 14s P99 (the new outlier).",
        },
        {
          label: "Recent change",
          content:
            "Yesterday: enabled 'AI search across your full conversation history' for enterprise tier. Implemented as: fetch all conversations + pass to LLM in context window.",
        },
        {
          label: "Sample slow request",
          content:
            "User: 'find when we discussed pricing' → Backend: fetched 380 conversations, packed into 92K tokens of context, sent to GPT-4. Took 13.8s.",
        },
      ],
      options: [
        {
          id: "vendor-throttle",
          label: "OpenAI throttling enterprise traffic",
          hypothesis: "The vendor is rate-limiting your large accounts.",
          isCorrect: false,
          feedback:
            "Throttling produces specific error codes (429s) and queueing, not 12x latency on successful requests. Plus throttling would affect ALL request types from those accounts, not just one specific type. The pattern is too localized for a vendor issue.",
        },
        {
          id: "long-context-arch",
          label: "New 'search history' feature uses long-context architecture, slow by design",
          hypothesis:
            "The new feature stuffs entire conversation history into the LLM context (92K tokens). LLM inference time scales with context length. Architecture choice, not a bug.",
          isCorrect: true,
          feedback:
            "Correct. Long-context LLM calls are inherently slow — 92K tokens through GPT-4 takes 10-15 seconds. The architecture chose 'pass everything to the LLM' over 'use RAG to retrieve only the relevant 3-5 conversations.' P99 went up because the new feature path is slow; P50 is unchanged because most requests don't take the new path. The fix is architectural: replace long-context with RAG for this feature.",
        },
        {
          id: "memory-leak",
          label: "Memory leak in the new feature causing slow GC",
          hypothesis: "Yesterday's deploy introduced a memory leak; GC pauses are causing tail latency.",
          isCorrect: false,
          feedback:
            "Memory leaks would affect ALL requests on affected nodes, not specifically the 'search history' request type. The latency is concentrated in one request shape, which points to that request's design, not infra-level issues.",
        },
        {
          id: "db-slowdown",
          label: "Database slow on conversation history fetches",
          hypothesis: "Fetching 380 conversations is hammering the DB.",
          isCorrect: false,
          feedback:
            "Plausible-sounding but the data shows the fetch is fast — the slow part is the 13.8s LLM call (92K tokens). DB fetches at the volume in question are millisecond-scale. Don't blame the database when the LLM call is the obvious bottleneck.",
        },
      ],
      resolution:
        "Replace the long-context architecture with RAG: embed conversation chunks, retrieve top 3-5 relevant conversations per query, pass only those to the LLM. P99 will drop from 14s to ~2s because you're going from 92K token context to ~5K. The deeper lesson: when adding 'AI over user history' features, the temptation to use long-context is real (simple architecture), but it scales latency linearly with history size. RAG is the production-ready architecture; long-context is for prototypes and small histories.",
      category: "Latency regression",
    },
    {
      id: "it-eval-gap",
      headline: "Eval scores up, user satisfaction down",
      context:
        "You shipped a prompt update last week that lifted eval scores from 78% → 91%. NPS for the AI feature dropped 22 points week-over-week. The two metrics are diverging. Engineering team is confused.",
      symptoms: [
        "Eval rubric scores jumped 13 points (good)",
        "User NPS dropped 22 points (bad)",
        "Free-text complaints: 'too long', 'why is it lecturing me', 'just answer the question'",
        "Volume unchanged. No latency change. No cost change.",
      ],
      evidence: [
        {
          label: "Prompt diff (last week)",
          content:
            "Old: 'Answer the user's question concisely.'\nNew: 'Answer the user's question with thoroughness. Include relevant context, considerations, and recommendations to ensure a complete answer.'",
        },
        {
          label: "Eval rubric criteria",
          content:
            "Completeness (40%), Accuracy (30%), Citations (15%), Tone (15%). Notably absent: brevity, response length.",
        },
        {
          label: "Sample 'good per eval' response",
          content:
            "User: 'how do I export my data?' → Assistant: [950-word response covering 4 export formats, when to use each, security considerations, GDPR implications, and 7 related features the user might want to know about.]",
        },
      ],
      options: [
        {
          id: "rubric-misaligned",
          label: "Eval rubric is misaligned with user preferences",
          hypothesis:
            "The rubric heavily weights completeness (40%) but doesn't measure brevity. The new prompt optimized for completeness — eval scores up. Users hate verbose answers — NPS down. The rubric was wrong, the prompt change was a faithful response to the rubric.",
          isCorrect: true,
          feedback:
            "Correct. Eval-driven development optimizes for what the rubric measures — and your rubric forgot brevity. The prompt update is the rubric working as designed; the rubric just didn't reflect what users actually value. This is the canonical 'eval gap' failure mode: hitting your metrics while users are upset. Add brevity (or 'response length appropriateness') to the rubric, then re-evaluate.",
        },
        {
          id: "prompt-bug",
          label: "Prompt update introduced a bug",
          hypothesis: "Something in the new prompt is causing weird outputs.",
          isCorrect: false,
          feedback:
            "The prompt is doing exactly what it was instructed to do — answer thoroughly with context and recommendations. There's no bug; there's a goal misalignment. The prompt is correctly executing a goal that doesn't match what users want.",
        },
        {
          id: "user-segment",
          label: "Power users are upset; average users are fine",
          hypothesis: "A specific user segment is driving the NPS drop.",
          isCorrect: false,
          feedback:
            "Possible to investigate but the free-text complaints are uniform ('too long', 'why is it lecturing'). This isn't a segment issue; it's a verbose-response issue affecting most users. Don't hide behind segmentation when the signal is broad.",
        },
        {
          id: "model-shift",
          label: "Model behavior shifted",
          hypothesis: "OpenAI changed something in the underlying model.",
          isCorrect: false,
          feedback:
            "Convenient but inconsistent. The eval scores went UP, not down — a model regression would tank both metrics. Plus the prompt was changed in the same window, which is a more proximate explanation. Don't blame the vendor when you have a more local cause.",
        },
      ],
      resolution:
        "Revert the prompt OR add brevity to the eval rubric and re-derive the right prompt. The deeper lesson: eval-driven development is only as good as your rubric. If you optimize for what the rubric measures, you'll improve those numbers — sometimes at the cost of things you forgot to measure. The most insidious eval bugs aren't 'the rubric is wrong about quality'; they're 'the rubric forgot to include something users care about.' Periodic NPS-vs-eval correlation checks catch this.",
      category: "Goodhart's law / eval gap",
    },
    {
      id: "it-flaky-tool",
      headline: "Agent fails 8% of the time with no clear error",
      context:
        "Multi-step agent that calls 4 tools (CRM lookup, calendar, email, doc generator). Failure rate: 8%. Failures show up as 'I encountered an error' messages with no further info. On-call has been firefighting for a week.",
      symptoms: [
        "8% of agent runs fail with generic error",
        "Failures distributed across all 4 tools (no single tool is broken)",
        "Retries fix ~half of failures",
        "P99 latency on failed runs is 28s (3x normal)",
      ],
      evidence: [
        {
          label: "Tool error rates (per-tool)",
          content:
            "CRM: 1.2% errors. Calendar: 0.8%. Email: 1.5%. Doc generator: 1.1%. Total per-tool baseline: ~4.6%.",
        },
        {
          label: "Failed-run trace",
          content:
            "Run #44781: agent calls CRM (success in 2.1s), calls Calendar (success in 1.8s), calls Email (TIMEOUT after 12s), agent retries Email (success in 1.4s), agent calls Doc (success in 3.2s), final response generated (success). User saw: 'I encountered an error' anyway.",
        },
        {
          label: "Code path",
          content:
            "Agent run wrapped in: try { runAgent() } catch { return 'I encountered an error' }. No specific tool failure handling.",
        },
      ],
      options: [
        {
          id: "individual-tool",
          label: "One tool is unreliable; isolate and fix it",
          hypothesis:
            "One of the 4 tools has higher-than-expected failure rate.",
          isCorrect: false,
          feedback:
            "Each tool's individual error rate is reasonable (1-1.5%). The 8% comes from the COMPOUND probability: 1 - 0.985⁴ ≈ 5.9% baseline failure rate just from any tool failing once, plus retry overhead pushing it to 8%. No single tool is the issue.",
        },
        {
          id: "no-tool-handling",
          label: "Agent's catch-all error handling masks recoverable tool failures",
          hypothesis:
            "The trace shows a tool that timed out, retried successfully, completed the workflow — but the user still got 'I encountered an error'. Bad error handling is treating recoverable failures as fatal.",
          isCorrect: true,
          feedback:
            "Correct. Run #44781 LITERALLY completed successfully (final response generated) but the user saw an error because somewhere in the catch block, a transient timeout was bubbled up as a fatal error. The fix isn't tool reliability — the tools are fine. The fix is structured error handling: distinguish transient retryable failures from fatal ones, only surface 'error' to the user when the workflow actually failed. The 8% drops to ~1% with proper error handling.",
        },
        {
          id: "model-confused",
          label: "Agent is getting confused by tool outputs and giving up",
          hypothesis: "LLM struggles with tool responses and emits an error.",
          isCorrect: false,
          feedback:
            "The trace shows the agent successfully completing the workflow — it's not confused. The error is being surfaced from the catch block, not from the model deciding to give up. Don't blame the LLM when the bug is in the surrounding code.",
        },
        {
          id: "rate-limits",
          label: "Hitting LLM rate limits during peak hours",
          hypothesis: "Rate limit errors are masquerading as generic errors.",
          isCorrect: false,
          feedback:
            "If rate limits were the cause, failures would cluster at peak hours and have specific 429 patterns. Here the failures are evenly distributed and the trace shows no rate-limit errors. Plus rate-limit errors usually retry-and-recover; the issue here is that recoveries are being incorrectly surfaced as failures.",
        },
      ],
      resolution:
        "Replace the catch-all with structured error handling: track per-tool failures, use bounded retries (already happening), distinguish transient (timeouts, rate limits) from fatal (auth, malformed) errors. Only surface 'error' to users when ALL retries on a workflow-critical step exhausted. Add observability: log the specific failure reason when surfacing error to the user. The deeper lesson: in agent systems, 'I encountered an error' is the worst observability pattern — it conflates 5 different failure modes into one indistinguishable user experience. Structured error handling is half the work of running agents in production.",
      category: "Error handling architecture",
    },
  ],
};

export function getIncidentTriageGameFor(moduleSlug: string): IncidentScenario[] | null {
  const scenarios = incidentScenariosByModule[moduleSlug];
  return scenarios && scenarios.length > 0 ? scenarios : null;
}
