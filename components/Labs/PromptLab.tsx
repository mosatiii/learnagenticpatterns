"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, RotateCcw, Lightbulb, CheckCircle2, XCircle,
  Loader2, MessageSquare, Eye, EyeOff, AlertTriangle,
} from "lucide-react";
import type { PromptLabConfig, PromptTestCase } from "@/data/prompt-labs";
import { useAuth } from "@/contexts/AuthContext";
import TierBadge from "./TierBadge";

interface PromptLabProps {
  config: PromptLabConfig;
  patternSlug: string;
  patternName: string;
}

interface TestResult {
  testCaseId: string;
  passed: boolean;
  score: number;
  feedback: string;
  outputPreview: string;
}

export default function PromptLab({ config, patternSlug, patternName }: PromptLabProps) {
  const [prompt, setPrompt] = useState(config.systemPromptStarter ?? "");
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(-1);
  const [hintIdx, setHintIdx] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);
  const [error, setError] = useState("");
  const [submissionCount, setSubmissionCount] = useState(0);
  const startTimeRef = useRef(Date.now());
  const { user } = useAuth();

  const MAX_SUBMISSIONS = 10;
  const tokenEstimate = Math.ceil(prompt.length / 4);
  const overBudget = tokenEstimate > config.maxTokenBudget;

  const totalScore = results.length > 0
    ? Math.round(
        results.reduce((sum, r) => {
          const tc = config.testCases.find((t) => t.id === r.testCaseId);
          return sum + (r.passed ? (tc?.weight ?? 0) : 0);
        }, 0)
      )
    : 0;
  const maxScore = config.testCases.reduce((sum, tc) => sum + tc.weight, 0);
  const passed = totalScore >= maxScore * 0.7;

  const runTests = async () => {
    if (!user) {
      setError("Sign in to run tests.");
      return;
    }
    if (!prompt.trim()) {
      setError("Write a prompt before running tests.");
      return;
    }
    if (overBudget) {
      setError(`Prompt exceeds token budget (${tokenEstimate}/${config.maxTokenBudget}).`);
      return;
    }
    if (submissionCount >= MAX_SUBMISSIONS) {
      setError(`Max ${MAX_SUBMISSIONS} submissions per session reached. Refresh to reset.`);
      return;
    }

    setError("");
    setIsRunning(true);
    setResults([]);
    setSubmissionCount((c) => c + 1);

    const token = typeof window !== "undefined" ? localStorage.getItem("lap_token") : null;
    const newResults: TestResult[] = [];

    for (let i = 0; i < config.testCases.length; i++) {
      setCurrentTest(i);
      const tc = config.testCases[i];

      try {
        const res = await fetch("/api/prompt-evaluate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            patternSlug,
            userPrompt: prompt,
            testCaseId: tc.id,
            testInput: tc.userMessage,
            expectedBehavior: tc.expectedBehavior,
            rubric: config.rubric,
          }),
        });

        const data = await res.json();
        if (data.success) {
          newResults.push({
            testCaseId: tc.id,
            passed: data.passed,
            score: data.score,
            feedback: data.feedback,
            outputPreview: data.outputPreview,
          });
        } else {
          newResults.push({
            testCaseId: tc.id,
            passed: false,
            score: 0,
            feedback: data.message || "Evaluation failed.",
            outputPreview: "",
          });
        }
      } catch {
        newResults.push({
          testCaseId: tc.id,
          passed: false,
          score: 0,
          feedback: "Network error. Try again.",
          outputPreview: "",
        });
      }

      setResults([...newResults]);
    }

    setCurrentTest(-1);
    setIsRunning(false);
  };

  const reset = () => {
    setPrompt(config.systemPromptStarter ?? "");
    setResults([]);
    setHintIdx(-1);
    setShowSolution(false);
    setError("");
    startTimeRef.current = Date.now();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TierBadge tier="practitioner" size="md" />
          <span className="px-2 py-0.5 rounded-full bg-surface text-text-secondary font-mono text-[10px] uppercase tracking-wider border border-border">
            Prompt Lab
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <MessageSquare size={24} className="text-blue-400" />
          {config.title}
        </h1>
      </div>

      {/* Scenario */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
        <p className="text-text-primary text-sm leading-relaxed">{config.scenario}</p>
        {config.contextDoc && (
          <p className="text-text-secondary text-xs mt-3 border-t border-blue-500/10 pt-3">
            {config.contextDoc}
          </p>
        )}
      </div>

      {/* Editor + Test Cases layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Prompt editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs text-text-secondary">Your System Prompt</label>
            <span className={`font-mono text-xs ${overBudget ? "text-red-400" : "text-text-secondary/60"}`}>
              ~{tokenEstimate}/{config.maxTokenBudget} tokens
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your system prompt here..."
            disabled={isRunning}
            className="w-full h-72 bg-code-bg border border-border rounded-lg p-4 font-mono text-sm text-text-primary placeholder:text-text-secondary/30 resize-y focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
          />

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={runTests}
              disabled={isRunning || !prompt.trim() || overBudget}
              className="inline-flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-mono text-sm px-5 py-2.5 rounded-lg transition-all disabled:opacity-40 border border-blue-500/30"
            >
              {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              {isRunning ? `Testing ${currentTest + 1}/${config.testCases.length}...` : "Run Tests"}
            </button>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-mono text-xs px-4 py-2.5 rounded-lg transition-colors border border-border hover:border-primary/30"
            >
              <RotateCcw size={14} />
              Reset
            </button>

            {hintIdx < config.hints.length - 1 && (
              <button
                onClick={() => setHintIdx((i) => i + 1)}
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-mono text-xs px-4 py-2.5 rounded-lg transition-colors border border-yellow-500/20 hover:border-yellow-500/30"
              >
                <Lightbulb size={14} />
                Hint ({hintIdx + 1}/{config.hints.length})
              </button>
            )}

            <button
              onClick={() => setShowSolution(!showSolution)}
              className="inline-flex items-center gap-2 text-text-secondary/60 hover:text-text-secondary font-mono text-xs px-4 py-2.5 rounded-lg transition-colors"
            >
              {showSolution ? <EyeOff size={14} /> : <Eye size={14} />}
              {showSolution ? "Hide" : "Show"} Solution
            </button>

            <span className="ml-auto font-mono text-xs text-text-secondary/40">
              {submissionCount}/{MAX_SUBMISSIONS} runs
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/5 border border-red-500/20 rounded-lg p-3">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          {/* Hints */}
          <AnimatePresence>
            {hintIdx >= 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3"
              >
                {config.hints.slice(0, hintIdx + 1).map((hint, i) => (
                  <p key={i} className="text-yellow-300/80 text-xs font-mono flex items-start gap-2 mb-1 last:mb-0">
                    <Lightbulb size={10} className="mt-0.5 flex-shrink-0" />
                    {hint}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sample solution */}
          <AnimatePresence>
            {showSolution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="bg-surface border border-primary/20 rounded-lg p-4">
                  <p className="font-mono text-xs text-primary mb-2">Sample Solution</p>
                  <pre className="text-text-secondary text-xs whitespace-pre-wrap leading-relaxed">
                    {config.sampleSolution}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Test cases panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-secondary">
              Test Cases ({results.filter((r) => r.passed).length}/{config.testCases.length} passing)
            </span>
            {results.length === config.testCases.length && (
              <span className={`font-mono text-xs ${passed ? "text-success" : "text-red-400"}`}>
                Score: {totalScore}/{maxScore}
              </span>
            )}
          </div>

          {config.testCases.map((tc, i) => {
            const result = results.find((r) => r.testCaseId === tc.id);
            const isCurrentlyTesting = isRunning && currentTest === i;

            return (
              <motion.div
                key={tc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-surface border rounded-lg p-3 transition-colors ${
                  result
                    ? result.passed
                      ? "border-success/30"
                      : "border-red-500/30"
                    : isCurrentlyTesting
                    ? "border-blue-500/30 animate-pulse"
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-[10px] text-text-secondary">
                    Test {i + 1} ({tc.weight}pts)
                  </span>
                  {isCurrentlyTesting && <Loader2 size={12} className="text-blue-400 animate-spin" />}
                  {result && (
                    result.passed
                      ? <CheckCircle2 size={14} className="text-success" />
                      : <XCircle size={14} className="text-red-400" />
                  )}
                </div>

                <p className="text-text-primary text-xs mb-2 line-clamp-3 leading-relaxed">
                  <span className="text-text-secondary">Input: </span>
                  {tc.userMessage ? `"${tc.userMessage.slice(0, 120)}${tc.userMessage.length > 120 ? "..." : ""}"` : "(empty input)"}
                </p>

                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <div className={`text-xs mt-2 pt-2 border-t ${result.passed ? "border-success/20" : "border-red-500/20"}`}>
                        <p className={`${result.passed ? "text-success/80" : "text-red-400/80"} leading-relaxed`}>
                          {result.feedback}
                        </p>
                        {result.outputPreview && (
                          <p className="text-text-secondary/60 mt-1 text-[10px] font-mono">
                            Preview: {result.outputPreview.slice(0, 150)}...
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Score summary */}
          {results.length === config.testCases.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-xl p-4 border ${
                passed
                  ? "bg-success/5 border-success/30"
                  : "bg-red-500/5 border-red-500/30"
              }`}
            >
              <div className="text-center">
                <p className={`text-lg font-bold ${passed ? "text-success" : "text-red-400"}`}>
                  {totalScore}/{maxScore} points
                </p>
                <p className={`text-xs font-mono ${passed ? "text-success/70" : "text-red-400/70"}`}>
                  {passed ? "Challenge passed!" : "Keep iterating — check the feedback above."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
