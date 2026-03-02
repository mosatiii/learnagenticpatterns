export interface Pattern {
  id: string;
  slug: string;
  number: number;
  name: string;
  sweParallel: string;
  sweParallelFull: string;
  description: string;
  agenticDefinition: string;
  mapping: {
    similarity: string;
    divergence: string;
  };
  codeBefore: string;
  codeAfter: string;
  codeBeforeLabel: string;
  codeAfterLabel: string;
  codeLanguage: string;
  productionNotes: string[];
  keyTakeaway: string;
  isUnlocked: boolean;
}

export const patterns: Pattern[] = [
  {
    id: "prompt-chaining",
    slug: "prompt-chaining",
    number: 1,
    name: "Prompt Chaining",
    sweParallel: "Pipe & Filter",
    sweParallelFull: "Pipe and Filter Architecture / Chain of Responsibility Pattern",
    description:
      "The foundational design pattern where a complex task is decomposed into a linear sequence of smaller, discrete LLM calls. The output of one step becomes the input (context) for the next step.",
    agenticDefinition:
      'Prompt Chaining is the foundational design pattern where a complex task is decomposed into a linear sequence of smaller, discrete LLM calls. The output of one step becomes the input (context) for the next step. By breaking a monolithic prompt into a chain, the system reduces the cognitive load on the model for any single inference, significantly improving accuracy, adherence to instructions, and reliability. It allows for intermediate "gates" where deterministic code can validate outputs before passing them to the next link in the chain.',
    mapping: {
      similarity:
        "Both patterns rely on passing data sequentially through processing nodes. Each node acts independently, having a single responsibility (SRP). The system is composed of modular components that can be tested and optimized in isolation.",
      divergence:
        'In SWE, the transformation is deterministic (bytes in, bytes out) and the interface is rigid (data types). In Prompt Chaining, the transformation is probabilistic (text in, text out). The "interface" between nodes is natural language, which is "fuzzy" and unstructured. This necessitates a new type of "Type Safety" — often implemented via intermediate parsing or "Guardrail" agents — to ensure the next node receives intelligible input.',
    },
    codeBefore: `def process_user_request(request):
    # One giant function trying to do everything
    # High complexity, hard to debug, prone to spaghetti code
    data = extract_entities(request)
    sentiment = analyze_sentiment(data)
    summary = summarize_text(data)
    response = formulate_response(summary, sentiment)
    return response`,
    codeAfter: `# Agentic Architecture using LangChain-style pseudocode
class PromptChain:
    def execute(self, user_query):
        # Step 1: Extraction Agent (The "Filter")
        # Objective: Clean and structure the raw input
        context = llm.invoke(
            prompt="Extract entities and intent...",
            input=user_query
        )

        # Validation Gate (Traditional Code)
        if not self.validate_structure(context):
            raise ValueError("Step 1 failed extraction")

        # Step 2: Analysis Agent (The "Processor")
        # Objective: Perform the core reasoning task
        analysis = llm.invoke(
            prompt="Analyze sentiment and key themes...",
            input=context
        )

        # Step 3: Synthesis Agent (The "Formatter")
        # Objective: Draft the final human-readable response
        final_response = llm.invoke(
            prompt="Draft reply based on analysis...",
            input=analysis
        )
        return final_response`,
    codeBeforeLabel: "Traditional Monolithic Logic",
    codeAfterLabel: "Agentic Prompt Chain Architecture",
    codeLanguage: "python",
    productionNotes: [
      "Latency is additive. Total Latency = Sum(Step_1...Step_N). Chains can become slow if they grow too long. Engineers must optimize prompt length (input tokens) and generation length (output tokens) at each step to maintain responsiveness.",
      'Error propagation is a significant risk. If Step 1 hallucinates or fails to extract the correct context, Step 2 processes garbage ("Garbage In, Garbage Out"). Validation gates between steps are not optional; they are critical reliability engineering.',
      "While multiple calls increase request count, breaking a task down can actually reduce total token usage compared to a massive, multi-turn conversation that requires re-reading a huge context window for every minor correction.",
    ],
    keyTakeaway:
      'Unlearn: The instinct to write a "Mega-Function" or a "Mega-Prompt" that handles all edge cases.\n\nAdapt: Think in terms of "Semantic Micro-Transactions." Break reasoning down into atomic units of work. Architect your prompt chains like you architect a data pipeline: Step A → Validate → Step B → Transform → Step C.',
    isUnlocked: true,
  },
  {
    id: "routing",
    slug: "routing",
    number: 2,
    name: "Routing",
    sweParallel: "Load Balancer / API Gateway",
    sweParallelFull: "Load Balancer / API Gateway / Strategy Pattern",
    description:
      'Dynamically directing a user request to the most appropriate specialized agent, model, or processing path based on the semantic intent and complexity of the query. A "Router" classifies the input and delegates execution to a downstream handler optimized for that specific task.',
    agenticDefinition:
      'Routing involves dynamically directing a user request to the most appropriate specialized agent, model, or processing path based on the semantic intent and complexity of the query. Instead of a single general-purpose model handling everything, a "Router" (often a smaller, faster model) classifies the input and delegates execution to a downstream handler optimized for that specific task.',
    mapping: {
      similarity:
        "Both mechanisms exist to optimize resource usage, enforce separation of concerns, and ensure that a request is handled by the component best suited for it. Just as an API Gateway inspects a request header or URL path to route traffic to the correct backend microservice, an Agentic Router inspects the meaning of a prompt to route it to the correct downstream agent.",
      divergence:
        'Traditional routing is rule-based and syntactic (RegEx, URL paths, headers). Agentic routing is semantic; it requires an LLM call or a vector similarity search to classify intent. This introduces a probabilistic element at the very entry point of the system — the router itself can "misunderstand" the destination.',
    },
    codeBefore: `# Rule-based routing
def route(request):
    if request.path.startswith("/billing"):
        return billingService.handle(request)
    elif request.path.startswith("/support"):
        return supportService.handle(request)
    else:
        return defaultService.handle(request)`,
    codeAfter: `# Agentic Routing
def route_request(user_query):
    # The Router is an Agent (or a classifier) itself
    # It decides the 'Strategy' at runtime
    intent = classification_agent.invoke(
        prompt="Classify intent: BILLING, SUPPORT, or GENERAL?",
        input=user_query
    )

    if intent == "BILLING":
        # Route to a model fine-tuned for financial data
        return billing_agent.run(user_query)
    elif intent == "SUPPORT":
        # Route to a RAG-equipped agent with technical docs
        return support_agent.run(user_query)
    else:
        # Route to a general-purpose frontier model
        return general_agent.run(user_query)`,
    codeBeforeLabel: "Traditional Rule-Based Routing",
    codeAfterLabel: "Semantic Routing Architecture",
    codeLanguage: "python",
    productionNotes: [
      "Using a frontier model (e.g., GPT-4) for the routing step is often overkill and expensive. A best practice is to use a smaller, faster model (e.g., fine-tuned Llama 3, Gemini Flash) or even a simple BERT classifier for the routing step to minimize overhead.",
      "The router is a single point of failure. If it misclassifies, the user gets a wrong answer even if the downstream agents are perfect. You must evaluate the router using a Confusion Matrix to track misclassifications (e.g., Support queries routed to Billing).",
    ],
    keyTakeaway:
      'Adapt: The "Controller" in your MVC architecture is now an AI. You are architecting a system where control flow is determined by natural language classification, not hard-coded logic paths. You must verify the accuracy of this "Semantic Switch."',
    isUnlocked: true,
  },
  {
    id: "parallelization",
    slug: "parallelization",
    number: 3,
    name: "Parallelization",
    sweParallel: "Scatter-Gather / MapReduce",
    sweParallelFull: "Scatter-Gather Pattern / MapReduce / Async-Await Concurrency",
    description:
      'Executing multiple independent agentic tasks simultaneously — such as voting on a decision, generating multiple creative drafts, or verifying facts against different sources — and then aggregating the results. Also known as the "Sectioning" or "Voting" pattern.',
    agenticDefinition:
      'Parallelization involves executing multiple independent agentic tasks simultaneously — such as voting on a decision, generating multiple creative drafts, or verifying facts against different sources — and then aggregating the results. This is also known as the "Sectioning" or "Voting" pattern.',
    mapping: {
      similarity:
        'Both patterns aim to reduce wall-clock time by utilizing concurrent processing threads. They both follow a "Fork-Join" topology where a main thread spawns workers and waits for their completion.',
      divergence:
        'In SWE, aggregation is usually deterministic (summing numbers, merging arrays, concatenating strings). In Agentic systems, aggregation requires a "Reducer" agent — a specialized LLM call — to synthesize disparate natural language outputs. This "Reduce" step often requires complex reasoning to resolve conflicts, de-duplicate information, or build consensus among the parallel outputs.',
    },
    codeBefore: `# Blocking, sequential calls
def generate_report(topic):
    research = do_research(topic)    # Takes 10s
    outlines = draft_outlines(topic)  # Takes 10s
    # Total time: 20s
    return combine(research, outlines)`,
    codeAfter: `# Async Scatter-Gather
async def agentic_parallel_flow(query):
    # Scatter: Launch 3 agents simultaneously
    # Each agent represents a 'thread' of reasoning
    task1 = asyncio.create_task(research_agent.run(query))
    task2 = asyncio.create_task(legal_agent.run(query))
    task3 = asyncio.create_task(market_agent.run(query))

    # Wait for all to complete (Map phase)
    results = await asyncio.gather(task1, task2, task3)

    # Gather: Use a Synthesis Agent to merge perspectives (Reduce phase)
    # The 'Reducer' is intelligent, not just a concatenator
    final_report = synthesis_agent.invoke(
        prompt="Synthesize these three perspectives into one report...",
        input=results
    )
    return final_report`,
    codeBeforeLabel: "Sequential Execution",
    codeAfterLabel: "Agentic Parallelization",
    codeLanguage: "python",
    productionNotes: [
      "Parallelization offers a dramatic reduction in end-to-end latency for complex tasks. It is the primary lever for making complex agentic workflows feel responsive.",
      "Costs scale linearly with the number of parallel branches. Running 5 agents in parallel costs 5x more tokens, even if latency is low. Developers must balance speed against budget.",
      'You must handle "stragglers" (agents that time out) or failures. Does the aggregator fail if one thread fails (fail-all), or does it proceed with partial information (best-effort)?',
    ],
    keyTakeaway:
      'Adapt: Concurrency is now applied to "thoughts" and "perspectives." You are architecting a digital boardroom where multiple entities "think" at once, and you need a strategy (the Reducer) to merge their conclusions into a single coherent output.',
    isUnlocked: true,
  },
  {
    id: "reflection",
    slug: "reflection",
    number: 4,
    name: "Reflection",
    sweParallel: "Unit Testing / TDD Loop",
    sweParallelFull: "Unit Testing / Code Review / Test-Driven Development (TDD) Loop",
    description:
      "Enables an agent to critique its own output (or the output of another agent) to identify errors, hallucinations, or areas for improvement, and then iteratively refine the result. It acts as an internal feedback loop.",
    agenticDefinition:
      "Reflection (or Self-Correction) enables an agent to critique its own output (or the output of another agent) to identify errors, hallucinations, or areas for improvement, and then iteratively refine the result. It acts as an internal feedback loop, significantly increasing the quality and robustness of the final output.",
    mapping: {
      similarity:
        'Both exist to catch errors before final delivery. The "Red-Green-Refactor" loop in TDD is structurally analogous to the "Draft-Critique-Revise" loop in Reflection. It is a quality assurance gate embedded in the development/execution process.',
      divergence:
        'Unit tests check against known, deterministic assertions (e.g., assert x == 5). Reflection checks against qualitative, ambiguous criteria (e.g., "Is this tone professional?", "Is this code secure?", "Does this argument make sense?") using an LLM as the judge. The "test" itself is probabilistic.',
    },
    codeBefore: `def generate_code(spec):
    return codegen_module.generate(spec)
    # If it's buggy, the user finds out later in production.`,
    codeAfter: `def generate_robust_code(spec):
    # Draft Phase
    code = coder_agent.run(spec)

    # Reflection Loop (The "Code Review")
    for _ in range(MAX_RETRIES):
        # The Critic Agent acts as the Unit Test Suite
        critique = reviewer_agent.run(code)

        if critique.is_approved():
            return code
        else:
            # Feedback injection: The loop enables self-correction
            code = coder_agent.run(spec, feedback=critique.comments)

    raise MaxRetriesExceededError("Unable to generate valid code")`,
    codeBeforeLabel: "Single Pass Generation",
    codeAfterLabel: "Reflective Loop Architecture",
    codeLanguage: "python",
    productionNotes: [
      "Reflection is expensive in terms of time. It can double or triple latency depending on the number of reflection cycles permitted. It is a trade-off: higher latency for higher accuracy.",
      'Highly effective at reducing hallucinations. However, there is a risk of "degeneracy," where the agent critiques itself into a worse state or gets stuck in a loop of minor, inconsequential edits.',
      "Increases token usage significantly. Use cheaper models for the drafting phase and stronger, more reasoning-capable models for the critique phase to optimize costs.",
    ],
    keyTakeaway:
      'Adapt: You are embedding the "Code Review" process directly into the runtime application. The system self-corrects before the human ever sees the output. You must design the "Critique Prompts" as carefully as you write unit tests.',
    isUnlocked: true,
  },
  {
    id: "tool-use",
    slug: "tool-use",
    number: 5,
    name: "Tool Use",
    sweParallel: "Adapter / Proxy Pattern",
    sweParallelFull: "Adapter Pattern / Proxy Pattern / Dependency Injection",
    description:
      "Extends the capabilities of an LLM by allowing it to interact with the external world (APIs, databases, calculators, software environments) to perform actions or retrieve data not present in its parametric memory. Transforms the LLM from a text generator into a system controller.",
    agenticDefinition:
      "Tool Use (or Function Calling) extends the capabilities of an LLM by allowing it to interact with the external world (APIs, databases, calculators, software environments) to perform actions or retrieve data that is not present in its parametric memory. This transforms the LLM from a text generator into a system controller.",
    mapping: {
      similarity:
        'Just as the Adapter pattern wraps an incompatible interface (like a 3rd party API) to make it usable by a client class, Agentic Tool Use wraps an external API (like a weather service or SQL database) into a schema (JSON) that the LLM can "understand" and "call."',
      divergence:
        "In SWE, the developer writes the code to call the API explicitly (service.call()). In Agentic Design, the developer defines the interface (the tool definition), and the Agent decides when and how to call it based on the conversation context. This is Inversion of Control at the logic level — the runtime decides the execution path, not the programmer.",
    },
    codeBefore: `def get_weather(city):
    # Developer decides this is always called here
    data = requests.get(f"api.weather.com/{city}")
    return parse(data)

def main():
    print(get_weather("Tokyo"))`,
    codeAfter: `# Tool Definition (The "Adapter")
weather_tool = Tool(
    name="get_weather",
    description="Get current weather for a city. Input should be a city name.",
    func=call_weather_api
)

# The Agent decides IF/WHEN to call it
agent = initialize_agent(tools=[weather_tool], llm=llm)

# The user prompt triggers the tool usage implicitly
result = agent.run("What should I wear in Tokyo today?")
# Internal Logic:
# 1. Thought: "I need to know the weather in Tokyo."
# 2. Action: Call tool 'get_weather' with arg 'Tokyo'
# 3. Observation: "It is 15C and raining."
# 4. Final Answer: "Wear a raincoat."`,
    codeBeforeLabel: "Hardcoded Integration",
    codeAfterLabel: "Agentic Tool Use",
    codeLanguage: "python",
    productionNotes: [
      "Read-only tools (GET requests) are generally safe. Write-enabled tools (POST/DELETE, \"Delete User\", \"Transfer Funds\") require strict Guardrails (Pattern 18) and Human-in-the-Loop (Pattern 13) validation.",
      'If the tool API changes, the agent breaks. Robust error handling (Pattern 12) is needed to inform the agent that the tool failed so it can try an alternative strategy rather than hallucinating a result.',
    ],
    keyTakeaway:
      'Unlearn: "I write the logic that calls the function."\n\nAdapt: "I write the function description so the Agent knows how to use it." You are writing API documentation for a machine reader. The quality of your tool description determines the reliability of the system.',
    isUnlocked: true,
  },
  {
    id: "planning",
    slug: "planning",
    number: 6,
    name: "Planning",
    sweParallel: "Workflow Orchestration / Saga",
    sweParallelFull: "Workflow Orchestration / Saga Pattern / Finite State Machine (FSM)",
    description:
      "The capability of an agent to break down a high-level, ambiguous user goal into a sequence of executable steps (a plan), and then execute them while maintaining the state of progress.",
    agenticDefinition:
      "Planning is the capability of an agent to break down a high-level, ambiguous user goal into a sequence of executable steps (a plan), and then execute them, maintaining the state of progress. It allows agents to tackle tasks that are too complex to be solved in a single turn.",
    mapping: {
      similarity:
        "Both involve managing a sequence of dependent tasks to achieve a complex goal. Both must manage state (which step are we on?) and dependencies (Step B requires Step A).",
      divergence:
        "Standard workflows (e.g., Airflow DAGs, AWS Step Functions) are static and defined at compile-time by the engineer. Agentic plans are dynamic and generated at run-time by the model. The agent builds its own DAG (Directed Acyclic Graph) based on the specific request, allowing it to handle novel situations that the programmer did not foresee.",
    },
    codeBefore: `def handle_return_order():
    # Hardcoded sequence
    validate_payment()
    check_inventory()
    ship_replacement()
    email_user()`,
    codeAfter: `# The Planner Agent generates the DAG at runtime
# Framework: LangGraph / AutoGen
plan = planner_agent.generate_plan(
    goal="Handle a return for a damaged item"
)

# Generated Plan (Dynamic):
# 1. Ask user for photo of damage (Reasoning: Policy requires proof)
# 2. Verify purchase history
# 3. Generate shipping label
# 4. Refund wallet

for step in plan:
    executor_agent.execute(step)
    # Agent updates plan if a step fails (e.g., photo invalid)`,
    codeBeforeLabel: "Static Workflow",
    codeAfterLabel: "Dynamic Planning",
    codeLanguage: "python",
    productionNotes: [
      'Agents often get stuck in loops or generate invalid plans (e.g., skipping a prerequisite). Reliability requires careful guardrails.',
      "Evaluating planners is difficult. You must verify not just the final output, but the validity of the generated plan logic. Is the plan optimal? Is it safe?",
      'Planning takes time upfront ("Time to First Token" is high). Latency-sensitive applications need to balance planning depth with responsiveness.',
    ],
    keyTakeaway:
      'Adapt: You are moving from "Imperative Programming" (telling the machine how to do it) to "Declarative Goal Setting" (telling the machine what to achieve). You build the planner, not the plan.',
    isUnlocked: true,
  },
  {
    id: "multi-agent-collaboration",
    slug: "multi-agent-collaboration",
    number: 7,
    name: "Multi-Agent Collaboration",
    sweParallel: "Microservices Architecture",
    sweParallelFull: "Microservices Architecture / Actor Model / Service-Oriented Architecture (SOA)",
    description:
      "Structuring a system as a team of specialized agents (e.g., a Researcher, a Writer, a Reviewer, a Coder) that collaborate, hand off tasks, and communicate to solve complex problems through role specialization and task decomposition.",
    agenticDefinition:
      "This pattern involves structuring a system as a team of specialized agents (e.g., a Researcher, a Writer, a Reviewer, a Coder) that collaborate, hand off tasks, and communicate to solve complex problems. It relies on role specialization and task decomposition.",
    mapping: {
      similarity:
        "Both involve the decomposition of a monolithic problem into specialized, decoupled components that communicate over a network/protocol. Both rely on the principle of Separation of Concerns.",
      divergence:
        'Microservices communicate via rigid, defined APIs (Syntactic Contracts). Agents communicate via natural language conversations (Semantic Contracts). The "handshake" between agents involves negotiation and context sharing, not just data transfer.',
    },
    codeBefore: `class ContentGenerator:
    def research(self): ...
    def write(self): ...
    def edit(self): ...
    def run(self):
        self.research()
        self.write()
        self.edit()`,
    codeAfter: `# Framework: CrewAI / LangGraph
researcher = Agent(role='Researcher', goal='Find facts', tools=[...])
writer = Agent(role='Writer', goal='Draft content', tools=[...])

# Defining the collaboration workflow (The "Orchestrator")
workflow = Workflow()
workflow.add_node(researcher)
workflow.add_node(writer)

# Define the Handoff (The "Network Call")
workflow.add_edge(researcher, writer)
workflow.run("Write a blog post about Agentic AI")`,
    codeBeforeLabel: "Monolith Class",
    codeAfterLabel: "Multi-Agent System",
    codeLanguage: "python",
    productionNotes: [
      'High latency due to multiple round-trips and "conversations" between agents.',
      'Tracing a request through a conversation between 5 agents is exponentially more difficult than tracing a monolith. Requires specialized tracing tools (like LangSmith or Arize) to visualize the "conversation graph."',
      "Multi-agent chat loops can burn tokens rapidly. Cost management is critical.",
    ],
    keyTakeaway:
      'Adapt: Architecture involves designing the "org chart" of your digital workforce. Who talks to whom? What is the hierarchy? Is it a flat mesh or a hierarchical team?',
    isUnlocked: true,
  },
  {
    id: "memory-management",
    slug: "memory-management",
    number: 8,
    name: "Memory Management",
    sweParallel: "Database / Caching / Session State",
    sweParallelFull: "Database / Caching / Session State Management",
    description:
      "Mechanisms for agents to store, index, and retrieve information over time, spanning short-term (conversation context) and long-term (knowledge base/episodic) history. This gives the agent a sense of continuity and identity.",
    agenticDefinition:
      "Mechanisms for agents to store, index, and retrieve information over time, spanning short-term (conversation context) and long-term (knowledge base/episodic) history. This gives the agent a sense of continuity and identity.",
    mapping: {
      similarity:
        "Persistence of state is crucial for both. Short-term memory ≈ RAM/Redis (Session Store); Long-term memory ≈ Disk/SQL/NoSQL (Persistent Store).",
      divergence:
        'Agentic memory is often Vector-based (semantic similarity) rather than Key-Value or Relational. Retrieval is probabilistic (getting "relevant" memories based on embedding distance) rather than exact (getting "row ID 123").',
    },
    codeBefore: `# Traditional Session
user_session = db.get_user_session(user_id)
last_action = user_session['last_action']`,
    codeAfter: `# Vector Database Retrieval (Long-Term Memory)
relevant_memories = vector_db.similarity_search(
    query=current_user_input
)

# Inject memories into prompt context (Short-Term Memory Loading)
agent.run(
    input=current_user_input,
    context=relevant_memories
)`,
    codeBeforeLabel: "Explicit State Persistence",
    codeAfterLabel: "Semantic Memory",
    codeLanguage: "python",
    productionNotes: [
      'Storing everything in context windows is expensive. Efficient RAG and summarization strategies are needed to manage the "Context Window Economy."',
      'Long-term memory risks storing PII indefinitely. Implementation of "Forgetting" mechanisms and strict data governance is required.',
    ],
    keyTakeaway:
      'Adapt: Database schema design is replaced by "Information Retrieval Strategy." You don\'t just query data; you curate context. You must decide what the agent needs to know to be effective.',
    isUnlocked: false,
  },
  {
    id: "learning-adaptation",
    slug: "learning-adaptation",
    number: 9,
    name: "Learning & Adaptation",
    sweParallel: "CI/CD / A-B Testing",
    sweParallelFull: "CI/CD Pipelines / A/B Testing / Online Learning Systems",
    description:
      'The ability of an agent to improve its performance over time based on feedback, user interactions, or new data, without full model retraining. Includes techniques like "In-Context Learning" (updating few-shot examples) or updating a knowledge base.',
    agenticDefinition:
      'The ability of an agent to improve its performance over time based on feedback, user interactions, or new data, without full model retraining. This includes techniques like "In-Context Learning" (updating few-shot examples) or updating a knowledge base.',
    mapping: {
      similarity:
        "Both represent the continuous improvement lifecycle of the system.",
      divergence:
        'In SWE, improvement requires a code commit, build, and deploy cycle. In Agentic systems, improvement can happen dynamically at runtime. The agent can "learn" a new rule by adding it to its system prompt or memory store, instantly changing behavior without a deployment.',
    },
    codeBefore: `# Code logic is fixed until next deployment
def calculate_score(x):
    return x * 1.5
    # To change to 1.6, must redeploy.`,
    codeAfter: `# Agent updates its own 'few-shot' examples based on feedback
if user_feedback == "Bad response":
    # The system 'learns' by updating the prompt context for next time
    memory.add_negative_example(last_interaction)
    optimizer.update_prompt_instructions("Avoid using passive voice.")`,
    codeBeforeLabel: "Static Code Deployment",
    codeAfterLabel: "Adaptive Agent",
    codeLanguage: "python",
    productionNotes: [
      '"Drift" is a major risk. An agent adapting to bad feedback (poisoning) can degrade quickly. Guardrails are needed to prevent the agent from learning incorrect behaviors.',
      'How do you version control "learned behaviors"? Evaluation of behavioral changes over time is a new engineering challenge.',
    ],
    keyTakeaway:
      'Adapt: Software is no longer a static artifact; it is a living system. Observability must track "Behavioral Drift" in real-time.',
    isUnlocked: false,
  },
  {
    id: "state-management-mcp",
    slug: "state-management-mcp",
    number: 10,
    name: "State Management (MCP)",
    sweParallel: "IDL / REST Standards / USB-C",
    sweParallelFull: "Interface Definition Language (IDL) / REST API Standards / USB-C Standard",
    description:
      "A standardized protocol (Model Context Protocol) for connecting AI models to data sources and tools, ensuring consistent context and state exchange between systems. MCP acts as a universal translator between the LLM and external systems.",
    agenticDefinition:
      "A standardized protocol for connecting AI models to data sources and tools, ensuring consistent context and state exchange between systems. MCP acts as a universal translator between the LLM and external systems.",
    mapping: {
      similarity:
        "Both provide a standardized contract for interoperability. Just as USB-C allows any device to connect to any charger, MCP allows any AI agent to connect to any data repository (GitHub, Slack, Drive) without custom glue code.",
      divergence:
        'MCP focuses specifically on exposing context (prompts, resources, tools) to LLMs, optimizing for the way models "read" interfaces (token-efficient schemas) rather than how compilers read code.',
    },
    codeBefore: `# Custom integration for every tool
def connect_to_github():
    # specific github logic...

def connect_to_slack():
    # specific slack logic...`,
    codeAfter: `# MCP Client connects to generic MCP Servers
# The client is agnostic to what the server actually is
client.connect(server="github-mcp-server")
client.connect(server="slack-mcp-server")

# Tools are auto-discovered and injected into the agent context
tools = client.list_tools()
agent.bind(tools)`,
    codeBeforeLabel: "Custom Glue Code",
    codeAfterLabel: "MCP Standard",
    codeLanguage: "python",
    productionNotes: [
      "Drastically reduces the engineering effort to integrate new tools. Write the MCP server once, use it with any agent.",
      "Standardized protocols allow for centralized security policies (Pattern 18).",
    ],
    keyTakeaway:
      'Adapt: Stop building custom connectors. Adopt standards (like MCP) that treat AI tools as "plug-and-play" peripherals.',
    isUnlocked: false,
  },
  {
    id: "goal-setting-monitoring",
    slug: "goal-setting-monitoring",
    number: 11,
    name: "Goal Setting & Monitoring",
    sweParallel: "Health Checks / APM",
    sweParallelFull: "Health Checks / Watchdogs / APM (Application Performance Monitoring)",
    description:
      'Mechanisms for agents to define high-level objectives, break them into trackable sub-goals, and continuously monitor progress towards completion. The agent checks: "Am I closer to the goal than I was 5 minutes ago?"',
    agenticDefinition:
      'Mechanisms for agents to define high-level objectives, break them into trackable sub-goals, and continuously monitor progress towards completion. The agent checks: "Am I closer to the goal than I was 5 minutes ago?"',
    mapping: {
      similarity:
        "Monitoring system health and progress toward a defined state.",
      divergence:
        'Traditional monitoring checks system metrics (CPU usage, latency, error rate). Agentic monitoring checks semantic progress (e.g., "Have we gathered enough research data yet?", "Is the draft complete?"). It requires "Metacognition" — thinking about thinking.',
    },
    codeBefore: `# Check if process is running
# if ps aux | grep my_script; then echo "OK"; else restart; fi

import subprocess
result = subprocess.run(["ps", "aux"], capture_output=True)
if "my_script" in result.stdout.decode():
    print("OK")
else:
    restart()`,
    codeAfter: `# Semantic Health Check
current_state = agent.get_state()
goal = "Draft a complete report on Q3 earnings"

# The Monitor is an Agent
status = critic_agent.evaluate(
    criteria="Is the report complete and accurate?",
    context=current_state
)

if status == "INCOMPLETE":
    agent.plan.update("Gather more financial data")
    agent.resume()`,
    codeBeforeLabel: "Process Monitoring",
    codeAfterLabel: "Goal Monitoring Agent",
    codeLanguage: "python",
    productionNotes: [
      'Essential to prevent agents from getting stuck in infinite loops ("doom loops") or declaring premature success.',
      "Monitoring consumes tokens. Balance oversight frequency against cost.",
    ],
    keyTakeaway:
      'Adapt: You need to build "Manager Agents" whose only job is to supervise "Worker Agents." You are automating middle management.',
    isUnlocked: false,
  },
  {
    id: "exception-handling-recovery",
    slug: "exception-handling-recovery",
    number: 12,
    name: "Exception Handling & Recovery",
    sweParallel: "Try-Catch / Circuit Breaker",
    sweParallelFull: "Try-Catch Blocks / Circuit Breaker Pattern / Retry-Exponential Backoff",
    description:
      "Strategies for agents to detect failures (e.g., API errors, hallucinations, logic loops) and self-correct or retry using alternative strategies. Allows the system to be resilient in the face of uncertainty.",
    agenticDefinition:
      "Strategies for agents to detect failures (e.g., API errors, hallucinations, logic loops) and self-correct or retry using alternative strategies. This allows the system to be resilient in the face of uncertainty.",
    mapping: {
      similarity:
        "Preventing system crash upon encountering an error.",
      divergence:
        'Agentic recovery is semantic. If a tool fails (e.g., "API Error 500"), the agent can reason about why and try a different tool (e.g., "Google Search failed, I will try Wikipedia") or rephrase the query. It is dynamic problem solving, not just retrying the same operation.',
    },
    codeBefore: `try:
    api.call()
except TimeoutError:
    time.sleep(2)
    api.call()  # Retry exact same logic`,
    codeAfter: `response = tool.call()

if "error" in response:
    # Agent reflects on error and pivots strategy
    plan_b = agent.think(
        "Tool A failed with error. This path is blocked. "
        "I should try searching Wikipedia instead to get the data."
    )
    plan_b.execute()`,
    codeBeforeLabel: "Deterministic Error Handling",
    codeAfterLabel: "Agentic Recovery",
    codeLanguage: "python",
    productionNotes: [
      "Without this, agents are brittle toys. Real-world APIs fail; agents must navigate these failures autonomously.",
      "Ensure error recovery doesn't spiral into an infinite retry loop of different failed strategies.",
    ],
    keyTakeaway:
      "Adapt: Error handling is now a creative problem-solving process. You don't just catch the error; you empower the agent to find a workaround.",
    isUnlocked: false,
  },
  {
    id: "human-in-the-loop",
    slug: "human-in-the-loop",
    number: 13,
    name: "Human-in-the-Loop",
    sweParallel: "Manual Approval Gates",
    sweParallelFull: "Manual Approval Gates (CI/CD) / Maker-Checker Pattern / Two-Factor Authentication",
    description:
      'Integrating human oversight at critical decision points to validate agent actions, provide feedback, or disambiguate requests. The agent pauses execution and requests input from a human "Tool."',
    agenticDefinition:
      'Integrating human oversight at critical decision points to validate agent actions, provide feedback, or disambiguate requests. The agent pauses execution and requests input from a human "Tool."',
    mapping: {
      similarity:
        "Pausing a workflow for authorization or verification.",
      divergence:
        'In Agentic systems, the human is treated as a "Tool" or an Oracle. The agent generates a prompt for the human ("I plan to send this email. Is it okay?"), and the human\'s response is injected back into the agent\'s context as a tool output. The interaction is conversational.',
    },
    codeBefore: `# Static Approval Step (YAML pipeline)
# steps:
#   - name: Wait for approval
#     uses: manual-approval-action
#     # Blocks until button click`,
    codeAfter: `# The Agent proactively asks
if action.risk_level > threshold:
    # 'human_tool' pauses execution and sends a msg to Slack/UI
    user_decision = human_tool.ask(
        "I am about to delete a production database. Proceed?"
    )
    if user_decision == "Y":
        execute()
    else:
        agent.think("User rejected. Aborting task.")`,
    codeBeforeLabel: "CI/CD Approval Gate",
    codeAfterLabel: "Agentic Human-in-the-Loop",
    codeLanguage: "python",
    productionNotes: [
      "The ultimate guardrail for high-stakes actions (writes, payments, public posts).",
      "Introduces massive latency (human speed vs. machine speed). Use asynchronous notifications (webhooks/Slack) rather than blocking the thread.",
    ],
    keyTakeaway:
      'Adapt: Design interfaces for the AI to "talk" to the human, not just the human to talk to the AI. The human is a component in the system loop.',
    isUnlocked: false,
  },
  {
    id: "knowledge-retrieval-rag",
    slug: "knowledge-retrieval-rag",
    number: 14,
    name: "Knowledge Retrieval (RAG)",
    sweParallel: "Database Query / Search Index",
    sweParallelFull: "Database Querying / Search Index Integration (Elasticsearch)",
    description:
      "Retrieval-Augmented Generation (RAG) equips agents with the ability to query external knowledge bases (Vector DBs, Search Indices) to ground their answers in fact and access proprietary data.",
    agenticDefinition:
      "Retrieval-Augmented Generation (RAG) equips agents with the ability to query external knowledge bases (Vector DBs, Search Indices) to ground their answers in fact and access proprietary data.",
    mapping: {
      similarity:
        "Fetching data from storage to populate a view or answer a request.",
      divergence:
        'RAG involves semantic search (vector embeddings) rather than keyword match. It creates a prompt context, not just a data object. The "Schema" is the semantic meaning of the data chunks.',
    },
    codeBefore: `-- SQL Query
SELECT answer FROM faq WHERE topic = 'pricing';`,
    codeAfter: `# Semantic Retrieval
docs = retriever.get_relevant_documents(
    "What is the pricing model?"
)

# Augment Context
prompt = f"Context: {docs}\\nQuestion: What is the pricing model?"

# Generate Answer
response = llm.generate(prompt)`,
    codeBeforeLabel: "SQL Query",
    codeAfterLabel: "Agentic RAG",
    codeLanguage: "python",
    productionNotes: [
      'You must evaluate the Retrieval (Did we get the right doc?) and the Generation (Did the LLM use the doc correctly?). This is known as "RAG Triad" evaluation.',
      "Vector search + LLM generation is slower than a DB lookup. Latency optimization requires careful indexing and caching strategies.",
    ],
    keyTakeaway:
      'Adapt: "Data Access Layer" now implies Vector DBs and Embedding Models. You are optimizing for "Context Relevance," not just query performance.',
    isUnlocked: false,
  },
  {
    id: "inter-agent-communication",
    slug: "inter-agent-communication",
    number: 15,
    name: "Inter-Agent Communication (A2A)",
    sweParallel: "Message Queues / API Contracts",
    sweParallelFull: "Message Queues (RabbitMQ/Kafka) / API Contracts (REST/gRPC)",
    description:
      "Protocols and formats for autonomous agents to exchange messages, tasks, and state information to collaborate on a shared goal.",
    agenticDefinition:
      "Protocols and formats for autonomous agents to exchange messages, tasks, and state information to collaborate on a shared goal.",
    mapping: {
      similarity:
        "Decoupled components exchanging information to coordinate work.",
      divergence:
        'Agents talk in natural language or structured JSON schemas representing "Intent" and "Content." The communication is often a negotiation ("Can you help with X?" "No, I am busy, ask Agent Y") rather than a command.',
    },
    codeBefore: `// Structured API Payload
// POST /order
// { "id": 123, "action": "ship" }`,
    codeAfter: `# Agent Protocol Message
{
    "sender": "SalesAgent",
    "recipient": "FulfillmentAgent",
    "content": "Client X wants the premium package. Can you verify stock?",
    "intent": "QUERY",
    "context_id": "session_789"
}`,
    codeBeforeLabel: "Structured API Payload",
    codeAfterLabel: "Agent Protocol",
    codeLanguage: "python",
    productionNotes: [
      'Protocols like A2A (Agent-to-Agent) or Google\'s Agent protocols are emerging to standardize this handshake to prevent "Tower of Babel" scenarios.',
    ],
    keyTakeaway:
      "Adapt: Define communication protocols and personas, not just data schemas. You are defining how digital employees talk to each other.",
    isUnlocked: false,
  },
  {
    id: "resource-aware-optimization",
    slug: "resource-aware-optimization",
    number: 16,
    name: "Resource-Aware Optimization",
    sweParallel: "Auto-scaling / Load Shedding",
    sweParallelFull: "Garbage Collection / Connection Pooling / Auto-scaling / Load Shedding",
    description:
      "Agents aware of their token consumption, API costs, and computational limits, optimizing their strategies accordingly (e.g., using a cheaper model for simple summarization vs. a frontier model for reasoning).",
    agenticDefinition:
      "Agents aware of their token consumption, API costs, and computational limits, optimizing their strategies accordingly (e.g., using a cheaper model for simple summarization vs. a frontier model for reasoning).",
    mapping: {
      similarity:
        "Managing finite system resources (memory, CPU, budget) to prevent outages or overruns.",
      divergence:
        'Optimization is decision-based (dynamic choice of model/path) rather than infrastructure-based (adding servers). The agent chooses to be frugal.',
    },
    codeBefore: `# Always uses same server configuration
server.process(request)`,
    codeAfter: `# Dynamic Model Selection based on complexity
if task.complexity == "LOW" or task.type == "SUMMARIZATION":
    model = "gpt-3.5-turbo"  # Cheap, Fast
else:
    model = "gpt-4"  # Expensive, Smart, Slow

response = model.generate(prompt)`,
    codeBeforeLabel: "Fixed Resource Allocation",
    codeAfterLabel: "Resource Aware Routing",
    codeLanguage: "python",
    productionNotes: [
      '"Token economics" is a new architectural constraint. Critical for business viability.',
      "Switching models can reduce latency for user-facing interactions while preserving quality for complex tasks.",
    ],
    keyTakeaway:
      'Adapt: Treat "Intelligence" as a metered utility with variable cost tiers. Architect systems that use the "Least Capable Model Necessary" for the task.',
    isUnlocked: false,
  },
  {
    id: "reasoning-techniques",
    slug: "reasoning-techniques",
    number: 17,
    name: "Reasoning Techniques",
    sweParallel: "Algorithms / Design Patterns",
    sweParallelFull: "Algorithms / Design Patterns (e.g., Breadth-First Search, Recursion)",
    description:
      "Advanced cognitive architectures like Chain-of-Thought (CoT), Tree-of-Thought (ToT), and ReAct (Reason+Act) that structure the model's internal processing to solve complex problems.",
    agenticDefinition:
      "Advanced cognitive architectures like Chain-of-Thought (CoT), Tree-of-Thought (ToT), and ReAct (Reason+Act) that structure the model's internal processing to solve complex problems.",
    mapping: {
      similarity:
        'The "method" by which the problem is solved. ToT is essentially a search algorithm (BFS/DFS) applied to the space of "thoughts."',
      divergence:
        "Reasoning is prompted, not coded. You don't write the for loop; you tell the model how to think about the loop. You are programming the cognitive process, not the instruction set.",
    },
    codeBefore: `def solve(problem):
    # Explicit implementation of A* search
    open_set = {start}
    while open_set:
        current = lowest_f_score(open_set)
        if current == goal:
            return path
        ...`,
    codeAfter: `prompt = """
Solve this problem using a Tree of Thought approach.
1. Generate 3 possible next steps.
2. Evaluate each step for feasibility.
3. Discard impossible paths.
4. Expand the best path.
Let's think step by step.
"""

llm.generate(prompt)`,
    codeBeforeLabel: "Coded Algorithm",
    codeAfterLabel: "Cognitive Prompting",
    codeLanguage: "python",
    productionNotes: [
      "More reasoning steps = higher latency. CoT increases token count significantly. Use only when the task complexity demands it.",
    ],
    keyTakeaway:
      'Adapt: Programming is now "Prompt Engineering" at the architectural level. You are defining the algorithms of thought.',
    isUnlocked: false,
  },
  {
    id: "guardrails-safety",
    slug: "guardrails-safety",
    number: 18,
    name: "Guardrails & Safety",
    sweParallel: "Input Validation / Firewalls / IAM",
    sweParallelFull: "Input Validation / Firewalls / Security Policies (IAM) / Middleware",
    description:
      'Architectural safeguards (input/output filters) to prevent agents from executing harmful actions, leaking PII, or deviating from policy. Ensures the agent stays "on rails."',
    agenticDefinition:
      'Architectural safeguards (input/output filters) to prevent agents from executing harmful actions, leaking PII, or deviating from policy. It ensures the agent stays "on rails."',
    mapping: {
      similarity:
        "Preventing bad data or malicious actions from compromising the system.",
      divergence:
        'Guardrails must filter semantic risks (e.g., "Don\'t give financial advice," "Don\'t be rude") rather than just syntactic ones (e.g., "Drop SQL injection," "Validate Email format"). This often requires a separate, smaller LLM to act as the "Censor."',
    },
    codeBefore: `# Input Sanitization
if not valid_email(input):
    raise Error("Invalid email")`,
    codeAfter: `# Output Guardrail
response = agent.generate()

safety_check = guardrail_model.check(response)
if safety_check.contains_pii or safety_check.is_toxic:
    return "<response filtered>"
else:
    return response`,
    codeBeforeLabel: "Input Sanitization",
    codeAfterLabel: "Semantic Guardrail",
    codeLanguage: "python",
    productionNotes: [
      'This is the "Firewall" of the AI age. Mandatory for enterprise compliance.',
      "Adds latency to every request. Must be optimized for speed while maintaining safety.",
    ],
    keyTakeaway:
      'Adapt: Security is now probabilistic. You need "AI Firewalls" (Guardrail models) that can read and understand intent.',
    isUnlocked: false,
  },
  {
    id: "evaluation-monitoring",
    slug: "evaluation-monitoring",
    number: 19,
    name: "Evaluation & Monitoring",
    sweParallel: "Integration Testing / Observability",
    sweParallelFull: "Integration Testing / Observability / APM (Datadog/New Relic)",
    description:
      "Frameworks for measuring agent performance (accuracy, faithfulness, tool usage) and monitoring behavior in production (traces, logs).",
    agenticDefinition:
      "Frameworks for measuring agent performance (accuracy, faithfulness, tool usage) and monitoring behavior in production (traces, logs).",
    mapping: {
      similarity:
        "Tracking system health and correctness.",
      divergence:
        '"Correctness" is subjective. Traditional metrics (Latency, Error Rate) are insufficient. You need "LLM-as-a-Judge" metrics to score "Correctness," "Hallucination Rate," and "Tone."',
    },
    codeBefore: `# Unit Test Assertion
assert function(2, 2) == 4`,
    codeAfter: `# LLM-as-a-Judge
score = evaluator_llm.grade(
    input=question,
    output=agent_answer,
    ground_truth=expected_answer
)
# Returns a score (e.g., 0.85) and reasoning
assert score > 0.9`,
    codeBeforeLabel: "Unit Test Assertion",
    codeAfterLabel: "LLM-based Evaluation",
    codeLanguage: "python",
    productionNotes: [
      'Continuous evaluation in production is required to detect "drift" (model behavior changing over time due to updates or data changes).',
    ],
    keyTakeaway:
      "Adapt: Testing is no longer binary. It is statistical. You are managing \"Quality Assurance\" via AI judges.",
    isUnlocked: false,
  },
  {
    id: "prioritization",
    slug: "prioritization",
    number: 20,
    name: "Prioritization",
    sweParallel: "Priority Queue / Job Scheduling",
    sweParallelFull: "Priority Queue / Job Scheduling / OS Process Scheduling",
    description:
      "The ability of an agent to rank disparate tasks or goals based on urgency, importance, and constraints, effectively managing its own backlog.",
    agenticDefinition:
      "The ability of an agent to rank disparate tasks or goals based on urgency, importance, and constraints, effectively managing its own backlog.",
    mapping: {
      similarity:
        "Deciding what to process next to optimize throughput and SLA adherence.",
      divergence:
        'Priorities are determined by semantic understanding of the task content (e.g., "This email looks angry, prioritize it"), not just a numerical priority flag set by a user.',
    },
    codeBefore: `# Priority Queue
queue.push(task, priority=1)`,
    codeAfter: `# Agent determines priority
priority_score = agent.evaluate_urgency(task_description)
# Logic: "This is a CEO request, priority = Critical"
queue.push(task, priority_score)`,
    codeBeforeLabel: "Priority Queue",
    codeAfterLabel: "Semantic Prioritization",
    codeLanguage: "python",
    productionNotes: [
      "Critical for agents managing their own time/resources in autonomous loops.",
    ],
    keyTakeaway:
      "Adapt: The Scheduler is now intelligent. It understands the content of the work, not just the metadata.",
    isUnlocked: false,
  },
  {
    id: "exploration-discovery",
    slug: "exploration-discovery",
    number: 21,
    name: "Exploration & Discovery",
    sweParallel: "Chaos Engineering / Fuzz Testing",
    sweParallelFull: "Chaos Engineering / Fuzz Testing / Web Crawling",
    description:
      "Agents proactively seeking new information, testing hypotheses, or exploring an environment to expand their knowledge or capabilities, rather than just reacting to prompts.",
    agenticDefinition:
      "Agents proactively seeking new information, testing hypotheses, or exploring an environment to expand their knowledge or capabilities, rather than just reacting to prompts.",
    mapping: {
      similarity:
        "Automated exploration of a system or dataspace to find edge cases or new data.",
      divergence:
        'Exploration is goal-directed and semantic. The agent explores "concepts" or "solutions," not just code paths. It formulates a hypothesis, tests it, and learns.',
    },
    codeBefore: `# Fuzzing
fuzzer.send_random_inputs(target_function)`,
    codeAfter: `# Hypothesis Testing Loop
while not hypothesis.proven():
    experiment = scientist_agent.design_experiment()
    result = lab_tool.run(experiment)
    scientist_agent.learn(result)
    scientist_agent.refine_hypothesis()`,
    codeBeforeLabel: "Fuzzing",
    codeAfterLabel: "Agentic Discovery",
    codeLanguage: "python",
    productionNotes: [
      "Unbounded exploration can be expensive and dangerous. Strict boundaries (sandboxing) are required.",
    ],
    keyTakeaway:
      'Adapt: Systems can now self-evolve their understanding. You are the architect of the "Discovery Loop."',
    isUnlocked: false,
  },
];

export function getPatternBySlug(slug: string): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}

export function getUnlockedPatterns(): Pattern[] {
  return patterns.filter((p) => p.isUnlocked);
}

export const MATURITY_LEVELS = [
  {
    level: 0,
    title: "Reactive",
    subtitle: "Zero-Shot",
    description:
      "The system responds to a single prompt immediately. It has no memory of past interactions and cannot perform external actions. It is purely an information retrieval or generation engine.",
    example: 'A standard ChatGPT query: "Write a poem about rust."',
    icon: "terminal",
  },
  {
    level: 1,
    title: "Tool-Use",
    subtitle: "Function Calling",
    description:
      "The system can decide to invoke a specific external function (API) to retrieve data or perform a calculation before answering. It acts as a router between natural language and deterministic code blocks.",
    example:
      '"What is the weather in Tokyo?" → System calls get_weather(\'Tokyo\') → System formats response.',
    icon: "wrench",
  },
  {
    level: 2,
    title: "Planning & Reasoning",
    subtitle: "Chain of Thought",
    description:
      "The system decomposes a complex, ambiguous goal into a sequence of logical steps before execution. It maintains a short-term plan state and executes steps sequentially, perhaps updating the plan if a step fails.",
    example:
      '"Plan a travel itinerary for Paris." → System breaks it down: 1. Search flights, 2. Search hotels, 3. Check restaurant availability.',
    icon: "brain",
  },
  {
    level: 3,
    title: "Context-Aware",
    subtitle: "Memory & Persistence",
    description:
      'The system maintains long-term state across sessions. It "remembers" user preferences, past decisions, and environmental context (Episodic Memory). It learns from interaction history to optimize future performance.',
    example:
      "A coding assistant that remembers your preferred variable naming convention from a project you worked on last month.",
    icon: "database",
  },
  {
    level: 4,
    title: "Autonomous Multi-Agent",
    subtitle: "Collaboration",
    description:
      "A system of systems. Multiple specialized agents (e.g., a Researcher, a Reviewer, a Coder) collaborate, hand off tasks, debate, and self-correct without human intervention to achieve complex, multi-domain objectives.",
    example:
      '"Build a clone of Flappy Bird." → Architect Agent plans structure → Coder Agent writes code → QA Agent writes tests → Deployment Agent pushes to cloud.',
    icon: "network",
  },
];

export const MAPPING_TABLE_DATA = [
  { agentic: "Prompt Chaining", swe: "Pipe & Filter / Chain of Responsibility" },
  { agentic: "Routing", swe: "Load Balancer / API Gateway / Strategy Pattern" },
  { agentic: "Parallelization", swe: "Scatter-Gather / MapReduce / Async-Await" },
  { agentic: "Reflection", swe: "Unit Testing / Code Review / TDD Loop" },
  { agentic: "Multi-Agent Collaboration", swe: "Microservices / Actor Model / SOA" },
  { agentic: "Memory Management", swe: "Database / Caching / Session State" },
];
