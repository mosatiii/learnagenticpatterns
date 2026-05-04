/**
 * Eval Designer game — type + content.
 *
 * Mechanic: player picks 3-5 criteria from a pool and assigns weights
 * summing to 100%. The submitted rubric is scored against an "expert
 * rubric" (the golden answer). Score = 100 - sum(|playerWeight - expertWeight|)
 * across criteria, capped at 0. Picking criteria the expert ignored is
 * penalized; missing criteria the expert valued is also penalized.
 */

export interface EvalCriterion {
  id: string;
  /** Short name shown on the chip. */
  name: string;
  /** One-sentence description of what this criterion measures. */
  description: string;
  /**
   * Expert weight 0-100. Sum across an EvalScenario's criteria must be 100.
   * Criteria with expertWeight 0 are "distractors" — plausible-sounding
   * criteria that don't actually predict quality for this use case.
   */
  expertWeight: number;
  /**
   * Why the expert weighted this criterion as they did. Shown after submit
   * for whichever criteria the player picked OR the expert weighted >0.
   */
  rationale: string;
}

export interface EvalScenario {
  id: string;
  /** What the AI feature does. */
  useCase: string;
  /** Production context — volume, stakes, current state. */
  context: string;
  /** Pool of 8-10 candidate criteria, including 2-3 distractors. */
  criteria: EvalCriterion[];
  /** Wrap-up explaining the rubric design lesson for this scenario. */
  designLesson: string;
  category: string;
}

// ─── Module 7 (Quality & Self-Correction) — 5 scenarios ──────────────────────

export const evalScenariosByModule: Record<string, EvalScenario[]> = {
  "quality-self-correction": [
    {
      id: "ed-support-chatbot",
      useCase: "Customer-support chatbot for a B2C SaaS product",
      context:
        "Volume: 50K conversations/day. Tier-1 support — handles password resets, billing questions, and product how-to. Hands off to human agents on complex issues. Wrong answers create support tickets and erode trust.",
      criteria: [
        {
          id: "factual-correctness",
          name: "Factual correctness",
          description: "Does the answer match documented product behavior?",
          expertWeight: 35,
          rationale:
            "By far the highest weight. A wrong factual answer in support is the worst failure mode — users act on it, the action fails, they lose trust. No amount of nice tone compensates for being wrong.",
        },
        {
          id: "escalation-judgment",
          name: "Escalation judgment",
          description: "Does the bot escalate to humans when it should (and not when it shouldn't)?",
          expertWeight: 25,
          rationale:
            "Critical second criterion. Bots that under-escalate frustrate users on complex issues; bots that over-escalate burn human-agent capacity. Calibrating this is half the value of the system.",
        },
        {
          id: "tone-empathy",
          name: "Tone & empathy",
          description: "Does the response feel warm, not robotic? Acknowledges frustration?",
          expertWeight: 15,
          rationale:
            "Real but secondary. Users tolerate robotic tone if the bot solves their problem; they don't tolerate warm wrong answers. Weight reflects 'matters but isn't load-bearing.'",
        },
        {
          id: "brevity",
          name: "Brevity",
          description: "Is the response appropriately short — no padding?",
          expertWeight: 15,
          rationale:
            "Surprisingly important for support. Long answers bury the resolution. Users skim. The right answer in 2 sentences beats the same answer in 6 paragraphs.",
        },
        {
          id: "citations",
          name: "Cites help-doc sources",
          description: "Does the response link to the relevant help article?",
          expertWeight: 10,
          rationale:
            "Useful for trust + lets the user verify. Lower weight because it's a 'nice-to-have' that good answers can skip; bad answers don't get rescued by adding a citation.",
        },
        {
          id: "personalization",
          name: "Personalization (uses customer name, history)",
          description: "Does the bot reference the customer's account, plan, or history?",
          expertWeight: 0,
          rationale:
            "Distractor. Sounds nice but rarely correlates with whether the issue gets resolved. PMs over-weight personalization in support; users care that it WORKS, not that it greets them by name.",
        },
        {
          id: "creativity",
          name: "Response creativity",
          description: "Does the response avoid sounding template-like?",
          expertWeight: 0,
          rationale:
            "Distractor. Support answers SHOULD sound like answers, not creative writing. Templates are fine when they're correct. Optimizing for creativity often pushes toward longer, fancier, less-correct answers.",
        },
        {
          id: "latency",
          name: "Response latency",
          description: "Does the response arrive within 3 seconds?",
          expertWeight: 0,
          rationale:
            "Distractor for QUALITY rubric — latency belongs in a separate operational SLA, not a quality eval. Conflating them lets a fast-but-wrong system score high. Quality rubric judges the OUTPUT.",
        },
      ],
      designLesson:
        "Quality rubrics for support bots overweight tone and personalization, underweight escalation judgment. The PM lesson: distinguish 'matters for trust' (tone) from 'matters for resolution' (correctness, escalation). Resolution-related criteria deserve 60%+ of the weight. Operational metrics like latency belong in separate SLAs, not quality rubrics.",
      category: "Customer-facing AI",
    },
    {
      id: "ed-code-review",
      useCase: "AI code-review assistant on every pull request",
      context:
        "Comments on PRs in a 200-engineer org. Goal: catch real bugs and security issues before human review. False positives waste reviewer time; false negatives let bugs ship. Replaces ~30% of human review effort.",
      criteria: [
        {
          id: "real-bug-detection",
          name: "Detects real bugs",
          description: "Does the AI flag actual bugs (logic errors, race conditions, broken assumptions)?",
          expertWeight: 30,
          rationale:
            "The reason the system exists. Without bug detection, the AI is a sophisticated style checker. This is the load-bearing criterion.",
        },
        {
          id: "security-issues",
          name: "Identifies security vulnerabilities",
          description: "Does it catch common security issues (injection, auth bypass, secrets in code)?",
          expertWeight: 25,
          rationale:
            "Highest-leverage AI catch in code review. Security issues are pattern-matchable, AI is good at them, and missed ones are catastrophic. Worth a heavy weight.",
        },
        {
          id: "false-positive-rate",
          name: "Low false-positive rate",
          description: "Does it avoid flagging non-issues (style preferences, false-alarm bugs)?",
          expertWeight: 25,
          rationale:
            "Nearly as important as detection. A reviewer who hits 5 false positives a day stops reading AI comments. False positives don't just waste time — they kill the system's authority.",
        },
        {
          id: "actionable-feedback",
          name: "Actionable suggestions",
          description: "Does the comment tell the dev WHAT to fix, not just THAT something's wrong?",
          expertWeight: 15,
          rationale:
            "Real but secondary. Reviewers can usually figure out the fix from a clear flag. Actionable suggestions are nice but not what justifies the system's existence.",
        },
        {
          id: "context-awareness",
          name: "Context-awareness",
          description: "Does it understand the change in context of the rest of the codebase?",
          expertWeight: 5,
          rationale:
            "Often discussed in PM circles, rarely matters for quality. Catching local bugs and security issues moves the needle far more than understanding cross-file architecture. Worth tracking but not a primary criterion.",
        },
        {
          id: "comment-tone",
          name: "Constructive comment tone",
          description: "Are comments professional and not condescending?",
          expertWeight: 0,
          rationale:
            "Distractor. AI comments don't have ego problems. Tone matters for human reviewers; for AI it's a non-issue and weighting it pulls effort from criteria that matter (bug detection).",
        },
        {
          id: "comment-count",
          name: "Comment volume",
          description: "Does the AI leave the right NUMBER of comments per PR (not too many)?",
          expertWeight: 0,
          rationale:
            "Distractor. Comment volume is downstream of false-positive rate. Optimizing for fewer comments directly produces lower recall. Measure FP rate; volume manages itself.",
        },
        {
          id: "doc-coverage",
          name: "Docstring/comment coverage suggestions",
          description: "Does it flag missing documentation?",
          expertWeight: 0,
          rationale:
            "Distractor for an AI code-reviewer. Docs are real but a separate concern (and arguably better handled by a dedicated tool). Mixing into quality rubric dilutes the bug-catching signal.",
        },
      ],
      designLesson:
        "For internal-facing AI tools, false-positive rate matters as much as detection rate. A noisy tool gets ignored; an under-detecting tool is useless. The 30/25/25 weighting on bug detection / security / FP rate is intentional symmetry — you cannot optimize one without measuring the others. Tone and volume are downstream metrics, not quality signals.",
      category: "Internal-facing AI",
    },
    {
      id: "ed-medical-info",
      useCase: "AI assistant answering general health questions on a healthcare app",
      context:
        "Volume: 100K queries/month. Audience: patients, NOT clinicians. Strict regulatory environment (HIPAA, FDA scrutiny on medical claims). Wrong info can cause harm. Liability is the dominant constraint.",
      criteria: [
        {
          id: "factual-correctness",
          name: "Medical factual correctness",
          description: "Are factual claims correct per current medical consensus?",
          expertWeight: 30,
          rationale:
            "Non-negotiable. Wrong medical info can harm patients and create regulatory liability. Every other criterion is downstream of this one being met.",
        },
        {
          id: "scope-refusal",
          name: "Refuses out-of-scope queries",
          description: "Does it decline to diagnose, prescribe, or give individualized medical advice?",
          expertWeight: 30,
          rationale:
            "Equally critical. The system is for general info; the moment it diagnoses, you're practicing medicine without a license. Refusal discipline matters as much as correctness.",
        },
        {
          id: "cited-sources",
          name: "Cites authoritative sources",
          description: "Does it cite NIH, CDC, peer-reviewed sources for claims?",
          expertWeight: 20,
          rationale:
            "Critical for legal defensibility AND user trust. Uncited medical claims look like opinion. Citations let users verify and shift some liability to the source.",
        },
        {
          id: "escalation-clinician",
          name: "Recommends seeing a clinician when appropriate",
          description: "When the symptoms warrant medical attention, does it say so?",
          expertWeight: 15,
          rationale:
            "Patient-safety critical. Failure to recommend escalation when warranted (chest pain, suicidal ideation, etc.) is the worst possible outcome. Worth significant weight.",
        },
        {
          id: "tone-clarity",
          name: "Clear, non-jargon tone",
          description: "Does it explain in patient-friendly language without being condescending?",
          expertWeight: 5,
          rationale:
            "Real but small. Patients need understandable answers, but quality is dominated by correctness, scope discipline, and citations — tone is a polish criterion.",
        },
        {
          id: "warmth",
          name: "Warmth / empathy",
          description: "Does it acknowledge that the person may be worried?",
          expertWeight: 0,
          rationale:
            "Distractor. PMs over-weight warmth in healthcare AI; the regulatory and safety bars are so high that even a perfectly warm answer with one wrong fact is a worse outcome than a clinical answer that's correct.",
        },
        {
          id: "personalization",
          name: "Uses the user's profile (age, conditions)",
          description: "Does it tailor based on what's known about the user?",
          expertWeight: 0,
          rationale:
            "Distractor — and a dangerous one. Personalization on health data starts crossing into individualized medical advice, which is exactly what scope-refusal is supposed to prevent. PMs propose this; legal kills it.",
        },
        {
          id: "speed",
          name: "Fast response (under 2s)",
          description: "Does it answer quickly?",
          expertWeight: 0,
          rationale:
            "Distractor for a quality rubric. Healthcare users will wait for a correct answer. Optimizing for speed pressures the system toward shorter, less-cited, less-careful answers — counterproductive.",
        },
      ],
      designLesson:
        "High-stakes domains (health, legal, financial) need rubrics dominated by correctness + scope discipline + citations. Patient-friendly tone and warmth are polish, not quality. Personalization is often a regulatory risk, not a quality win. The PM lesson: in regulated AI, the rubric IS your liability story — make sure 80%+ of the weight goes to defensibility criteria.",
      category: "Regulated / high-stakes AI",
    },
    {
      id: "ed-sales-email",
      useCase: "AI that drafts personalized sales outreach emails",
      context:
        "B2B sales tool. Salesperson reviews and edits before sending. Volume: 5K drafts/day across reps. Drafts that need heavy editing waste rep time; drafts that get sent unedited and hallucinate company facts cause public credibility damage.",
      criteria: [
        {
          id: "factual-accuracy-prospect",
          name: "Factual accuracy about the prospect",
          description: "Does the email reference correct facts about the prospect (company, role, recent news)?",
          expertWeight: 35,
          rationale:
            "The dominant failure mode. Hallucinated 'I see your company just raised a Series B' (when they didn't) is publicly embarrassing and immediately torches the relationship. Single highest-leverage criterion.",
        },
        {
          id: "personalization-quality",
          name: "Personalization quality (not generic)",
          description: "Does it actually feel personalized vs. mail-merge?",
          expertWeight: 25,
          rationale:
            "If the email reads as obviously templated, the prospect dismisses it. Personalization is the entire reason to use AI for sales drafts vs. just sending the template. High weight.",
        },
        {
          id: "tone-appropriateness",
          name: "Appropriate tone for industry",
          description: "Does it match the formality expected in the prospect's industry (formal for finance, casual for startups)?",
          expertWeight: 15,
          rationale:
            "Real but secondary. Mismatched tone hurts conversion at the margin; getting facts wrong hurts conversion catastrophically. Worth measuring but not the load-bearing criterion.",
        },
        {
          id: "clear-cta",
          name: "Clear call-to-action",
          description: "Does the email end with a specific, low-friction ask (e.g., '15-min call next week')?",
          expertWeight: 15,
          rationale:
            "Important for conversion. Vague CTAs ('let me know if interested') convert worse than specific ones. AI tends to default to vague — worth eval pressure.",
        },
        {
          id: "subject-line-quality",
          name: "Subject line that's openable",
          description: "Is the subject line specific, not spam-flagged, and inviting to click?",
          expertWeight: 10,
          rationale:
            "Real but quantifiable through open rates separately. Worth tracking in the rubric so you don't ship a draft system with terrible subject lines, but lower weight because users edit subjects often.",
        },
        {
          id: "length",
          name: "Email length (under 150 words)",
          description: "Is the email short enough to read on phone?",
          expertWeight: 0,
          rationale:
            "Distractor disguised as best-practice. Length is downstream of personalization quality. A long, well-personalized email beats a short generic one. Optimizing length directly produces shorter generic emails.",
        },
        {
          id: "writing-style",
          name: "Polished writing style",
          description: "No typos, good grammar, professional polish?",
          expertWeight: 0,
          rationale:
            "Distractor — modern LLMs hit this floor with no effort. Putting weight here doesn't differentiate good drafts from bad ones; it just rewards uniform competence. Use weight on criteria that ACTUALLY vary.",
        },
        {
          id: "uses-prospects-name",
          name: "Uses prospect's name",
          description: "Does it greet the prospect by name?",
          expertWeight: 0,
          rationale:
            "Distractor. Mail-merge has been doing this for 20 years. Doesn't differentiate AI-quality drafts. The interesting question is whether personalization is SUBSTANTIVE (their company's news) not whether the salutation is right.",
        },
      ],
      designLesson:
        "For AI drafting features (email, content, summaries), the dominant quality criterion is whether the output's CLAIMS are correct — not whether it's polished. Modern LLMs nail polish for free; they hallucinate facts unless you measure for it. Weight 60%+ on factual accuracy + substantive personalization. Polish, length, and basic formatting are noise that the model handles by default.",
      category: "AI drafting tools",
    },
    {
      id: "ed-eval-judge",
      useCase: "LLM-as-judge that scores outputs in your eval pipeline (judging the judges)",
      context:
        "You're now evaluating the EVAL system itself. The LLM-judge scores ~10K AI outputs per release against rubrics. If the judge is wrong, every downstream release decision is wrong. Quality of the judge is the most leveraged thing in your stack.",
      criteria: [
        {
          id: "human-agreement",
          name: "Agreement with human reviewers",
          description: "Does the judge's score correlate with what experienced humans would score?",
          expertWeight: 40,
          rationale:
            "By far the most important. The judge's job is to be a reliable proxy for human judgment at scale. If it doesn't agree with humans on the calibration set, nothing else matters. This is the single load-bearing criterion.",
        },
        {
          id: "consistency",
          name: "Consistency on identical inputs",
          description: "Does it return the same score when given the same input twice?",
          expertWeight: 25,
          rationale:
            "Critical. A judge that gives different scores to identical inputs introduces noise into every release decision. Inconsistency means you can't tell if a small score change is a real regression or judge variance. Worth heavy weight.",
        },
        {
          id: "rubric-following",
          name: "Follows the rubric (no off-criteria scoring)",
          description: "Does it score on the requested criteria, or does it sneak in its own?",
          expertWeight: 20,
          rationale:
            "Important. Judges that 'help' by adding their own quality criteria break the eval contract. The whole point is that you specified the rubric. If the judge improvises, you're not measuring what you think.",
        },
        {
          id: "explanation-quality",
          name: "Provides clear score explanations",
          description: "Does it explain WHY it gave each score?",
          expertWeight: 10,
          rationale:
            "Real but secondary. Explanations help when reviewing failures; the score itself is what gates releases. Worth measuring so failed cases are debuggable, not the load-bearing criterion.",
        },
        {
          id: "calibration-edges",
          name: "Calibration on edge cases",
          description: "Does it handle ambiguous/borderline cases sensibly?",
          expertWeight: 5,
          rationale:
            "Real but small. Edge cases are by definition rare. The first three criteria (human agreement, consistency, rubric following) handle 95% of the value. Edge-case calibration is polish.",
        },
        {
          id: "speed",
          name: "Fast judgment (under 2s)",
          description: "Does it return scores quickly?",
          expertWeight: 0,
          rationale:
            "Distractor. Eval pipelines are batch operations; latency per call doesn't matter as long as the batch finishes overnight. Optimizing for speed pressures the judge to use a smaller model — exactly the wrong tradeoff.",
        },
        {
          id: "cost-per-judgment",
          name: "Low cost per judgment",
          description: "Is it cheap to run at scale?",
          expertWeight: 0,
          rationale:
            "Distractor for a QUALITY rubric. Cost is real but belongs in the budget conversation, not the quality conversation. Conflating cost into quality lets a cheap-but-wrong judge score high.",
        },
        {
          id: "model-tier",
          name: "Uses a strong model (GPT-4 / Opus)",
          description: "Is the judge running on a frontier-tier model?",
          expertWeight: 0,
          rationale:
            "Distractor. Model tier is an INPUT to quality, not a measure OF it. Measuring model tier instead of outcomes is exactly the failure mode of resume-based judgment. Measure the agreement with humans; let model tier emerge from that.",
        },
      ],
      designLesson:
        "Eval-on-eval is meta but matters: when the judge is wrong, every downstream release decision is wrong. The rubric for an eval judge weights heavily on agreement with humans + consistency + rubric-following — these three cover 85% of what makes a judge trustworthy. Cost, latency, and model tier are inputs to the system, not measures of its quality. Don't conflate inputs with outputs in your rubric.",
      category: "Meta-evaluation",
    },
  ],
};

export function getEvalDesignerGameFor(moduleSlug: string): EvalScenario[] | null {
  const scenarios = evalScenariosByModule[moduleSlug];
  return scenarios && scenarios.length > 0 ? scenarios : null;
}

