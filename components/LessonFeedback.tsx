"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { trackGameEvent } from "@/lib/game/analytics";

interface Props {
  lessonSlug: string;
  track?: "developer" | "pm";
}

export default function LessonFeedback({ lessonSlug, track = "developer" }: Props) {
  const { user } = useAuth();
  const [vote, setVote] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  // Load existing vote on mount
  useEffect(() => {
    if (!user) return;
    fetch(`/api/lesson-feedback?userId=${user.id}&lessonSlug=${lessonSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.feedback) {
          setVote(data.feedback.helpful);
        }
      })
      .catch(() => {});
  }, [user, lessonSlug]);

  if (!user) return null;

  async function handleVote(helpful: boolean) {
    // Toggle off if clicking the same vote
    const newVote = vote === helpful ? null : helpful;

    setVote(newVote);

    // PostHog event
    trackGameEvent("lesson_feedback", {
      lesson_slug: lessonSlug,
      track,
      helpful: newVote,
    });

    if (newVote === null) return;

    setSaving(true);
    try {
      await fetch("/api/lesson-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          lessonSlug,
          track,
          helpful: newVote,
        }),
      });
    } catch {
      // Silently fail — vote is still shown locally
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-10 pt-6 border-t border-border"
    >
      <div className="flex items-center justify-center gap-4">
        <span className="font-mono text-xs text-text-secondary">
          Was this helpful?
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote(true)}
            disabled={saving}
            className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs transition-all ${
              vote === true
                ? "bg-success/15 text-success border border-success/30"
                : "bg-surface border border-border text-text-secondary hover:border-success/30 hover:text-success"
            }`}
          >
            <ThumbsUp size={13} className={vote === true ? "fill-success/30" : ""} />
            Yes
          </button>

          <button
            onClick={() => handleVote(false)}
            disabled={saving}
            className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs transition-all ${
              vote === false
                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                : "bg-surface border border-border text-text-secondary hover:border-red-500/30 hover:text-red-400"
            }`}
          >
            <ThumbsDown size={13} className={vote === false ? "fill-red-400/30" : ""} />
            No
          </button>
        </div>

        <AnimatePresence>
          {vote !== null && (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[10px] text-text-secondary/50"
            >
              Thanks!
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
