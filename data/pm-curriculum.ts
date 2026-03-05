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
  {
    id: "pm-ai-coding-tools",
    slug: "ai-coding-tools-landscape",
    number: 11,
    title: "The AI Coding Tools Landscape",
    subtitle: "Every tool your engineering team is using (or asking to use) — and what it means for your product",
    icon: "terminal",
    isFree: true,
    description:
      "AI coding tools have gone from autocomplete to fully autonomous agents that can build features, fix bugs, and ship PRs. Your engineering team is already using them — or asking to. As a PM, you need to understand what these tools can actually do, how they differ, what they cost, and how they change your team's velocity, quality, and workflow. This module covers every major tool in the landscape as of early 2026.",
    whyItMatters:
      "These tools directly impact your roadmap. A developer with Cursor or Claude Code can build a feature in hours that used to take days. But they also introduce new risks: AI-generated code can have subtle bugs, security vulnerabilities, or architectural drift. The tool your team picks affects hiring, onboarding, code review processes, and your entire SDLC. Understanding the landscape helps you make informed decisions about tooling budgets, productivity expectations, and quality gates.",
    keyDecisions: [
      "Which AI coding tools should your team standardize on (or should you let developers choose)?",
      "What's the ROI of paying $20-100/seat/month for AI coding tools vs. free tiers?",
      "How do you measure the actual productivity gains (not just lines of code)?",
      "Should AI-generated code go through different review processes than human-written code?",
      "What's your policy on AI tools accessing proprietary code and data (security/IP)?",
      "How do you adjust sprint velocity estimates when AI tools accelerate development?",
      "What guardrails do you need around autonomous agent modes (auto-merge, auto-deploy)?",
    ],
    questionsForEngineering: [
      "Which tools are developers already using informally? What do they like/dislike?",
      "What's the measured impact on PR throughput since adopting AI coding tools?",
      "Are we seeing more bugs in AI-assisted code vs. human-written code?",
      "What data leaves our environment when using these tools? (security review)",
      "Do we need enterprise agreements for SOC 2 / HIPAA compliance?",
      "How are these tools handling our monorepo / multi-service architecture?",
      "What's the token cost per developer per month for our usage patterns?",
    ],
    relatedPatterns: [
      "Tool Use",
      "Multi-Agent Collaboration",
      "Human-in-the-Loop",
      "Reflection",
      "Planning",
    ],
    sections: [
      {
        heading: "The Shift: From Autocomplete to Autonomous Agents",
        body: "In 2023, AI coding tools were glorified autocomplete — they predicted the next line of code. By 2026, they've become autonomous agents that can understand an entire codebase, plan multi-file changes, run tests, fix their own mistakes, and submit pull requests. This is the single biggest change in software development tooling since the IDE itself. Understanding this shift is critical because it changes how fast your team can ship, what's possible in a sprint, and what role code review plays.",
        bullets: [
          "2022-2023: Autocomplete era — tools like Copilot suggested the next line or function body",
          "2024: Chat era — developers described problems in natural language and got code blocks back",
          "2025: Agent era — tools started reading entire codebases, running commands, and iterating autonomously",
          "2026: Multi-agent era — tools dispatch multiple specialized agents in parallel across your codebase",
        ],
      },
      {
        heading: "Claude Code (Anthropic)",
        body: "Claude Code is Anthropic's agentic coding tool. It runs in your terminal, VS Code, a desktop app, or the browser. Unlike tab-completion tools, Claude Code operates through an agentic loop: it gathers context from your codebase, takes action (edits files, runs commands, searches the web), and verifies results — repeating until the task is done. It's powered by Claude Sonnet for routine tasks and Claude Opus for complex architectural decisions.",
        bullets: [
          "Agentic loop: gather context → take action → verify results → repeat",
          "Can read files, edit code, run shell commands, execute tests, and search the web",
          "Supports regex search, file pattern matching, and codebase-wide exploration",
          "Available via terminal (npm/Homebrew/native install), VS Code, desktop app, and browser",
          "Requires Anthropic API key or Claude subscription (Pro/Team/Enterprise)",
          "You stay in the loop — can interrupt and redirect at any point",
          "Input pricing: ~$3/M tokens (Sonnet), ~$15/M tokens (Opus)",
          "Strength: deep reasoning on complex architecture, strong at multi-file refactoring",
        ],
      },
      {
        heading: "OpenAI Codex (GPT-5.3-Codex)",
        body: "OpenAI released GPT-5.3-Codex (codenamed 'Garlic') in February 2026. It's a specialized coding model that prioritizes 'cognitive density' — 6x more reasoning capability per byte through what OpenAI calls Enhanced Pre-Training Efficiency (EPTE). The headline numbers: 400K-token context window (holds entire codebases in memory) and 128K-token output capacity (can generate complete applications in one pass). It's 25% faster than its predecessor and significantly cheaper per token than competitors.",
        bullets: [
          "400,000-token context window — can hold entire codebases in memory",
          "128,000-token output capacity — can generate complete applications in one pass",
          "Native agentic capabilities: autonomous multi-file refactoring, dependency analysis, test execution",
          "Can navigate files, call APIs, and run tests without external orchestration",
          "Input pricing: $1.25/M tokens — significantly cheaper than Claude's $3-5/M tokens",
          "New features (March 2026): configurable memories, sub-agent thread forking, multimodal tool outputs",
          "Notably, GPT-5.3-Codex contributed to its own development (data pipelines, training infra)",
          "Strength: raw speed, large context window, cost efficiency at scale",
        ],
      },
      {
        heading: "Cursor (Cursor 2.0)",
        body: "Cursor is the IDE that put agentic coding on the map. Version 2.0 (released late 2025) introduced a multi-agent architecture that fundamentally changes the coding workflow. Instead of chatting with one AI about your code, you orchestrate multiple specialized agents working on different parts of your codebase simultaneously. Cursor's proprietary Composer model is 4x faster than comparable models, completing most tasks in under 30 seconds.",
        bullets: [
          "Multi-agent orchestration: dispatch a Database Schema agent, UI Components agent, and API Routes agent in parallel",
          "Shadow Virtual File System (SVFS): agents write to isolated virtual trees, merged before developer approval",
          "Composer model: multi-file edits reduced from ~42s to ~9s, 500K token context window",
          "Self-healing test success rate: improved from 55% to 89%",
          "Built-in browser tool: agents can test web apps visually without leaving the IDE",
          "Agent capabilities: build features, refactor, fix bugs, write tests, run terminal commands",
          "Pricing: Pro ($20/mo), Max ($50/mo, multi-agent dispatch), Enterprise ($100/seat, unlimited agents + SOC2)",
          "Strength: best-in-class IDE experience, multi-agent parallel execution, strong for full-stack development",
        ],
      },
      {
        heading: "GitHub Copilot (Agent Mode + Workspace)",
        body: "GitHub Copilot is the most widely adopted AI coding tool, integrated directly into GitHub's ecosystem. Its Agent Mode turns Copilot from a code-completion tool into a real-time collaborator that plans and executes multi-step coding tasks from natural language. The new Agents Tab (January 2026) embeds agent sessions directly into repositories alongside code, PRs, and issues. Copilot Workspace adds explicit stepwise reasoning — generating editable specs, plans, and PR-ready diffs with human review at every stage.",
        bullets: [
          "Agent Mode: multi-step coding from natural language, self-healing (recognizes and fixes its own errors)",
          "Agents Tab: agent sessions live inside your GitHub repository, alongside code and PRs",
          "Can run commands, analyze runtime errors, and suggest architectural improvements",
          "Copilot Workspace: generates editable specs → explicit plans → PR-ready diffs",
          "Human review required before merge — emphasis on developer control",
          "Supports VS Code, JetBrains, Neovim, Visual Studio, Xcode, and CLI",
          "Pricing: Individual ($10/mo), Business ($19/seat/mo), Enterprise ($39/seat/mo)",
          "Strength: deepest GitHub integration, widest IDE support, largest existing user base, enterprise trust",
        ],
      },
      {
        heading: "Google Gemini Code Assist",
        body: "Google's entry in the agentic coding space is Gemini Code Assist, powered by Gemini 3 Pro and Gemini 3 Flash. Its agent mode (currently in preview) pairs developers with AI agents that handle the full development lifecycle — from reading design documents and issues, through multi-file code generation, to integrating external tools via Model Context Protocol (MCP). The distinguishing factor is deep integration with Google Cloud services.",
        bullets: [
          "Agent mode: generates code from design docs, issues, and TODO comments",
          "Human-in-the-Loop (HiTL): you comment on, edit, and approve plans during execution",
          "MCP server integration: extend agent capabilities with external tools",
          "Powered by Gemini 3 Pro and Gemini 3 Flash models",
          "Available in VS Code and IntelliJ (expanding to more IDEs)",
          "Deep Google Cloud integration: Pub/Sub, Cloud Functions, BigQuery",
          "Pricing: Free tier available, Enterprise via Google Cloud subscription",
          "Strength: best for Google Cloud-heavy teams, MCP-native, strong multi-modal understanding",
        ],
      },
      {
        heading: "Windsurf (by Codeium)",
        body: "Windsurf is a purpose-built AI IDE from Codeium, centered around 'Cascade' — its agentic AI system. Cascade's differentiator is what Codeium calls 'Flow Awareness': it tracks everything you do in the editor (edits, terminal commands, clipboard, file views) and uses that context to infer your intent without you repeating yourself. It's designed to feel like a pair programmer who's been watching over your shoulder all day.",
        bullets: [
          "Cascade Flow Awareness: tracks all edits, terminal commands, clipboard, and viewing patterns in real time",
          "Deep codebase knowledge: maintains semantic understanding of every file, function, and folder",
          "Multiple modes: Code (build features), Plan (architect before coding), Ask (read-only exploration)",
          "Built-in browser, web search, one-click deployment, and live previews inside the IDE",
          "Tool calling (up to 20 tools per prompt), MCP server integration, voice input",
          "Named checkpoints and reverts — undo any AI change instantly",
          "Supports GPT-5.4, Claude Sonnet 4.6, Gemini 3.1 Pro, and other models",
          "Strength: most context-aware IDE, excellent for long coding sessions, strong flow-state preservation",
        ],
      },
      {
        heading: "Amazon Q Developer",
        body: "Amazon Q Developer is AWS's full-lifecycle AI coding assistant. While other tools focus on code generation, Amazon Q covers the entire SDLC — from writing code to transforming legacy applications, scanning for security vulnerabilities, generating tests and documentation, and even optimizing SQL queries in AWS services. It's the clear choice for teams deeply invested in the AWS ecosystem.",
        bullets: [
          "Supports 25+ programming languages with industry-leading multiline acceptance rates",
          "Agentic coding: natural language → production-ready features with step-by-step instructions",
          "Code Transformation: automatically upgrades legacy apps (e.g., Java 8 → Java 21) with dependency refactoring",
          "Security scanning: OWASP Top 10 vulnerability detection with automatic code remediation",
          "Generates code reviews, unit tests, and documentation automatically",
          "Deep AWS integration: CDK, Lambda, Glue, Redshift, and console troubleshooting",
          "Enterprise: data isolation (customer content not used for training), existing IAM governance",
          "Strength: best for AWS-heavy teams, strongest legacy migration tooling, full SDLC coverage",
        ],
      },
      {
        heading: "How to Compare: The PM Decision Framework",
        body: "When your engineering team asks to adopt (or switch) AI coding tools, here's what matters. Don't get distracted by benchmark scores — focus on how each tool fits your team's workflow, security requirements, and budget.",
        bullets: [
          "Context window size: How much of your codebase can the tool 'see' at once? Larger = better for monorepos",
          "Agentic autonomy: Can it plan → execute → verify → iterate autonomously, or does it need hand-holding?",
          "IDE integration: Does it work where your team already lives (VS Code, JetBrains, terminal)?",
          "Security & compliance: Where does your code go? SOC 2? HIPAA? Can you self-host?",
          "Cost per seat: $0 (free tiers) to $100/seat/month — what's the actual productivity ROI?",
          "Model flexibility: Can your team choose which LLM powers the tool, or is it locked to one provider?",
          "Ecosystem fit: AWS team → Amazon Q. Google Cloud → Gemini. GitHub-heavy → Copilot. Model-agnostic → Cursor/Windsurf",
          "Multi-agent support: Can it run parallel agents on different parts of the codebase? (Cursor leads here)",
        ],
      },
      {
        heading: "What This Means for Your Roadmap",
        body: "AI coding tools don't just make developers faster — they change what's possible in a sprint. Features that took a week might take two days. But this doesn't mean you can 3x your commitments. AI-assisted code still needs review, testing, and architectural oversight. The productivity gains are real but uneven: boilerplate and CRUD tasks see 5-10x speedups, while novel architecture and complex business logic see more modest 1.5-2x improvements.",
        bullets: [
          "Expect 2-4x throughput on well-defined, boilerplate-heavy tasks (CRUD, tests, docs)",
          "Expect 1.5-2x on novel features requiring architectural decisions",
          "AI-generated code needs more code review attention, not less — subtle bugs are harder to spot",
          "Budget $20-100/developer/month for AI tooling — it pays for itself in days",
          "Adjust sprint planning: higher velocity but allocate time for AI code review",
          "New hiring signal: ability to effectively prompt and direct AI coding agents matters",
          "Consider: do you need a dedicated 'AI tooling' owner on the team?",
        ],
      },
      {
        heading: "The Risks You Need to Manage",
        body: "AI coding tools introduce real risks that PMs need to think about proactively, not after something goes wrong.",
        bullets: [
          "IP & data leakage: some tools send code to external APIs — ensure your security team has reviewed data flows",
          "Architectural drift: AI agents optimize for speed, not consistency — code may diverge from your team's patterns",
          "Over-reliance: developers who depend too heavily on AI lose deep understanding of the codebase",
          "License contamination: AI-generated code can inadvertently reproduce copyrighted or GPL-licensed code",
          "Security vulnerabilities: AI doesn't inherently understand your threat model — generated code needs security review",
          "Cost creep: token-based pricing can spike unpredictably with heavy agentic usage",
          "Mitigation: enforce linters, architecture decision records (ADRs), regular security scans, and token budget alerts",
        ],
      },
    ],
  },
];

export function getPMModuleBySlug(slug: string): PMModule | undefined {
  return pmModules.find((m) => m.slug === slug);
}
