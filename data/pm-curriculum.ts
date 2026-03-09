export interface PMModuleSection {
  heading: string;
  body: string;
  bullets?: string[];
}

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
  icon: "layers" | "compass" | "zap" | "shield-check" | "plug" | "users" | "brain" | "bar-chart" | "git-branch" | "search" | "terminal";
  /** If true, this module is accessible without sign-up */
  isFree?: boolean;
  /** If true, do not show the "Free" badge on the card (module can still be free to access) */
  hideFreeBadge?: boolean;
  /** Optional long-form sections for deep-dive modules */
  sections?: PMModuleSection[];
}

export const pmModules: PMModule[] = [
  // --- Module 1: Becoming AI-Native ---
  {
    id: "pm-ai-native-foundations",
    slug: "ai-native-foundations",
    number: 1,
    title: "Becoming AI-Native",
    subtitle: "What agents and MCP actually are — and why every PM needs to understand them now",
    icon: "terminal",
    isFree: true,
    hideFreeBadge: true,
    description:
      "This is the foundation module. It answers the three questions every PM is quietly Googling: What exactly is an AI agent? What is MCP and why does everyone keep talking about it? And what does it mean to become AI-native as a product organization? The module establishes the vocabulary, mental models, and strategic lens that every subsequent module builds on.",
    whyItMatters:
      "If you cannot explain what an agent is in a stakeholder meeting, you lose credibility the moment your engineering team starts building one. If you do not understand MCP, you will miss the biggest infrastructure shift since REST APIs. This module gives PMs the fluency to lead conversations, not just follow them.",
    keyDecisions: [
      "Is your product adding AI as a feature, or redesigning around AI as the core experience?",
      "Should your team adopt MCP now, or wait for the ecosystem to mature?",
      "Where on the L0–L4 spectrum should your first AI feature land?",
      "How do you communicate agent capabilities and limitations to non-technical stakeholders?",
    ],
    questionsForEngineering: [
      "Are we building stateless AI features or persistent agents with memory and tool access?",
      "Have we evaluated MCP servers for our existing integrations (Slack, databases, CRMs)?",
      "What infrastructure do we need to support agents that call tools and maintain state?",
    ],
    relatedPatterns: ["Tool Use", "State Management (MCP)", "Prompt Chaining", "Planning", "Human-in-the-Loop"],
    sections: [
      {
        heading: "What Is an AI Agent?",
        body: "An AI agent is software that uses a large language model as its reasoning engine to autonomously pursue goals. Unlike a chatbot that responds to one message at a time, an agent can plan multi-step tasks, use external tools, make decisions, and iterate on its own work. The core loop: perceive, reason, act, observe, repeat. Autonomy exists on a spectrum from suggest-and-wait to execute-independently. Real examples: coding agents that write and test code, research agents that compile reports, support agents that resolve tickets end-to-end.",
      },
      {
        heading: "The Five Levels of Agent Autonomy",
        body: "L0 is a basic chatbot with no tools or memory. L1 is a tool-calling assistant that follows fixed workflows. L2 is a reasoning agent that plans its own steps and chooses tools dynamically. L3 is a persistent agent with cross-session memory and learned preferences. L4 is a multi-agent system where specialized agents collaborate. Most production products today are L1–L2. The PM's job is to decide which level each feature needs and when to graduate upward.",
      },
      {
        heading: "What Is MCP (Model Context Protocol)?",
        body: "MCP is an open standard created by Anthropic that defines how agents connect to external tools and data. Before MCP, every agent-to-tool connection was custom-built. MCP is the universal plug. It standardizes how agents discover tools, call them, and handle responses. An MCP server exposes tools (functions) and resources (data). An MCP client (the agent) discovers and calls them. This makes integrations portable across LLM providers.",
      },
      {
        heading: "Why MCP Changes Everything for Product Teams",
        body: "Integration speed drops from weeks to hours. Tool connections become composable and portable. The security boundary is clearly defined. Product teams can promise real integrations, not vaporware. When you swap LLM providers, your tool layer stays intact.",
      },
      {
        heading: "The Three Waves: LLMs to Agents to MCP",
        body: "Wave 1 (2022–2023): LLMs showed AI could generate human-quality text and code. Products added summarization, chatbots, smart search. Wave 2 (2024–2025): wrapping LLMs in agentic loops created multi-step task completion. Wave 3 (2025–2026): MCP gave agents a universal standard for connecting to real systems. LLMs gave agents a brain, tool use gave them hands, MCP gave them a universal way to plug into the world.",
      },
      {
        heading: "What AI-Native Actually Means",
        body: "AI-native does not mean adding a chatbot to your app. It means the product is designed from the ground up around AI capabilities. AI-as-feature: bolt-on chatbot, AI summaries, smart search. AI-native: the entire UX is intent-driven, not menu-driven. Example: AI-as-feature says the AI suggests email replies. AI-native says the AI reads, triages, drafts, and sends emails on your behalf with approval gates. The shift requires rethinking UX from buttons and menus to goals and approvals.",
      },
      {
        heading: "The AI-Native PM Skill Set",
        body: "Understand the cost model (every LLM call costs money, think in tokens). Think in loops, not requests (agents iterate and self-correct). Design for uncertainty (AI output is probabilistic). Know the safety stack (guardrails, human-in-the-loop, content filtering). Speak the vocabulary (agent, tool use, RAG, MCP, prompt chaining, reflection). Evaluate trade-offs (speed vs. quality, autonomy vs. control, cost vs. capability).",
      },
    ],
  },
  // --- Module 2: AI Product Discovery ---
  {
    id: "pm-ai-product-discovery",
    slug: "ai-product-discovery",
    number: 2,
    title: "AI Product Discovery",
    subtitle: "Knowing what to build before you build it",
    icon: "compass",
    description:
      "AI makes building fast. Cursor, Claude Code, and Replit Agent mean a prototype can exist in hours. This is revolutionary, but it creates a new risk: building the wrong thing faster. The PM's highest-value skill is no longer managing a backlog. It is identifying which problems are genuinely worth solving with AI, and which are just impressive demos that nobody needs. This module teaches the discovery frameworks specific to AI products.",
    whyItMatters:
      "Every team has more AI ideas than capacity. The teams that win are the ones that ruthlessly filter for ideas where AI creates genuine user value, not just technical novelty. Without a disciplined discovery process, you will build features that impress in demos but get ignored in production. This module is the filter.",
    keyDecisions: [
      "Which of your product's workflows score highest on the 5-dimension audit?",
      "For your top AI candidate, does it pass the 80% automation test?",
      "Does the user trust profile (stakes, reversibility, transparency) support an autonomous agent or a copilot?",
      "Are competitors already shipping agent features in your category? Where are the gaps?",
      "Is traditional automation (Zapier, scripts) a better fit than an AI agent for any of your candidates?",
    ],
    questionsForEngineering: [
      "For our top workflow candidate, what is the technical feasibility to automate 80% of it?",
      "What data do we have access to that would power the agent's decisions?",
      "What is the simplest possible prototype we could build to test user reaction?",
      "What existing tools or MCP servers could we leverage to accelerate the prototype?",
    ],
    relatedPatterns: ["Tool Use", "Planning", "Human-in-the-Loop"],
  },
  // --- Module 3: The PM Prototyping Toolkit ---
  {
    id: "pm-prototyping-toolkit",
    slug: "pm-prototyping-toolkit",
    number: 3,
    title: "The PM Prototyping Toolkit",
    subtitle: "From idea to working prototype in hours, not sprints",
    icon: "layers",
    description:
      "This is the module no other AI curriculum has. The core insight: tools like Cursor, Claude Code, Replit Agent, v0, Lovable, and Bolt have made it possible for non-engineers to build functional prototypes in hours. This does not make PMs into engineers. It collapses the feedback loop from weeks to hours. Instead of writing a PRD, waiting for a sprint, and hoping the team built what you imagined, you can show a working prototype in your next stakeholder meeting. The shift is from spec-then-build to build-then-learn.",
    whyItMatters:
      "The PM who walks into a meeting with a working prototype is 10x more convincing than the PM with a slide deck. Prototyping also eliminates the most expensive mistake in product development: building the wrong thing. When a prototype takes 4 hours instead of 4 weeks, you can test 10 ideas in the time it used to take to build one. This is not about replacing engineers. It is about making the discovery phase dramatically faster and more concrete.",
    keyDecisions: [
      "Which tool is the best fit for the type of prototype you need (UI, full-stack, CLI, data)?",
      "Is the goal to validate a user hypothesis or to demonstrate technical feasibility?",
      "How will you frame the prototype to stakeholders so it is treated as a test, not a commitment?",
      "What is the cheapest, fastest way to test your riskiest assumption?",
    ],
    questionsForEngineering: [
      "Can you review this prototype and tell me what would change if we built it for production?",
      "What technical constraints does the real system have that the prototype does not account for?",
      "How far is this prototype from a production-ready MVP?",
    ],
    relatedPatterns: ["Tool Use", "Planning", "Prompt Chaining"],
  },
  // --- Module 4: Task Orchestration ---
  {
    id: "pm-task-orchestration",
    slug: "task-orchestration",
    number: 4,
    title: "Task Orchestration",
    subtitle: "How agents break work into steps",
    icon: "layers",
    description:
      "Agents do not solve complex problems in one shot. They decompose them into a sequence of smaller steps, like a project plan. This module teaches PMs how to think about step decomposition, how each step adds latency and cost, and how to design workflows that balance thoroughness with speed. Understanding orchestration is essential for writing realistic PRDs for any agentic feature.",
    whyItMatters:
      "Every extra step in an agent's chain adds latency and cost. A 3-step chain might take 5 seconds and cost $0.01. A 10-step chain might take 30 seconds and cost $0.05. Your UX must account for this. You also decide where to add validation checkpoints where the agent verifies its work before moving on. This directly shapes the user experience.",
    keyDecisions: [
      "How many steps can your UX tolerate before users drop off?",
      "Which steps need deterministic validation (hard checks) vs. AI judgment?",
      "Should the agent plan its own steps dynamically, or follow a fixed workflow?",
      "What happens when a step fails mid-chain: retry, skip, or escalate?",
    ],
    questionsForEngineering: [
      "What is the expected latency per step in our chain?",
      "Can we show progressive results as each step completes?",
      "Where should we add validation gates between steps?",
      "Do we need dynamic planning or is a fixed pipeline sufficient?",
    ],
    relatedPatterns: ["Prompt Chaining", "Planning", "Prioritization"],
  },
  // --- Module 5: Intelligent Routing ---
  {
    id: "pm-intelligent-routing",
    slug: "intelligent-routing",
    number: 5,
    title: "Intelligent Routing",
    subtitle: "Choosing the right path automatically",
    icon: "compass",
    description:
      "Not every user request needs the same treatment. Routing classifies what the user wants and sends it to the best-fit handler: a cheaper model for simple questions, a specialized one for complex tasks. This is the single biggest lever for cost optimization in AI products and directly impacts your unit economics.",
    whyItMatters:
      "A simple FAQ lookup does not need a $0.03/request frontier model. A $0.001 model works fine. But a complex multi-step analysis does need the expensive model. Smart routing can cut AI costs by 60–80% while maintaining quality where it matters. This module teaches PMs how to define routing categories, set cost tiers, and monitor misrouting rates.",
    keyDecisions: [
      "What categories of requests does your product handle?",
      "Which categories justify expensive models vs. cheap ones?",
      "What is the acceptable misrouting rate before user experience degrades?",
      "Should you expose the routing decision to users (e.g., Using advanced analysis)?",
    ],
    questionsForEngineering: [
      "What is our classification accuracy for routing decisions?",
      "What is the cost difference between our model tiers?",
      "Can we A/B test routing strategies to optimize cost vs. quality?",
      "How do we handle fallback when the cheap model underperforms?",
    ],
    relatedPatterns: ["Routing", "Resource-Aware Optimization", "Reasoning Techniques"],
  },
  // --- Module 6: Speed & Parallel Processing ---
  {
    id: "pm-speed-at-scale",
    slug: "speed-at-scale",
    number: 6,
    title: "Speed & Parallel Processing",
    subtitle: "Making agents fast enough for production",
    icon: "zap",
    description:
      "Agents can run multiple tasks simultaneously: researching, analyzing, and drafting at the same time instead of sequentially. This dramatically reduces wait times. But each parallel branch costs money, so you are trading dollars for speed. This module teaches PMs how to identify parallelizable tasks, calculate cost-speed trade-offs, and design UX for progressive results.",
    whyItMatters:
      "User patience is measured in seconds. A sequential 5-step agent taking 25 seconds will lose users. Running 3 of those steps in parallel might cut total time to 12 seconds. But 3 parallel branches mean 3x the API cost for that portion. The PM must define the right balance for each use case.",
    keyDecisions: [
      "What is the maximum acceptable response time for your use case?",
      "Which tasks are independent and can run simultaneously?",
      "Is the cost of parallel execution justified by the UX improvement?",
      "Should you show a progress indicator or stream partial results?",
    ],
    questionsForEngineering: [
      "What is our current end-to-end latency and where are the bottlenecks?",
      "Which steps can we safely parallelize without dependency issues?",
      "What is the cost impact of running N branches in parallel?",
      "Can we implement progressive streaming to show results as they arrive?",
    ],
    relatedPatterns: ["Parallelization"],
  },
  // --- Module 7: Quality & Self-Correction ---
  {
    id: "pm-quality-self-correction",
    slug: "quality-self-correction",
    number: 7,
    title: "Quality & Self-Correction",
    subtitle: "How agents check and improve their own work",
    icon: "shield-check",
    description:
      "Agents can review their own output, spot errors, and try again. This is called Reflection. You can also have separate evaluator agents that score quality. This module teaches PMs how to define quality bars, design eval-driven development workflows, and balance reflection cycles with latency budgets.",
    whyItMatters:
      "Without self-correction, agents produce first-draft quality every time. With reflection, they catch hallucinations, fix formatting, and improve accuracy. But each reflection cycle roughly doubles latency. The PM defines good enough for each feature and decides how many correction cycles are worth the wait. This module also introduces eval-driven development: write your evaluation criteria BEFORE you build the feature, just like writing acceptance criteria before development.",
    keyDecisions: [
      "What quality bar must the agent meet before showing output to users?",
      "How many self-correction cycles are acceptable given your latency budget?",
      "Have you written evaluation criteria BEFORE building the feature?",
      "What does good enough mean for this specific feature and user segment?",
    ],
    questionsForEngineering: [
      "What is our hallucination rate with and without reflection?",
      "How much latency does each reflection cycle add?",
      "Can we use a cheaper model for the critique/judge step?",
      "Do we have an automated eval pipeline running in CI/CD?",
    ],
    relatedPatterns: ["Reflection", "Evaluation & Monitoring", "Goal Setting & Monitoring"],
  },
  // --- Module 8: RAG & Knowledge Systems ---
  {
    id: "pm-rag-knowledge",
    slug: "rag-knowledge-systems",
    number: 8,
    title: "RAG & Knowledge Systems",
    subtitle: "How your agent knows what your company knows",
    icon: "search",
    description:
      "Retrieval-Augmented Generation (RAG) is the most common architecture pattern in production AI products. It lets your agent search your company's documents, databases, and knowledge bases to ground its responses in real, accurate information rather than relying solely on its training data. This module gives PMs the complete picture: what RAG is, when to use it vs. alternatives, how to evaluate retrieval quality, and the common failures to test for.",
    whyItMatters:
      "Almost every enterprise AI feature needs RAG. If your agent answers questions about your product, searches internal documentation, or references company data, RAG is involved. PMs who do not understand RAG cannot evaluate whether their agent's answers are good or debug why they are wrong. This is the single most important architecture concept for most PM use cases.",
    keyDecisions: [
      "Does your feature need RAG, fine-tuning, or can a large context window suffice?",
      "What documents and data sources should the agent have access to?",
      "How often does your knowledge base change, and what is your update pipeline?",
      "What retrieval quality metrics (recall, precision) are acceptable for your use case?",
      "Have you tested for the 5 common RAG failure modes?",
    ],
    questionsForEngineering: [
      "What is our current retrieval accuracy (recall and precision)?",
      "What chunk size and overlap are we using, and have we tested alternatives?",
      "How do we handle document updates in the knowledge base?",
      "What vector database are we using and what are the scaling implications?",
    ],
    relatedPatterns: ["Knowledge Retrieval (RAG)", "Tool Use", "Evaluation & Monitoring"],
  },
  // --- Module 9: Tools, APIs & MCP Integrations ---
  {
    id: "pm-tools-apis-mcp",
    slug: "tools-apis-mcp",
    number: 9,
    title: "Tools, APIs & MCP Integrations",
    subtitle: "How agents connect to real-world systems",
    icon: "plug",
    description:
      "This module focuses on the tool use layer: how agents call external APIs, execute functions, and interact with real systems through MCP. With RAG covered separately in Module 8, this module concentrates on the action side: agents that do things in the real world, not just retrieve information.",
    whyItMatters:
      "This is where agents go from neat demo to real product. An agent that can look up customer data, create tickets, send emails, and update your CRM is transformative. But every tool is a potential security risk and failure point. The PM must decide which tools to expose, what permissions to grant, and how to handle failures gracefully.",
    keyDecisions: [
      "Which internal systems should the agent be able to access?",
      "What data should agents read vs. write? What actions are irreversible?",
      "What happens when an external tool fails mid-task?",
      "Are you using MCP for standardized integrations or custom API wrappers?",
    ],
    questionsForEngineering: [
      "What tools are we exposing and what permissions do they have?",
      "How do we handle API failures or timeouts gracefully?",
      "Are we using MCP or custom integrations for tool connections?",
      "What is the latency cost of each tool call?",
    ],
    relatedPatterns: ["Tool Use", "State Management (MCP)", "Exception Handling & Recovery"],
  },
  // --- Module 10: Multi-Agent Teams ---
  {
    id: "pm-multi-agent-teams",
    slug: "multi-agent-teams",
    number: 10,
    title: "Multi-Agent Teams",
    subtitle: "When one agent is not enough",
    icon: "users",
    description:
      "Complex products may need multiple specialized agents working together: a researcher, a writer, a reviewer, like a team of digital employees. Each agent has a specific role and they pass work between each other through defined protocols. This module also introduces Google's Agent-to-Agent (A2A) protocol, which standardizes how agents from different systems communicate.",
    whyItMatters:
      "Multi-agent systems are powerful but expensive and complex. Each conversation between agents burns tokens and adds latency. The PM decides whether the task complexity justifies multiple agents or if a single well-designed agent can handle it. Most products start with one agent and scale to multi-agent only when needed.",
    keyDecisions: [
      "Does your use case genuinely need multiple agents or can one suffice?",
      "What are the distinct roles/specializations needed?",
      "Which topology (hub-spoke, pipeline, peer review, competitive) fits your workflow?",
      "What is the cost ceiling for multi-agent interactions?",
    ],
    questionsForEngineering: [
      "What is the token cost per multi-agent conversation?",
      "How do we trace and debug issues across multiple agents?",
      "Can we start with a single agent and upgrade to multi-agent later?",
      "What orchestration framework are we using (CrewAI, LangGraph, AutoGen)?",
    ],
    relatedPatterns: ["Multi-Agent Collaboration", "Inter-Agent Communication (A2A)"],
  },
  // --- Module 11: Memory & Personalization ---
  {
    id: "pm-memory-personalization",
    slug: "memory-personalization",
    number: 11,
    title: "Memory & Personalization",
    subtitle: "Agents that remember and improve",
    icon: "brain",
    description:
      "Agents can maintain memory across conversations: remembering user preferences, past interactions, and learned behaviors. Short-term memory keeps track of the current conversation. Long-term memory persists across sessions, enabling true personalization. This module covers the architecture, compliance implications, and product design patterns for agent memory.",
    whyItMatters:
      "Memory is what turns a generic AI into a personalized assistant. But it comes with real trade-offs: storing user data requires compliance (GDPR, SOC 2), memory retrieval adds latency, and agents can learn wrong things from bad interactions (drift). The PM defines data retention policies and decides what is worth remembering.",
    keyDecisions: [
      "What should the agent remember across sessions vs. forget?",
      "How long should memories be retained (compliance implications)?",
      "Can users view, edit, or delete what the agent remembers about them?",
      "How do you prevent the agent from learning incorrect behaviors?",
    ],
    questionsForEngineering: [
      "What is our memory storage architecture (vector DB, cache, etc.)?",
      "How do we handle PII in long-term memory?",
      "What is the latency cost of memory retrieval?",
      "How do we detect and correct behavioral drift over time?",
    ],
    relatedPatterns: ["Memory Management", "Learning & Adaptation"],
  },
  // --- Module 12: Safety, Guardrails & Human Oversight ---
  {
    id: "pm-safety-guardrails",
    slug: "safety-guardrails",
    number: 12,
    title: "Safety, Guardrails & Human Oversight",
    subtitle: "Keeping agents safe in production",
    icon: "shield-check",
    description:
      "Agents can go off-rails: generating harmful content, leaking PII, or taking unintended actions. Guardrails are architectural filters that check every input and output. Human-in-the-Loop inserts manual approval at critical decision points. This module covers the full safety stack that enterprise buyers will ask about first.",
    whyItMatters:
      "This is your liability layer. One wrong agent action can create legal, financial, or reputational damage. The PM defines which actions need human approval, what content must be filtered, and how the agent behaves when encountering unexpected situations. Enterprise buyers will evaluate your safety architecture before they evaluate your features.",
    keyDecisions: [
      "Which agent actions require human approval before execution?",
      "What content must be filtered (PII, harmful content, off-brand tone)?",
      "What is your escalation path when the agent encounters an edge case?",
      "How do you balance safety checks with response speed?",
    ],
    questionsForEngineering: [
      "What guardrail models are we using for input/output filtering?",
      "How do we implement human-in-the-loop without blocking the UX?",
      "What is our error recovery strategy when tools or models fail?",
      "How do we audit agent actions for compliance?",
    ],
    relatedPatterns: ["Guardrails & Safety", "Human-in-the-Loop", "Exception Handling & Recovery"],
  },
  // --- Module 13: Measuring Agent Success ---
  {
    id: "pm-measuring-success",
    slug: "measuring-success",
    number: 13,
    title: "Measuring Agent Success",
    subtitle: "Metrics, evaluation, and monitoring",
    icon: "bar-chart",
    description:
      "Traditional metrics (page views, click rates) do not capture agent quality. You need new metrics: task completion rate, hallucination rate, user satisfaction with agent output, cost per task, and latency percentiles. This module teaches PMs how to build an agent metrics dashboard, implement automated evaluation, and detect quality degradation.",
    whyItMatters:
      "If you cannot measure it, you cannot improve it and you cannot justify investment to stakeholders. Agent quality is subjective and probabilistic: the same prompt might produce different results. You need automated evaluation pipelines that continuously score your agent's output, detect quality degradation, and alert when performance drops. This is how you build stakeholder confidence.",
    keyDecisions: [
      "What are your primary success metrics (completion rate, accuracy, CSAT)?",
      "How do you define and detect hallucinations for your domain?",
      "What is your cost budget per agent task?",
      "How often should you evaluate agent quality (real-time vs. batch)?",
    ],
    questionsForEngineering: [
      "What evaluation framework are we using?",
      "Can we set up automated quality scoring with LLM-as-a-Judge?",
      "What is our current hallucination rate and how do we track it?",
      "Do we have alerting for quality degradation in production?",
    ],
    relatedPatterns: ["Evaluation & Monitoring", "Goal Setting & Monitoring"],
  },
  // --- Module 14: LLMOps & Production Realities ---
  {
    id: "pm-llmops-production",
    slug: "llmops-production",
    number: 14,
    title: "LLMOps & Production Realities",
    subtitle: "What happens after you ship",
    icon: "bar-chart",
    description:
      "There is a gap between we built an agent and it works reliably in production. This module covers the operational realities: prompt versioning, model provider management, cost monitoring, A/B testing agent behaviors, logging, observability, and the dreaded model update broke everything problem. This is the module that turns AI features from fragile demos into reliable production systems.",
    whyItMatters:
      "Most AI products break within weeks of launch, not because the technology fails, but because the operational infrastructure was not built. A model provider updates their API and your prompts stop working. Your costs spike because a prompt change made the agent more verbose. A subtle quality regression goes undetected for two weeks. LLMOps is the discipline that prevents all of this. PMs need to understand it because they own the quality bar and the budget.",
    keyDecisions: [
      "Do you have prompt versioning and a deployment pipeline?",
      "What is your multi-provider strategy if your primary LLM goes down?",
      "Do you have per-feature cost dashboards with alert thresholds?",
      "How do you handle model updates that change agent behavior?",
      "Is every agent interaction logged with full traceability?",
    ],
    questionsForEngineering: [
      "Are we pinning model versions in production?",
      "What is our prompt deployment and rollback process?",
      "Do we have cost alerting set up per feature?",
      "What is our observability stack for agent interactions?",
      "How do we regression-test against new model versions?",
    ],
    relatedPatterns: ["Evaluation & Monitoring", "Resource-Aware Optimization"],
  },
  // --- Module 15: Your Agentic AI Roadmap ---
  {
    id: "pm-maturity-roadmap",
    slug: "maturity-roadmap",
    number: 15,
    title: "Your Agentic AI Roadmap",
    subtitle: "From chatbot to autonomous system",
    icon: "git-branch",
    description:
      "This is the synthesis module. It takes everything from Modules 1–14 and turns it into a concrete roadmap for your product. Agentic AI adoption follows five maturity levels: L0 (chatbot), L1 (tool-calling), L2 (multi-step reasoning), L3 (memory and context-aware), L4 (autonomous multi-agent). Your roadmap should be a deliberate progression, not a leap to L4.",
    whyItMatters:
      "Most products should start at L1–L2 and graduate upward. Jumping to L4 before nailing L1 leads to fragile, expensive systems. The Gartner stat is real: massive surge in interest, but fewer than 25% of AI agent projects reach production. This module helps you be in the 25% by planning a realistic, phased roadmap.",
    keyDecisions: [
      "What maturity level is your current product at?",
      "What level do you need to reach for your next milestone?",
      "What is a realistic timeline for graduating between levels?",
      "Which single L1 feature could you ship in 30 days?",
    ],
    questionsForEngineering: [
      "What is the engineering effort to move from our current level to the next?",
      "What infrastructure do we need for the next maturity level?",
      "Which patterns should we implement first for maximum impact?",
      "What are the risks of moving too fast vs. too slow?",
    ],
    relatedPatterns: ["Exploration & Discovery"],
  },
];

export function getPMModuleBySlug(slug: string): PMModule | undefined {
  return pmModules.find((m) => m.slug === slug);
}
