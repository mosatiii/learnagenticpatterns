"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupSchema, type SignupFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";

const roles = [
  "Senior Developer",
  "Tech Lead",
  "Software Architect",
  "CTO/VP Engineering",
  "Product Manager",
  "Other",
];

export default function SignupPage() {
  const { user, signup } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  if (user) {
    router.push("/");
    return null;
  }

  const onSubmit = async (data: SignupFormData) => {
    setServerError("");
    try {
      await signup(data);
      router.push("/");
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
              <label htmlFor="role" className="block font-mono text-sm text-text-secondary mb-1.5">
                Role
              </label>
              <select
                id="role"
                {...register("role")}
                className="w-full bg-code-bg border border-border rounded-md px-4 py-3 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans appearance-none"
                defaultValue=""
              >
                <option value="" disabled>Select your role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-400 text-xs mt-1 font-mono">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="challenge" className="block font-mono text-sm text-text-secondary mb-1.5">
                Biggest challenge with Agentic AI?{" "}
                <span className="text-text-secondary/50">(optional)</span>
              </label>
              <textarea
                id="challenge"
                {...register("challenge")}
                rows={2}
                className="w-full bg-code-bg border border-border rounded-md px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans resize-none"
                placeholder="I know microservices but agents feel like magic..."
              />
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
            <Link href="/login" className="text-primary font-mono hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
