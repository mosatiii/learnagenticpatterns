"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { waitlistSchema, type WaitlistFormData } from "@/lib/validations";

const roles = [
  "Senior Developer",
  "Tech Lead",
  "Software Architect",
  "CTO/VP Engineering",
  "Other",
];

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
        <h3 className="font-mono text-2xl text-text-primary font-bold mb-2">
          You&apos;re in! All 21 patterns unlocked.
        </h3>
        <p className="text-text-secondary">
          Check your email for a confirmation. Start with Pattern 01 and work your way through.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-5">
      {/* First Name */}
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

      {/* Email */}
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

      {/* Role */}
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

      {/* Challenge */}
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

      {/* Server Error */}
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md px-4 py-3">
          <p className="text-red-400 text-sm font-mono">{serverError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-sans font-semibold text-base px-6 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating your account...
          </>
        ) : (
          <>
            Sign Up Free — Unlock All Patterns
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-center text-text-secondary/60 text-xs font-mono">
        100% free · No credit card · Unsubscribe anytime
      </p>
    </form>
  );
}
