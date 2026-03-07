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
  /** Optional long-form sections for deep-dive modules */
  sections?: PMModuleSection[];
}

export const pmModules: PMModule[] = [
  {
    id: "pm-task-orchestration",
    slug: "task-orchestration",
    number: 2,
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
    number: 3,
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
    number: 4,
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
    number: 5,
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
    number: 6,
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
    number: 7,
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
    number: 8,
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
    number: 9,
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
    number: 10,
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
    number: 11,
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

pmModules.unshift({
    id: "pm-ai-native-foundations",
    slug: "ai-native-foundations",
    number: 1,
    title: "Becoming AI-Native",
    subtitle: "What agents and MCP actually are — and why every PM needs to understand them now",
    icon: "terminal",
    isFree: true,
    description:
      "Before diving into patterns, tools, and architectures, you need a rock-solid foundation. This module answers the three questions every PM is quietly Googling: What exactly is an AI agent? What is MCP (Model Context Protocol) and why does everyone keep talking about it? And what does it actually mean to become 'AI-native' as a product organization? No jargon, no hype — just the mental models you need to lead confidently in this space.",
    whyItMatters:
      "If you can't explain what an agent is in a stakeholder meeting, you'll lose credibility the moment your engineering team starts building one. If you don't understand MCP, you'll miss the biggest infrastructure shift since REST APIs. And if your organization isn't thinking about AI-native product design, you're optimizing a horse-drawn carriage while competitors build cars. This module gives you the vocabulary, the frameworks, and the strategic lens to lead — not just follow.",
    keyDecisions: [
      "Is your product adding AI as a feature, or redesigning around AI as the core experience?",
      "Should your team adopt MCP now, or wait for the ecosystem to mature?",
      "Where on the agent autonomy spectrum should your first AI feature land?",
      "How do you communicate agent capabilities (and limitations) to non-technical stakeholders?",
      "What's your strategy for upskilling your team to think AI-native?",
    ],
    questionsForEngineering: [
      "Are we building stateless AI features or persistent agents with memory and tool access?",
      "Have we evaluated MCP servers for our existing integrations (Slack, databases, CRMs)?",
      "What's the difference between our current LLM integration and a true agentic architecture?",
      "What infrastructure do we need to support agents that call tools and maintain state?",
      "How do we prototype an agent internally before shipping it to users?",
    ],
    relatedPatterns: [
      "Tool Use",
      "State Management (MCP)",
      "Prompt Chaining",
      "Planning",
      "Human-in-the-Loop",
    ],
    sections: [
      {
        heading: "What Is an AI Agent?",
        body: "An AI agent is software that uses a large language model (LLM) as its reasoning engine to autonomously pursue goals. Unlike a simple chatbot that responds to one message at a time, an agent can plan multi-step tasks, use external tools, make decisions, and iterate on its own work. Think of the difference between a calculator (you press buttons, it responds) and an employee (you give a goal, they figure out how to achieve it). Agents are the employee.",
        bullets: [
          "A chatbot answers questions. An agent completes tasks.",
          "Agents have a loop: perceive → reason → act → observe → repeat until the goal is met",
          "They can call tools (search the web, query a database, send an email) as part of their reasoning",
          "They maintain context across multiple steps — they remember what they've already done",
          "Autonomy exists on a spectrum: from 'suggest and wait for approval' to 'execute independently'",
          "Real-world examples: coding agents that write and test code, research agents that compile reports, support agents that resolve tickets end-to-end",
        ],
      },
      {
        heading: "The Five Levels of Agent Autonomy",
        body: "Not all agents are created equal. Understanding where your product sits on the autonomy spectrum helps you set the right expectations with stakeholders, users, and your engineering team. Most products should start at Level 1 or 2 and graduate upward as trust is built.",
        bullets: [
          "L0 — Chatbot: responds to single messages, no tool access, no memory across turns",
          "L1 — Tool-Calling Assistant: can search docs, query APIs, and use tools, but follows a fixed workflow",
          "L2 — Reasoning Agent: plans its own steps, decides which tools to use, handles branching logic",
          "L3 — Persistent Agent: maintains memory across sessions, learns user preferences, adapts over time",
          "L4 — Multi-Agent System: multiple specialized agents collaborate, delegate, and hand off work to each other",
          "Most production products today are at L1-L2. L3-L4 are emerging but add significant complexity and cost",
        ],
      },
      {
        heading: "What Is MCP (Model Context Protocol)?",
        body: "MCP is an open standard (created by Anthropic, now widely adopted) that defines how AI agents connect to external tools and data sources. Before MCP, every agent-to-tool connection was custom-built — like building a unique adapter for every appliance in your house. MCP is the universal plug. It standardizes how agents discover tools, call them, and handle responses. If your product uses any external data or APIs, MCP is how your agent will talk to them.",
        bullets: [
          "MCP is to agents what REST APIs are to web apps — a universal standard for communication",
          "An MCP server exposes tools (functions an agent can call) and resources (data an agent can read)",
          "An MCP client (the agent) discovers available tools, understands their parameters, and calls them",
          "Examples: an MCP server for Slack lets agents send messages, read channels, and search history",
          "MCP servers exist for databases (Postgres, Supabase), file systems, GitHub, Google Drive, and hundreds more",
          "Adopting MCP means your agent integrations are portable — switch LLM providers without rewriting tool logic",
          "The ecosystem is growing rapidly: enterprise companies are building MCP servers for their platforms",
        ],
      },
      {
        heading: "Why MCP Changes Everything for Product Teams",
        body: "MCP isn't just a technical detail your engineers deal with — it fundamentally changes your product strategy. Before MCP, building an agent that could access 5 different enterprise tools meant 5 custom integrations, each with different auth flows, data formats, and failure modes. With MCP, it's 5 standardized connections that all work the same way. This dramatically reduces time-to-market for agent features and makes your integrations composable.",
        bullets: [
          "Integration speed: what took weeks of custom API work now takes hours with an existing MCP server",
          "Composability: users or admins can connect new tools to your agent without engineering work",
          "Ecosystem leverage: the MCP marketplace is growing — you can tap into community-built integrations",
          "Portability: your tool layer doesn't change when you swap the underlying LLM",
          "Security boundary: MCP defines clear permission scopes for what agents can read vs. write",
          "Product implication: you can now promise 'connects to your existing tools' as a real feature, not vaporware",
        ],
      },
      {
        heading: "What Is This Platform?",
        body: "learnagenticpatterns.com is a free educational platform built specifically for Product Managers and Developers who want to become AI-native. It's not a blog, not a newsletter, and not a course you watch passively. It's a structured, pattern-by-pattern curriculum that teaches you how AI agents actually work, how MCP connects them to the real world, and how to make confident product decisions in this new landscape. Every module builds on the last. By the end, you won't just understand agentic AI — you'll be able to architect product strategies around it.",
        bullets: [
          "11 PM modules covering every layer of agentic AI — from foundations to multi-agent teams to production metrics",
          "21 engineering patterns for developers — the technical depth your team needs, mapped to SWE concepts they already know",
          "Interactive decision games: Ship or Skip, Budget Builder, Stakeholder Simulator — practice real PM trade-offs",
          "Each module includes: overview, why it matters for your product, key decisions, and questions to ask your engineering team",
          "100% free. No paywalls, no premium tier. Built as a community-first educational resource",
          "Whether you're a PM exploring AI for the first time or a tech lead bridging the gap with product — this platform is for you",
        ],
      },
      {
        heading: "How We Got Here: From LLMs to Agents to MCP",
        body: "To understand where AI products are going, you need to understand the three waves that brought us here. Each wave unlocked new capabilities — and new product opportunities. Most organizations are still catching up to Wave 2 while Wave 3 is already reshaping the landscape.",
        bullets: [
          "Wave 1 — Large Language Models (LLMs): starting around 2022, models like GPT-3 and GPT-4 showed that AI could generate human-quality text, code, and analysis. Products added AI-powered features: summarization, search, chatbots. But LLMs alone are stateless and can't take action — they just generate text",
          "Wave 2 — AI Agents: by 2024-2025, teams discovered that wrapping LLMs in a loop — where the model can plan, use tools, observe results, and iterate — creates something far more powerful than a chatbot. Agents can complete multi-step tasks: research a topic, draft a report, book a meeting, fix a bug. This is where most cutting-edge products are today",
          "Wave 3 — MCP and the Connected Agent: in late 2024, Anthropic open-sourced the Model Context Protocol (MCP), giving agents a universal standard for connecting to external tools and data. By 2026, MCP has become the USB-C of the agent world — one standard plug that works everywhere. This wave makes agents genuinely useful in enterprise environments because they can access real systems (CRMs, databases, internal tools) without custom integration work",
          "The pattern: LLMs gave agents a brain. Tool use gave them hands. MCP gave them a universal way to plug into the world. Understanding this progression helps you evaluate where your product sits and where it should go next",
        ],
      },
      {
        heading: "What Does 'AI-Native' Actually Mean?",
        body: "AI-native doesn't mean 'we added a chatbot to our app.' It means the product was designed from the ground up around AI capabilities — the same way mobile-native apps were designed for touch, not just desktop apps squeezed onto a phone screen. An AI-native product rethinks the entire user experience: instead of users clicking through menus and filling forms, they describe what they want and the AI figures out how to deliver it.",
        bullets: [
          "AI-as-feature: bolt-on chatbot, AI-generated summaries, smart search — useful but not transformative",
          "AI-native: the entire product experience is designed around agent capabilities — intent-driven, not menu-driven",
          "Example: AI-as-feature = 'AI suggests email replies.' AI-native = 'AI reads, triages, drafts, and sends emails on your behalf with approval gates'",
          "AI-native products replace workflows, not just individual tasks",
          "The shift requires rethinking UX: from 'what buttons do users click?' to 'what goals do users describe?'",
          "Trust is the key design constraint: users need transparency into what the agent is doing and why",
        ],
      },
      {
        heading: "The AI-Native PM Skill Set",
        body: "Being an AI-native PM means developing new instincts alongside your existing product skills. You don't need to code agents yourself, but you need to understand the architecture well enough to make good product decisions — just like a mobile PM needs to understand push notifications, offline storage, and app store dynamics without writing Swift or Kotlin.",
        bullets: [
          "Understand the cost model: every LLM call costs money — you must think in tokens and API calls, not just server costs",
          "Think in loops, not requests: agents iterate, retry, and self-correct — your UX must handle non-instant responses",
          "Design for uncertainty: AI output is probabilistic, not deterministic — 'good enough' is a product decision",
          "Know the safety stack: guardrails, human-in-the-loop, content filtering — these are product features, not afterthoughts",
          "Speak the vocabulary: agent, tool use, RAG, MCP, prompt chaining, reflection — fluency builds credibility",
          "Evaluate trade-offs: speed vs. quality, autonomy vs. control, cost vs. capability — every agent feature has these",
        ],
      },
      {
        heading: "The Practice Path: Apply What You Learn",
        body: "This curriculum isn't just theory. After you master the foundations in these modules, there's an entire Practice section where you apply your knowledge hands-on. The Practice path includes interactive games, simulations, and decision exercises designed specifically for PMs — so you're not just reading about agent trade-offs, you're making them under realistic constraints.",
        bullets: [
          "Ship or Skip: rapid-fire product decisions — should you ship this AI feature or kill it? Defend your reasoning",
          "Budget Builder: allocate a real AI budget across model tiers, infrastructure, and agent capabilities — then see if your product survives",
          "Stakeholder Simulator: role-play conversations with engineers, executives, and skeptical customers about your AI roadmap",
          "Each game maps to the modules you've learned — practice reinforces theory",
          "The goal: by the time you finish, you won't just understand agentic AI concepts — you'll have practiced the actual decisions PMs face when building AI-native products",
          "Start with the modules first, then move to Practice once you have the vocabulary and frameworks",
        ],
      },
      {
        heading: "Where to Start: Your First Week as an AI-Native PM",
        body: "You don't need to understand every pattern in this curriculum before you start making better product decisions. Here's a practical first-week plan to get you from 'curious' to 'conversationally dangerous' in AI-native product thinking.",
        bullets: [
          "Day 1-2: Try 3 agent products yourself (ChatGPT with tools, Claude with MCP, Cursor with agent mode) — experience the UX firsthand",
          "Day 3: Map your product's top 5 workflows and ask: 'Could an agent do 80% of this autonomously?'",
          "Day 4: Sit with your engineering lead and ask: 'What's the simplest agent we could prototype in a week?'",
          "Day 5: Write a one-pager for your team: 'Here's what agents can do for our users, and here's where we should start'",
          "Ongoing: complete the remaining modules in this curriculum — each one gives you a specific lens for product decisions",
          "Remember: you don't need to be technical. You need to be fluent enough to ask the right questions and make informed trade-offs",
        ],
      },
    ],
  });

export function getPMModuleBySlug(slug: string): PMModule | undefined {
  return pmModules.find((m) => m.slug === slug);
}
