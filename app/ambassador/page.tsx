"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  Video,
  CheckCircle2,
  Megaphone,
  Youtube,
  Instagram,
  MonitorPlay,
  Globe,
} from "lucide-react";
import posthog from "posthog-js";
import { POSTHOG_KEY } from "@/lib/posthog-config";
import { ambassadorSchema, type AmbassadorFormData } from "@/lib/validations";

const platformOptions = [
  { value: "YouTube" as const, label: "YouTube", icon: Youtube },
  { value: "TikTok" as const, label: "TikTok", icon: MonitorPlay },
  { value: "Instagram" as const, label: "Instagram", icon: Instagram },
  { value: "Other" as const, label: "Other", icon: Globe },
];

const tiers = [
  { range: "Under 5K", payout: "$50", followers: "< 5,000 followers" },
  { range: "Under 10K", payout: "$75", followers: "5,000 – 9,999 followers" },
  { range: "Under 15K", payout: "$100", followers: "10,000 – 14,999 followers" },
];

const steps = [
  {
    number: "01",
    icon: Video,
    title: "Full Dedicated Video",
    description:
      "Create a complete video about learnagenticpatterns.com — not a mention or shout-out.",
  },
  {
    number: "02",
    icon: Megaphone,
    title: "Platform Walkthrough",
    description:
      "Walk your audience through the 21 patterns, code examples, and interactive exercises.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Paid Partnership Disclosure",
    description:
      'Include a clear disclosure as required by platform guidelines (e.g. "Includes paid promotion").',
  },
];

const topics = [
  "AI & Machine Learning",
  "No-Code / Low-Code",
  "Product Management",
  "Tech Education",
  "Startups",
  "Career Development",
];

export default function AmbassadorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AmbassadorFormData>({
    resolver: zodResolver(ambassadorSchema),
  });

  const selectedPlatform = watch("platform");

  const onSubmit = async (data: AmbassadorFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/ambassador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Something went wrong");

      if (typeof window !== "undefined" && POSTHOG_KEY) {
        posthog.capture("ambassador_application_submitted", {
          platform: data.platform,
          follower_count: data.followerCount,
        });
      }

      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  const inputClass =
    "w-full bg-code-bg border border-border rounded-md px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans text-sm";

  return (
    <main className="relative z-10 pt-24">
      {/* Hero */}
      <section className="py-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block font-mono text-primary text-xs tracking-wider uppercase mb-6 border border-primary/20 rounded-full px-4 py-1.5 bg-primary/5">
              Ambassador Program
            </span>
            <h1 className="font-mono text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
              Get Paid to Share{" "}
              <span className="text-gradient">What You Love</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
              Create a dedicated video introducing learnagenticpatterns.com to
              your audience and earn up to{" "}
              <span className="text-accent font-semibold">$100 CAD</span> when
              it goes live.
            </p>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-7 py-3 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20 mt-8"
            >
              Apply Now <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Payout Tiers */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-mono text-xl text-text-primary font-bold mb-2 text-center">
              Payout Tiers
            </h2>
            <p className="text-text-secondary text-sm text-center mb-8">
              Paid upon publishing your dedicated video
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tiers.map((tier, i) => {
                const isMiddle = i === 1;
                return (
                  <motion.div
                    key={tier.range}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative rounded-xl p-6 text-center transition-all ${
                      isMiddle
                        ? "bg-surface border-2 border-primary/40 shadow-lg shadow-primary/5"
                        : "bg-surface border border-border"
                    }`}
                  >
                    {isMiddle && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-wider text-primary bg-primary/10 border border-primary/30 rounded-full px-3 py-0.5">
                        Popular
                      </span>
                    )}
                    <p className="font-mono text-text-secondary text-xs mb-3">
                      {tier.range}
                    </p>
                    <p className="font-mono text-3xl font-bold text-text-primary mb-1">
                      {tier.payout}
                      <span className="text-text-secondary text-sm font-normal ml-1">
                        CAD
                      </span>
                    </p>
                    <p className="text-text-secondary/60 text-xs">
                      {tier.followers}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Ambassadors Preview */}
      <section className="py-16 bg-surface/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-mono text-xl text-text-primary font-bold mb-2 text-center">
              Featured Ambassadors
            </h2>
            <p className="text-text-secondary text-sm text-center mb-8">
              Your name and channel could be here
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative bg-surface border border-dashed border-primary/20 rounded-xl p-6 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/5 border border-primary/15 flex items-center justify-center mb-3">
                    <span className="font-mono text-primary/30 text-lg font-bold">
                      ?
                    </span>
                  </div>
                  <p className="font-mono text-text-secondary/40 text-sm font-medium mb-1">
                    Your Name
                  </p>
                  <p className="font-mono text-primary/30 text-xs">
                    your-channel
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Requirements — numbered steps */}
      <section className="py-16 bg-surface/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-mono text-xl text-text-primary font-bold mb-8 text-center">
            What&apos;s Required
          </h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-5 bg-surface border border-border rounded-lg p-5"
              >
                <span className="font-mono text-primary/30 text-2xl font-bold leading-none mt-0.5 select-none">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-mono text-text-primary font-bold text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We're Looking For */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-mono text-xl text-text-primary font-bold mb-2">
              Who We&apos;re Looking For
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              Creators under 15K followers covering topics like:
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-block font-mono text-xs text-primary border border-primary/20 rounded-full px-4 py-1.5 bg-primary/5"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-surface/30" id="apply">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-mono text-xl text-text-primary font-bold mb-1 text-center">
              Apply to the Program
            </h2>
            <p className="text-text-secondary text-sm mb-8 text-center">
              Takes less than 2 minutes. We&apos;ll get back to you within a few
              days.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border border-success/30 rounded-xl p-10 text-center"
              >
                <CheckCircle2
                  size={44}
                  className="text-success mx-auto mb-4"
                />
                <h3 className="font-mono text-text-primary font-bold text-lg mb-2">
                  Application Received
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
                  Thanks for applying! We&apos;ll review your profile and reach
                  out soon with next steps.
                </p>
              </motion.div>
            ) : (
              <div className="bg-surface border border-border rounded-xl p-8">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-mono text-xs text-text-secondary mb-1.5 uppercase tracking-wider"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      className={inputClass}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1 font-mono">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-mono text-xs text-text-secondary mb-1.5 uppercase tracking-wider"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                    <p className="text-text-secondary/50 text-xs mt-1.5">
                      Use the same email associated with your public profile so
                      we can verify your channel.
                    </p>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1 font-mono">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Platform — card selection */}
                  <div>
                    <span className="block font-mono text-xs text-text-secondary mb-2.5 uppercase tracking-wider">
                      Platform
                    </span>
                    <input type="hidden" {...register("platform")} />
                    <div className="grid grid-cols-4 gap-2.5">
                      {platformOptions.map((p) => {
                        const isSelected = selectedPlatform === p.value;
                        return (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() =>
                              setValue("platform", p.value, {
                                shouldValidate: true,
                              })
                            }
                            className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3.5 transition-all cursor-pointer ${
                              isSelected
                                ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                                : "border-border bg-code-bg hover:border-text-secondary/40"
                            }`}
                          >
                            <p.icon
                              size={20}
                              className={
                                isSelected
                                  ? "text-primary"
                                  : "text-text-secondary"
                              }
                            />
                            <span
                              className={`font-mono text-xs font-medium ${
                                isSelected
                                  ? "text-primary"
                                  : "text-text-primary"
                              }`}
                            >
                              {p.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.platform && (
                      <p className="text-red-400 text-xs mt-1.5 font-mono">
                        {errors.platform.message}
                      </p>
                    )}
                  </div>

                  {/* Channel URL */}
                  <div>
                    <label
                      htmlFor="channelUrl"
                      className="block font-mono text-xs text-text-secondary mb-1.5 uppercase tracking-wider"
                    >
                      Channel / Profile Link
                    </label>
                    <input
                      id="channelUrl"
                      type="url"
                      {...register("channelUrl")}
                      className={inputClass}
                      placeholder="https://youtube.com/@yourchannel"
                    />
                    {errors.channelUrl && (
                      <p className="text-red-400 text-xs mt-1 font-mono">
                        {errors.channelUrl.message}
                      </p>
                    )}
                  </div>

                  {/* Follower Count */}
                  <div>
                    <label
                      htmlFor="followerCount"
                      className="block font-mono text-xs text-text-secondary mb-1.5 uppercase tracking-wider"
                    >
                      Subscriber / Follower Count
                    </label>
                    <input
                      id="followerCount"
                      type="text"
                      {...register("followerCount")}
                      className={inputClass}
                      placeholder="e.g. 5,000"
                    />
                    {errors.followerCount && (
                      <p className="text-red-400 text-xs mt-1 font-mono">
                        {errors.followerCount.message}
                      </p>
                    )}
                  </div>

                  {/* Why Audience */}
                  <div>
                    <label
                      htmlFor="whyAudience"
                      className="block font-mono text-xs text-text-secondary mb-1.5 uppercase tracking-wider"
                    >
                      Why would your audience benefit?
                    </label>
                    <textarea
                      id="whyAudience"
                      rows={4}
                      {...register("whyAudience")}
                      className={`${inputClass} resize-none`}
                      placeholder="Tell us about your audience and why this would be valuable to them..."
                    />
                    {errors.whyAudience && (
                      <p className="text-red-400 text-xs mt-1 font-mono">
                        {errors.whyAudience.message}
                      </p>
                    )}
                  </div>

                  {/* Server Error */}
                  {serverError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-md px-4 py-3">
                      <p className="text-red-400 text-sm font-mono">
                        {serverError}
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-sans font-semibold text-sm px-6 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application{" "}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-text-secondary/50 text-xs font-mono">
                    No commitment until we approve your application
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
