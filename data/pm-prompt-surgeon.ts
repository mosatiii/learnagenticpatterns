/**
 * Prompt Surgeon game — type + content.
 *
 * Mechanic: see a broken prompt + the failures it produced + a pool of
 * candidate "fix moves" (few-shot examples, format spec, role priming,
 * constraint, etc.). Pick 2-3 moves that would best address the failures.
 * Score = overlap with expert moves; feedback explains each pick.
 */

export interface FixMove {
  id: string;
  /** Short label shown on the chip. */
  label: string;
  /** What this move actually does to the prompt. */
  description: string;
  /** True if this move would meaningfully address the observed failures. */
  isOptimal: boolean;
  /** Why this fix is right or wrong for this scenario. */
  rationale: string;
}

export interface PromptScenario {
  id: string;
  /** What the AI is supposed to do. */
  goal: string;
  /** Production context — who uses this, why it matters. */
  context: string;
  /** The current prompt as-written (the "patient"). */
  brokenPrompt: string;
  /** Concrete failure examples — input + bad output + why it's wrong. */
  failures: { input: string; badOutput: string; whyBad: string }[];
  /** Pool of 6-8 candidate fix moves; 2-3 are optimal, rest are distractors. */
  fixMoves: FixMove[];
  /** Wrap-up: the diagnostic lesson this scenario teaches. */
  surgeryLesson: string;
  category: string;
}

// ─── Module 2 (AI Product Discovery) — 5 scenarios ───────────────────────────

export const promptScenariosByModule: Record<string, PromptScenario[]> = {
  "ai-product-discovery": [
    {
      id: "ps-pm-summarizer",
      goal:
        "AI feature that summarizes product-discovery user-interview transcripts into a 200-word executive summary highlighting unmet needs.",
      context:
        "Used by PMs after every user interview. The summary feeds into the company's discovery doc. Currently the summaries are too long, too generic, and miss the unmet-need framing.",
      brokenPrompt:
        "You are a helpful assistant. Summarize the following user interview transcript.",
      failures: [
        {
          input: "[45-min interview transcript with a sales operations user]",
          badOutput:
            "The user discussed various aspects of their work including team coordination, current tooling, and challenges with reporting. They mentioned several frustrations and shared opinions about ideal solutions...",
          whyBad: "Generic, no unmet-need framing, doesn't surface specifics, ~600 words long.",
        },
        {
          input: "[interview transcript with a customer-success manager]",
          badOutput:
            "The conversation covered the manager's daily workflow, including their use of multiple tools and processes. They expressed mixed feelings about current systems...",
          whyBad: "Same shape — vague summary, no specific unmet needs surfaced, way over 200 words.",
        },
      ],
      fixMoves: [
        {
          id: "few-shot",
          label: "Add 2 few-shot examples",
          description:
            "Add a 'good' example transcript + the kind of summary you want, before the user's transcript.",
          isOptimal: true,
          rationale:
            "Few-shot is the highest-leverage fix here. Showing the model 'this kind of input → this kind of output' addresses both the format AND the unmet-need framing simultaneously. PMs underuse few-shot; it consistently outperforms instruction-only prompts for shape-specific outputs.",
        },
        {
          id: "format-spec",
          label: "Add an explicit output format spec",
          description:
            "Specify: '## Unmet Needs (3-5 bullets)\\n## Workflow Pain Points\\n## Suggested Probes for Next Interview' as the required structure.",
          isOptimal: true,
          rationale:
            "Format specs are excellent for forcing the right SHAPE. Combined with few-shot, this gets you 90% of the way to good summaries. Without a format spec, the model defaults to flowing paragraphs — which is exactly what you're seeing.",
        },
        {
          id: "length-constraint",
          label: "Add 'Keep summary under 200 words.'",
          description:
            "Explicit length constraint at the top of the prompt.",
          isOptimal: true,
          rationale:
            "Direct addressing of the length problem. LLMs respect explicit length instructions reliably. Without one, the model defaults to 'thoroughness' which produces 600-word summaries.",
        },
        {
          id: "role-priming",
          label: "Add role priming: 'You are a senior PM coach...'",
          description:
            "Prime the model with a role that frames the task perspective.",
          isOptimal: false,
          rationale:
            "Role priming is overrated for tasks like this. 'Senior PM coach' sounds nice but doesn't change the behavior measurably. The model already knows what summaries look like; it needs the SHAPE (format spec + few-shot), not a personality. Role priming helps when the task requires a perspective the model wouldn't default to (e.g., adversarial review).",
        },
        {
          id: "chain-of-thought",
          label: "Add 'Think step by step before answering'",
          description: "Standard CoT prompt to encourage reasoning.",
          isOptimal: false,
          rationale:
            "CoT is for reasoning tasks (math, multi-step logic, analysis). Summarization isn't a reasoning problem; it's a transformation problem. CoT on summarization typically makes outputs LONGER (which you don't want) without improving quality. Wrong tool.",
        },
        {
          id: "negative-instruction",
          label: "Add 'Do not be generic or vague.'",
          description: "Negative instruction telling the model what to avoid.",
          isOptimal: false,
          rationale:
            "Negative instructions ('don't be X') are weaker than positive instructions or examples. The model has no reference for what 'generic' means in your context. Showing a good summary (few-shot) does more than telling the model what NOT to do.",
        },
        {
          id: "temperature",
          label: "Lower the temperature to 0.2",
          description: "Reduce randomness for more deterministic outputs.",
          isOptimal: false,
          rationale:
            "Temperature affects creativity/variability, not accuracy or shape. The summaries aren't 'too random' — they're 'too generic and too long.' Temperature is the wrong dial. Reach for it when you have inconsistent OUTPUTS for the same input, not when the output is consistently bad.",
        },
        {
          id: "model-upgrade",
          label: "Switch to GPT-4 (from GPT-4o-mini)",
          description: "Use a more capable model.",
          isOptimal: false,
          rationale:
            "Model upgrade is a real lever but the wrong first move. The current failures (vague + long) aren't model-capability issues; they're prompt issues. GPT-4 with the same vague prompt will produce slightly better vague long summaries. Fix the prompt; reach for the bigger model only if the prompt is good and quality is still insufficient.",
        },
      ],
      surgeryLesson:
        "When outputs are vague + wrong shape: reach for few-shot examples + format spec + length constraints. These three address the most common 'wrong-shape output' failure mode. Reach for role priming, CoT, negative instructions, temperature, and model upgrade only when you've ruled out shape problems. Most prompt failures are shape problems disguised as quality problems.",
      category: "Output shape",
    },
    {
      id: "ps-feature-classifier",
      goal:
        "AI that classifies user feedback into one of 6 categories (Feature Request, Bug Report, Pricing Complaint, Praise, Cancellation Risk, Other).",
      context:
        "Used to triage 2,000 feedback items/week into the right Slack channels. Currently classifying ~70% accurately. Bugs and Feature Requests are getting confused; Cancellation Risk is under-detected.",
      brokenPrompt:
        "Classify the following user feedback into one of these categories: Feature Request, Bug Report, Pricing Complaint, Praise, Cancellation Risk, Other.",
      failures: [
        {
          input: "'It's missing the export button I had in v1. Now I have to do it manually.'",
          badOutput: "Bug Report",
          whyBad: "This is a Feature Request (missing functionality), not a Bug (broken functionality).",
        },
        {
          input: "'Considering whether this is worth $99/mo. I love the analytics but the chat feature is half-baked.'",
          badOutput: "Pricing Complaint",
          whyBad:
            "Should be Cancellation Risk — the user is on the edge. Pricing is a symptom; the underlying signal is they're evaluating leaving.",
        },
      ],
      fixMoves: [
        {
          id: "category-definitions",
          label: "Add explicit definitions for each category",
          description:
            "For each of the 6 categories, add a 1-2 sentence definition explaining what counts and what doesn't.",
          isOptimal: true,
          rationale:
            "The model is making the canonical 'no taxonomy' error — it doesn't know that 'missing functionality' is Feature Request not Bug Report, because the labels alone don't disambiguate. Definitions are the highest-leverage fix for classification problems with overlapping categories.",
        },
        {
          id: "edge-case-examples",
          label: "Add few-shot examples that include the confused cases",
          description:
            "Add 5-6 examples showing the right classification for tricky cases (missing-feature → Feature Request, pricing-doubt-with-quality-issue → Cancellation Risk).",
          isOptimal: true,
          rationale:
            "Few-shot examples specifically chosen to hit the failure modes ARE the eval-driven prompt fix. You've identified two confusions (Bug/Feature, Pricing/Cancellation); examples for each will move accuracy on those cases from 30% to 90%+.",
        },
        {
          id: "priority-rule",
          label: "Add a priority rule: 'If signal of Cancellation Risk is present, classify as Cancellation Risk over other categories.'",
          description:
            "Explicit precedence rule for the highest-stakes category.",
          isOptimal: true,
          rationale:
            "Direct fix for the under-detection of Cancellation Risk. It's the highest-stakes category; pricing complaints can wait, cancellation risks need eyes today. An explicit rule prevents the model from defaulting to other labels when both fit.",
        },
        {
          id: "long-explanation",
          label: "Ask the model to explain its reasoning before classifying",
          description: "'Think step by step about what this feedback is signaling, then classify.'",
          isOptimal: false,
          rationale:
            "CoT is good for reasoning tasks but adds 5x the latency for marginal accuracy gains on classification. Better fixes here (definitions, examples) achieve the same accuracy without the latency cost. CoT is sometimes useful as a development tool to debug WHY the model is mis-classifying — but not as a production fix.",
        },
        {
          id: "more-categories",
          label: "Add more categories (e.g., 'Onboarding Issue', 'Feature Praise')",
          description: "Expand the category list to be more granular.",
          isOptimal: false,
          rationale:
            "Wrong direction. The current confusions aren't 'we need more categories' — they're 'the categories aren't well-defined.' More categories means MORE confusions, not fewer. Fix the definitions of the existing categories first; add new ones only if you can't fit reality into the current set.",
        },
        {
          id: "model-upgrade",
          label: "Switch to GPT-4",
          description: "Bigger model for better classification.",
          isOptimal: false,
          rationale:
            "GPT-4 will be slightly better with the SAME vague taxonomy, but the systematic confusions (missing-feature as Bug, pricing-with-issue as Pricing) will persist because they're definition problems, not capability problems. Fix the taxonomy; the smaller model will then perform fine.",
        },
        {
          id: "embedding-classifier",
          label: "Switch from LLM to a fine-tuned small embedding-based classifier",
          description: "Train a small classifier on labeled data instead of using an LLM.",
          isOptimal: false,
          rationale:
            "Real long-term option but not a 'prompt fix' — it's an architecture change. Worth considering when you have 1000+ labeled examples and want lower cost/latency. For now, prompt fixes (definitions + examples) are faster and reach the same accuracy.",
        },
      ],
      surgeryLesson:
        "Classification with overlapping categories is fixed by definitions + edge-case examples + priority rules. NOT by CoT, more categories, or model upgrades. The PM lesson: when classifications are systematically wrong on specific category pairs, the prompt is missing the disambiguation — fix it explicitly with definitions and examples that target the confused cases. This is eval-driven prompt iteration in its purest form.",
      category: "Classification disambiguation",
    },
    {
      id: "ps-discovery-bot",
      goal:
        "AI that interviews users in chat about their workflows and generates discovery notes for PMs.",
      context:
        "Used for async user research at scale. Currently the AI asks 1-2 surface questions then declares the interview done. PMs find the resulting notes shallow and missing the 'why' behind user behavior.",
      brokenPrompt:
        "You are interviewing a user about their workflow. Ask questions and generate a summary of what you learn.",
      failures: [
        {
          input: "[user said: 'I use Notion for project management']",
          badOutput:
            "Q: What do you like about Notion? [user answers] AI: Thanks! Here's a summary: User uses Notion for project management and likes its flexibility.",
          whyBad:
            "Two surface questions. No 'why this tool not others?' No 'what does Notion not do?' No 'what would change if it was 10x better?' Just a polite recap.",
        },
        {
          input: "[user said: 'we struggle to track customer feedback']",
          badOutput:
            "Q: What's hard about it? [user answers tools they tried] AI: Thanks for sharing. You face challenges tracking customer feedback across multiple tools.",
          whyBad:
            "Surface again. No 'walk me through last week's feedback' for specifics. No 'what does success look like?' No probing for emotional/business consequences.",
        },
      ],
      fixMoves: [
        {
          id: "interview-method-instruction",
          label: "Specify the interview method explicitly (e.g., '5 Whys', 'Day in the Life')",
          description:
            "Add: 'Use the 5 Whys technique. After each user answer, ask one follow-up that probes WHY. Continue for at least 5 turns before summarizing.'",
          isOptimal: true,
          rationale:
            "The biggest miss in the current prompt is no interview methodology. Without it, the LLM defaults to 'be polite, ask one question, summarize.' Specifying a method (5 Whys, JTBD framework, story-based) anchors the model to a real interviewing pattern. Highest-impact fix.",
        },
        {
          id: "min-turn-count",
          label: "Require minimum interview length: 'Conduct at least 6 turns before summarizing.'",
          description: "Force the model to dig deeper before wrapping.",
          isOptimal: true,
          rationale:
            "Direct fix for the 'two questions and done' pattern. Without a minimum-turn requirement, the model is incentivized to wrap quickly (LLMs are biased toward concision). Explicit minimums fix this.",
        },
        {
          id: "good-question-examples",
          label: "Add few-shot examples of what 'depth' looks like",
          description:
            "Show 2-3 examples of good follow-up questions: 'walk me through last week's [thing]', 'what changed when you stopped doing X?', 'what does success look like?'",
          isOptimal: true,
          rationale:
            "Examples teach the model what kind of questions to ask. The current failures are surface because the model doesn't know what depth questions look like in this context. Few-shot specifically of GOOD QUESTIONS is the right pattern here.",
        },
        {
          id: "tone-warmth",
          label: "Tell the model to be warm and empathetic",
          description: "Add tone instructions.",
          isOptimal: false,
          rationale:
            "The failure mode isn't that the AI is cold — it's that it's superficial. Warmth without substance produces 'thanks for sharing!' style filler that makes the problem worse, not better. Substance first; tone second.",
        },
        {
          id: "longer-summary",
          label: "Specify the summary should be longer (500+ words)",
          description: "Require longer output.",
          isOptimal: false,
          rationale:
            "Doesn't fix the underlying issue — the AI doesn't have material for a longer summary because the interview was shallow. A 500-word summary of a 2-question interview is just 500 words of padding. Fix the input (interview depth), not the output requirement.",
        },
        {
          id: "structured-output",
          label: "Force JSON output structure for the summary",
          description: "Constrain summary to a specific JSON schema.",
          isOptimal: false,
          rationale:
            "Structured output is useful for downstream parsing but doesn't fix the depth issue. A JSON output of a shallow interview is a structured shallow interview. Fix the interviewing first; format the output as needed second.",
        },
        {
          id: "enable-tools",
          label: "Give the AI access to a 'check competitor knowledge' tool",
          description: "Let the AI look up competitor info to ask better questions.",
          isOptimal: false,
          rationale:
            "Adds complexity for marginal value. The user is the source of truth in user research; competitor lookups don't make the questions better. Worse, it can introduce 'have you tried [competitor]?' bias. Skip the tools; fix the interview method.",
        },
      ],
      surgeryLesson:
        "When an AI is shallow at a multi-turn task: specify the methodology, require minimum turns, and show examples of depth questions. Don't reach for tone, output formatting, or tools — those don't address the underlying behavior gap. The PM lesson: AI 'interviewing' or 'consulting' tasks need explicit methodology in the prompt or they'll default to surface conversation. Be explicit about the technique.",
      category: "Multi-turn behavior",
    },
    {
      id: "ps-spec-writer",
      goal:
        "AI that writes a one-pager PRD given a discovery insight (e.g., 'users are confused by our pricing page').",
      context:
        "Used by PMs to draft initial PRDs before refining. Current outputs are generic ('add clearer pricing copy', 'consider A/B testing') without the rigor of a real PRD (specific metrics, user segments, acceptance criteria).",
      brokenPrompt:
        "Given the discovery insight below, write a one-page PRD with the problem, proposed solution, and success metrics.",
      failures: [
        {
          input: "Discovery insight: 'Users on the pricing page can't tell which plan they need; bounce rate from pricing page is 67%.'",
          badOutput:
            "Problem: Users are confused by the pricing page. Proposed solution: Make the pricing page clearer with better copy and visual design. Success metrics: Reduced bounce rate, higher conversions.",
          whyBad:
            "Generic. No specific user segment named, no specific intervention, no measurable target ('reduced' is not a metric), no acceptance criteria.",
        },
      ],
      fixMoves: [
        {
          id: "prd-template",
          label: "Embed a specific PRD template in the prompt",
          description:
            "Provide the exact structure: '## Problem (with named user segment + behavior + business impact)\\n## Hypothesis (specific intervention)\\n## Success Metric (single primary KPI with target)\\n## Acceptance Criteria (what must be true to ship)'",
          isOptimal: true,
          rationale:
            "PRD templates force the model to fill in specific fields rather than generate flowy prose. The current output is generic precisely because the prompt doesn't specify what 'good' looks like at the field level. Template + field labels = the highest-impact fix.",
        },
        {
          id: "good-prd-example",
          label: "Add a single complete example of a good PRD",
          description:
            "Few-shot with one fully-fleshed PRD as the example.",
          isOptimal: true,
          rationale:
            "Examples teach the model what 'rigor' looks like in this domain. A single complete example often outperforms three pages of instructions because the model can pattern-match. Combined with the template, this nails the PRD shape.",
        },
        {
          id: "metric-format",
          label: "Require metrics in the form: 'Move [metric] from [baseline] to [target] by [date]'",
          description: "Force a specific shape for the success metrics section.",
          isOptimal: true,
          rationale:
            "Direct fix for the 'reduced bounce rate' problem. Without an explicit metric format, the model produces vague directional language. Forcing the 'X → Y by Z' shape forces specific numbers, which forces the model to ground them in the input data.",
        },
        {
          id: "longer-output",
          label: "Require longer output (1500+ words)",
          description: "Force the PRD to be longer for more detail.",
          isOptimal: false,
          rationale:
            "Length doesn't fix vagueness. A 1500-word vague PRD is worse than a 500-word specific one because it buries the key points in padding. The fix is structural (template + examples), not size.",
        },
        {
          id: "creative-instructions",
          label: "Tell the model to 'be creative and bold'",
          description: "Encourage interesting solution proposals.",
          isOptimal: false,
          rationale:
            "PRDs aren't graded on creativity — they're graded on rigor. 'Be creative' produces wilder generic suggestions, not better-grounded ones. The failure isn't lack of imagination; it's lack of specificity.",
        },
        {
          id: "role-priming",
          label: "Prime as 'Senior Director of Product'",
          description: "Add seniority to the role.",
          isOptimal: false,
          rationale:
            "Role seniority doesn't translate to output rigor. 'Senior Director' produces the same generic PRD with slightly more confident phrasing. The fix is structural (template + examples + metric format), not role.",
        },
        {
          id: "research-tool",
          label: "Give the AI access to user-research data tools",
          description: "Let the AI look up additional context.",
          isOptimal: false,
          rationale:
            "Tools add complexity. The current failure isn't lack of data — the discovery insight already contains the data. Tools wouldn't make the PRD more specific; they'd just add latency. Fix the prompt structure first.",
        },
      ],
      surgeryLesson:
        "Generic outputs from AI on structured tasks (PRDs, RFCs, plans) almost always trace back to lack of template + examples + format constraints. Reach for those three first. Don't try to fix vagueness with 'be more specific' — show the model what specific looks like with a template and an example. Length, creativity, role priming, and tools are downstream concerns; structure is the load-bearing fix.",
      category: "Structured generation",
    },
    {
      id: "ps-pm-coach",
      goal:
        "AI mentor for new PMs that answers their questions about product management practices, frameworks, and decision-making.",
      context:
        "Used by junior PMs as a sounding board. Currently the AI gives textbook-correct but practically-vague answers. Power users describe it as 'knows the words but not the work.'",
      brokenPrompt:
        "You are a product management mentor. Answer the user's question about product management.",
      failures: [
        {
          input: "'My team is debating whether to A/B test a feature or just ship it. How should I decide?'",
          badOutput:
            "There are several factors to consider. A/B testing is valuable when you want to validate impact, but it requires sufficient traffic and time. You should consider your team's resources, the feature's importance, and your hypothesis confidence. Many companies use A/B testing strategically for high-impact decisions.",
          whyBad:
            "Recites textbook tradeoffs without giving a decision rule. Doesn't ask any clarifying questions. Doesn't reference specific thresholds (traffic needed, decision-cost framing).",
        },
      ],
      fixMoves: [
        {
          id: "decision-frameworks",
          label: "Add specific PM decision frameworks the AI can apply",
          description:
            "Embed frameworks: 'For A/B test vs ship, use the framework: (1) reversibility cost, (2) sample size needed for 80% power on expected effect, (3) decision speed value. Apply concrete numbers when possible.'",
          isOptimal: true,
          rationale:
            "The biggest gap is the AI has the WORDS for PM frameworks but not the procedure for applying them. Embedding actual decision frameworks in the prompt makes the AI's answers operational. This is the difference between a textbook and a coach.",
        },
        {
          id: "ask-clarifying-first",
          label: "Require the AI to ask a clarifying question before answering",
          description:
            "'Before answering ANY question, ask 1-2 clarifying questions to understand the user's specific context (team size, traffic, stakes, prior decisions).'",
          isOptimal: true,
          rationale:
            "PM decisions are context-dependent. A real coach asks 'how much traffic do you have? what's your hypothesis confidence?' before answering. Forcing the AI to clarify first prevents the textbook-recital pattern. This single change converts 'mentor' from feeling academic to feeling consultative.",
        },
        {
          id: "specific-thresholds",
          label: "Instruct the AI to give specific numerical thresholds when applicable",
          description:
            "'When discussing thresholds (sample size, traffic, time), give specific numbers (e.g., \"need at least 5K daily users for 2-week A/B test\") not vague directional language.'",
          isOptimal: true,
          rationale:
            "Vagueness is the failure mode; specificity is the fix. Forcing concrete numbers (even if approximate) makes the advice actionable. Junior PMs need rules of thumb, not 'consider the tradeoffs.'",
        },
        {
          id: "longer-answers",
          label: "Require longer answers (500+ words)",
          description: "Force more detailed responses.",
          isOptimal: false,
          rationale:
            "Length is symptom, not cause. The current 200-word answer is vague; a 500-word vague answer is worse. The fix is depth (frameworks, clarifying questions, specifics), not size. Length without depth produces patronizing essays.",
        },
        {
          id: "more-frameworks-list",
          label: "Add a long list of every PM framework the AI should reference",
          description: "List 20+ frameworks in the prompt.",
          isOptimal: false,
          rationale:
            "Listing frameworks isn't the same as embedding them as decision procedures. A list lets the model name-drop frameworks ('you could use RICE, ICE, MoSCoW...') without applying them. The fix is depth on a few key frameworks with HOW to use them, not breadth of name-dropping.",
        },
        {
          id: "casual-tone",
          label: "Make the AI more casual / friendly",
          description: "Adjust tone to feel less corporate.",
          isOptimal: false,
          rationale:
            "Tone is unrelated to the substance gap. The AI sounds reasonable and friendly already; it just gives vague advice in a friendly voice. Casualness doesn't make 'consider the tradeoffs' more useful. Substance first; tone second.",
        },
        {
          id: "model-upgrade",
          label: "Switch to GPT-4",
          description: "Bigger model for smarter answers.",
          isOptimal: false,
          rationale:
            "GPT-4 with the same generic prompt will produce slightly more confident-sounding generic advice. The bottleneck isn't capability — the model knows about A/B testing. The bottleneck is the prompt giving it permission to recite vs. requiring it to ASK and APPLY. Model upgrade doesn't fix the prompt's structural issue.",
        },
      ],
      surgeryLesson:
        "When AI mentor/coach products feel academic: the fix is forcing the AI to ASK first and APPLY frameworks with specifics, not to recite them. Vagueness in mentoring is rarely a model-capability problem; it's a prompt-permission problem. Give the AI explicit decision frameworks with HOW to use them, require clarifying questions, and force specific thresholds. The combination converts 'textbook' into 'coach.'",
      category: "Mentoring / Q&A",
    },
  ],
};

export function getPromptSurgeonGameFor(moduleSlug: string): PromptScenario[] | null {
  const scenarios = promptScenariosByModule[moduleSlug];
  return scenarios && scenarios.length > 0 ? scenarios : null;
}
