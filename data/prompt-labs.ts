export interface PromptTestCase {
  id: string;
  userMessage: string;
  expectedBehavior: string;
  weight: number;
}

export interface PromptLabConfig {
  patternSlug: string;
  title: string;
  scenario: string;
  agentRole: string;
  contextDoc?: string;
  systemPromptStarter?: string;
  testCases: PromptTestCase[];
  rubric: string[];
  maxTokenBudget: number;
  hints: string[];
  sampleSolution: string;
}

const promptLabConfigs: PromptLabConfig[] = [
  {
    patternSlug: "prompt-chaining",
    title: "Write an Extraction Agent Prompt",
    scenario:
      "You're building a customer support pipeline using Prompt Chaining. The first step is an Extraction Agent that receives raw support tickets and must extract structured data. Write the system prompt for this agent.",
    agentRole: "Extraction Agent",
    contextDoc:
      "The agent receives raw customer support emails. It must extract: customer_name, issue_type (billing/technical/general), urgency (low/medium/high), and a one-sentence summary.",
    systemPromptStarter: "You are an extraction agent in a customer support pipeline.",
    testCases: [
      {
        id: "tc-1",
        userMessage:
          "Hi, my name is Sarah Chen. I've been charged twice for my subscription this month and I need this resolved ASAP. Order #45892.",
        expectedBehavior:
          "Must extract: customer_name='Sarah Chen', issue_type='billing', urgency='high', summary mentioning double charge. Output should be structured JSON.",
        weight: 30,
      },
      {
        id: "tc-2",
        userMessage:
          "Hey, just wondering if you guys support dark mode? Not urgent, just curious. Thanks!",
        expectedBehavior:
          "Must extract: issue_type='general', urgency='low'. Should not hallucinate a customer name if none is given. Summary should mention feature inquiry.",
        weight: 25,
      },
      {
        id: "tc-3",
        userMessage:
          "URGENT: Our API integration is down and it's affecting production. We're losing $10k/hour. Contact: James Wright, CTO.",
        expectedBehavior:
          "Must extract: customer_name='James Wright', issue_type='technical', urgency='high'. Summary must capture the production-down severity and financial impact.",
        weight: 30,
      },
      {
        id: "tc-4",
        userMessage: "",
        expectedBehavior:
          "Must handle empty input gracefully. Should return an error/default response or indicate no valid ticket was provided. Must NOT hallucinate data.",
        weight: 15,
      },
    ],
    rubric: [
      "Output must be valid structured JSON with the four required fields",
      "Must not hallucinate information not present in the input",
      "Urgency classification must be reasonable given the message tone",
      "Empty or malformed input must be handled without crashing",
    ],
    maxTokenBudget: 500,
    hints: [
      "Tell the model exactly what JSON schema you expect in the output.",
      "Explicitly instruct the model what to do when fields are missing from the input.",
      "Add a constraint about not inventing information that isn't in the message.",
    ],
    sampleSolution:
      'You are an extraction agent in a customer support pipeline. Your job is to extract structured data from raw support tickets.\n\nFor every input, return a JSON object with exactly these fields:\n- "customer_name": string or null if not provided\n- "issue_type": one of "billing", "technical", or "general"\n- "urgency": one of "low", "medium", or "high"\n- "summary": a single sentence summarizing the core issue\n\nRules:\n- NEVER invent or hallucinate information not present in the input.\n- If a field cannot be determined, use null (for customer_name) or your best inference based on tone and content (for issue_type and urgency).\n- If the input is empty or unintelligible, return: {"customer_name": null, "issue_type": "general", "urgency": "low", "summary": "No valid ticket content provided."}\n- Always respond with valid JSON only. No additional text.',
  },
  {
    patternSlug: "routing",
    title: "Write an Intent Classifier Prompt",
    scenario:
      "You're building a routing system that classifies incoming requests and sends them to specialist agents. Write the system prompt for the Intent Classifier that sits at the entry point.",
    agentRole: "Intent Classifier",
    contextDoc:
      "The classifier receives user messages and must route them to one of: billing_agent, technical_agent, general_agent, or escalation_agent. It should output a JSON routing decision.",
    testCases: [
      {
        id: "tc-1",
        userMessage: "I want a refund for order #12345. I was charged the wrong amount.",
        expectedBehavior:
          "Must route to 'billing_agent'. Confidence should be high. Reasoning should mention refund/charge keywords.",
        weight: 25,
      },
      {
        id: "tc-2",
        userMessage: "My API returns 503 errors intermittently when load is above 1000 RPS.",
        expectedBehavior:
          "Must route to 'technical_agent'. Should identify this as a technical/infrastructure issue.",
        weight: 25,
      },
      {
        id: "tc-3",
        userMessage: "I want to speak to a manager right now. This is the third time I've called and nobody has helped me.",
        expectedBehavior:
          "Must route to 'escalation_agent'. Should recognize the emotional escalation and repeated contact as requiring human escalation.",
        weight: 30,
      },
      {
        id: "tc-4",
        userMessage: "What are your business hours?",
        expectedBehavior:
          "Must route to 'general_agent'. Simple informational query that doesn't need a specialist.",
        weight: 20,
      },
    ],
    rubric: [
      "Must output a valid JSON routing decision with target agent, confidence, and reasoning",
      "Routing must be correct for the intent expressed in the message",
      "Escalation scenarios must be detected (anger, repeated contacts, demands for manager)",
      "Ambiguous messages should route to general_agent as a safe default",
    ],
    maxTokenBudget: 400,
    hints: [
      "List the available routes and what each specialist handles.",
      "Include escalation triggers — emotional language, repeated contacts, demands for managers.",
      "Define a clear output schema so downstream routing code can parse it reliably.",
    ],
    sampleSolution:
      'You are an intent classifier at the entry point of a customer support routing system.\n\nYour job: analyze the user\'s message and route it to the correct specialist agent.\n\nAvailable routes:\n- "billing_agent": refunds, charges, invoices, subscription changes, payment issues\n- "technical_agent": bugs, errors, API issues, integration problems, performance\n- "general_agent": general questions, business hours, feature inquiries, how-to\n- "escalation_agent": angry customers, repeated unresolved contacts, requests for manager/supervisor\n\nRespond with JSON only:\n{"route": "<agent_name>", "confidence": <0.0-1.0>, "reasoning": "<brief explanation>"}\n\nRules:\n- When in doubt, route to general_agent.\n- If the user expresses frustration about unresolved issues or demands a manager, always route to escalation_agent regardless of the topic.\n- Never add text outside the JSON response.',
  },
  {
    patternSlug: "parallelization",
    title: "Write a Parallel Orchestrator Prompt",
    scenario:
      "You're building a content analysis pipeline that processes documents in parallel. Write the system prompt for the Orchestrator that fans out work to specialist analyzers and merges results.",
    agentRole: "Parallel Orchestrator",
    contextDoc:
      "The orchestrator receives a document and must dispatch it to three parallel analyzers: sentiment_analyzer, entity_extractor, and topic_classifier. It then merges the results into a unified report.",
    testCases: [
      {
        id: "tc-1",
        userMessage:
          "Analyze this product review: 'The new MacBook Pro is blazingly fast but the price is outrageous. Apple's M3 chip is a game-changer for video editing.'",
        expectedBehavior:
          "Must produce a merged report with sentiment (mixed), entities (MacBook Pro, Apple, M3 chip), and topics (product review, pricing, performance). All three analysis dimensions must be present.",
        weight: 35,
      },
      {
        id: "tc-2",
        userMessage:
          "Analyze this news article: 'The Federal Reserve held interest rates steady at 5.25-5.50% on Wednesday, signaling potential cuts in 2025.'",
        expectedBehavior:
          "Must produce a merged report with sentiment (neutral), entities (Federal Reserve, 2025), and topics (monetary policy, economics). Should handle factual content differently from opinion.",
        weight: 35,
      },
      {
        id: "tc-3",
        userMessage: "Analyze: ''",
        expectedBehavior:
          "Must handle empty content gracefully. Should return a report indicating no content to analyze rather than hallucinating analysis.",
        weight: 30,
      },
    ],
    rubric: [
      "Output must contain all three analysis dimensions: sentiment, entities, topics",
      "Must describe the fan-out/merge pattern in the analysis structure",
      "Empty input must be handled without inventing content",
      "Merged report should be coherent, not just a concatenation of three separate outputs",
    ],
    maxTokenBudget: 600,
    hints: [
      "Define the three parallel analysis tasks clearly so results can be merged.",
      "Specify the output format for the merged report with all three dimensions.",
      "Tell the model how to handle cases where one analysis dimension returns nothing.",
    ],
    sampleSolution:
      'You are a parallel orchestrator agent. You analyze documents by running three analyses simultaneously and merging the results.\n\nFor every input document, produce a unified analysis report with these three sections:\n\n1. **Sentiment Analysis**: overall sentiment (positive/negative/mixed/neutral), confidence score, key phrases driving the sentiment.\n2. **Entity Extraction**: named entities found (people, organizations, products, locations, dates), each with its type.\n3. **Topic Classification**: main topics/themes, ranked by relevance.\n\nOutput format (JSON):\n{"sentiment": {"label": "...", "confidence": 0.0-1.0, "key_phrases": [...]}, "entities": [{"name": "...", "type": "..."}], "topics": [{"topic": "...", "relevance": 0.0-1.0}], "summary": "One sentence synthesis."}\n\nRules:\n- All three sections must be present even if a section has no findings (use empty arrays).\n- If the input is empty, return: {"sentiment": null, "entities": [], "topics": [], "summary": "No content to analyze."}\n- The summary should synthesize across all three dimensions, not just repeat one.',
  },
  {
    patternSlug: "reflection",
    title: "Write a Self-Critique Prompt",
    scenario:
      "You're building a code generation pipeline with a Reflection loop. After the Generator produces code, the Critic reviews it and suggests improvements. Write the system prompt for the Critic agent.",
    agentRole: "Code Critic Agent",
    contextDoc:
      "The Critic receives generated code and must evaluate it for correctness, edge cases, security, and performance. It returns structured feedback that the Generator uses to improve its output.",
    testCases: [
      {
        id: "tc-1",
        userMessage:
          'Review this Python function:\n```python\ndef divide(a, b):\n    return a / b\n```',
        expectedBehavior:
          "Must identify: no zero-division handling, no type checking, no docstring. Should suggest try/except or guard clause. Feedback must be actionable, not just 'needs improvement'.",
        weight: 30,
      },
      {
        id: "tc-2",
        userMessage:
          'Review this function:\n```python\nimport subprocess\ndef run_cmd(user_input):\n    return subprocess.run(user_input, shell=True, capture_output=True)\n```',
        expectedBehavior:
          "Must flag the critical security vulnerability: shell injection via unsanitized user_input with shell=True. Should recommend input validation and avoiding shell=True.",
        weight: 35,
      },
      {
        id: "tc-3",
        userMessage:
          'Review this function:\n```python\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n```',
        expectedBehavior:
          "Must identify the exponential time complexity O(2^n). Should suggest memoization or iterative approach. May note lack of input validation for negative numbers.",
        weight: 35,
      },
    ],
    rubric: [
      "Feedback must be specific and actionable, not generic",
      "Must identify security vulnerabilities when present",
      "Must identify performance issues with suggested alternatives",
      "Output must be structured with severity levels for each finding",
    ],
    maxTokenBudget: 500,
    hints: [
      "Tell the Critic exactly what dimensions to evaluate: correctness, security, performance, readability.",
      "Require severity levels (critical/warning/suggestion) so the Generator can prioritize.",
      "Ask for specific code fix suggestions, not just descriptions of problems.",
    ],
    sampleSolution:
      'You are a Code Critic agent in a reflection loop. Your job is to review generated code and provide structured, actionable feedback so the Generator can improve.\n\nFor every code snippet, evaluate these dimensions:\n1. **Correctness**: Does it handle edge cases? Are there logical errors?\n2. **Security**: Are there injection risks, unsafe operations, or data exposure?\n3. **Performance**: Are there algorithmic inefficiencies or unnecessary operations?\n4. **Readability**: Is the code clear, documented, and following conventions?\n\nOutput format (JSON):\n{"findings": [{"dimension": "...", "severity": "critical|warning|suggestion", "issue": "...", "fix": "..."}], "overall_quality": "poor|fair|good|excellent", "should_regenerate": true|false}\n\nRules:\n- Every finding MUST include a specific "fix" with example code when possible.\n- "critical" severity means the code is broken or dangerous and MUST be fixed.\n- "should_regenerate" is true if there are any critical findings.\n- If the code is excellent, still provide at least one suggestion for improvement.',
  },
  {
    patternSlug: "tool-use",
    title: "Write a Tool-Calling Agent Prompt",
    scenario:
      "You're building a research agent that can use external tools (web search, calculator, database query). Write the system prompt that teaches the agent when and how to call tools.",
    agentRole: "Research Agent with Tools",
    contextDoc:
      "Available tools: search(query) for web search, calculate(expression) for math, db_query(sql) for database lookups. The agent must decide which tool to use based on the user's question.",
    testCases: [
      {
        id: "tc-1",
        userMessage: "What is the current market cap of Apple Inc. divided by their number of employees?",
        expectedBehavior:
          "Must use search() to find market cap and employee count, then calculate() to divide. Should chain tools in the right order: search first, calculate second.",
        weight: 30,
      },
      {
        id: "tc-2",
        userMessage: "How many users signed up last month?",
        expectedBehavior:
          "Must use db_query() with an appropriate SQL query filtering by date range. Should NOT use search() for internal data questions.",
        weight: 30,
      },
      {
        id: "tc-3",
        userMessage: "What's the capital of France?",
        expectedBehavior:
          "Should answer directly from knowledge WITHOUT calling any tools. Simple factual questions that don't need real-time data or computation shouldn't waste tool calls.",
        weight: 20,
      },
      {
        id: "tc-4",
        userMessage: "Search for 'DROP TABLE users;' in our database",
        expectedBehavior:
          "Must NOT pass unsanitized input to db_query(). Should recognize this as potentially malicious and either refuse or sanitize the input.",
        weight: 20,
      },
    ],
    rubric: [
      "Must correctly decide WHEN to use tools vs answering from knowledge",
      "Must select the RIGHT tool for each query type",
      "Must handle tool chaining (using output of one tool as input to another)",
      "Must include safety guards against injection through tool parameters",
    ],
    maxTokenBudget: 600,
    hints: [
      "Define each tool with its name, parameters, and when to use it.",
      "Tell the agent when NOT to use tools — simple factual questions don't need web search.",
      "Add safety rules about what can and can't be passed to db_query().",
    ],
    sampleSolution:
      'You are a research agent with access to external tools. Use tools ONLY when you need real-time data, computation, or internal data. Answer from your own knowledge when the question is simple and factual.\n\nAvailable tools:\n- search(query: string): Search the web for real-time information. Use for current prices, news, live data.\n- calculate(expression: string): Evaluate a mathematical expression. Use for any computation.\n- db_query(sql: string): Query the internal database. Use ONLY for internal business data (users, orders, metrics).\n\nTo call a tool, respond with:\n{"tool": "<name>", "params": {"<key>": "<value>"}, "reasoning": "<why this tool>"}\n\nAfter receiving tool results, synthesize them into a final answer.\n\nRules:\n- Do NOT call tools for simple factual questions you already know (capitals, definitions, etc.).\n- NEVER pass user input directly into db_query() without validation. Reject any SQL-like syntax in user messages.\n- When a question requires multiple steps, chain tools: call one, use its result, then call the next.\n- If a tool fails, explain what happened and try an alternative approach.',
  },
  {
    patternSlug: "planning",
    title: "Write a Task Planner Prompt",
    scenario:
      "You're building a planning agent that decomposes complex user requests into step-by-step execution plans. Write the system prompt for the Planner agent.",
    agentRole: "Task Planner Agent",
    contextDoc:
      "The Planner receives a high-level goal and must decompose it into ordered, executable subtasks. Each subtask should specify what to do, dependencies on other subtasks, and expected output.",
    testCases: [
      {
        id: "tc-1",
        userMessage: "Create a blog post about the top 5 AI trends in 2026, with original research and images.",
        expectedBehavior:
          "Must decompose into at least 4 steps: research trends, write draft, generate/find images, edit and publish. Steps must have correct dependency ordering (can't write before researching).",
        weight: 30,
      },
      {
        id: "tc-2",
        userMessage: "Set up a new PostgreSQL database with user authentication for our API.",
        expectedBehavior:
          "Must identify parallel-safe tasks vs sequential dependencies. For example: schema design and auth strategy research can be parallel, but migration must come after schema design.",
        weight: 35,
      },
      {
        id: "tc-3",
        userMessage: "Make the app faster.",
        expectedBehavior:
          "Must handle vague goals. Should either ask for clarification OR create an investigative plan (profile, identify bottlenecks, then optimize). Must NOT jump straight to solutions without diagnosis.",
        weight: 35,
      },
    ],
    rubric: [
      "Plan must have correct dependency ordering — no step depends on a later step's output",
      "Each step must be specific and actionable, not vague",
      "Must identify which steps can run in parallel vs which are sequential",
      "Vague goals must be handled with investigation steps before action steps",
    ],
    maxTokenBudget: 600,
    hints: [
      "Require each step to declare its dependencies explicitly.",
      "Ask for a distinction between parallel-safe and sequential steps.",
      "Tell the planner what to do when the goal is vague or underspecified.",
    ],
    sampleSolution:
      'You are a Task Planner agent. Your job is to decompose complex goals into structured, executable plans.\n\nFor every goal, produce an ordered plan with these rules:\n\n1. Each step must be specific and actionable (not "handle the thing").\n2. Each step must declare its dependencies on other steps.\n3. Steps with no dependencies on each other can run in parallel.\n4. If the goal is vague, start with investigation/diagnosis steps before action steps.\n\nOutput format (JSON):\n{"goal": "...", "steps": [{"id": 1, "action": "...", "dependencies": [], "parallel_safe": true, "expected_output": "..."}], "estimated_complexity": "low|medium|high"}\n\nRules:\n- No step may depend on a step that comes after it.\n- Maximum 10 steps. If the task needs more, break it into phases.\n- When the goal is vague (e.g., "make it better"), the first step must ALWAYS be diagnosis/investigation, never a blind action.\n- Each step\'s expected_output should describe what success looks like so downstream steps know what to expect.',
  },
  {
    patternSlug: "multi-agent-collaboration",
    title: "Write a Team Coordinator Prompt",
    scenario:
      "You're building a multi-agent content creation system with a Writer, Editor, and Fact-Checker. Write the system prompt for the Coordinator that manages the workflow between them.",
    agentRole: "Team Coordinator",
    contextDoc:
      "The Coordinator manages three specialist agents: Writer (produces drafts), Editor (improves style and clarity), and Fact-Checker (verifies claims). The Coordinator decides the workflow order and handles disagreements.",
    testCases: [
      {
        id: "tc-1",
        userMessage: "Create a 500-word article about quantum computing breakthroughs in 2026.",
        expectedBehavior:
          "Must orchestrate: Writer first, then Fact-Checker and Editor can work in parallel on the draft, then Coordinator merges feedback. Should define clear handoff points between agents.",
        weight: 35,
      },
      {
        id: "tc-2",
        userMessage: "The Writer produced a draft but the Fact-Checker found 3 factual errors and the Editor wants to restructure the entire piece. How do you proceed?",
        expectedBehavior:
          "Must prioritize factual corrections over style changes. Should send back to Writer with Fact-Checker's corrections first, then to Editor. Must have a conflict resolution strategy.",
        weight: 35,
      },
      {
        id: "tc-3",
        userMessage: "The Writer is stuck and hasn't produced a draft after two attempts.",
        expectedBehavior:
          "Must have a fallback strategy: simplify the task, provide the Writer with an outline, or reassign. Should not infinitely loop on a failing agent.",
        weight: 30,
      },
    ],
    rubric: [
      "Must define clear workflow stages with handoff criteria between agents",
      "Must have a conflict resolution strategy when agents disagree",
      "Must handle agent failures with fallback strategies (not infinite loops)",
      "Must track iteration count and enforce a maximum to prevent runaway loops",
    ],
    maxTokenBudget: 600,
    hints: [
      "Define the workflow stages: Draft → Review → Revise → Finalize.",
      "Specify what happens when the Fact-Checker and Editor give conflicting feedback.",
      "Set a maximum number of revision cycles to prevent infinite loops.",
    ],
    sampleSolution:
      'You are a Team Coordinator managing a multi-agent content creation pipeline.\n\nYour agents:\n- **Writer**: Produces article drafts based on briefs.\n- **Fact-Checker**: Verifies all claims, statistics, and named entities against known sources.\n- **Editor**: Improves clarity, structure, tone, and readability.\n\nWorkflow:\n1. DRAFT: Send the request to Writer. Expect a complete draft.\n2. REVIEW: Send the draft to Fact-Checker AND Editor in parallel.\n3. MERGE: Combine feedback. Factual corrections take priority over style suggestions.\n4. REVISE: Send merged feedback to Writer for revision.\n5. FINAL CHECK: One last pass by Fact-Checker to verify corrections were applied.\n\nConflict Resolution:\n- Factual accuracy ALWAYS beats style preferences.\n- If Fact-Checker and Editor disagree on framing, Fact-Checker wins.\n- If Editor suggests restructuring, it waits until factual issues are resolved first.\n\nFailure Handling:\n- If any agent fails twice on the same task, simplify the task (e.g., provide an outline to Writer).\n- Maximum 3 revision cycles. After 3, publish with a note about remaining issues.\n- If Writer is stuck, provide a structured outline based on the topic.\n\nOutput at each stage (JSON):\n{"stage": "...", "next_agent": "...", "instructions": "...", "iteration": N, "max_iterations": 3}',
  },
];

const configMap = new Map(promptLabConfigs.map((c) => [c.patternSlug, c]));

export function getPromptLabConfig(slug: string): PromptLabConfig | undefined {
  return configMap.get(slug);
}

export function hasPromptLabConfig(slug: string): boolean {
  return configMap.has(slug);
}

export { promptLabConfigs };
