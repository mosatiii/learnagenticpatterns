"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";

const PRACTICE_BASE = "https://practice.learnagenticpatterns.com";

/** Build the practice redirect URL, embedding the JWT in the hash so
 *  the practice subdomain can pick it up without relying on cookies. */
function practiceRedirect(): string {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("lap_token")
    : null;
  return token
    ? `${PRACTICE_BASE}/#token=${encodeURIComponent(token)}`
    : PRACTICE_BASE;
}

export default function LoginPage() {
  const { user, login, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [switchingAccount, setSwitchingAccount] = useState(false);

  const fromPractice = searchParams.get("from") === "practice";
  const isSwitchAccount = searchParams.get("switchAccount") === "true";

  // "Use a different account" flow: force logout on main domain first
  useEffect(() => {
    if (isSwitchAccount && user && !switchingAccount) {
      setSwitchingAccount(true);
      logout();
    }
  }, [isSwitchAccount, user, logout, switchingAccount]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Already logged in — redirect (skip if user is switching accounts)
  if (user && !isSwitchAccount) {
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
            Already signed in — redirecting{fromPractice ? " to Practice Labs" : ""}…
          </p>
        </div>
      </main>
    );
  }

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    try {
      await login(data.email, data.password);
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
        className="w-full max-w-md mx-auto px-4"
      >
        <div className="bg-surface border border-border rounded-lg p-8">
          <h1 className="font-mono text-2xl text-text-primary font-bold mb-2">
            Welcome back
          </h1>
          <p className="text-text-secondary text-sm mb-8">
            Log in to continue your learning journey.
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="font-mono text-sm text-text-secondary">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-primary text-xs font-mono hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full bg-code-bg border border-border rounded-md px-4 py-3 pr-12 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans"
                  placeholder="••••••••"
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
                <><Loader2 className="w-5 h-5 animate-spin" /> Logging in...</>
              ) : (
                <>Log In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href={fromPractice ? "/signup?from=practice" : "/signup"} className="text-primary font-mono hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
