"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Eye, EyeOff, Code2, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signupSchema, type SignupFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";

const PRACTICE_BASE = "https://practice.learnagenticpatterns.com";

function practiceRedirect(): string {
  return PRACTICE_BASE;
}

const tracks = [
  {
    value: "Developer" as const,
    label: "Developer",
    description: "21 patterns with code examples & SWE mappings",
    icon: Code2,
  },
  {
    value: "Product Manager" as const,
    label: "Product Manager",
    description: "11 modules with decision frameworks & games",
    icon: Briefcase,
  },
];

export default function SignupPage() {
  const { user, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fromPractice = searchParams.get("from") === "practice";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const selectedRole = watch("role");

  if (user) {
    if (fromPractice) {
      window.location.href = practiceRedirect();
    } else {
      router.push("/");
    }
    return (
      <main className="relative z-10 pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto mb-3" />
          <p className="text-text-secondary font-mono text-sm">
            Already signed in. Redirecting{fromPractice ? " to Practice Labs" : " to your dashboard"}.
          </p>
        </div>
      </main>
    );
  }

  const onSubmit = async (data: SignupFormData) => {
    setServerError("");
    try {
      await signup(data);
      if (fromPractice) {
        window.location.href = practiceRedirect();
      } else {
        router.push("/");
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <main className="relative z-10 pt-24 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-4 py-12"
      >
        <div className="bg-surface border border-border rounded-lg p-8">
          <h1 className="font-mono text-2xl text-text-primary font-bold mb-2">
            Create your free account
          </h1>
          <p className="text-text-secondary text-sm mb-8">
            Unlock all 21 patterns. No credit card required.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="firstName" className="block font-mono text-sm text-text-secondary mb-1.5">
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
                <p className="text-red-400 text-xs mt-1 font-mono">{errors.firstName.message}</p>
              )}
            </div>

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

            <div>
              <label htmlFor="password" className="block font-mono text-sm text-text-secondary mb-1.5">
                Password
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
              <span className="block font-mono text-sm text-text-secondary mb-2.5">
                I&apos;m a...
              </span>
              <input type="hidden" {...register("role")} />
              <div className="grid grid-cols-2 gap-3">
                {tracks.map((track) => {
                  const isSelected = selectedRole === track.value;
                  return (
                    <button
                      key={track.value}
                      type="button"
                      onClick={() => setValue("role", track.value, { shouldValidate: true })}
                      className={`relative flex flex-col items-center gap-2 rounded-lg border px-4 py-4 transition-all text-center cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                          : "border-border bg-code-bg hover:border-text-secondary/40"
                      }`}
                    >
                      <track.icon
                        size={22}
                        className={isSelected ? "text-primary" : "text-text-secondary"}
                      />
                      <span className={`font-mono text-sm font-semibold ${
                        isSelected ? "text-primary" : "text-text-primary"
                      }`}>
                        {track.label}
                      </span>
                      <span className="text-text-secondary/70 text-[11px] leading-tight">
                        {track.description}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.role && (
                <p className="text-red-400 text-xs mt-1.5 font-mono">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("agreedToTerms")}
                  className="mt-0.5 w-4 h-4 rounded border-border bg-code-bg text-primary focus:ring-primary/30 focus:ring-offset-0 cursor-pointer accent-primary"
                />
                <span className="text-text-secondary text-sm leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-primary hover:underline font-mono"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-primary hover:underline font-mono"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </Link>
                </span>
              </label>
              {errors.agreedToTerms && (
                <p className="text-red-400 text-xs mt-1.5 font-mono">{errors.agreedToTerms.message}</p>
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
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</>
              ) : (
                <>Sign Up Free <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

            <p className="text-center text-text-secondary/60 text-xs font-mono">
              100% free · No credit card · Unsubscribe anytime
            </p>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            Already have an account?{" "}
            <Link href={fromPractice ? "/login?from=practice" : "/login"} className="text-primary font-mono hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
