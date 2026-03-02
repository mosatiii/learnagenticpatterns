"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="relative z-10 pt-24 min-h-screen flex items-center justify-center">
        <div className="font-mono text-text-secondary">Loading...</div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <main className="relative z-10 pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-mono text-2xl text-text-primary mb-4">Invalid reset link</h1>
          <p className="text-text-secondary mb-6">This link is missing or malformed.</p>
          <Link href="/forgot-password" className="text-primary font-mono hover:underline">
            Request a new reset link →
          </Link>
        </div>
      </main>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Something went wrong");

      setDone(true);
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
          {done ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
              <h1 className="font-mono text-2xl text-text-primary font-bold mb-2">
                Password updated
              </h1>
              <p className="text-text-secondary text-sm mb-6">
                Your password has been reset. You can now log in.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold px-6 py-3 rounded-md transition-all"
              >
                Log In <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-mono text-2xl text-text-primary font-bold mb-2">
                Set a new password
              </h1>
              <p className="text-text-secondary text-sm mb-8">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="password" className="block font-mono text-sm text-text-secondary mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="w-full bg-code-bg border border-border rounded-md px-4 py-3 pr-12 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans"
                      placeholder="Min 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1 font-mono">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block font-mono text-sm text-text-secondary mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="w-full bg-code-bg border border-border rounded-md px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans"
                    placeholder="Repeat password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1 font-mono">{errors.confirmPassword.message}</p>
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
                    <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</>
                  ) : (
                    <>Reset Password <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
