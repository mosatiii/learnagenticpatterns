"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  Video,
  DollarSign,
  CheckCircle2,
  Users,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { ambassadorSchema, type AmbassadorFormData } from "@/lib/validations";

const platforms = ["YouTube", "TikTok", "Instagram", "Other"] as const;

const expectations = [
  {
    icon: Video,
    title: "Full Dedicated Video",
    description:
      "Create a complete video dedicated to learnagenticpatterns.com — not just a mention or shout-out.",
  },
  {
    icon: Megaphone,
    title: "Platform Walkthrough",
    description:
      "Walk your audience through the platform: the 21 patterns, code examples, and interactive exercises.",
  },
  {
    icon: CheckCircle2,
    title: "Paid Partnership Disclosure",
    description:
      'Include a clear disclosure that this is a paid partnership, as required by platform guidelines (e.g. "Includes paid promotion").',
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: "$50 CAD on Publish",
    description:
      "Receive $50 CAD once your dedicated video goes live. No strings attached.",
  },
  {
    icon: Users,
    title: "Early Access & Support",
    description:
      "Get direct access to the founder for any questions about the platform while creating your content.",
  },
  {
    icon: Sparkles,
    title: "Feature on Our Site",
    description:
      "Top ambassador videos may be featured on learnagenticpatterns.com, giving you extra visibility.",
  },
];

export default function AmbassadorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AmbassadorFormData>({
    resolver: zodResolver(ambassadorSchema),
  });

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
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  const inputClass =
    "w-full bg-code-bg border border-border rounded-md px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans";

  return (
    <main className="relative z-10 pt-24">
      {/* Hero */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-primary text-sm mb-4 block">
              {">"} ambassador_program
            </span>
            <h1 className="font-mono text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
              Become an{" "}
              <span className="text-gradient">Ambassador</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
              We&apos;re looking for micro-influencers in{" "}
              <span className="text-text-primary font-medium">AI</span>,{" "}
              <span className="text-text-primary font-medium">no-code</span>,{" "}
              <span className="text-text-primary font-medium">product management</span>, and{" "}
              <span className="text-text-primary font-medium">tech education</span> to
              introduce learnagenticpatterns.com to their audience through a
              full dedicated video.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We're Looking For */}
      <section className="py-16 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-mono text-2xl text-text-primary font-bold mb-3">
              <span className="text-primary">{">"}</span> Who We&apos;re Looking For
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Creators under 10K subscribers or followers who cover topics like:
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "AI & Machine Learning",
                "No-Code / Low-Code",
                "Product Management",
                "Tech Education",
                "Startups",
                "Career Development",
              ].map((topic) => (
                <span
                  key={topic}
                  className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-4 py-1.5"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's Expected */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-mono text-2xl text-text-primary font-bold mb-8">
            <span className="text-primary">{">"}</span> What&apos;s Expected
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {expectations.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-border rounded-lg p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-mono text-text-primary font-bold text-sm mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-mono text-2xl text-text-primary font-bold mb-8">
            <span className="text-accent">{">"}</span> What You Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-accent/20 rounded-lg p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-accent" />
                </div>
                <h3 className="font-mono text-text-primary font-bold text-sm mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20" id="apply">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-mono text-2xl text-text-primary font-bold mb-2">
              <span className="text-primary">{">"}</span> Apply Now
            </h2>
            <p className="text-text-secondary text-sm mb-8">
              Fill out the form below and we&apos;ll get back to you within a few
              days.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border border-success/30 rounded-lg p-8 text-center"
              >
                <CheckCircle2
                  size={48}
                  className="text-success mx-auto mb-4"
                />
                <h3 className="font-mono text-text-primary font-bold text-lg mb-2">
                  Application Received!
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Thanks for applying to the Ambassador Program. We&apos;ll review
                  your application and get back to you soon.
                </p>
              </motion.div>
            ) : (
              <div className="bg-surface border border-border rounded-lg p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-mono text-sm text-text-secondary mb-1.5"
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

                  {/* Channel URL */}
                  <div>
                    <label
                      htmlFor="channelUrl"
                      className="block font-mono text-sm text-text-secondary mb-1.5"
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

                  {/* Platform */}
                  <div>
                    <label
                      htmlFor="platform"
                      className="block font-mono text-sm text-text-secondary mb-1.5"
                    >
                      Platform
                    </label>
                    <select
                      id="platform"
                      {...register("platform")}
                      className={`${inputClass} appearance-none cursor-pointer`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select your platform
                      </option>
                      {platforms.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    {errors.platform && (
                      <p className="text-red-400 text-xs mt-1 font-mono">
                        {errors.platform.message}
                      </p>
                    )}
                  </div>

                  {/* Follower Count */}
                  <div>
                    <label
                      htmlFor="followerCount"
                      className="block font-mono text-sm text-text-secondary mb-1.5"
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
                      className="block font-mono text-sm text-text-secondary mb-1.5"
                    >
                      Why would your audience benefit from the platform?
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
                    className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-sans font-semibold text-base px-6 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
