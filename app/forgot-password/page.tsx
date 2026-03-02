"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Something went wrong");
      }

      setSent(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <main className="relative z-10 pt-24 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-4"
      >
        <div className="bg-surface border border-border rounded-lg p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
              <h1 className="font-mono text-2xl text-text-primary font-bold mb-2">
                Check your email
              </h1>
              <p className="text-text-secondary text-sm mb-6">
                If an account exists with that email, we&apos;ve sent a password
                reset link. It expires in 1 hour.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-primary font-mono text-sm hover:underline"
              >
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-mono text-2xl text-text-primary font-bold mb-2">
                Reset your password
              </h1>
              <p className="text-text-secondary text-sm mb-8">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block font-mono text-sm text-text-secondary mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full bg-code-bg border border-border rounded-md px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans"
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1 font-mono">{errors.email.message}</p>
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
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                  ) : (
                    <><Mail className="w-5 h-5" /> Send Reset Link</>
                  )}
                </button>
              </form>

              <p className="text-center text-text-secondary text-sm mt-6">
                <Link href="/login" className="text-primary font-mono hover:underline inline-flex items-center gap-1">
                  <ArrowLeft size={12} /> Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
