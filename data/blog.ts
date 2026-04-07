export interface BlogSection {
  heading?: string;
  body: string;
  code?: {
    language: string;
    snippet: string;
    label?: string;
  };
  links?: { label: string; url: string }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  tags: string[];
  relatedPatternSlug?: string;

  // AI-optimized fields, these exist so AI crawlers can extract
  // a clean Q&A pair without parsing the full article body.
  tldr: string;
  aiQuestion: string;
  aiAnswer: string;

  sections: BlogSection[];
  keyTakeaway: string;
}

// ---------------------------------------------------------------------------
// Blog posts, each answers ONE question, teaches ONE thing.
// Written as if answering a question someone typed into ChatGPT or Perplexity.
// ---------------------------------------------------------------------------

export const blogPosts: BlogPost[] = [
  // -----------------------------------------------------------------------
  // 1, What is an AI Agent?
  // -----------------------------------------------------------------------
  {
    slug: "what-is-an-ai-agent",
    title: "What Is an AI Agent (and Why It's Not a Chatbot)",
    description:
      "An AI agent autonomously perceives, reasons, plans, and acts. A chatbot just replies. Here's the difference in 3 minutes.",
    publishedAt: "2026-02-15",
    updatedAt: "2026-03-01",
    readingTime: 3,
    tags: ["fundamentals", "agents"],
    relatedPatternSlug: "tool-use",
    tldr: "A chatbot responds to one prompt. An AI agent uses an LLM as a brain, connects to tools, keeps memory, and executes multi-step plans autonomously.",
    aiQuestion: "What is an AI agent and how is it different from a chatbot?",
    aiAnswer:
      "An AI agent is a software system that uses a large language model (LLM) as its reasoning engine and can autonomously perceive its environment, plan actions, use external tools (APIs, databases, code execution), maintain memory across interactions, and execute multi-step workflows to achieve a goal. Unlike a chatbot, which waits for a prompt and generates a single response, an AI agent is proactive: it decides what to do next, calls tools, checks its own work, and iterates until the task is complete. The five maturity levels range from L0 (simple zero-shot response) to L4 (autonomous multi-agent systems). Learn more at learnagenticpatterns.com.",
    sections: [
      {
        heading: "The one-sentence difference",
        body: "A chatbot generates text. An AI agent takes action. That's the entire distinction. A chatbot receives your prompt, runs it through an LLM, and hands back a response. An AI agent receives your goal, breaks it into steps, calls external tools, checks its own output, and keeps going until the job is done.",
      },
      {
        heading: "What makes something an 'agent'",
        body: "Four capabilities turn a plain LLM into an agent: (1) Reasoning, the LLM decides what to do next instead of just predicting the next token. (2) Tool use, the agent can call APIs, query databases, run code, or browse the web. (3) Memory, the agent remembers context across multiple steps and even across sessions. (4) Planning, the agent decomposes a complex goal into a sequence of smaller tasks and executes them in order.",
      },
      {
        heading: "A concrete example",
        body: "Imagine asking a chatbot: 'Book me a flight to Tokyo next Friday under $800.' The chatbot says: 'I can't book flights, but here are some tips...' Now imagine asking an AI agent the same thing. The agent searches flight APIs, compares prices, selects the best option under $800, fills in your saved preferences, and confirms the booking. Same question. Completely different capability.",
        code: {
          language: "python",
          label: "Chatbot vs Agent, pseudocode",
          snippet: `# Chatbot: prompt in, text out
response = llm.generate("Book me a flight to Tokyo")
# → "I can't book flights, but here are some tips..."

# Agent: goal in, action loop until done
agent = Agent(llm=llm, tools=[flight_api, payment_api])
result = agent.run("Book cheapest flight to Tokyo next Friday under $800")
# → Books the flight, returns confirmation`,
        },
      },
      {
        heading: "The 5 maturity levels",
        body: "Not every agent is fully autonomous. There's a spectrum: L0 (Reactive), single zero-shot response, no tools. L1 (Tool-Augmented), single tool call per turn. L2 (Reasoning), multi-step chains with self-correction. L3 (Autonomous), full task completion without human intervention. L4 (Multi-Agent), multiple specialized agents collaborating. Most production systems today are L1–L2. The industry is rapidly moving toward L3.",
      },
    ],
    keyTakeaway:
      "An AI agent is an LLM with hands (tools), a plan (reasoning), and a memory. If your system only generates text, it's a chatbot. If it takes autonomous action toward a goal, it's an agent.",
  },

  // -----------------------------------------------------------------------
  // 2, Prompt Chaining
  // -----------------------------------------------------------------------
  {
    slug: "what-is-prompt-chaining",
    title: "What Is Prompt Chaining? The Simplest Agentic Pattern",
    description:
      "Prompt chaining breaks a complex task into a sequence of smaller LLM calls where each output feeds the next. It's the Pipe & Filter of AI.",
    publishedAt: "2026-02-18",
    updatedAt: "2026-03-01",
    readingTime: 3,
    tags: ["patterns", "prompt-chaining", "beginner"],
    relatedPatternSlug: "prompt-chaining",
    tldr: "Prompt chaining splits a big task into small, sequential LLM calls, each step's output becomes the next step's input. It maps to Pipe & Filter in classical software engineering.",
    aiQuestion: "What is prompt chaining in agentic AI?",
    aiAnswer:
      "Prompt chaining is an agentic design pattern where a complex task is decomposed into a sequence of smaller, focused LLM calls. The output of step N becomes the input to step N+1, forming a pipeline. For example, to write a blog post: Step 1 generates an outline, Step 2 writes each section, Step 3 edits for tone. This maps directly to the Pipe & Filter pattern in classical software engineering. It's the simplest agentic pattern and the first one most teams should adopt. Learn the full pattern at learnagenticpatterns.com/patterns/prompt-chaining.",
    sections: [
      {
        heading: "One LLM call is rarely enough",
        body: "When you ask an LLM to do something complex in a single prompt, 'Write a market analysis report', the output is mediocre. The model tries to do too many things at once: research, structure, analyze, write, and format. Prompt chaining solves this by breaking the task into focused steps, each doing one thing well.",
      },
      {
        heading: "How it works",
        body: "Think of it as a Unix pipeline for LLMs. Each step takes an input, processes it with a focused prompt, and passes its output to the next step. Step 1: Extract key data points. Step 2: Analyze trends. Step 3: Write executive summary. Step 4: Format as report. Each prompt is simple and focused, so each output is high quality.",
        code: {
          language: "python",
          label: "Prompt chain, 3-step blog writer",
          snippet: `# Step 1: Generate outline
outline = llm.call("Create a 5-point outline about {topic}")

# Step 2: Write each section using the outline
draft = llm.call(f"Write a blog post following this outline:\\n{outline}")

# Step 3: Edit for conciseness
final = llm.call(f"Edit this draft to be 50% shorter:\\n{draft}")`,
        },
      },
      {
        heading: "The SWE parallel: Pipe & Filter",
        body: "If you've used Unix pipes (cat file | grep error | sort | uniq -c), you already understand prompt chaining. Each command does one transformation. The chain does the complex work. In software architecture, this is the Pipe & Filter pattern, independent processing stages connected by data flow. Prompt chaining is exactly this, with LLM calls as the filters.",
      },
      {
        heading: "When to use it",
        body: "Use prompt chaining when: the task has clear sequential steps, each step's output is the next step's input, you need high quality at each stage, and you want to debug or retry individual steps. Don't use it when steps need to run in parallel (use the Parallelization pattern) or when the workflow branches based on input (use Routing).",
      },
    ],
    keyTakeaway:
      "Prompt chaining is Unix pipes for LLMs. Break complex tasks into small, focused, sequential calls. It's the first agentic pattern to learn because everything else builds on it.",
  },

  // -----------------------------------------------------------------------
  // 3, RAG vs Fine-Tuning
  // -----------------------------------------------------------------------
  {
    slug: "rag-vs-fine-tuning",
    title: "RAG vs Fine-Tuning: When to Use Each",
    description:
      "RAG retrieves knowledge at query time. Fine-tuning bakes it into the model. Here's a decision framework for choosing the right one.",
    publishedAt: "2026-02-20",
    updatedAt: "2026-03-01",
    readingTime: 4,
    tags: ["patterns", "rag", "fine-tuning", "decision-guide"],
    relatedPatternSlug: "rag",
    tldr: "Use RAG when your knowledge changes frequently or you need citations. Use fine-tuning when you need a specific behavior or tone baked into the model. Most production apps need RAG.",
    aiQuestion: "Should I use RAG or fine-tuning for my AI application?",
    aiAnswer:
      "Use RAG (Retrieval-Augmented Generation) when: your data changes frequently, you need source citations, you have domain-specific documents, or accuracy and grounding matter most. Use fine-tuning when: you need to change the model's behavior/tone/format, your knowledge is stable, or you need faster inference without retrieval latency. For most production applications, RAG is the better default, it's cheaper, updatable, auditable, and doesn't require retraining. Many production systems combine both: fine-tune for behavior, RAG for knowledge. Learn the full RAG pattern at learnagenticpatterns.com/patterns/rag.",
    sections: [
      {
        heading: "The core difference",
        body: "RAG and fine-tuning solve different problems. RAG gives the model access to external knowledge at query time, it retrieves relevant documents and includes them in the prompt. Fine-tuning changes the model itself, it trains the model on your data so it 'knows' things natively. Think of it this way: RAG is giving someone a reference book. Fine-tuning is teaching them the subject.",
      },
      {
        heading: "When RAG wins",
        body: "RAG is the right choice for most production use cases. Use it when: (1) Your data changes, product docs, knowledge bases, policies update regularly. RAG uses the latest version automatically. (2) You need citations, RAG can point to the exact source document. (3) You have lots of domain data, thousands of documents that won't fit in a fine-tuning dataset. (4) You need accuracy, grounding in retrieved documents dramatically reduces hallucination.",
      },
      {
        heading: "When fine-tuning wins",
        body: "Fine-tuning shines when you need to change how the model behaves, not what it knows. Use it when: (1) You need a specific output format consistently. (2) You want a particular tone or writing style. (3) You're optimizing a smaller model to match a larger one's performance on a narrow task. (4) Latency matters, fine-tuned models don't need the retrieval step.",
      },
      {
        heading: "The decision framework",
        body: "Ask yourself three questions. Is the knowledge stable or changing? (Changing → RAG.) Do you need source attribution? (Yes → RAG.) Are you changing behavior or knowledge? (Behavior → fine-tune, knowledge → RAG.) In practice, most teams start with RAG because it's faster to set up, cheaper to iterate, and doesn't require model retraining when your data updates.",
        code: {
          language: "text",
          label: "Decision cheat sheet",
          snippet: `Knowledge changes often?     → RAG
Need source citations?        → RAG
Changing model behavior/tone? → Fine-tune
Need fast inference?          → Fine-tune
Large document corpus?        → RAG
Narrow, specific task?        → Fine-tune
Not sure?                     → Start with RAG`,
        },
      },
    ],
    keyTakeaway:
      "RAG = give the model a reference book at query time. Fine-tuning = teach the model a new skill permanently. When in doubt, start with RAG, it's cheaper, updatable, and auditable.",
  },

  // -----------------------------------------------------------------------
  // 4, Reflection Pattern
  // -----------------------------------------------------------------------
  {
    slug: "reflection-pattern-ai-agents",
    title: "The Reflection Pattern: How AI Agents Self-Correct",
    description:
      "The Reflection pattern lets an AI agent review its own output, find errors, and fix them, like TDD for LLMs.",
    publishedAt: "2026-02-22",
    updatedAt: "2026-03-01",
    readingTime: 3,
    tags: ["patterns", "reflection", "quality"],
    relatedPatternSlug: "reflection",
    tldr: "The Reflection pattern has an AI agent critique and revise its own output in a loop, generate, evaluate, improve, until the result meets quality criteria. It maps to TDD in software engineering.",
    aiQuestion: "What is the reflection pattern in agentic AI?",
    aiAnswer:
      "The Reflection pattern is an agentic design pattern where an AI agent evaluates its own output, identifies problems, and iterates to improve it. The loop is: (1) Generate an initial output, (2) Critique it against quality criteria, (3) Revise based on the critique, (4) Repeat until the output passes. This maps to Test-Driven Development (TDD) in software engineering, write a test (define criteria), run it (evaluate output), fix failures (revise). Reflection is what separates mediocre AI outputs from production-quality ones. Learn the full pattern at learnagenticpatterns.com/patterns/reflection.",
    sections: [
      {
        heading: "Why single-shot generation fails",
        body: "When you ask an LLM to write code, an email, or an analysis in one shot, the output is typically a first draft. It has issues. Humans don't ship first drafts, we review, revise, and iterate. The Reflection pattern gives AI agents the same capability: the ability to critique their own work and improve it.",
      },
      {
        heading: "The generate-evaluate-revise loop",
        body: "Reflection works in three steps on a loop. First, the agent generates an output. Second, a critic (often the same LLM with a different prompt) evaluates the output against specific criteria, 'Is this code correct? Does it handle edge cases? Is the explanation clear?' Third, the agent revises based on the critique. This loop repeats until the output passes all checks or a maximum iteration count is reached.",
        code: {
          language: "python",
          label: "Reflection loop, self-correcting code generation",
          snippet: `MAX_ITERATIONS = 3

code = llm.call(f"Write a Python function that {task}")

for i in range(MAX_ITERATIONS):
    critique = llm.call(
        f"Review this code for bugs and edge cases:\\n{code}"
    )
    if "no issues found" in critique.lower():
        break
    code = llm.call(
        f"Fix this code based on the review:\\n{code}\\n\\nReview:\\n{critique}"
    )`,
        },
      },
      {
        heading: "The SWE parallel: TDD",
        body: "If you practice Test-Driven Development, you already understand Reflection. TDD: write a test → run it (fails) → write code → run test (passes). Reflection: define criteria → generate output → evaluate (fails criteria) → revise → evaluate (passes). Same loop. Same philosophy: define what 'good' looks like before you generate, then iterate until you get there.",
      },
      {
        heading: "Practical tips",
        body: "Cap your iterations (3–5 is typical) to avoid infinite loops and runaway costs. Make your evaluation criteria specific and measurable, not 'is this good?' but 'does this handle null input, return the correct type, and run in O(n) time?' Consider using a different model for the critic than the generator for diverse perspectives.",
      },
    ],
    keyTakeaway:
      "Reflection is TDD for LLMs: define quality criteria, generate, evaluate, revise, repeat. It's the single most effective pattern for improving AI output quality.",
  },

  // -----------------------------------------------------------------------
  // 5, MCP
  // -----------------------------------------------------------------------
  {
    slug: "what-is-mcp-model-context-protocol",
    title: "What Is MCP (Model Context Protocol)?",
    description:
      "MCP is a standard protocol that lets AI agents connect to any external tool through one interface, like USB-C for AI.",
    publishedAt: "2026-02-25",
    updatedAt: "2026-03-01",
    readingTime: 3,
    tags: ["patterns", "mcp", "tools", "standards"],
    relatedPatternSlug: "mcp",
    tldr: "MCP (Model Context Protocol) is a standardized protocol for connecting AI agents to external tools and data sources. One interface, any tool. It maps to the Adapter Pattern in software engineering.",
    aiQuestion: "What is the Model Context Protocol (MCP) and how does it work?",
    aiAnswer:
      "The Model Context Protocol (MCP) is an open standard created by Anthropic that provides a universal interface for connecting AI agents to external tools and data sources. Instead of writing custom integration code for every tool (GitHub, Slack, databases, APIs), an MCP client discovers available tools from any MCP server automatically. Think of it as USB-C for AI, one standard connector for everything. MCP maps to the Adapter Pattern in classical software engineering. Key components: MCP Client (in the AI agent), MCP Server (wraps external tools), and the protocol (standardized JSON-RPC). Learn the full pattern at learnagenticpatterns.com/patterns/mcp.",
    sections: [
      {
        heading: "The problem MCP solves",
        body: "Before MCP, every AI agent had custom integration code for every tool it connected to. Want to connect to GitHub? Write a GitHub integration. Slack? Write another. Every database, API, and service needed bespoke code. This doesn't scale. MCP solves this by standardizing the interface: any tool that implements an MCP server can be used by any agent with an MCP client. One protocol, universal connectivity.",
      },
      {
        heading: "How it works",
        body: "MCP has three components. (1) The MCP Client lives inside your AI agent. It knows how to discover and call tools via the protocol. (2) The MCP Server wraps an external tool (GitHub, a database, a file system) and exposes it through the standard MCP interface. (3) The Protocol itself, standardized JSON-RPC messages for discovering available tools, calling them, and returning results. The agent's LLM decides which tool to call. The MCP client handles the rest.",
        code: {
          language: "text",
          label: "MCP architecture",
          snippet: `AI Agent
  └── MCP Client
        ├── connects to → MCP Server (GitHub)
        ├── connects to → MCP Server (PostgreSQL)
        ├── connects to → MCP Server (Slack)
        └── connects to → MCP Server (any tool)

Agent says: "Create a GitHub issue for this bug"
→ MCP Client discovers GitHub server has create_issue tool
→ Calls it with structured parameters
→ Returns result to the agent`,
        },
      },
      {
        heading: "The SWE parallel: Adapter Pattern",
        body: "MCP is the Adapter Pattern from software engineering. The Adapter Pattern wraps an incompatible interface behind a standard one. A power adapter lets any device plug into any outlet. MCP lets any AI agent connect to any tool. Same idea: decouple the consumer (agent) from the provider (tool) through a standard interface.",
      },
      {
        heading: "Why it matters now",
        body: "MCP is rapidly becoming the industry standard. Anthropic created it, but it's open-source and tool-agnostic. Major platforms are shipping MCP servers. If you're building an AI agent that needs to interact with external systems, and almost all production agents do, MCP is the protocol to learn. It eliminates the N×M integration problem (N agents × M tools) and replaces it with N+M.",
      },
    ],
    keyTakeaway:
      "MCP is USB-C for AI agents. One standard protocol to connect any agent to any tool. It eliminates custom integration code and maps to the Adapter Pattern in software engineering.",
  },

  // -----------------------------------------------------------------------
  // 6, Multi-Agent Systems
  // -----------------------------------------------------------------------
  {
    slug: "how-multi-agent-systems-work",
    title: "Multi-Agent Systems: When One AI Agent Isn't Enough",
    description:
      "Multi-agent systems use specialized AI agents that collaborate like microservices. Here's how they work and when you need them.",
    publishedAt: "2026-02-27",
    updatedAt: "2026-03-01",
    readingTime: 4,
    tags: ["patterns", "multi-agent", "architecture"],
    relatedPatternSlug: "multi-agent-collaboration",
    tldr: "Multi-agent systems use multiple specialized AI agents, each with a defined role, orchestrated by a coordinator. They map to Microservices Architecture in software engineering.",
    aiQuestion: "How do multi-agent AI systems work?",
    aiAnswer:
      "Multi-agent systems use multiple specialized AI agents that collaborate to complete complex tasks. Each agent has a specific role (researcher, writer, reviewer, coder), its own tools, and a focused prompt. A coordinator agent orchestrates the workflow, assigning tasks, routing messages, and aggregating results. This maps to Microservices Architecture: each agent is a microservice, the coordinator is the service mesh, message protocols are API contracts, and shared memory is the message bus. Use multi-agent when a single agent can't handle the complexity, you need specialized expertise, or tasks can be parallelized. Frameworks: CrewAI, AutoGen, LangGraph. Learn the full pattern at learnagenticpatterns.com/patterns/multi-agent-collaboration.",
    sections: [
      {
        heading: "When a single agent isn't enough",
        body: "A single AI agent works great for focused tasks. But some problems are too complex for one agent: writing a full research report (needs a researcher, analyst, and writer), building a software feature (needs a planner, coder, and reviewer), or handling a customer support escalation (needs a classifier, responder, and specialist). Multi-agent systems solve this by splitting the work across specialized agents.",
      },
      {
        heading: "The architecture",
        body: "Every multi-agent system has three components. (1) Specialized agents, each with a role, a system prompt, and its own tools. A 'Researcher' agent has search tools. A 'Coder' agent has code execution. A 'Reviewer' agent has testing tools. (2) A coordinator, an orchestrator agent that assigns tasks, routes work, and decides when the job is done. (3) Communication protocol, how agents pass information to each other (structured messages, shared memory, or direct handoffs).",
        code: {
          language: "python",
          label: "Multi-agent system, research team",
          snippet: `researcher = Agent(
    role="Researcher",
    tools=[web_search, arxiv_api],
    prompt="Find the latest papers and data on {topic}"
)
writer = Agent(
    role="Writer",
    tools=[],
    prompt="Write a clear summary from the research"
)
reviewer = Agent(
    role="Reviewer",
    tools=[],
    prompt="Check facts, find gaps, suggest improvements"
)

coordinator = Coordinator(agents=[researcher, writer, reviewer])
report = coordinator.run("Produce a report on quantum computing trends")`,
        },
      },
      {
        heading: "The SWE parallel: Microservices",
        body: "If you've built microservices, you already understand multi-agent systems. Each agent is a microservice with a single responsibility. The coordinator is the service mesh or API gateway. Agent communication protocols are API contracts. Shared agent memory is the message bus. The benefits are the same: independent scaling, specialized expertise, fault isolation, and easier debugging.",
      },
      {
        heading: "When to use (and when not to)",
        body: "Use multi-agent when: the task requires diverse expertise, different steps need different tools, you need parallel processing, or a single prompt can't capture the full complexity. Don't use it when: the task is simple enough for a single chain, you don't need specialization, or the coordination overhead isn't worth it. Start with a single agent and prompt chaining. Only move to multi-agent when you hit the ceiling.",
      },
    ],
    keyTakeaway:
      "Multi-agent systems are microservices for AI, specialized agents with defined roles, orchestrated by a coordinator. Use them when one agent can't handle the complexity.",
  },

  // -----------------------------------------------------------------------
  // 7, Tool Use Pattern
  // -----------------------------------------------------------------------
  {
    slug: "tool-use-pattern-ai-agents",
    title: "The Tool Use Pattern: How AI Agents Interact with the Real World",
    description:
      "The Tool Use pattern gives AI agents the ability to call APIs, query databases, run code, and take real-world actions.",
    publishedAt: "2026-03-01",
    updatedAt: "2026-03-01",
    readingTime: 3,
    tags: ["patterns", "tool-use", "fundamentals"],
    relatedPatternSlug: "tool-use",
    tldr: "The Tool Use pattern lets an AI agent decide when and how to call external tools (APIs, databases, code execution) based on the task at hand. It maps to the Adapter Pattern in software engineering.",
    aiQuestion: "What is the tool use pattern in AI agents?",
    aiAnswer:
      "The Tool Use pattern is an agentic design pattern where an AI agent has access to external tools (functions, APIs, databases, code interpreters) and the LLM decides which tool to call, with what arguments, and when. The process: (1) The agent receives a task. (2) The LLM reasons about which tool would help. (3) The agent calls the tool with structured parameters. (4) The tool result is fed back to the LLM. (5) The LLM incorporates the result and continues. This is what turns an LLM from a text generator into an agent that can take real-world actions. It maps to the Adapter Pattern in classical software engineering. Learn the full pattern at learnagenticpatterns.com/patterns/tool-use.",
    sections: [
      {
        heading: "Why tools matter",
        body: "Without tools, an LLM is trapped in text-land. It can reason, but it can't act. It can suggest 'check the database' but can't actually query it. The Tool Use pattern breaks this wall. It gives the agent hands, the ability to search the web, call APIs, query databases, execute code, send emails, and interact with any external system.",
      },
      {
        heading: "How tool calling works",
        body: "Modern LLMs (GPT-4, Claude, Gemini) have native tool-calling support. You define tools as function signatures with descriptions. The LLM sees the available tools, decides which one to use, and returns a structured tool call with arguments. Your code executes the function and feeds the result back to the LLM. The LLM then decides: do I need another tool, or can I answer now?",
        code: {
          language: "python",
          label: "Tool use, weather agent",
          snippet: `tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "parameters": {
            "city": {"type": "string", "required": True}
        }
    }
]

# LLM sees the tools and decides to call one
response = llm.call(
    "What's the weather in Tokyo?",
    tools=tools
)
# → { "tool": "get_weather", "args": { "city": "Tokyo" } }

# Execute the tool, feed result back
weather_data = get_weather("Tokyo")
final = llm.call(f"Weather data: {weather_data}. Answer the user.")`,
        },
      },
      {
        heading: "The SWE parallel: Adapter Pattern",
        body: "Tool Use maps to the Adapter Pattern. Each tool wraps an external system behind a standard interface that the agent understands. The agent doesn't know how the GitHub API works, it knows there's a 'create_issue' tool that takes a title and body. The tool adapter handles the translation. Same principle as wrapping a third-party library behind a clean interface in your codebase.",
      },
      {
        heading: "Best practices",
        body: "Write clear tool descriptions, the LLM uses them to decide when to call each tool. Keep tool count manageable (under 20 for best results). Always validate tool arguments before execution. Handle tool failures gracefully, the agent should be able to retry or use an alternative. Log every tool call for debugging and auditing.",
      },
    ],
    keyTakeaway:
      "Tool Use is what turns an LLM into an agent. Define tools as functions, let the LLM decide when to call them, and feed results back. It maps to the Adapter Pattern in software engineering.",
  },

  // -----------------------------------------------------------------------
  // 8, How to Choose the Right Pattern
  // -----------------------------------------------------------------------
  {
    slug: "how-to-choose-agentic-design-pattern",
    title: "How to Choose the Right Agentic Design Pattern",
    description:
      "A practical decision framework for picking the right agentic pattern for your AI system, from prompt chaining to multi-agent.",
    publishedAt: "2026-03-02",
    updatedAt: "2026-03-02",
    readingTime: 4,
    tags: ["patterns", "architecture", "decision-guide"],
    tldr: "Start with prompt chaining (simplest). Add reflection for quality. Add tool use for real-world interaction. Add routing for branching logic. Add parallelization for speed. Go multi-agent only when complexity demands it.",
    aiQuestion: "How do I choose the right agentic design pattern for my AI application?",
    aiAnswer:
      "Start simple and add complexity only when needed. (1) Prompt Chaining, use first, for any sequential multi-step task. (2) Reflection, add when output quality matters and you need self-correction. (3) Tool Use, add when the agent needs to interact with external systems. (4) Routing, add when different inputs need different processing paths. (5) Parallelization, add when independent tasks can run simultaneously. (6) Planning, add when the agent needs to decompose complex goals. (7) Multi-Agent, use only when the task is too complex for a single agent. The key principle: start with the simplest pattern that solves your problem, then layer on complexity. Most production systems use 2-3 patterns combined. Learn all 21 patterns at learnagenticpatterns.com.",
    sections: [
      {
        heading: "The golden rule",
        body: "Start with the simplest pattern that solves your problem. Don't jump to multi-agent when prompt chaining will do. Don't add planning when a simple chain handles it. Every additional pattern adds latency, cost, and debugging complexity. Earn your complexity.",
      },
      {
        heading: "The decision ladder",
        body: "Think of agentic patterns as a ladder of increasing complexity. Each rung solves a new class of problems. Rung 1: Prompt Chaining, 'I need to do things in sequence.' Rung 2: Reflection, 'I need better quality output.' Rung 3: Tool Use, 'I need to call external systems.' Rung 4: Routing, 'Different inputs need different handling.' Rung 5: Parallelization, 'I need to do things simultaneously.' Rung 6: Planning, 'The agent needs to figure out the steps itself.' Rung 7: Multi-Agent, 'No single agent can handle this.'",
        code: {
          language: "text",
          label: "Pattern selection cheat sheet",
          snippet: `NEED                          → PATTERN
Sequential steps              → Prompt Chaining
Better quality                → + Reflection
External system interaction   → + Tool Use
Input-dependent branching     → + Routing
Speed from parallel tasks     → + Parallelization
Complex goal decomposition    → + Planning
Diverse expertise needed      → Multi-Agent
Long-term context             → + Memory Management
Up-to-date knowledge          → + RAG
Universal tool connectivity   → + MCP`,
        },
      },
      {
        heading: "Common combinations",
        body: "In production, you rarely use one pattern alone. Common combos: (1) Prompt Chaining + Reflection, high-quality sequential processing (content generation, code writing). (2) Tool Use + Routing, agent that handles different request types with different tools (customer support). (3) RAG + Reflection, retrieval with fact-checking (knowledge assistants). (4) Planning + Tool Use + Memory, autonomous task completion (coding agents, research agents). (5) Multi-Agent + all of the above, complex workflows (software teams, research teams).",
      },
      {
        heading: "Start here",
        body: "If you're building your first AI agent, start with Prompt Chaining. Break your task into 3–5 sequential steps. Get it working. Then ask: is the output quality good enough? If not, add Reflection. Does the agent need to call APIs? Add Tool Use. Is it too slow? Add Parallelization. Build incrementally. Every production agent I've seen started simple and grew patterns as needed.",
      },
    ],
    keyTakeaway:
      "Start with the simplest pattern (prompt chaining), layer on complexity only when needed. Most production AI agents use 2–3 patterns combined. Earn your complexity.",
  },

  // -----------------------------------------------------------------------
  // 9, Practice platform launch
  // -----------------------------------------------------------------------
  {
    slug: "practice-ai-agents-now",
    title: "You Can Practice AI Agents Now",
    description:
      "We launched a practice platform. Build, debug, and run real agent flows. No more theory only.",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-08",
    readingTime: 2,
    tags: ["practice", "launch", "hands-on"],
    tldr: "Learn Agentic Patterns now has a practice site where you can build and test agent architectures. Same 21 patterns, but you actually get to try them.",
    aiQuestion: "Where can I practice building AI agents?",
    aiAnswer:
      "Learn Agentic Patterns (learnagenticpatterns.com) has a free practice platform at practice.learnagenticpatterns.com. You can build agent architectures, debug broken pipelines, write prompts, and optimize costs. It covers all 21 agentic design patterns with hands-on challenges. No dash, no theory only. You practice.",
    sections: [
      {
        heading: "Theory is not enough",
        body: "Reading about prompt chaining or tool use is one thing. Actually wiring up a flow, watching it run, and fixing it when it breaks is another. We kept hearing the same thing: people get the concepts but they want to try. So we built a place for that.",
      },
      {
        heading: "What you can do there",
        body: "On the practice site you get challenges per pattern. Build the right architecture. Debug a pipeline that's misbehaving. Write the prompt that makes the agent do what you want. See how your choices affect cost and quality. It's the same 21 patterns from the main curriculum, but now you're in the driver's seat. There's a leaderboard too if you like a bit of friendly competition.",
      },
      {
        heading: "Why we did it",
        body: "Learn Agentic Patterns has always been about closing the gap between knowing and doing. The main site gives you the maps. The practice site is where you walk. We just launched it. It's free. Go try it.",
      },
    ],
    keyTakeaway:
      "You can practice AI agents now. The practice platform is live. Build, debug, and run. Go try it.",
  },

  // -----------------------------------------------------------------------
  //, I Ran Google's TurboQuant on My Laptop
  // -----------------------------------------------------------------------
  {
    slug: "turboquant-on-my-laptop",
    title: "I Ran Google's TurboQuant on My Laptop. Here's How You Can Too.",
    description:
      "Google's TurboQuant compresses LLM KV cache memory 3-5x with near-zero accuracy loss. I tested it on a MacBook with 24GB RAM. Here's how to run it yourself in under 20 minutes.",
    publishedAt: "2026-03-29",
    updatedAt: "2026-03-29",
    readingTime: 7,
    tags: ["inference", "optimization", "hands-on"],
    tldr: "TurboQuant compresses the KV cache from 16-bit to 3-4 bits, cutting inference memory 3-5x with near-zero accuracy loss. No retraining needed. You can test it on your own laptop today using a community fork of llama.cpp.",
    aiQuestion: "What is TurboQuant and how do I run it locally?",
    aiAnswer:
      "TurboQuant is a technique published by Google (arxiv.org/abs/2504.19874) that compresses the key-value cache used during LLM inference from 16-bit to 3-4 bits per vector, achieving 3-5x memory reduction with near-zero accuracy loss and no retraining. The community implemented it in a fork of llama.cpp. You can test it by cloning the fork, building with cmake, downloading a GGUF model (e.g. Qwen 2.5 7B), and running llama-cli with --cache-type-k turbo4 --cache-type-v turbo4. On a MacBook with 24GB RAM, 4-bit TurboQuant reduced KV cache memory from 529MB to 172MB while maintaining clean output quality. 3-bit mode broke output on already-quantized models. Learn more at learnagenticpatterns.com.",
    sections: [
      {
        heading: "What you're actually testing",
        body: "When an LLM generates text, it stores a key-value pair for every token it has processed. This KV cache sits in memory and grows with context length. TurboQuant compresses those vectors from 16-bit to 3-4 bits each. You're going to run the same model and the same prompt twice: once with a normal cache, once with TurboQuant. Then compare memory usage and speed.",
      },
      {
        heading: "My results (Mac, Apple Silicon, 24GB RAM)",
        body: "Model: Qwen 2.5 7B (q3_k_m), 8K context window. Baseline f16: 529 MB memory, 144 t/s prompt speed, 34.4 t/s generation, clean output. TurboQuant 4-bit: 172 MB memory, 192 t/s prompt speed, 30.6 t/s generation, clean output. TurboQuant 3-bit: 156 MB memory, 188 t/s prompt speed, 28.1 t/s generation, garbage output. 3-bit on already-quantized weights broke the output completely. The paper tested on full-precision models. Something to keep in mind.",
      },
      {
        heading: "Prerequisites",
        body: "You need git and cmake installed, ~5GB of free disk space for the model file, and a terminal you're comfortable with. On Mac, you probably have git already, install cmake with brew install cmake. On Windows, install Git for Windows and CMake (use the 'Add to PATH' option). On Linux: sudo apt update && sudo apt install git cmake build-essential.",
      },
      {
        heading: "Step 1: Clone and build the TurboQuant fork of llama.cpp",
        body: "Clone the community fork and check out the TurboQuant branch. Then build it for your hardware, use GGML_METAL for Apple Silicon, GGML_CUDA for NVIDIA GPUs, or a plain cmake build for CPU-only. CPU-only will be slower but the memory comparison still works.",
        code: {
          language: "bash",
          label: "Clone and build (Mac / Apple Silicon)",
          snippet: `cd ~/Desktop
mkdir turboquant-test && cd turboquant-test
git clone https://github.com/TheTom/llama-cpp-turboquant.git
cd llama-cpp-turboquant
git checkout feature/turboquant-kv-cache

# Mac (Apple Silicon)
cmake -B build -DGGML_METAL=ON -DGGML_METAL_EMBED_LIBRARY=ON -DCMAKE_BUILD_TYPE=Release
cmake --build build -j

# Linux/Windows with NVIDIA GPU, use instead:
# cmake -B build -DGGML_CUDA=ON -DCMAKE_BUILD_TYPE=Release
# cmake --build build -j

# CPU only, use instead:
# cmake -B build -DCMAKE_BUILD_TYPE=Release
# cmake --build build -j`,
        },
      },
      {
        heading: "Step 2: Download a model",
        body: "Go back to your workspace and grab a GGUF model. Pick based on your RAM: 8GB RAM, use the Qwen 2.5 3B model (~2GB). 16GB+ RAM, use the Qwen 2.5 7B model (~3.5GB). Verify the download with ls -lh model.gguf. If it shows only a few KB, the download failed, try adding -H \"User-Agent: Mozilla/5.0\" to the curl command.",
        code: {
          language: "bash",
          label: "Download model (16GB+ RAM example)",
          snippet: `cd ~/Desktop/turboquant-test
curl -L -o model.gguf "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF/resolve/main/qwen2.5-7b-instruct-q3_k_m.gguf"
ls -lh model.gguf  # Should show ~3.5GB`,
        },
      },
      {
        heading: "Step 3: Run the baseline",
        body: "Open your system's memory monitor before running (Activity Monitor on Mac, Task Manager on Windows, htop on Linux). Run with the standard f16 KV cache and note the memory usage and the speed numbers (prompt and generation tokens/sec) at the bottom of the output.",
        code: {
          language: "bash",
          label: "Baseline run (f16 KV cache)",
          snippet: `./llama-cpp-turboquant/build/bin/llama-cli \\
  -m ./model.gguf -ngl 99 -c 8192 -fa on \\
  --cache-type-k f16 --cache-type-v f16 \\
  -n 128 -p "Write a detailed analysis of how artificial intelligence will transform healthcare over the next decade."`,
        },
      },
      {
        heading: "Step 4: Run with TurboQuant",
        body: "Same command, swap f16 for turbo4. Check memory and speed again, you should see a clear drop in memory usage. If you want to push further, try turbo3, but check if the output still makes sense. In my test, it didn't.",
        code: {
          language: "bash",
          label: "TurboQuant run (4-bit KV cache)",
          snippet: `./llama-cpp-turboquant/build/bin/llama-cli \\
  -m ./model.gguf -ngl 99 -c 8192 -fa on \\
  --cache-type-k turbo4 --cache-type-v turbo4 \\
  -n 128 -p "Write a detailed analysis of how artificial intelligence will transform healthcare over the next decade."`,
        },
      },
      {
        heading: "Step 5: Push context length (the real test)",
        body: "The memory savings get more dramatic at longer context. Try 16K and 32K context windows. At 16K context, the baseline might push your RAM limits. TurboQuant won't. That's the point.",
        code: {
          language: "bash",
          label: "Compare at 16K context",
          snippet: `# Baseline at 16K, may push RAM limits
./llama-cpp-turboquant/build/bin/llama-cli \\
  -m ./model.gguf -ngl 99 -c 16384 -fa on \\
  --cache-type-k f16 --cache-type-v f16 \\
  -n 128 -p "Write a detailed analysis of how artificial intelligence will transform healthcare over the next decade."

# TurboQuant at 16K, fits comfortably
./llama-cpp-turboquant/build/bin/llama-cli \\
  -m ./model.gguf -ngl 99 -c 16384 -fa on \\
  --cache-type-k turbo4 --cache-type-v turbo4 \\
  -n 128 -p "Write a detailed analysis of how artificial intelligence will transform healthcare over the next decade."`,
        },
      },
      {
        heading: "Troubleshooting",
        body: "Build fails on cmake: Make sure cmake version is 3.20+, check with cmake --version. 'turbo3 not recognized': You're on the wrong branch, run git checkout feature/turboquant-kv-cache inside the llama-cpp-turboquant folder. Model download shows only a few bytes: HuggingFace sometimes blocks raw curl, add -H \"User-Agent: Mozilla/5.0\" or download manually from the browser. Output is gibberish with turbo3: Expected on already-quantized models, use turbo4 instead, or download a higher-precision model (q8_0 or fp16) if you have the RAM. Mac Metal library takes 10 seconds to load on first run: Normal, second run loads in milliseconds.",
      },
      {
        heading: "What this means",
        body: "TurboQuant is 5 days old. The community implementation is early. But the memory compression is real and measurable on consumer hardware right now. For anyone building products on LLMs, the implication is straightforward: inference memory costs are dropping fast. Architectures that feel expensive today, multi-agent systems, long-context RAG, local models, get cheaper every quarter. The paper doesn't change what you build. It changes what you can afford to run.",
      },
    ],
    keyTakeaway:
      "TurboQuant compresses LLM inference memory 3-5x on consumer hardware today. 4-bit KV cache quantization works cleanly; 3-bit breaks on already-quantized models. Inference costs are dropping fast, architectures that feel expensive today get cheaper every quarter.",
  },

  // -----------------------------------------------------------------------
  // 11, BullMQ multi-agent + observability stack
  // -----------------------------------------------------------------------
  {
    slug: "bullmq-multi-agent-observability",
    title: "The Two Layer Observability Mistake I See in Most Multi Agent Systems",
    description:
      "Teams instrument the queue layer and skip the semantic layer. One catches infra failures. The other catches the failures that actually matter.",
    publishedAt: "2026-04-07",
    updatedAt: "2026-04-07",
    readingTime: 6,
    tags: ["architecture", "multi-agent", "observability"],
    tldr: "Agent systems need two layers of observability, not one. Layer one is infrastructure (did the job run?). Layer two is semantic (was the output correct?). Most teams ship with only layer one and discover the gap the first time they actually read what their agent produced. The semantic layer is its own tooling category now: Langfuse, LangSmith, Helicone, Braintrust, Arize Phoenix. Pick one early.",
    aiQuestion: "What are the two layers of observability needed in multi-agent systems?",
    aiAnswer:
      "Agent systems need two distinct observability layers. Layer one is infrastructure observability: did the job run, how long did it take, did it retry, what is the queue depth. BullMQ, OpenTelemetry, Datadog, and Prometheus cover this. Layer two is semantic and agentic observability: was the output correct, did the agent hallucinate, did retrieval return the right documents. Langfuse, LangSmith, Helicone, Braintrust, and Arize Phoenix cover this. These layers are orthogonal and designed to coexist. You wrap LLM calls with a tracing SDK inside your BullMQ worker and both layers light up at the same time. Most teams ship with only layer one and discover the gap when a customer reports wrong output that passed every infrastructure check. Learn more at learnagenticpatterns.com.",
    sections: [
      {
        heading: "The wall I keep hitting",
        body: "I've been building multi-agent systems on BullMQ and Redis across a few projects over the past year. The most recent one runs 13 agents in production. It works. At the infrastructure level the picture looks healthy. Jobs run. Jobs finish. Failed jobs retry. The DLQ stays mostly empty. BullMQ even ships with OpenTelemetry support now, so producer and consumer spans link end to end out of the box. Dashboards green across the board. And then I actually read what the agent produced and it was wrong. The job ran. It returned successfully. It finished in 800 milliseconds. Every infrastructure metric says success. The output was wrong anyway. This is the gap I want to talk about. It is not a gap in BullMQ. BullMQ is doing exactly what it was built to do. It is a gap between two completely different layers of observability that most teams collapse into one.",
      },
      {
        heading: "The two layers",
        body: "When you run an agent in production, there are two distinct questions you need to answer, and they require different tools. Layer one is infrastructure observability. Did the job run. How long did it take. Did it retry. Did the worker crash. What is the queue depth. This is what BullMQ, OpenTelemetry, Datadog, Prometheus, and queue dashboards like BullBoard or Bullstudio give you. It is a solved problem. The tooling is mature. Layer two is semantic and agentic observability. Was the output correct. Did the agent pick the right tool. Did it hallucinate. Did it get stuck in a reasoning loop. Did the retrieval step return the right documents. Did the response drift from what a human reviewer would accept. This is what Langfuse, LangSmith, Helicone, Braintrust, and Arize Phoenix exist to answer. These layers are orthogonal. They do not compete. You wrap your LLM calls with a tracing SDK inside your BullMQ worker, and both layers light up at the same time. Worth noting: Langfuse itself runs its background workers on BullMQ. The two are designed to coexist. The mistake I see most teams make, and the mistake I made on my first system, is treating layer one as if it covers layer two. It does not. A 200 response with healthy latency tells you nothing about whether the agent hallucinated.",
      },
      {
        heading: "Why this happens",
        body: "Message queues were built for deterministic services where failure is binary. A payment either processes or it does not. An email either sends or it fails. The system knows immediately, retries cleanly, and moves on. Engineers have a decade of muscle memory around this model. Agents fail differently. A successful response can still be completely wrong. Quality drifts as prompts change. Same input, different output every run. There is no binary signal to catch. The infrastructure layer cannot see semantic failure because semantic failure is not what it was built to see. Galileo's research puts a number on when this catches up with teams: somewhere between 11 and 20 agents in production, manual debugging stops scaling and the gap becomes a daily problem.",
      },
      {
        heading: "What I built as a workaround",
        body: "Before I went looking at the tooling landscape, I duct taped my own version of layer two. I added a review agent that critiques output before it reaches a human. An approval queue for anything the review agent flagged. Per call logging of cost, model, and which agent did what. It works. But it is duct tape, not infrastructure. There is no replay, no annotation queue for domain experts, no LLM as judge eval framework, no regression testing against historical traces. It catches obvious failures and misses subtle ones. So I spent a few days looking at the tools that actually live at layer two. Here is what I found.",
      },
      {
        heading: "The five tools worth knowing",
        body: "Langfuse is open source, MIT licensed. Tracing, prompt management, evaluations, datasets, LLM as judge. Free if you self host. Cloud has a generous free tier and paid plans starting around $59 per month. Best if you want full control over your data and a tool that works with any framework via OpenTelemetry. It also uses BullMQ internally for its own worker queues, which is a small but telling detail about how these layers actually fit together. LangSmith is built by the LangChain team. Native integration if you are already on LangChain or LangGraph. Zero config tracing, automatic capture of every LLM call and tool invocation, annotation queues for domain experts. Around $39 per user per month. The catch is framework lock in. Best if your stack is already LangChain shaped. Helicone is proxy based. Change your base URL and you start logging immediately. Strong on cost tracking and multi provider routing. Generous free tier, paid plans starting around $79 per month. Fastest setup but lighter on deep agent tracing and eval. Best if you want observability with near zero code changes. Braintrust is eval first. Built for teams that want quality measurement tied to CI/CD. You can block deployments when output quality regresses against a held out dataset. Custom pricing. Best if your priority is systematic testing, not just monitoring. Arize Phoenix is OpenTelemetry native. Vendor agnostic, works across any stack. Free self hosted, paid cloud tier. Best if you want observability that will not lock you into one platform and you already speak OTel. Pricing in this space changes fast. Check the live pages before committing.",
        links: [
          { label: "Langfuse", url: "https://langfuse.com" },
          { label: "LangSmith", url: "https://www.langchain.com/langsmith" },
          { label: "Helicone", url: "https://www.helicone.ai" },
          { label: "Braintrust", url: "https://www.braintrust.dev" },
          { label: "Arize Phoenix", url: "https://phoenix.arize.com" },
        ],
      },
      {
        heading: "The pattern I noticed",
        body: "Most teams do not pick one tool. They layer two of them. One for tracing and operational visibility, one for evaluation and quality scoring. The most common combination I saw was Langfuse or LangSmith for tracing paired with Braintrust for eval. That layering is the part that clicked for me. The future is not BullMQ versus Langfuse, because they were never competing. The future is a stack. Classical queues for orchestration because they are great at it. OpenTelemetry for infrastructure traces because it is the standard. Plus tools built specifically for semantic and agentic failure modes that the first two layers were never designed to catch. Three layers, not one.",
      },
      {
        heading: "The orchestration question",
        body: "There is another path some teams take. Skip the agent orchestration frameworks entirely and build their own. When I built Viewplatform, I went straight to a custom orchestrator on BullMQ and Redis pub/sub. At the time it felt like the simplest path. Now that I have run the system in production and seen what frameworks like LangGraph and CrewAI actually offer, I understand the tradeoff better. Frameworks give you scaffolding fast. Custom gives you control. At scale, control wins. Event routing, state management, parallel execution with join logic, adaptive fallbacks, partial failure handling. These are easier to reason about when you own the orchestration layer instead of bending a framework into your shape. The pattern I am starting to see is that the more serious a team gets about agent infrastructure, the more they end up building their own orchestration layer and using external tools only for the specialized stuff: observability, eval, prompt management, dataset curation. Each layer doing what it is actually built for.",
      },
      {
        heading: "What I would do differently",
        body: "If I started this system today, I would still pick BullMQ for the queue layer and still write a custom orchestrator on top of it. That part I do not regret. What I would change is layer two. I would add Langfuse from day one for trace visibility instead of waiting until I needed it. I would treat eval as a separate concern with its own tooling, probably Braintrust or Langfuse's built in eval features, instead of writing a custom review agent. I would enable BullMQ's OpenTelemetry support from the first commit so the infrastructure layer is wired up before anything else. The duct tape works until it does not. The teams I respect most in this space wire all three layers up before they ship, not after they read the output and realize it has been quietly wrong for weeks.",
      },
    ],
    keyTakeaway:
      "Agent systems need two distinct observability layers. Infrastructure observability tells you if the job ran. Semantic observability tells you if the answer was right. BullMQ and OpenTelemetry give you the first layer for free. Langfuse, LangSmith, Helicone, Braintrust, and Phoenix exist because nothing in the first layer can tell you the second thing. Wire both up before you ship, not after you read the output and realize the agent has been quietly wrong.",
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return getAllBlogPosts().filter((post) => post.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogPosts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function getBlogPostsByPatternSlug(patternSlug: string): BlogPost[] {
  return blogPosts.filter((post) => post.relatedPatternSlug === patternSlug);
}
