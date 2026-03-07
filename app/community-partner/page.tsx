"use client";

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
} from "lucide-react";
import Link from "next/link";

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
            <Link
              href="/ambassador#apply"
              onClick={() => {
                if (typeof window !== "undefined" && POSTHOG_KEY) {
                  posthog.capture("community_partner_apply_clicked", { location: "hero" });
                }
              }}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-7 py-3 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20 mt-8"
            >
              Apply Now <ArrowRight size={16} />
            </Link>
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
              Every partner gets a searchable profile on our{" "}
              <Link
                href="/featured-ambassadors"
                className="text-primary hover:underline font-mono"
              >
                Featured Ambassadors
              </Link>{" "}
              page — visible to every learner on the platform.
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
      <section className="py-16 bg-surface/30">
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

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-mono text-2xl md:text-3xl text-text-primary font-bold mb-4">
              Ready to Join?
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Fill out our short application form and we&apos;ll reach out within
              a few days to get you set up as a Featured Partner.
            </p>
            <Link
              href="/ambassador#apply"
              onClick={() => {
                if (typeof window !== "undefined" && POSTHOG_KEY) {
                  posthog.capture("community_partner_apply_clicked", { location: "bottom_cta" });
                }
              }}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-7 py-3 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              Apply Now <ArrowRight size={16} />
            </Link>
            <p className="text-text-secondary/50 text-xs font-mono mt-4">
              No commitment — just tell us about your channel
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
