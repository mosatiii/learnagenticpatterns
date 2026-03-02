"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, ArrowRight, Mail } from "lucide-react";
import { waitlistSchema, type WaitlistFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";

const roles = [
  "Senior Developer",
  "Tech Lead",
  "Software Architect",
  "CTO/VP Engineering",
  "Other",
];

export default function WaitlistForm() {
  const { user, signup, verify } = useAuth();
  const [mode, setMode] = useState<"signup" | "returning">("signup");
  const [serverError, setServerError] = useState("");
  const [returningEmail, setReturningEmail] = useState("");
  const [verifying, setVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  // Already signed in
  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
        <h3 className="font-mono text-2xl text-text-primary font-bold mb-2">
          Welcome back, {user.firstName}!
        </h3>
        <p className="text-text-secondary">
          All 21 patterns are unlocked. Start with Pattern 01 and work your way
          through.
        </p>
      </motion.div>
    );
  }

  const onSignup = async (data: WaitlistFormData) => {
    setServerError("");
    try {
      await signup(data);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setVerifying(true);
    try {
      const found = await verify(returningEmail);
      if (!found) {
        setServerError("Email not found. Please sign up first.");
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  // "Already signed up?" — just enter email
  if (mode === "returning") {
    return (
      <div className="max-w-md mx-auto">
        <form onSubmit={onVerify} className="space-y-4">
          <div>
            <label
              htmlFor="returningEmail"
              className="block font-mono text-sm text-text-secondary mb-1.5"
            >
              Enter your email to continue
            </label>
            <input
              id="returningEmail"
              type="email"
              value={returningEmail}
              onChange={(e) => setReturningEmail(e.target.value)}
              className="w-full bg-code-bg border border-border rounded-md px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans"
              placeholder="you@company.com"
              required
            />
          </div>

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md px-4 py-3">
              <p className="text-red-400 text-sm font-mono">{serverError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={verifying}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-background font-sans font-semibold text-base px-6 py-3.5 rounded-md transition-all flex items-center justify-center gap-2"
          >
            {verifying ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Checking...</>
            ) : (
              <><Mail className="w-5 h-5" /> Continue</>
            )}
          </button>
        </form>

        <button
          onClick={() => { setMode("signup"); setServerError(""); }}
          className="mt-4 w-full text-center text-text-secondary text-sm hover:text-primary transition-colors font-mono"
        >
          ← New here? Sign up instead
        </button>
      </div>
    );
  }

  // Full sign-up form
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSignup)}
        className="max-w-xl mx-auto space-y-5"
      >
        <div>
          <label
            htmlFor="firstName"
            className="block font-mono text-sm text-text-secondary mb-1.5"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...register("firstName")}
            className="w-full bg-code-bg border border-border rounded-md px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans"
            placeholder="Your first name"
          />
          {errors.firstName && (
            <p className="text-red-400 text-xs mt-1 font-mono">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-mono text-sm text-text-secondary mb-1.5"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full bg-code-bg border border-border rounded-md px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans"
            placeholder="you@company.com"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1 font-mono">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="role"
            className="block font-mono text-sm text-text-secondary mb-1.5"
          >
            Role
          </label>
          <select
            id="role"
            {...register("role")}
            className="w-full bg-code-bg border border-border rounded-md px-4 py-3 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans appearance-none"
            defaultValue=""
          >
            <option value="" disabled>
              Select your role
            </option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-red-400 text-xs mt-1 font-mono">
              {errors.role.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="challenge"
            className="block font-mono text-sm text-text-secondary mb-1.5"
          >
            Biggest challenge with Agentic AI?{" "}
            <span className="text-text-secondary/50">(optional)</span>
          </label>
          <textarea
            id="challenge"
            {...register("challenge")}
            rows={3}
            className="w-full bg-code-bg border border-border rounded-md px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans resize-none"
            placeholder="I know microservices but agents feel like magic..."
          />
          {errors.challenge && (
            <p className="text-red-400 text-xs mt-1 font-mono">
              {errors.challenge.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-md px-4 py-3">
            <p className="text-red-400 text-sm font-mono">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-sans font-semibold text-base px-6 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Creating your account...</>
          ) : (
            <>Sign Up Free — Unlock All Patterns <ArrowRight className="w-5 h-5" /></>
          )}
        </button>

        <p className="text-center text-text-secondary/60 text-xs font-mono">
          100% free · No credit card · Unsubscribe anytime
        </p>
      </form>

      <button
        onClick={() => { setMode("returning"); setServerError(""); }}
        className="mt-6 w-full text-center text-text-secondary text-sm hover:text-primary transition-colors font-mono"
      >
        Already signed up? Enter your email to continue →
      </button>
    </div>
  );
}
