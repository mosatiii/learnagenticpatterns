"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Palette,
  PenTool,
  LayoutDashboard,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Linkedin,
  Mail,
  Loader2,
  Shield,
  AlertTriangle,
  Rocket,
  Quote,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  roleAssessments,
  type Role,
  type AssessmentQuestion,
  type AssessmentResult,
} from "@/data/assessment";

const ROLE_ICONS: Record<string, typeof Code2> = {
  "product-manager": LayoutDashboard,
  developer: Code2,
  designer: Palette,
  writer: PenTool,
};

const PM_ROLE = roleAssessments[0]; // Product Manager is first
const OTHER_ROLES = roleAssessments.slice(1); // Developer, Designer, Writer

// ---------------------------------------------------------------------------
// Landing — PM Hero + Role Picker
// ---------------------------------------------------------------------------
function RolePicker({ onSelect }: { onSelect: (role: Role) => void }) {
  const PmIcon = ROLE_ICONS[PM_ROLE.role];

  return (
    <section className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1 mb-6">
            Free · 3 minutes · Powered by AI
          </span>

          <h1 className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
            Will AI{" "}
            <span className="text-gradient">Replace Me?</span>
          </h1>

          <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Get an honest, AI-powered analysis of your career. Find out what makes
            you irreplaceable — and where you&apos;re vulnerable.
          </p>
        </motion.div>

        {/* PM Hero Card */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={() => onSelect(PM_ROLE.role)}
          className="group w-full bg-surface border border-primary/30 rounded-2xl p-8 md:p-10 text-left hover:border-primary/60 transition-all hover:shadow-xl hover:shadow-primary/10 cursor-pointer mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PmIcon size={32} className="text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-mono text-xl md:text-2xl text-text-primary font-bold">
                  {PM_ROLE.title}
                </h2>
                <span className="hidden sm:inline-block font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                  Most popular
                </span>
              </div>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-3">
                Are you a Product Manager wondering if AI is coming for your job?
              </p>
              <p className="text-text-secondary/70 text-sm leading-relaxed">
                Find out which parts of your workflow are already being automated, which
                agentic AI patterns you need to understand to stay relevant, and get a
                concrete pivot plan.
              </p>
            </div>
            <div className="flex-shrink-0 hidden md:block">
              <span className="flex items-center gap-2 font-sans font-semibold text-sm text-primary group-hover:translate-x-1 transition-transform">
                Start <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </motion.button>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4 my-8"
        >
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-text-secondary/60">or pick your role</span>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        {/* Other role cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {OTHER_ROLES.map((ra, i) => {
            const Icon = ROLE_ICONS[ra.role];
            return (
              <motion.button
                key={ra.role}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                onClick={() => onSelect(ra.role)}
                className="group bg-surface border border-border rounded-xl p-6 text-left hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
              >
                <Icon
                  size={28}
                  className="text-primary mb-3 group-hover:scale-110 transition-transform"
                />
                <h3 className="font-mono text-base text-text-primary font-bold mb-1">
                  {ra.title}
                </h3>
                <p className="text-text-secondary text-sm">{ra.subtitle}</p>
              </motion.button>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-text-secondary/50 text-xs font-mono mt-10 text-center"
        >
          No sign-up required · Your answers are not stored · Powered by Gemini
        </motion.p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Quiz — Multi-step Form
// ---------------------------------------------------------------------------
function Quiz({
  role,
  questions,
  onComplete,
  onBack,
}: {
  role: Role;
  questions: AssessmentQuestion[];
  onComplete: (answers: Record<string, string | string[]>) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const q = questions[step];
  const total = questions.length;
  const progress = ((step + 1) / total) * 100;

  const currentAnswer = answers[q.id];
  const hasAnswer =
    q.type === "freetext"
      ? typeof currentAnswer === "string" && currentAnswer.trim().length > 0
      : q.type === "multi"
        ? Array.isArray(currentAnswer) && currentAnswer.length > 0
        : !!currentAnswer;

  function handleSingle(optionId: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));
  }

  function handleMulti(optionId: string) {
    setAnswers((prev) => {
      const current = (prev[q.id] as string[]) || [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [q.id]: next };
    });
  }

  function handleFreetext(value: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  }

  function handleNext() {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  }

  function handlePrev() {
    if (step > 0) setStep(step - 1);
    else onBack();
  }

  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-text-secondary">
              Question {step + 1} of {total}
            </span>
            <span className="font-mono text-xs text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-mono text-xl md:text-2xl text-text-primary font-bold mb-8 leading-relaxed">
              {q.question}
            </h2>

            {/* Single select */}
            {q.type === "single" && q.options && (
              <div className="space-y-3">
                {q.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSingle(opt.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      currentAnswer === opt.id
                        ? "border-primary bg-primary/10 text-text-primary"
                        : "border-border bg-surface text-text-secondary hover:border-primary/30 hover:text-text-primary"
                    }`}
                  >
                    <span className="text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Multi select */}
            {q.type === "multi" && q.options && (
              <div className="space-y-3">
                {q.options.map((opt) => {
                  const selected =
                    Array.isArray(currentAnswer) &&
                    currentAnswer.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleMulti(opt.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all flex items-center gap-3 ${
                        selected
                          ? "border-primary bg-primary/10 text-text-primary"
                          : "border-border bg-surface text-text-secondary hover:border-primary/30 hover:text-text-primary"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          selected
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {selected && <Check size={12} className="text-background" />}
                      </span>
                      <span className="text-sm">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Free text */}
            {q.type === "freetext" && (
              <textarea
                value={(currentAnswer as string) || ""}
                onChange={(e) => handleFreetext(e.target.value)}
                placeholder="Be specific — this gives the AI more to work with..."
                rows={4}
                className="w-full bg-surface border border-border rounded-lg p-4 text-text-primary text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-primary resize-none"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 font-mono text-sm text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className={`flex items-center gap-2 font-sans font-semibold text-sm px-6 py-3 rounded-md transition-all ${
              hasAnswer
                ? "bg-accent hover:bg-accent/90 text-white hover:shadow-lg hover:shadow-accent/20"
                : "bg-surface text-text-secondary/50 cursor-not-allowed border border-border"
            }`}
          >
            {step === total - 1 ? "Get My Results" : "Next"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Loading State
// ---------------------------------------------------------------------------
function AnalyzingLoader() {
  const messages = [
    "Reading your answers...",
    "Mapping to AI patterns...",
    "Calculating your score...",
    "Building your action plan...",
    "Crafting your elevator pitch...",
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center pt-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <Loader2 size={48} className="text-primary animate-spin mx-auto mb-6" />
        <h2 className="font-mono text-2xl text-text-primary font-bold mb-3">
          Analyzing Your Profile
        </h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-text-secondary text-sm font-mono"
          >
            {messages[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Results Display
// ---------------------------------------------------------------------------
function Results({
  result,
  role,
  onRetake,
}: {
  result: AssessmentResult;
  role: Role;
  onRetake: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  const scoreColor =
    result.score >= 70
      ? "text-success"
      : result.score >= 40
        ? "text-accent"
        : "text-red-400";

  async function handleCopyPitch() {
    await navigator.clipboard.writeText(result.elevatorPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareLinkedIn() {
    const text = `I just took the "Will AI Replace Me?" assessment and scored ${result.score}%.\n\n${result.elevatorPitch}\n\nTake yours → https://learnagenticpatterns.com/assessment`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://learnagenticpatterns.com/assessment")}&summary=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  async function handleSendEmail() {
    if (!email) return;
    setEmailSending(true);
    try {
      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, answers: {}, email }),
      });
      setEmailSent(true);
    } catch {
      // silent fail
    }
    setEmailSending(false);
  }

  return (
    <section className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1 mb-6">
            Your Assessment Results
          </span>
          <div className="relative inline-block mb-4">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-surface"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className={scoreColor}
                strokeDasharray={`${2 * Math.PI * 70}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 70 * (1 - result.score / 100),
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                transform="rotate(-90 80 80)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-mono text-4xl font-bold ${scoreColor}`}>
                {result.score}%
              </span>
            </div>
          </div>
          <p className="font-mono text-sm text-text-secondary">
            AI-Proof Score
          </p>
        </motion.div>

        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-success" />
            <h3 className="font-mono text-lg text-text-primary font-bold">
              What AI Can&apos;t Replace About You
            </h3>
          </div>
          <ul className="space-y-3">
            {result.strengths.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <Check size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary text-sm leading-relaxed">
                  {s}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Vulnerabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface border border-border rounded-xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={20} className="text-accent" />
            <h3 className="font-mono text-lg text-text-primary font-bold">
              Where You&apos;re Vulnerable
            </h3>
          </div>
          <ul className="space-y-3">
            {result.vulnerabilities.map((v, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <AlertTriangle
                  size={16}
                  className="text-accent mt-0.5 flex-shrink-0"
                />
                <span className="text-text-secondary text-sm leading-relaxed">
                  {v}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-surface border border-border rounded-xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Rocket size={20} className="text-primary" />
            <h3 className="font-mono text-lg text-text-primary font-bold">
              Your 30-Day Action Plan
            </h3>
          </div>
          <div className="space-y-5">
            {result.actionPlan.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex gap-4"
              >
                <span className="font-mono text-primary font-bold text-lg flex-shrink-0 w-8">
                  {a.step}.
                </span>
                <div>
                  <p className="text-text-primary text-sm font-semibold mb-1">
                    {a.title}
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {a.description}
                  </p>
                  {a.link && (
                    <Link
                      href={a.link}
                      className="inline-block font-mono text-xs text-primary hover:underline mt-1"
                    >
                      {a.link.replace("https://learnagenticpatterns.com", "")} →
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Elevator Pitch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-surface border border-primary/20 rounded-xl p-6 md:p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Quote size={20} className="text-primary" />
            <h3 className="font-mono text-lg text-text-primary font-bold">
              Your Elevator Pitch
            </h3>
          </div>
          <p className="text-text-primary text-sm leading-relaxed italic mb-4">
            &ldquo;{result.elevatorPitch}&rdquo;
          </p>
          <button
            onClick={handleCopyPitch}
            className="flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-primary transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
        </motion.div>

        {/* Share / Email / CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-6"
        >
          {/* Share buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleShareLinkedIn}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white font-sans font-semibold text-sm px-6 py-3 rounded-md transition-all"
            >
              <Linkedin size={16} />
              Share on LinkedIn
            </button>
            <button
              onClick={onRetake}
              className="flex-1 flex items-center justify-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium text-sm px-6 py-3 rounded-md transition-all"
            >
              <Sparkles size={16} />
              Retake Assessment
            </button>
          </div>

          {/* Email report */}
          {!emailSent ? (
            <div className="bg-code-bg border border-border rounded-lg p-4 flex items-center gap-3">
              <Mail size={16} className="text-text-secondary flex-shrink-0" />
              <input
                type="email"
                placeholder="Email me my results"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none min-w-0"
              />
              <button
                onClick={handleSendEmail}
                disabled={!email || emailSending}
                className={`font-sans font-semibold text-sm px-4 py-2 rounded-md transition-all whitespace-nowrap ${
                  email && !emailSending
                    ? "bg-accent hover:bg-accent/90 text-white"
                    : "text-text-secondary/40 cursor-not-allowed"
                }`}
              >
                {emailSending ? "..." : "Send"}
              </button>
            </div>
          ) : (
            <div className="bg-code-bg border border-success/30 rounded-lg p-4 flex items-center justify-center gap-2">
              <Check size={16} className="text-success" />
              <p className="font-mono text-sm text-text-primary">
                Sent! Check your inbox.
              </p>
            </div>
          )}

          {/* CTA to curriculum */}
          {(role === "developer" || role === "product-manager") && (
            <Link
              href="/#curriculum"
              className="flex items-center justify-between bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-all group"
            >
              <div>
                <p className="font-mono text-sm text-text-primary font-semibold">
                  {role === "product-manager"
                    ? "Learn the patterns behind AI products"
                    : "Close the gaps — start learning"}
                </p>
                <p className="text-text-secondary text-xs mt-0.5">
                  21 patterns · Free · No credit card
                </p>
              </div>
              <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          )}

          {role !== "developer" && role !== "product-manager" && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  "https://learnagenticpatterns.com/assessment"
                );
              }}
              className="w-full flex items-center justify-between bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-all group"
            >
              <div className="text-left">
                <p className="font-mono text-sm text-text-primary font-semibold">
                  Share with a colleague
                </p>
                <p className="text-text-secondary text-xs mt-0.5">
                  Dev &amp; PM versions available
                </p>
              </div>
              <Copy size={16} className="text-primary flex-shrink-0" />
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Error State
// ---------------------------------------------------------------------------
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center max-w-md mx-auto px-4">
        <AlertTriangle size={48} className="text-accent mx-auto mb-6" />
        <h2 className="font-mono text-2xl text-text-primary font-bold mb-3">
          Something went wrong
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          The AI analysis failed. This can happen if the service is temporarily busy.
        </p>
        <button
          onClick={onRetry}
          className="bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-6 py-3 rounded-md transition-all"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main Assessment Page
// ---------------------------------------------------------------------------
type Phase = "landing" | "quiz" | "loading" | "results" | "error";

export default function AssessmentPage() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [role, setRole] = useState<Role>("developer");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string | string[]>>({});

  function handleRoleSelect(r: Role) {
    setRole(r);
    setPhase("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleQuizComplete(answers: Record<string, string | string[]>) {
    setSavedAnswers(answers);
    setPhase("loading");
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, answers }),
      });

      const data = await res.json();

      if (!data.success || !data.result) {
        setPhase("error");
        return;
      }

      setResult(data.result);
      setPhase("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setPhase("error");
    }
  }

  function handleRetake() {
    setResult(null);
    setSavedAnswers({});
    setPhase("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleRetry() {
    if (Object.keys(savedAnswers).length > 0) {
      await handleQuizComplete(savedAnswers);
    } else {
      handleRetake();
    }
  }

  const roleAssessment = roleAssessments.find((r) => r.role === role);

  return (
    <main className="relative z-10">
      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <motion.div key="landing" exit={{ opacity: 0 }}>
            <RolePicker onSelect={handleRoleSelect} />
          </motion.div>
        )}

        {phase === "quiz" && roleAssessment && (
          <motion.div key="quiz" exit={{ opacity: 0 }}>
            <Quiz
              role={role}
              questions={roleAssessment.questions}
              onComplete={handleQuizComplete}
              onBack={handleRetake}
            />
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div key="loading" exit={{ opacity: 0 }}>
            <AnalyzingLoader />
          </motion.div>
        )}

        {phase === "results" && result && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Results result={result} role={role} onRetake={handleRetake} />
          </motion.div>
        )}

        {phase === "error" && (
          <motion.div key="error" exit={{ opacity: 0 }}>
            <ErrorState onRetry={handleRetry} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
