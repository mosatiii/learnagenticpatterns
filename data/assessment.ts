export type Role = "product-manager" | "developer" | "designer" | "writer";

export interface AssessmentOption {
  id: string;
  label: string;
  signal: string; // maps to pattern slugs (developer) or skill dimensions (designer/writer)
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "single" | "multi" | "freetext";
  options?: AssessmentOption[];
}

export interface RoleAssessment {
  role: Role;
  title: string;
  subtitle: string;
  icon: string; // Lucide icon name
  questions: AssessmentQuestion[];
}

export interface AssessmentResult {
  score: number;
  strengths: string[];
  vulnerabilities: string[];
  actionPlan: {
    step: number;
    title: string;
    description: string;
    link?: string;
  }[];
  elevatorPitch: string;
  patternsYouKnow?: string[];
  patternsToLearn?: string[];
}

// Shared closing questions appended to every role
export const sharedQuestions: AssessmentQuestion[] = [
  {
    id: "experience",
    question: "How many years of professional experience do you have?",
    type: "single",
    options: [
      { id: "0-2", label: "0–2 years", signal: "junior" },
      { id: "3-5", label: "3–5 years", signal: "mid" },
      { id: "6-10", label: "6–10 years", signal: "senior" },
      { id: "10-15", label: "10–15 years", signal: "staff" },
      { id: "15+", label: "15+ years", signal: "principal" },
    ],
  },
  {
    id: "fear",
    question: "Be honest — what worries you most right now?",
    type: "single",
    options: [
      { id: "irrelevant", label: "AI will make my skills irrelevant", signal: "fear-irrelevance" },
      { id: "juniors", label: "Juniors with AI will do my job cheaper", signal: "fear-replacement" },
      { id: "what-to-learn", label: "I don't know what to learn first", signal: "fear-direction" },
      { id: "company-expects", label: "My company expects me to use AI and I'm not ready", signal: "fear-pressure" },
      { id: "fine", label: "Nothing — I just want to stay ahead", signal: "confident" },
    ],
  },
];

// ---------------------------------------------------------------------------
// DEVELOPER — 12 questions mapping to 21 agentic patterns
// ---------------------------------------------------------------------------
const developerQuestions: AssessmentQuestion[] = [
  {
    id: "dev-systems",
    question: "What types of systems have you built? (select all that apply)",
    type: "multi",
    options: [
      { id: "rest-apis", label: "REST APIs / microservices", signal: "tool-use,a2a" },
      { id: "data-pipelines", label: "Data pipelines / ETL", signal: "prompt-chaining,rag" },
      { id: "event-driven", label: "Event-driven / message queue systems", signal: "multi-agent-collaboration,orchestrator-workers" },
      { id: "search", label: "Search / recommendation engines", signal: "rag,memory-management" },
      { id: "cicd", label: "CI/CD / deployment automation", signal: "evaluator-optimizer,agentic-testing" },
      { id: "web-apps", label: "User-facing web/mobile apps", signal: "human-in-the-loop,guardrails" },
      { id: "none", label: "None of the above", signal: "none" },
    ],
  },
  {
    id: "dev-errors",
    question: "How do you handle errors in production?",
    type: "single",
    options: [
      { id: "try-catch", label: "Try-catch and hope for the best", signal: "gap:guardrails,gap:reflection" },
      { id: "structured", label: "Structured error handling with retries and fallbacks", signal: "guardrails" },
      { id: "observability", label: "Full observability — logging, tracing, alerts, dashboards", signal: "ai-self-evaluation,guardrails" },
      { id: "chaos", label: "Chaos engineering — we break things on purpose to find weaknesses", signal: "agentic-testing,ai-self-evaluation" },
    ],
  },
  {
    id: "dev-feedback",
    question: "Have you ever built a system where one component checks another component's work?",
    type: "single",
    options: [
      { id: "no", label: "No", signal: "gap:reflection,gap:evaluator-optimizer" },
      { id: "code-reviews", label: "Yes — code reviews / PR processes", signal: "reflection-partial" },
      { id: "auto-tests", label: "Yes — automated test suites that validate output quality", signal: "reflection" },
      { id: "auto-correct", label: "Yes — systems that auto-correct based on feedback loops", signal: "reflection,evaluator-optimizer" },
    ],
  },
  {
    id: "dev-complexity",
    question: "How do you handle tasks that are too complex for one function or service?",
    type: "single",
    options: [
      { id: "mega-function", label: "I write a big function that handles everything", signal: "gap:prompt-chaining" },
      { id: "sequential", label: "Break it into sequential steps with validation between each", signal: "prompt-chaining" },
      { id: "parallel", label: "Split into parallel tasks and merge results", signal: "parallelization" },
      { id: "coordinator", label: "A coordinator delegates to specialized workers", signal: "orchestrator-workers,multi-agent-collaboration" },
    ],
  },
  {
    id: "dev-apis",
    question: "Have you ever built a system that connects to external APIs or tools dynamically?",
    type: "single",
    options: [
      { id: "hardcoded", label: "No — everything is hardcoded", signal: "gap:tool-use,gap:mcp" },
      { id: "specific", label: "Yes — we integrate a few specific APIs", signal: "tool-use" },
      { id: "plugin", label: "Yes — we have a plugin system where new tools can be added without code changes", signal: "mcp" },
      { id: "adapter", label: "Yes — we have a standardized adapter layer for all external services", signal: "mcp,tool-use" },
    ],
  },
  {
    id: "dev-decisions",
    question: "How do your systems make decisions?",
    type: "single",
    options: [
      { id: "if-else", label: "Hardcoded if/else logic", signal: "gap:routing,gap:planning" },
      { id: "config", label: "Configuration-driven rules", signal: "routing-partial" },
      { id: "dynamic-routing", label: "Dynamic routing based on input classification", signal: "routing" },
      { id: "self-planning", label: "The system plans its own approach based on the goal", signal: "planning,routing" },
    ],
  },
  {
    id: "dev-state",
    question: "How do you manage state and context across requests?",
    type: "single",
    options: [
      { id: "stateless", label: "Stateless — every request starts fresh", signal: "gap:memory-management" },
      { id: "session", label: "Session storage / cookies", signal: "memory-management-partial" },
      { id: "db-cache", label: "Database + caching layers (Redis, etc.)", signal: "memory-management" },
      { id: "multi-tier", label: "Multiple tiers — short-term cache, long-term DB, context windows", signal: "memory-management" },
    ],
  },
  {
    id: "dev-approval",
    question: "Have you built systems where a human needs to approve before an action happens?",
    type: "single",
    options: [
      { id: "no", label: "No — everything is fully automated", signal: "gap:human-in-the-loop" },
      { id: "basic", label: "Yes — approval workflows for deployments or content", signal: "human-in-the-loop" },
      { id: "risk-based", label: "Yes — with different approval levels based on risk", signal: "human-in-the-loop,guardrails" },
    ],
  },
  {
    id: "dev-ai-usage",
    question: "How are you using AI in your daily work right now?",
    type: "single",
    options: [
      { id: "not-at-all", label: "I'm not using AI at all", signal: "ai-exposure:none" },
      { id: "chatgpt", label: "I use ChatGPT/Claude for quick questions", signal: "ai-exposure:consumer" },
      { id: "copilot", label: "I use AI coding tools (Copilot, Cursor) daily", signal: "ai-exposure:tools" },
      { id: "built-features", label: "I've built features that use LLM APIs", signal: "ai-exposure:builder" },
      { id: "shipped-products", label: "I've designed and shipped AI-powered products", signal: "ai-exposure:architect" },
    ],
  },
  {
    id: "dev-ai-resources",
    question: "Have you explored any of these? (select all)",
    type: "multi",
    options: [
      { id: "langchain", label: "LangChain / LangGraph documentation", signal: "framework-langchain" },
      { id: "anthropic", label: "Anthropic's 'Building Effective Agents' guide", signal: "framework-anthropic" },
      { id: "openai", label: "OpenAI's API documentation", signal: "framework-openai" },
      { id: "andrew-ng", label: "Andrew Ng's agentic patterns talks", signal: "academic-ng" },
      { id: "papers", label: "Research papers on AI agents", signal: "academic-papers" },
      { id: "none", label: "None of these", signal: "no-resources" },
    ],
  },
  {
    id: "dev-ai-complex",
    question: "What's the most complex thing you've built with AI?",
    type: "single",
    options: [
      { id: "nothing", label: "Nothing yet", signal: "ai-build:none" },
      { id: "chatbot", label: "A simple chatbot or wrapper around an API", signal: "ai-build:basic" },
      { id: "rag", label: "A RAG system (search + LLM)", signal: "ai-build:rag" },
      { id: "multi-step", label: "A multi-step agent that uses tools", signal: "ai-build:agent" },
      { id: "multi-agent", label: "A multi-agent system with coordination", signal: "ai-build:multi-agent" },
    ],
  },
  {
    id: "dev-blocker",
    question: "What's stopping you from building more with AI?",
    type: "single",
    options: [
      { id: "no-start", label: "I don't know where to start", signal: "blocker:start" },
      { id: "no-architecture", label: "I understand the basics but can't connect it to real architecture", signal: "blocker:architecture" },
      { id: "no-production", label: "I can prototype but don't know how to make it production-ready", signal: "blocker:production" },
      { id: "go-deeper", label: "I'm already building — I need to go deeper on specific patterns", signal: "blocker:depth" },
      { id: "nothing", label: "Nothing — I'm fully in", signal: "blocker:none" },
    ],
  },
];

// ---------------------------------------------------------------------------
// DESIGNER — 8 questions mapping to skill dimensions
// ---------------------------------------------------------------------------
const designerQuestions: AssessmentQuestion[] = [
  {
    id: "des-type",
    question: "What kind of design work do you do? (select all)",
    type: "multi",
    options: [
      { id: "ui-ux", label: "UI/UX design", signal: "dim:systems-thinking" },
      { id: "brand", label: "Brand / visual identity", signal: "dim:creative-judgment" },
      { id: "illustration", label: "Illustration / graphic design", signal: "dim:execution" },
      { id: "motion", label: "Motion / animation", signal: "dim:execution" },
      { id: "design-systems", label: "Design systems", signal: "dim:systems-thinking" },
      { id: "user-research", label: "User research", signal: "dim:human-insight" },
    ],
  },
  {
    id: "des-start",
    question: "When you start a project, what happens first?",
    type: "single",
    options: [
      { id: "open-figma", label: "I open Figma and start designing", signal: "vulnerable:execution-first" },
      { id: "competitors", label: "I look at what competitors are doing", signal: "partial:research" },
      { id: "user-research", label: "I talk to users or look at research data", signal: "safe:human-insight" },
      { id: "define-problem", label: "I define the problem and constraints with stakeholders", signal: "very-safe:strategic-thinking" },
    ],
  },
  {
    id: "des-decisions",
    question: "How do you make design decisions?",
    type: "single",
    options: [
      { id: "looks-good", label: "I go with what looks good", signal: "vulnerable:aesthetic-only" },
      { id: "design-system", label: "I follow the design system and brand guidelines", signal: "partial:system-following" },
      { id: "data-driven", label: "I base it on user data, business goals, and technical constraints", signal: "safe:multi-factor-judgment" },
      { id: "test-iterate", label: "I test multiple approaches with real users and iterate", signal: "very-safe:evidence-based" },
    ],
  },
  {
    id: "des-pushback",
    question: "A client says 'I don't like it.' What do you do?",
    type: "single",
    options: [
      { id: "redesign", label: "I redesign it to their preference", signal: "vulnerable:order-taker" },
      { id: "ask-why", label: "I ask what specifically isn't working and why", signal: "safe:communication" },
      { id: "show-data", label: "I show data on why the decision was made and propose alternatives", signal: "very-safe:strategic-selling" },
    ],
  },
  {
    id: "des-hardest",
    question: "What's the hardest part of your job?",
    type: "single",
    options: [
      { id: "look-good", label: "Making things look good", signal: "vulnerable:surface-craft" },
      { id: "user-needs", label: "Understanding what the user actually needs vs what they say", signal: "safe:empathy" },
      { id: "balancing", label: "Balancing business goals, user needs, and technical limits", signal: "very-safe:strategic-balance" },
      { id: "alignment", label: "Getting stakeholders aligned on a direction", signal: "very-safe:leadership" },
    ],
  },
  {
    id: "des-ai-usage",
    question: "How are you using AI tools right now?",
    type: "single",
    options: [
      { id: "refuse", label: "I'm not — I refuse to", signal: "ai:resistant" },
      { id: "tried", label: "I've tried Midjourney/DALL-E for fun", signal: "ai:curious" },
      { id: "mockups", label: "I use AI for quick mockups and exploration", signal: "ai:adopter" },
      { id: "daily", label: "AI is part of my daily workflow — I generate, then refine", signal: "ai:integrated" },
      { id: "workflows", label: "I've built AI-powered design workflows for my team", signal: "ai:leader" },
    ],
  },
  {
    id: "des-systems",
    question: "Can you build or maintain a design system?",
    type: "single",
    options: [
      { id: "no", label: "No — I design individual screens", signal: "vulnerable:screen-level" },
      { id: "follow", label: "I can follow an existing design system", signal: "partial:consumer" },
      { id: "built", label: "I've built and maintained a design system", signal: "safe:system-builder" },
      { id: "scaled", label: "I've built design systems that scale across products and teams", signal: "very-safe:system-architect" },
    ],
  },
  {
    id: "des-technical",
    question: "Do you understand how the things you design get built?",
    type: "single",
    options: [
      { id: "handoff", label: "No — I hand off to developers", signal: "vulnerable:isolated" },
      { id: "basic-code", label: "I understand basic HTML/CSS", signal: "partial:awareness" },
      { id: "collaborate", label: "I collaborate closely with engineers and understand technical constraints", signal: "safe:cross-functional" },
      { id: "prototype", label: "I can prototype in code", signal: "very-safe:full-stack-design" },
    ],
  },
];

// ---------------------------------------------------------------------------
// WRITER — 8 questions mapping to skill dimensions
// ---------------------------------------------------------------------------
const writerQuestions: AssessmentQuestion[] = [
  {
    id: "wri-type",
    question: "What kind of writing do you do? (select all)",
    type: "multi",
    options: [
      { id: "blog", label: "Blog posts / articles", signal: "dim:content" },
      { id: "marketing", label: "Marketing copy / ads", signal: "dim:persuasion" },
      { id: "technical", label: "Technical documentation", signal: "dim:expertise" },
      { id: "social", label: "Social media content", signal: "dim:engagement" },
      { id: "longform", label: "Long-form (books, whitepapers, reports)", signal: "dim:depth" },
      { id: "ux", label: "UX writing / product copy", signal: "dim:precision" },
      { id: "journalism", label: "Journalism / investigative", signal: "dim:original-reporting" },
    ],
  },
  {
    id: "wri-start",
    question: "Where does your writing start?",
    type: "single",
    options: [
      { id: "blank-page", label: "A blank page — I just start writing", signal: "vulnerable:unstructured" },
      { id: "template", label: "A template or outline from my manager", signal: "very-vulnerable:template-filler" },
      { id: "research", label: "Research — I interview people, read sources, find angles", signal: "safe:research-driven" },
      { id: "strategy", label: "A strategic goal — who is this for, what should they do after reading?", signal: "very-safe:strategic" },
    ],
  },
  {
    id: "wri-differentiation",
    question: "What makes your writing different from anyone else's?",
    type: "single",
    options: [
      { id: "clean", label: "I'm a good writer with clean grammar", signal: "vulnerable:commodity-skill" },
      { id: "fast", label: "I write fast", signal: "very-vulnerable:speed" },
      { id: "voice", label: "I have a distinctive voice and perspective", signal: "safe:unique-voice" },
      { id: "expertise", label: "I have deep expertise in a specific domain", signal: "very-safe:domain-expert" },
      { id: "access", label: "I have relationships and access to sources others don't", signal: "extremely-safe:access" },
    ],
  },
  {
    id: "wri-measurement",
    question: "How do you know if your writing worked?",
    type: "single",
    options: [
      { id: "dont-track", label: "I don't really track it", signal: "vulnerable:no-measurement" },
      { id: "metrics", label: "Page views and engagement metrics", signal: "partial:vanity-metrics" },
      { id: "outcomes", label: "Business outcomes — conversions, signups, behavior change", signal: "safe:business-impact" },
      { id: "reader-impact", label: "I talk to readers and see how it changed their thinking", signal: "very-safe:human-feedback" },
    ],
  },
  {
    id: "wri-unfamiliar",
    question: "A client asks you to write 10 blog posts about a topic you don't know. What do you do?",
    type: "single",
    options: [
      { id: "research-write", label: "Research the topic and write them", signal: "vulnerable:commodity-research" },
      { id: "interview", label: "Interview experts and bring their insights into the writing", signal: "safe:original-sourcing" },
      { id: "push-back", label: "Push back — redefine the strategy so we write fewer, better pieces", signal: "very-safe:strategic-pushback" },
    ],
  },
  {
    id: "wri-ai-usage",
    question: "How are you using AI in your writing right now?",
    type: "single",
    options: [
      { id: "not-using", label: "I'm not — I write everything myself", signal: "ai:resistant" },
      { id: "brainstorming", label: "I use AI for brainstorming or outlines", signal: "ai:curious" },
      { id: "first-drafts", label: "I use AI for first drafts that I heavily edit", signal: "ai:adopter" },
      { id: "commodity-ai", label: "AI handles the commodity writing, I focus on strategy and voice", signal: "ai:integrated" },
      { id: "workflows", label: "I've built AI-assisted content workflows", signal: "ai:leader" },
    ],
  },
  {
    id: "wri-skills",
    question: "Can you do these? (select all that apply)",
    type: "multi",
    options: [
      { id: "editing", label: "Edit a 3,000-word piece down to 800 without losing the point", signal: "skill:editorial-judgment" },
      { id: "interviewing", label: "Interview someone and turn a conversation into a compelling story", signal: "skill:human-connection" },
      { id: "multi-voice", label: "Write in three different brand voices for three different companies", signal: "skill:adaptability" },
      { id: "data-strategy", label: "Look at analytics and change the content strategy based on data", signal: "skill:strategic-thinking" },
      { id: "simplify", label: "Explain a complex technical concept to a non-technical reader", signal: "skill:translation" },
    ],
  },
  {
    id: "wri-unique-value",
    question: "What do you bring that a ChatGPT prompt can't? (be specific)",
    type: "freetext",
  },
];

// ---------------------------------------------------------------------------
// PRODUCT MANAGER — 10 questions mapping to agentic pattern understanding
// ---------------------------------------------------------------------------
const productManagerQuestions: AssessmentQuestion[] = [
  {
    id: "pm-type",
    question: "What kind of product work do you do? (select all)",
    type: "multi",
    options: [
      { id: "b2b-saas", label: "B2B SaaS", signal: "domain:enterprise" },
      { id: "consumer", label: "Consumer / marketplace", signal: "domain:consumer" },
      { id: "platform", label: "Platform / developer tools", signal: "domain:platform" },
      { id: "internal", label: "Internal tools / ops", signal: "domain:internal" },
      { id: "ai-product", label: "AI-powered product", signal: "domain:ai-native" },
      { id: "growth", label: "Growth / experimentation", signal: "domain:growth" },
    ],
  },
  {
    id: "pm-discovery",
    question: "How do you decide what to build?",
    type: "single",
    options: [
      { id: "stakeholder-says", label: "Stakeholders tell me what to build", signal: "vulnerable:order-taker" },
      { id: "roadmap", label: "I follow the roadmap we planned last quarter", signal: "partial:roadmap-driven" },
      { id: "data-user", label: "I combine user research, data, and business goals to prioritize", signal: "safe:evidence-based" },
      { id: "bets", label: "I run discovery sprints and make informed bets on outcomes", signal: "very-safe:outcome-driven" },
    ],
  },
  {
    id: "pm-specs",
    question: "What does a typical spec / PRD from you look like?",
    type: "single",
    options: [
      { id: "ticket-list", label: "A list of tickets or features", signal: "vulnerable:ticket-factory" },
      { id: "user-stories", label: "User stories with acceptance criteria", signal: "partial:structured" },
      { id: "problem-solution", label: "Problem statement, success metrics, trade-offs, and proposed solution", signal: "safe:strategic-specs" },
      { id: "outcomes", label: "Outcome-focused with hypotheses, experiment plan, and decision framework", signal: "very-safe:outcome-architect" },
    ],
  },
  {
    id: "pm-eng-collab",
    question: "How do you work with your engineering team?",
    type: "single",
    options: [
      { id: "handoff", label: "I write specs and hand them off", signal: "vulnerable:handoff-pm" },
      { id: "standups", label: "Regular standups and sprint reviews", signal: "partial:process-pm" },
      { id: "embedded", label: "I'm embedded with the team — pairing on design, unblocking, adjusting scope in real-time", signal: "safe:embedded-pm" },
      { id: "technical", label: "I can read code, understand system architecture, and make technical trade-off decisions", signal: "very-safe:technical-pm" },
    ],
  },
  {
    id: "pm-automation",
    question: "Which parts of your daily work could AI already do? (select all you think apply)",
    type: "multi",
    options: [
      { id: "write-specs", label: "Writing first drafts of PRDs and specs", signal: "automatable:specs" },
      { id: "competitor-research", label: "Competitive research and market analysis", signal: "automatable:research" },
      { id: "data-analysis", label: "Pulling and analyzing product metrics", signal: "automatable:analytics" },
      { id: "stakeholder-updates", label: "Status updates and stakeholder comms", signal: "automatable:comms" },
      { id: "user-interviews", label: "Conducting user interviews", signal: "not-automatable:interviews" },
      { id: "prioritization", label: "Prioritization and trade-off decisions", signal: "not-automatable:judgment" },
      { id: "none", label: "None — AI can't do my job", signal: "unaware" },
    ],
  },
  {
    id: "pm-ai-understanding",
    question: "How well do you understand how AI products actually work under the hood?",
    type: "single",
    options: [
      { id: "magic", label: "It's mostly magic to me — I know it's LLMs but not how they work", signal: "gap:fundamentals" },
      { id: "basics", label: "I understand prompts, tokens, and that models can hallucinate", signal: "partial:basics" },
      { id: "architecture", label: "I understand RAG, fine-tuning, agent architectures, and can evaluate technical trade-offs", signal: "safe:literate" },
      { id: "deep", label: "I can spec an AI feature, define evaluation criteria, and work with engineers on prompt/architecture decisions", signal: "very-safe:ai-pm" },
    ],
  },
  {
    id: "pm-agentic-patterns",
    question: "An engineer says 'we should use an orchestrator-worker pattern for this.' What do you do?",
    type: "single",
    options: [
      { id: "nod", label: "Nod and trust them — that's their domain", signal: "vulnerable:abdicate-technical" },
      { id: "google", label: "Google it later to understand what they mean", signal: "partial:reactive-learning" },
      { id: "discuss", label: "I'd ask about trade-offs vs alternatives and whether it fits the user need", signal: "safe:collaborative-technical" },
      { id: "evaluate", label: "I know what that pattern does and can evaluate if it's the right fit for our use case", signal: "very-safe:pattern-literate" },
    ],
  },
  {
    id: "pm-measurement",
    question: "How do you know if a feature succeeded?",
    type: "single",
    options: [
      { id: "shipped", label: "It shipped on time", signal: "vulnerable:output-focused" },
      { id: "usage", label: "Usage metrics went up", signal: "partial:vanity-metrics" },
      { id: "outcome", label: "We moved a specific business or user metric we defined upfront", signal: "safe:outcome-focused" },
      { id: "iterate", label: "We ran an experiment, measured the result, and iterated based on what we learned", signal: "very-safe:experiment-driven" },
    ],
  },
  {
    id: "pm-ai-usage",
    question: "How are you using AI in your PM work right now?",
    type: "single",
    options: [
      { id: "not-at-all", label: "I'm not using AI at all", signal: "ai:none" },
      { id: "chatgpt-questions", label: "I use ChatGPT/Claude for ad-hoc questions", signal: "ai:consumer" },
      { id: "drafts-analysis", label: "I use AI for drafting specs, analyzing data, or summarizing research", signal: "ai:tools" },
      { id: "product-decisions", label: "I use AI insights to inform product decisions and strategy", signal: "ai:integrated" },
      { id: "ai-features", label: "I've shipped AI-powered features and understand the full build lifecycle", signal: "ai:builder" },
    ],
  },
  {
    id: "pm-blocker",
    question: "What's your biggest challenge with AI right now?",
    type: "single",
    options: [
      { id: "dont-get-it", label: "I don't really understand what's possible with AI yet", signal: "blocker:awareness" },
      { id: "cant-spec", label: "I can't spec AI features because I don't understand the architecture", signal: "blocker:architecture" },
      { id: "cant-evaluate", label: "I can't evaluate whether my team's AI approach is good or not", signal: "blocker:evaluation" },
      { id: "no-strategy", label: "I know AI matters but I don't have a clear strategy for my product", signal: "blocker:strategy" },
      { id: "ahead", label: "I'm already using AI effectively — I want to go deeper", signal: "blocker:none" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Assembled role configs
// ---------------------------------------------------------------------------
export const roleAssessments: RoleAssessment[] = [
  {
    role: "product-manager",
    title: "Product Manager",
    subtitle: "PMs, product leads, TPMs, product owners",
    icon: "LayoutDashboard",
    questions: [...productManagerQuestions, ...sharedQuestions],
  },
  {
    role: "developer",
    title: "Developer",
    subtitle: "Software engineers, architects, tech leads",
    icon: "Code2",
    questions: [...developerQuestions, ...sharedQuestions],
  },
  {
    role: "designer",
    title: "Designer",
    subtitle: "UI/UX, graphic, brand, product designers",
    icon: "Palette",
    questions: [...designerQuestions, ...sharedQuestions],
  },
  {
    role: "writer",
    title: "Writer",
    subtitle: "Content creators, copywriters, journalists",
    icon: "PenTool",
    questions: [...writerQuestions, ...sharedQuestions],
  },
];

export function getRoleAssessment(role: Role): RoleAssessment | undefined {
  return roleAssessments.find((r) => r.role === role);
}
