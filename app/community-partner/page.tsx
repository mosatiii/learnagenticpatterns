"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import posthog from "posthog-js";
import { POSTHOG_KEY } from "@/lib/posthog-config";
import {
  ArrowRight,
  Award,
  Link2,
  Sparkles,
  Mail,
  Heart,
  BookOpen,
  Users,
  Globe,
  Loader2,
  CheckCircle2,
  Youtube,
  Instagram,
  MonitorPlay,
  Linkedin,
} from "lucide-react";
import {
  communityPartnerSchema,
  type CommunityPartnerFormData,
} from "@/lib/validations";

const platformOptions = [
  { value: "YouTube" as const, label: "YouTube", icon: Youtube },
  { value: "TikTok" as const, label: "TikTok", icon: MonitorPlay },
  { value: "Instagram" as const, label: "Instagram", icon: Instagram },
  { value: "LinkedIn" as const, label: "LinkedIn", icon: Linkedin },
  { value: "Other" as const, label: "Other", icon: Globe },
];

const perks = [
  {
    icon: Award,
    title: "Featured Partner Badge",
    description:
      "Your name and logo permanently displayed on our home page as a recognized community partner.",
  },
  {
    icon: Link2,
    title: "Direct Links on Practice Path",
    description:
      "Your YouTube and LinkedIn linked directly from our Practice learning path — seen by every active learner.",
  },
  {
    icon: Sparkles,
    title: "Early Pattern Access",
    description:
      "Get exclusive early access to new Agentic Design Patterns before they go live to the public.",
  },
  {
    icon: Mail,
    title: "Newsletter Feature",
    description:
      "Featured in our weekly newsletter reaching hundreds of active developers, PMs, and AI practitioners.",
  },
];

const reasons = [
  {
    icon: Heart,
    title: "Community-First",
    description:
      "We're 100% free. No paywalls, no premium tiers. Every pattern, code example, and exercise is open to everyone.",
  },
  {
    icon: BookOpen,
    title: "Education-Focused",
    description:
      "Built to help developers and PMs actually understand Agentic AI — not just use it. Real depth, real learning.",
  },
  {
    icon: Users,
    title: "Growing Audience",
    description:
      "Hundreds of active learners working through 21 patterns, interactive labs, and hands-on exercises every week.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Learners from around the world in AI, product management, no-code, and software engineering.",
  },
];

export default function CommunityPartnerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CommunityPartnerFormData>({
    resolver: zodResolver(communityPartnerSchema),
  });

  const selectedPlatform = watch("platform");

  const onSubmit = async (data: CommunityPartnerFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/community-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Something went wrong");

      if (typeof window !== "undefined" && POSTHOG_KEY) {
        posthog.capture("community_partner_application_submitted", {
          platform: data.platform,
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
              Community Partner Program
            </span>
            <h1 className="font-mono text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
              Become a Featured Voice
              <br />
              in <span className="text-gradient">Agentic AI</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
              Partner with a free, community-first educational platform and get
              permanent visibility, early access, and direct links to your
              content — seen by every learner on our site.
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

      {/* What You Get */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-mono text-xl text-text-primary font-bold mb-2 text-center">
            What Partners Get
          </h2>
          <p className="text-text-secondary text-sm text-center mb-8">
            No cash payouts — something better: lasting visibility and access
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-surface border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <perk.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-mono text-text-primary font-bold text-sm mb-1.5">
                  {perk.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {perk.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Profile on Featured Page */}
      <section className="py-16 bg-surface/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-mono text-xl text-text-primary font-bold mb-2 text-center">
              Your Own Profile Card
            </h2>
            <p className="text-text-secondary text-sm text-center mb-8 max-w-lg mx-auto">
              Every partner gets a searchable profile card on our platform —
              visible to every learner on the site.
            </p>

            {/* Preview card */}
            <div className="max-w-md mx-auto bg-surface border border-dashed border-primary/25 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-primary/40 text-lg font-bold">
                    ?
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-text-secondary/40 text-sm font-bold">
                      Your Name
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-accent border border-accent/30 rounded-full px-2 py-0.5 bg-accent/5">
                      <Award size={10} /> Partner
                    </span>
                  </div>
                  <p className="font-mono text-primary/30 text-xs mb-2">
                    your-channel
                  </p>
                  <p className="text-text-secondary/30 text-xs leading-relaxed mb-2.5">
                    Your bio and description will appear here...
                  </p>
                  <div className="flex gap-1.5">
                    <span className="inline-block font-mono text-[10px] text-primary/30 border border-primary/10 rounded-full px-2.5 py-0.5">
                      AI
                    </span>
                    <span className="inline-block font-mono text-[10px] text-primary/30 border border-primary/10 rounded-full px-2.5 py-0.5">
                      Your Topic
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-text-secondary/50 text-xs text-center mt-4 font-mono">
              Searchable by name, channel, and topic
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Partner with Us */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-mono text-xl text-text-primary font-bold mb-2 text-center">
            Why Partner with Us?
          </h2>
          <p className="text-text-secondary text-sm text-center mb-8">
            A free, community-first platform built for real learning
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 bg-surface border border-border rounded-xl p-5"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <reason.icon size={18} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-mono text-text-primary font-bold text-sm mb-1">
                    {reason.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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
              Apply to Become a Partner
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
                    <div className="grid grid-cols-5 gap-2">
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
                            className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 transition-all cursor-pointer ${
                              isSelected
                                ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                                : "border-border bg-code-bg hover:border-text-secondary/40"
                            }`}
                          >
                            <p.icon
                              size={18}
                              className={
                                isSelected
                                  ? "text-primary"
                                  : "text-text-secondary"
                              }
                            />
                            <span
                              className={`font-mono text-[11px] font-medium ${
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

                  {/* Why Partner */}
                  <div>
                    <label
                      htmlFor="whyPartner"
                      className="block font-mono text-xs text-text-secondary mb-1.5 uppercase tracking-wider"
                    >
                      Why do you want to partner with us?
                    </label>
                    <textarea
                      id="whyPartner"
                      rows={4}
                      {...register("whyPartner")}
                      className={`${inputClass} resize-none`}
                      placeholder="Tell us about your content, audience, and what a partnership would look like..."
                    />
                    {errors.whyPartner && (
                      <p className="text-red-400 text-xs mt-1 font-mono">
                        {errors.whyPartner.message}
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
