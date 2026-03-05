export interface PMModule {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  whyItMatters: string;
  keyDecisions: string[];
  questionsForEngineering: string[];
  relatedPatterns: string[];
  icon: "layers" | "compass" | "zap" | "shield-check" | "plug" | "users" | "brain" | "bar-chart" | "git-branch" | "search";
}

export const pmModules: PMModule[] = [
  {
    id: "pm-task-orchestration",
    slug: "task-orchestration",
    number: 1,
    title: "Task Orchestration",
    subtitle: "How agents break work into steps",
    icon: "layers",
    description:
      "Agents don't solve complex problems in one shot. They decompose them into a sequence of smaller steps — just like a project plan. Understanding this helps you define realistic scope, set latency expectations, and write better PRDs for agentic features.",
    whyItMatters:
      "Every extra step in an agent's chain adds latency and cost. As a PM, you decide how many steps are acceptable. A 3-step chain might take 5 seconds; a 10-step chain might take 30 seconds. Your UX must account for this. You also decide where to add validation checkpoints — points where the agent verifies its work before moving on.",
    keyDecisions: [
      "How many steps can your UX tolerate before users drop off?",
      "Which steps need deterministic validation (hard checks) vs. AI judgment?",
      "Should the agent plan its own steps dynamically, or follow a fixed workflow?",
      "What happens when a step fails mid-chain — retry, skip, or escalate?",
    ],
    questionsForEngineering: [
      "What's the expected latency per step in our chain?",
      "Can we show progressive results as each step completes?",
      "Where should we add validation gates between steps?",
      "Do we need dynamic planning or is a fixed pipeline sufficient?",
    ],
    relatedPatterns: ["Prompt Chaining", "Planning", "Prioritization"],
  },
  {
    id: "pm-intelligent-routing",
    slug: "intelligent-routing",
    number: 2,
    title: "Intelligent Routing",
    subtitle: "Choosing the right path automatically",
    icon: "compass",
    description:
      "Not every user request needs the same treatment. Routing lets your agent classify what the user wants and send it to the best-fit handler — a cheaper model for simple questions, a specialized one for complex tasks. This directly impacts your cost structure and response quality.",
    whyItMatters:
      "Routing is your biggest lever for cost optimization. A simple FAQ lookup doesn't need a $0.03/request frontier model — a $0.001 model works fine. But a complex analysis does. Smart routing can cut your AI costs by 60-80% while maintaining quality where it matters. It also determines which user segments get which experience.",
    keyDecisions: [
      "What categories of requests does your product handle?",
      "Which categories justify expensive models vs. cheap ones?",
      "What's the acceptable misrouting rate before user experience degrades?",
      "Should you expose the routing decision to users (e.g., 'Using advanced analysis...')?",
    ],
    questionsForEngineering: [
      "What's our classification accuracy for routing decisions?",
      "What's the cost difference between our model tiers?",
      "Can we A/B test routing strategies to optimize cost vs. quality?",
      "How do we monitor and correct misrouted requests?",
    ],
    relatedPatterns: ["Routing", "Resource-Aware Optimization", "Reasoning Techniques"],
  },
  {
    id: "pm-speed-at-scale",
    slug: "speed-at-scale",
    number: 3,
    title: "Speed & Parallel Processing",
    subtitle: "Making agents fast enough for production",
    icon: "zap",
    description:
      "Agents can run multiple tasks at the same time — researching, analyzing, and drafting simultaneously instead of sequentially. This dramatically reduces wait times. But each parallel branch costs money, so you're trading dollars for speed.",
    whyItMatters:
      "User patience is measured in seconds. A sequential 5-step agent taking 25 seconds will lose users. Running 3 of those steps in parallel might cut it to 12 seconds. But 3 parallel branches = 3x the API cost for that portion. You must define the right balance between speed, cost, and output quality for each use case.",
    keyDecisions: [
      "What's the maximum acceptable response time for your use case?",
      "Which tasks are independent and can run simultaneously?",
      "Is the cost of parallel execution justified by the UX improvement?",
      "Should you show a progress indicator or stream partial results?",
    ],
    questionsForEngineering: [
      "What's our current end-to-end latency and where are the bottlenecks?",
      "Which steps can we safely parallelize without dependency issues?",
      "What's the cost impact of running N branches in parallel?",
      "Can we implement progressive streaming to show results as they arrive?",
    ],
    relatedPatterns: ["Parallelization"],
  },
  {
    id: "pm-quality-self-correction",
    slug: "quality-self-correction",
    number: 4,
    title: "Quality & Self-Correction",
    subtitle: "How agents check and improve their own work",
    icon: "shield-check",
    description:
      "Agents can review their own output, spot errors, and try again — like built-in QA. This is called Reflection. You can also have separate evaluator agents that score quality. This is how you go from 'demo-quality' to 'production-quality' AI.",
    whyItMatters:
      "Without self-correction, agents produce first-draft quality every time. With reflection, they can catch hallucinations, fix formatting, and improve accuracy — but each reflection cycle doubles latency. You need to define 'good enough' for each feature and decide how many correction cycles are worth the wait.",
    keyDecisions: [
      "What quality bar must the agent meet before showing output to users?",
      "How many self-correction cycles are acceptable given your latency budget?",
      "Should quality checks run on every response or only flagged ones?",
      "What metrics define 'good enough' (accuracy, tone, completeness)?",
    ],
    questionsForEngineering: [
      "What's our hallucination rate with and without reflection?",
      "How much latency does each reflection cycle add?",
      "Can we use a cheaper model for the critique step?",
      "What evaluation metrics are we tracking in production?",
    ],
    relatedPatterns: ["Reflection", "Evaluation & Monitoring", "Goal Setting & Monitoring"],
  },
  {
    id: "pm-tool-integration",
    slug: "tool-integration",
    number: 5,
    title: "Connecting to the Real World",
    subtitle: "Tools, data, and external systems",
    icon: "plug",
    description:
      "Agents are only useful when they can access real data — your database, APIs, documents, and enterprise systems. Tool Use lets agents call external functions. RAG lets agents search your knowledge base. MCP standardizes how agents connect to everything.",
    whyItMatters:
      "This is where agents go from 'neat demo' to 'real product.' An agent that can look up customer data, search your docs, and call your APIs is transformative. But every tool is a potential security risk and failure point. You must decide which tools to expose, what permissions to grant, and how to handle tool failures gracefully.",
    keyDecisions: [
      "Which internal systems should the agent be able to access?",
      "What data should agents read vs. write? (Read-only is much safer)",
      "Do you need RAG (searching your own documents) or live API calls?",
      "What happens when an external tool fails mid-task?",
    ],
    questionsForEngineering: [
      "What tools are we exposing and what permissions do they have?",
      "What's our RAG retrieval accuracy — are we getting the right documents?",
      "How do we handle API failures or timeouts gracefully?",
      "Are we using MCP or custom integrations for tool connections?",
    ],
    relatedPatterns: ["Tool Use", "State Management (MCP)", "Knowledge Retrieval (RAG)"],
  },
  {
    id: "pm-multi-agent-teams",
    slug: "multi-agent-teams",
    number: 6,
    title: "Multi-Agent Teams",
    subtitle: "When one agent isn't enough",
    icon: "users",
    description:
      "Complex products may need multiple specialized agents working together — a researcher, a writer, a reviewer — like a team of digital employees. Each agent has a specific role and they pass work between each other through defined protocols.",
    whyItMatters:
      "Multi-agent systems are powerful but expensive and complex. Each 'conversation' between agents burns tokens and adds latency. As a PM, you decide whether the task complexity justifies multiple agents or if a single well-designed agent can handle it. Most products start with one agent and scale to multi-agent only when needed.",
    keyDecisions: [
      "Does your use case genuinely need multiple agents or can one suffice?",
      "What are the distinct roles/specializations needed?",
      "How should agents hand off work to each other?",
      "What's the cost ceiling for multi-agent interactions?",
    ],
    questionsForEngineering: [
      "What's the token cost per multi-agent conversation?",
      "How do we trace and debug issues across multiple agents?",
      "Can we start with a single agent and upgrade to multi-agent later?",
      "What orchestration framework are we using (CrewAI, LangGraph, AutoGen)?",
    ],
    relatedPatterns: ["Multi-Agent Collaboration", "Inter-Agent Communication (A2A)"],
  },
  {
    id: "pm-memory-personalization",
    slug: "memory-personalization",
    number: 7,
    title: "Memory & Personalization",
    subtitle: "Agents that remember and improve",
    icon: "brain",
    description:
      "Agents can maintain memory across conversations — remembering user preferences, past interactions, and learned behaviors. Short-term memory keeps track of the current conversation. Long-term memory persists across sessions, enabling true personalization.",
    whyItMatters:
      "Memory is what turns a generic AI into a personalized assistant. But it comes with real tradeoffs: storing user data requires compliance (GDPR, SOC 2), memory retrieval adds latency, and agents can 'learn' wrong things from bad interactions (drift). You must define data retention policies and decide what's worth remembering.",
    keyDecisions: [
      "What should the agent remember across sessions vs. forget?",
      "How long should memories be retained (compliance implications)?",
      "Can users view, edit, or delete what the agent remembers about them?",
      "How do you prevent the agent from learning incorrect behaviors?",
    ],
    questionsForEngineering: [
      "What's our memory storage architecture (vector DB, cache, etc.)?",
      "How do we handle PII in long-term memory?",
      "What's the latency cost of memory retrieval?",
      "How do we detect and correct behavioral drift over time?",
    ],
    relatedPatterns: ["Memory Management", "Learning & Adaptation"],
  },
  {
    id: "pm-safety-guardrails",
    slug: "safety-guardrails",
    number: 8,
    title: "Safety, Guardrails & Human Oversight",
    subtitle: "Keeping agents safe in production",
    icon: "shield-check",
    description:
      "Agents can go off-rails — generating harmful content, leaking PII, or taking unintended actions. Guardrails are architectural filters that check every input and output. Human-in-the-Loop inserts manual approval at critical decision points. Exception handling ensures graceful recovery when things fail.",
    whyItMatters:
      "This is your liability layer. One wrong agent action can create legal, financial, or reputational damage. You must define which actions need human approval (payments, data deletion, public communications), what content must be filtered, and how the agent behaves when it encounters something unexpected. Enterprise buyers will ask about this first.",
    keyDecisions: [
      "Which agent actions require human approval before execution?",
      "What content must be filtered (PII, harmful content, off-brand tone)?",
      "What's your escalation path when the agent encounters an edge case?",
      "How do you balance safety checks with response speed?",
    ],
    questionsForEngineering: [
      "What guardrail models are we using for input/output filtering?",
      "How do we implement human-in-the-loop without blocking the UX?",
      "What's our error recovery strategy when tools or models fail?",
      "How do we audit agent actions for compliance?",
    ],
    relatedPatterns: ["Guardrails & Safety", "Human-in-the-Loop", "Exception Handling & Recovery"],
  },
  {
    id: "pm-measuring-success",
    slug: "measuring-success",
    number: 9,
    title: "Measuring Agent Success",
    subtitle: "Metrics, evaluation, and monitoring",
    icon: "bar-chart",
    description:
      "Traditional metrics (page views, click rates) don't capture agent quality. You need new metrics: task completion rate, hallucination rate, user satisfaction with agent output, cost per task, and latency percentiles. Evaluation frameworks use 'LLM-as-a-Judge' to score quality at scale.",
    whyItMatters:
      "If you can't measure it, you can't improve it. Agent quality is subjective and probabilistic — the same prompt might produce different results. You need automated evaluation pipelines that continuously score your agent's output, detect quality degradation, and alert when performance drops. This is how you build stakeholder confidence.",
    keyDecisions: [
      "What are your primary success metrics (completion rate, accuracy, CSAT)?",
      "How do you define and detect hallucinations for your domain?",
      "What's your cost budget per agent task?",
      "How often should you evaluate agent quality (real-time vs. batch)?",
    ],
    questionsForEngineering: [
      "What evaluation framework are we using?",
      "Can we set up automated quality scoring with LLM-as-a-Judge?",
      "What's our current hallucination rate and how do we track it?",
      "Do we have alerting for quality degradation in production?",
    ],
    relatedPatterns: ["Evaluation & Monitoring", "Goal Setting & Monitoring"],
  },
  {
    id: "pm-maturity-roadmap",
    slug: "maturity-roadmap",
    number: 10,
    title: "Your Agentic AI Roadmap",
    subtitle: "From chatbot to autonomous system",
    icon: "git-branch",
    description:
      "Agentic AI adoption follows five maturity levels: L0 (simple chatbot), L1 (tool-calling), L2 (multi-step reasoning), L3 (memory and context-aware), L4 (autonomous multi-agent). Each level unlocks new capabilities but adds complexity. Your roadmap should be a deliberate progression, not a leap to L4.",
    whyItMatters:
      "Most products should start at L1-L2 and graduate upward. Jumping to L4 (multi-agent) before you've nailed L1 (reliable tool-calling) leads to fragile, expensive systems. As a PM, you define the maturity milestones, set the timeline, and manage stakeholder expectations. The Gartner stat is real: 1,445% surge in interest, but <25% reach production.",
    keyDecisions: [
      "What maturity level is your current product at?",
      "What level do you need to reach for your next milestone?",
      "Which capabilities from each level deliver the most user value?",
      "What's a realistic timeline for graduating between levels?",
    ],
    questionsForEngineering: [
      "What's the engineering effort to move from our current level to the next?",
      "What infrastructure do we need for the next maturity level?",
      "Which patterns should we implement first for maximum impact?",
      "What are the risks of moving too fast vs. too slow?",
    ],
    relatedPatterns: ["Exploration & Discovery"],
  },
];
