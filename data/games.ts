// ─── Types ───────────────────────────────────────────────────────────────────

export type BlockCategory = "agent" | "gate" | "data" | "distractor";

export interface BlockDefinition {
  id: string;
  label: string;
  category: BlockCategory;
  description: string;
}

export interface SimulationEvent {
  nodeId: string;
  status: "pass" | "fail" | "warn";
  message: string;
  delay: number;
}

export interface GameConfig {
  patternSlug: string;
  mission: string;
  missionDetail: string;
  availableBlocks: BlockDefinition[];
  requiredBlockIds: string[];
  validTopologies: string[][];
  simulate: (placedBlockIds: string[]) => SimulationEvent[];
  scoring: {
    hasRequiredBlocks: number;
    correctOrder: number;
    noDistractors: number;
  };
  hints: string[];
  successMessage: string;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function hasAll(placed: string[], required: string[]): boolean {
  return required.every((id) => placed.includes(id));
}

function matchesAny(placed: string[], topologies: string[][]): boolean {
  return topologies.some(
    (t) => t.length === placed.length && t.every((id, i) => placed[i] === id)
  );
}

// ─── Game Configs ────────────────────────────────────────────────────────────

const promptChainingGame: GameConfig = {
  patternSlug: "prompt-chaining",
  mission: "Build a Customer Support Pipeline",
  missionDetail:
    "Assemble an agent pipeline that extracts intent from a support ticket, validates the extraction, analyzes sentiment, and generates a response.",
  availableBlocks: [
    { id: "extraction", label: "Extraction Agent", category: "agent", description: "Extracts entities and intent from raw input" },
    { id: "validation-gate", label: "Validation Gate", category: "gate", description: "Checks extraction output structure before passing downstream" },
    { id: "analysis", label: "Analysis Agent", category: "agent", description: "Analyzes sentiment and key themes" },
    { id: "response", label: "Response Agent", category: "agent", description: "Generates a human-readable response" },
    { id: "router", label: "Router", category: "distractor", description: "Routes requests to different handlers" },
    { id: "retry-loop", label: "Retry Loop", category: "distractor", description: "Retries a failed step" },
  ],
  requiredBlockIds: ["extraction", "validation-gate", "analysis", "response"],
  validTopologies: [["extraction", "validation-gate", "analysis", "response"]],
  simulate(placed) {
    if (!hasAll(placed, ["extraction"])) {
      return [{ nodeId: placed[0] || "", status: "fail", message: "No extraction step — raw text goes straight to processing.", delay: 0 }];
    }
    const events: SimulationEvent[] = [
      { nodeId: "extraction", status: "pass", message: "Entities extracted: customer_name, issue_type, urgency.", delay: 0 },
    ];
    if (!placed.includes("validation-gate")) {
      events.push({ nodeId: placed[placed.indexOf("extraction") + 1] || "analysis", status: "fail", message: "Hallucinated entities propagated — no validation gate caught the error. Garbage in, garbage out.", delay: 600 });
      return events;
    }
    events.push({ nodeId: "validation-gate", status: "pass", message: "Structure validated. All required fields present.", delay: 600 });
    if (!placed.includes("analysis")) {
      events.push({ nodeId: "response", status: "warn", message: "Response generated without analysis — tone may be wrong.", delay: 1200 });
      return events;
    }
    events.push({ nodeId: "analysis", status: "pass", message: "Sentiment: frustrated. Priority: high.", delay: 1200 });
    events.push({ nodeId: "response", status: "pass", message: "Empathetic response drafted, matching frustrated tone.", delay: 1800 });
    const distractors = placed.filter((id) => !this.requiredBlockIds.includes(id));
    distractors.forEach((id) => {
      events.push({ nodeId: id, status: "warn", message: "This block is unnecessary in a linear chain.", delay: 1800 });
    });
    return events;
  },
  scoring: { hasRequiredBlocks: 40, correctOrder: 40, noDistractors: 20 },
  hints: [
    "Think sequentially: what must happen before analysis?",
    "What happens if the extraction hallucinates? You need a gate.",
    "The pipeline should flow: extract → validate → analyze → respond.",
  ],
  successMessage: "Perfect pipeline! You built a textbook Prompt Chain with proper validation gates between each step.",
};

const routingGame: GameConfig = {
  patternSlug: "routing",
  mission: "Build a Multi-Path Request Handler",
  missionDetail:
    "Create a system that classifies incoming support requests and routes them to the correct specialist agent based on intent.",
  availableBlocks: [
    { id: "classifier", label: "Intent Classifier", category: "agent", description: "Classifies the semantic intent of the request" },
    { id: "billing-agent", label: "Billing Agent", category: "agent", description: "Handles billing and payment queries" },
    { id: "technical-agent", label: "Technical Agent", category: "agent", description: "Handles technical support queries" },
    { id: "general-agent", label: "General Agent", category: "agent", description: "Handles general inquiries and fallback" },
    { id: "response-merger", label: "Response Merger", category: "gate", description: "Merges responses from multiple agents" },
    { id: "reflection-loop", label: "Reflection Loop", category: "distractor", description: "Agent critiques its own output" },
  ],
  requiredBlockIds: ["classifier", "billing-agent", "technical-agent", "general-agent"],
  validTopologies: [
    ["classifier", "billing-agent", "technical-agent", "general-agent"],
    ["classifier", "technical-agent", "billing-agent", "general-agent"],
    ["classifier", "general-agent", "billing-agent", "technical-agent"],
    ["classifier", "general-agent", "technical-agent", "billing-agent"],
    ["classifier", "billing-agent", "general-agent", "technical-agent"],
    ["classifier", "technical-agent", "general-agent", "billing-agent"],
  ],
  simulate(placed) {
    if (!placed.includes("classifier")) {
      return [{ nodeId: placed[0] || "", status: "fail", message: "No classifier — requests go to a random agent. Billing questions hit the tech team.", delay: 0 }];
    }
    const events: SimulationEvent[] = [
      { nodeId: "classifier", status: "pass", message: "Intent classified: billing_dispute (92% confidence).", delay: 0 },
    ];
    if (!placed.includes("billing-agent")) {
      events.push({ nodeId: "classifier", status: "warn", message: "Billing intent detected but no Billing Agent available — request dropped.", delay: 600 });
      return events;
    }
    events.push({ nodeId: "billing-agent", status: "pass", message: "Billing agent handling dispute. Fetching account history.", delay: 600 });
    if (placed.includes("technical-agent")) {
      events.push({ nodeId: "technical-agent", status: "pass", message: "Standing by — not needed for this request.", delay: 1000 });
    }
    if (placed.includes("general-agent")) {
      events.push({ nodeId: "general-agent", status: "pass", message: "Fallback ready — not needed for this request.", delay: 1200 });
    }
    const distractors = placed.filter((id) => !this.requiredBlockIds.includes(id) && id !== "response-merger");
    distractors.forEach((id) => {
      events.push({ nodeId: id, status: "warn", message: "This block doesn't belong in a routing architecture.", delay: 1400 });
    });
    return events;
  },
  scoring: { hasRequiredBlocks: 40, correctOrder: 40, noDistractors: 20 },
  hints: [
    "Every routing system needs a classifier at the front.",
    "What happens to billing questions if there's no billing specialist?",
    "The classifier must come first — it decides where to send requests.",
  ],
  successMessage: "Excellent routing architecture! Requests are classified semantically and dispatched to the right specialist.",
};

const parallelizationGame: GameConfig = {
  patternSlug: "parallelization",
  mission: "Build a Parallel Analysis System",
  missionDetail:
    "Create a system that analyzes a document from three angles simultaneously and then merges the results into a single report.",
  availableBlocks: [
    { id: "splitter", label: "Task Splitter", category: "gate", description: "Splits the input into parallel subtasks" },
    { id: "sentiment-agent", label: "Sentiment Analyzer", category: "agent", description: "Analyzes emotional tone" },
    { id: "entity-agent", label: "Entity Extractor", category: "agent", description: "Extracts named entities" },
    { id: "summary-agent", label: "Summarizer", category: "agent", description: "Creates a concise summary" },
    { id: "merger", label: "Result Merger", category: "gate", description: "Combines outputs from parallel agents into one report" },
    { id: "planner", label: "Planner", category: "distractor", description: "Creates a multi-step execution plan" },
  ],
  requiredBlockIds: ["splitter", "sentiment-agent", "entity-agent", "summary-agent", "merger"],
  validTopologies: [
    ["splitter", "sentiment-agent", "entity-agent", "summary-agent", "merger"],
    ["splitter", "sentiment-agent", "summary-agent", "entity-agent", "merger"],
    ["splitter", "entity-agent", "sentiment-agent", "summary-agent", "merger"],
    ["splitter", "entity-agent", "summary-agent", "sentiment-agent", "merger"],
    ["splitter", "summary-agent", "sentiment-agent", "entity-agent", "merger"],
    ["splitter", "summary-agent", "entity-agent", "sentiment-agent", "merger"],
  ],
  simulate(placed) {
    if (!placed.includes("splitter")) {
      return [{ nodeId: placed[0] || "", status: "fail", message: "No splitter — the document is processed sequentially. 3x slower.", delay: 0 }];
    }
    const events: SimulationEvent[] = [
      { nodeId: "splitter", status: "pass", message: "Document split into 3 parallel tasks.", delay: 0 },
    ];
    const agents = ["sentiment-agent", "entity-agent", "summary-agent"];
    let delay = 500;
    for (const agent of agents) {
      if (placed.includes(agent)) {
        const labels: Record<string, string> = {
          "sentiment-agent": "Tone: professional, slightly urgent.",
          "entity-agent": "Found: 3 people, 2 orgs, 5 dates.",
          "summary-agent": "Summary: 3-sentence executive brief generated.",
        };
        events.push({ nodeId: agent, status: "pass", message: labels[agent], delay });
        delay += 200;
      }
    }
    if (!placed.includes("merger")) {
      events.push({ nodeId: agents.find((a) => placed.includes(a)) || "", status: "warn", message: "Results generated but never combined — user gets 3 separate outputs.", delay: delay + 300 });
      return events;
    }
    events.push({ nodeId: "merger", status: "pass", message: "All results merged into unified analysis report.", delay: delay + 300 });
    return events;
  },
  scoring: { hasRequiredBlocks: 40, correctOrder: 40, noDistractors: 20 },
  hints: [
    "Parallel systems need a splitter at the start and a merger at the end.",
    "The order of the parallel agents doesn't matter — they run simultaneously.",
    "Without a merger, the user gets fragmented outputs.",
  ],
  successMessage: "Perfect scatter-gather! You split the work, ran agents in parallel, and merged the results.",
};

const reflectionGame: GameConfig = {
  patternSlug: "reflection",
  mission: "Build a Self-Improving Code Generator",
  missionDetail:
    "Create a system where an agent generates code, a critic reviews it, and the generator improves based on feedback — like an automated code review loop.",
  availableBlocks: [
    { id: "coder", label: "Coder Agent", category: "agent", description: "Generates code from a specification" },
    { id: "critic", label: "Critic Agent", category: "agent", description: "Reviews code for bugs, style, and correctness" },
    { id: "feedback-loop", label: "Feedback Loop", category: "gate", description: "Passes critique back to the coder for revision" },
    { id: "max-retries", label: "Max Retries Gate", category: "gate", description: "Stops the loop after N iterations to prevent infinite loops" },
    { id: "router", label: "Router", category: "distractor", description: "Routes requests to different handlers" },
    { id: "memory-store", label: "Memory Store", category: "distractor", description: "Stores long-term context" },
  ],
  requiredBlockIds: ["coder", "critic", "feedback-loop", "max-retries"],
  validTopologies: [
    ["coder", "critic", "feedback-loop", "max-retries"],
  ],
  simulate(placed) {
    if (!placed.includes("coder")) {
      return [{ nodeId: placed[0] || "", status: "fail", message: "No coder agent — nothing generates the initial code.", delay: 0 }];
    }
    const events: SimulationEvent[] = [
      { nodeId: "coder", status: "pass", message: "First draft generated. 3 functions, 45 lines.", delay: 0 },
    ];
    if (!placed.includes("critic")) {
      events.push({ nodeId: "coder", status: "warn", message: "Code shipped without review. Bug found in production.", delay: 600 });
      return events;
    }
    events.push({ nodeId: "critic", status: "pass", message: "Found 2 issues: missing null check, inefficient loop.", delay: 600 });
    if (!placed.includes("feedback-loop")) {
      events.push({ nodeId: "critic", status: "warn", message: "Critique generated but never sent back to coder. Issues remain unfixed.", delay: 1200 });
      return events;
    }
    events.push({ nodeId: "feedback-loop", status: "pass", message: "Feedback injected. Coder revising...", delay: 1200 });
    if (!placed.includes("max-retries")) {
      events.push({ nodeId: "feedback-loop", status: "warn", message: "No retry limit! Loop ran 47 times burning tokens before timeout.", delay: 1800 });
      return events;
    }
    events.push({ nodeId: "max-retries", status: "pass", message: "Retry limit set to 3. Code approved after 2 iterations.", delay: 1800 });
    return events;
  },
  scoring: { hasRequiredBlocks: 40, correctOrder: 40, noDistractors: 20 },
  hints: [
    "Reflection = Draft → Critique → Revise. That's the TDD loop.",
    "Without a feedback loop, the critique is wasted.",
    "What stops the agent from looping forever? You need a safety valve.",
  ],
  successMessage: "Perfect reflection loop! Draft → Critique → Revise with a safety limit. This is TDD for AI.",
};

const toolUseGame: GameConfig = {
  patternSlug: "tool-use",
  mission: "Build a Data-Grounded Research Agent",
  missionDetail:
    "Create an agent that can answer questions using real data by calling external tools (APIs, databases) instead of relying on its training data alone.",
  availableBlocks: [
    { id: "planner", label: "Query Planner", category: "agent", description: "Decides which tools to call based on the question" },
    { id: "api-adapter", label: "API Adapter", category: "gate", description: "Translates LLM requests into structured API calls" },
    { id: "db-adapter", label: "Database Adapter", category: "gate", description: "Translates LLM requests into SQL queries" },
    { id: "synthesizer", label: "Synthesis Agent", category: "agent", description: "Combines tool outputs into a coherent answer" },
    { id: "guardrail", label: "Access Guardrail", category: "gate", description: "Validates tool calls are within allowed scope" },
    { id: "splitter", label: "Task Splitter", category: "distractor", description: "Splits input into parallel subtasks" },
  ],
  requiredBlockIds: ["planner", "api-adapter", "db-adapter", "synthesizer"],
  validTopologies: [
    ["planner", "api-adapter", "db-adapter", "synthesizer"],
    ["planner", "db-adapter", "api-adapter", "synthesizer"],
    ["planner", "guardrail", "api-adapter", "db-adapter", "synthesizer"],
    ["planner", "guardrail", "db-adapter", "api-adapter", "synthesizer"],
  ],
  simulate(placed) {
    if (!placed.includes("planner")) {
      return [{ nodeId: placed[0] || "", status: "fail", message: "No query planner — the agent guesses which tool to use. Calls the wrong API.", delay: 0 }];
    }
    const events: SimulationEvent[] = [
      { nodeId: "planner", status: "pass", message: "Plan: 1) Query sales DB, 2) Call pricing API, 3) Synthesize.", delay: 0 },
    ];
    if (placed.includes("guardrail")) {
      events.push({ nodeId: "guardrail", status: "pass", message: "Tool calls validated — within allowed scope.", delay: 500 });
    }
    if (!placed.includes("api-adapter") && !placed.includes("db-adapter")) {
      events.push({ nodeId: "planner", status: "fail", message: "No tool adapters available. Agent hallucinates the data.", delay: 600 });
      return events;
    }
    if (placed.includes("db-adapter")) {
      events.push({ nodeId: "db-adapter", status: "pass", message: "SQL executed. 142 rows returned from sales_orders.", delay: 800 });
    }
    if (placed.includes("api-adapter")) {
      events.push({ nodeId: "api-adapter", status: "pass", message: "Pricing API returned current rates for 3 tiers.", delay: 1000 });
    }
    if (!placed.includes("synthesizer")) {
      events.push({ nodeId: placed[placed.length - 1], status: "warn", message: "Raw data returned to user — no synthesis into a readable answer.", delay: 1400 });
      return events;
    }
    events.push({ nodeId: "synthesizer", status: "pass", message: "Answer synthesized from DB + API data. Zero hallucination.", delay: 1400 });
    return events;
  },
  scoring: { hasRequiredBlocks: 40, correctOrder: 40, noDistractors: 20 },
  hints: [
    "The planner decides WHICH tools to call. It must come first.",
    "Without adapters, the agent can't reach external data.",
    "A synthesizer turns raw tool outputs into a coherent answer.",
  ],
  successMessage: "Solid tool-use architecture! The agent plans, calls tools through adapters, and synthesizes results.",
};

const planningGame: GameConfig = {
  patternSlug: "planning",
  mission: "Build a Multi-Step Task Executor",
  missionDetail:
    "Create a system that takes a complex goal, breaks it into a step-by-step plan, executes each step, and can re-plan when a step fails.",
  availableBlocks: [
    { id: "planner", label: "Planner Agent", category: "agent", description: "Decomposes a goal into an ordered list of steps" },
    { id: "executor", label: "Step Executor", category: "agent", description: "Executes a single step from the plan" },
    { id: "progress-check", label: "Progress Monitor", category: "gate", description: "Checks if the step succeeded before proceeding" },
    { id: "replanner", label: "Re-Planner", category: "agent", description: "Revises the plan when a step fails or conditions change" },
    { id: "sentiment-agent", label: "Sentiment Analyzer", category: "distractor", description: "Analyzes emotional tone" },
    { id: "merger", label: "Result Merger", category: "distractor", description: "Merges parallel outputs" },
  ],
  requiredBlockIds: ["planner", "executor", "progress-check", "replanner"],
  validTopologies: [
    ["planner", "executor", "progress-check", "replanner"],
  ],
  simulate(placed) {
    if (!placed.includes("planner")) {
      return [{ nodeId: placed[0] || "", status: "fail", message: "No planner — the agent jumps straight into execution with no strategy.", delay: 0 }];
    }
    const events: SimulationEvent[] = [
      { nodeId: "planner", status: "pass", message: "Plan created: 4 steps to deploy the feature.", delay: 0 },
    ];
    if (!placed.includes("executor")) {
      events.push({ nodeId: "planner", status: "fail", message: "Plan created but nothing executes it.", delay: 600 });
      return events;
    }
    events.push({ nodeId: "executor", status: "pass", message: "Step 1 executed. Step 2 executed. Step 3 failed — dependency missing.", delay: 600 });
    if (!placed.includes("progress-check")) {
      events.push({ nodeId: "executor", status: "warn", message: "Failure not detected. Steps 4-5 proceed on broken foundation.", delay: 1200 });
      return events;
    }
    events.push({ nodeId: "progress-check", status: "pass", message: "Failure detected at step 3. Halting execution.", delay: 1200 });
    if (!placed.includes("replanner")) {
      events.push({ nodeId: "progress-check", status: "warn", message: "Failure detected but no way to recover. Entire task aborted.", delay: 1800 });
      return events;
    }
    events.push({ nodeId: "replanner", status: "pass", message: "Plan revised: added dependency install as step 3a. Resuming from step 3.", delay: 1800 });
    return events;
  },
  scoring: { hasRequiredBlocks: 40, correctOrder: 40, noDistractors: 20 },
  hints: [
    "Planning requires: plan → execute → monitor → re-plan.",
    "What happens when a step fails? You need monitoring AND recovery.",
    "A re-planner lets the system adapt instead of just crashing.",
  ],
  successMessage: "Complete planning loop! Plan → Execute → Monitor → Re-plan. This is the Saga pattern for AI.",
};

const multiAgentGame: GameConfig = {
  patternSlug: "multi-agent-collaboration",
  mission: "Build a Content Creation Team",
  missionDetail:
    "Assemble a team of specialized agents that collaborate to produce a blog post: one researches, one writes, one reviews, and a coordinator manages the workflow.",
  availableBlocks: [
    { id: "coordinator", label: "Coordinator", category: "agent", description: "Orchestrates the workflow and delegates tasks to specialists" },
    { id: "researcher", label: "Research Agent", category: "agent", description: "Gathers facts and references from sources" },
    { id: "writer", label: "Writer Agent", category: "agent", description: "Drafts the content based on research" },
    { id: "reviewer", label: "Review Agent", category: "agent", description: "Checks quality, accuracy, and tone" },
    { id: "validation-gate", label: "Validation Gate", category: "distractor", description: "Checks data structure" },
    { id: "db-adapter", label: "Database Adapter", category: "distractor", description: "Queries a database" },
  ],
  requiredBlockIds: ["coordinator", "researcher", "writer", "reviewer"],
  validTopologies: [
    ["coordinator", "researcher", "writer", "reviewer"],
  ],
  simulate(placed) {
    if (!placed.includes("coordinator")) {
      const first = placed[0];
      if (first === "researcher") {
        return [
          { nodeId: "researcher", status: "pass", message: "Research done, but no one told the writer.", delay: 0 },
          { nodeId: placed[1] || "researcher", status: "fail", message: "No coordinator — agents work in isolation. Research never reaches the writer.", delay: 800 },
        ];
      }
      return [{ nodeId: placed[0] || "", status: "fail", message: "No coordinator — agents don't know who does what. Chaos.", delay: 0 }];
    }
    const events: SimulationEvent[] = [
      { nodeId: "coordinator", status: "pass", message: "Workflow assigned: Research → Write → Review.", delay: 0 },
    ];
    if (!placed.includes("researcher")) {
      events.push({ nodeId: "writer", status: "warn", message: "Writer starts from scratch — no research to build on.", delay: 600 });
    } else {
      events.push({ nodeId: "researcher", status: "pass", message: "5 sources found. Key facts extracted.", delay: 600 });
    }
    if (!placed.includes("writer")) {
      events.push({ nodeId: "coordinator", status: "fail", message: "Research done but no writer to produce the content.", delay: 1200 });
      return events;
    }
    events.push({ nodeId: "writer", status: "pass", message: "1,200-word draft completed using research.", delay: 1200 });
    if (!placed.includes("reviewer")) {
      events.push({ nodeId: "writer", status: "warn", message: "Draft published without review. Factual error in paragraph 3.", delay: 1800 });
      return events;
    }
    events.push({ nodeId: "reviewer", status: "pass", message: "Review complete. 1 factual correction, 2 style suggestions applied.", delay: 1800 });
    return events;
  },
  scoring: { hasRequiredBlocks: 40, correctOrder: 40, noDistractors: 20 },
  hints: [
    "Every team needs a coordinator — who assigns work?",
    "Writers need research. Put the researcher before the writer.",
    "Without a reviewer, errors ship to production.",
  ],
  successMessage: "Great team architecture! A coordinator orchestrates specialized agents, just like microservices with a service mesh.",
};

// ─── Registry ────────────────────────────────────────────────────────────────

const GAME_CONFIGS: GameConfig[] = [
  promptChainingGame,
  routingGame,
  parallelizationGame,
  reflectionGame,
  toolUseGame,
  planningGame,
  multiAgentGame,
];

export function getGameConfig(slug: string): GameConfig | null {
  return GAME_CONFIGS.find((g) => g.patternSlug === slug) ?? null;
}

export function hasGameConfig(slug: string): boolean {
  return GAME_CONFIGS.some((g) => g.patternSlug === slug);
}
