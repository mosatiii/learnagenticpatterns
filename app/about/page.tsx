"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, ArrowRight, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

const education = [
  {
    degree: "Master of Business, Entrepreneurship & Technology (MBET)",
    school: "University of Waterloo",
    year: "2025",
    detail:
      "Interdisciplinary graduate program combining technology commercialization, entrepreneurial finance, scalable business models, and venture creation.",
  },
  {
    degree: "BSc. Software Engineering, Minor: Business Administration",
    school: "American University of Iraq, Sulaimani (AUIS)",
    year: "2024",
    detail:
      "Foundation in software architecture, algorithms, and systems design with a business perspective.",
  },
];

export default function AboutPage() {
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
              {">"} about_
            </span>
            <h1 className="font-mono text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
              The Story Behind{" "}
              <span className="text-gradient">This Curriculum</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-start gap-3"
            >
              <div className="w-32 h-32 rounded-full bg-surface border-2 border-primary/30 flex items-center justify-center">
                <span className="font-mono text-primary text-4xl font-bold">
                  M
                </span>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/mosatiii/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://github.com/mosatiii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
              </div>
            </motion.div>

            {/* Bio text */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-5 text-text-secondary leading-relaxed"
            >
              <p className="text-lg">
                Hi, I&apos;m{" "}
                <span className="text-text-primary font-semibold">
                  Mousa Al-Jawaheri
                </span>
                .
              </p>
              <p>
                I&apos;m a Technical Product Leader with a background in Software
                Engineering and a Master&apos;s (MBET) from the{" "}
                <span className="text-text-primary">University of Waterloo</span>.
                I specialize in bridging the gap between complex engineering
                architectures and scalable product-market fit.
              </p>
              <p>
                My current focus is deeply rooted in{" "}
                <span className="text-primary font-mono">
                  Agentic Design Patterns
                </span>
                ,{" "}
                <span className="text-primary font-mono">
                  multi-agent orchestration
                </span>
                , and{" "}
                <span className="text-primary font-mono">
                  autonomous workflows
                </span>{" "}
                to modernize legacy B2B and SaaS industries with AI-native
                architectures.
              </p>
              <p>
                As a Product Manager, I&apos;ve scaled platforms by 70% in DAUs
                and led the transition of rule-based business logic into
                autonomous AI workflows. I&apos;ve shipped AI-integrated products,
                managed cross-functional squads, and driven
                &ldquo;Service-to-Product&rdquo; transformations.
              </p>
              <p>
                When I saw senior engineers, people who&apos;ve built production
                systems at scale, struggle with Agentic AI because the vocabulary
                felt alien, I knew the gap wasn&apos;t skill. It was framing.{" "}
                <span className="text-primary font-mono">Prompt Chaining</span> is{" "}
                <span className="text-text-primary">Pipe &amp; Filter</span>.{" "}
                <span className="text-primary font-mono">Multi-Agent Collaboration</span>{" "}
                is <span className="text-text-primary">Microservices</span>.{" "}
                <span className="text-primary font-mono">Reflection</span> is{" "}
                <span className="text-text-primary">TDD</span>.
              </p>
              <p>
                This curriculum is my attempt to give senior developers the mental
                model that makes agentic AI click by mapping every new concept to
                something they already know deeply.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-16 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Education" decorator="ref" centered={false} />
          <div className="space-y-6">
            {education.map((edu, i) => (
              <motion.div
                key={edu.school}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-border rounded-lg p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-mono text-text-primary font-bold text-sm">
                      {edu.degree}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <span className="text-primary font-mono text-xs">
                        {edu.school}
                      </span>
                      <span className="text-text-secondary text-xs font-mono">
                        · {edu.year}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {edu.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 bg-surface border border-border rounded-lg p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Award size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-mono text-text-primary font-bold text-sm mb-3">
                  Certifications
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1">
                    CSPO® · Scrum Alliance, 2025
                  </span>
                  <span className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1">
                    PMC™ · BrainStation Toronto, 2024
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Projects */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Technical Projects & Research"
            decorator=">"
            centered={false}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface border border-border rounded-lg p-6 hover:border-primary/30 transition-all"
            >
              <h3 className="font-mono text-primary text-sm font-bold mb-2">
                Multi-Agent Systems
              </h3>
              <p className="font-mono text-text-primary text-xs mb-3">
                AI-Powered Code Review, Writing &amp; Lead Generation
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Building autonomous multi-agent workflows for real-world use cases
                from AI code reviewers that catch bugs before humans do, to
                content generation pipelines and intelligent lead qualification
                systems. Shipped by{" "}
                <a
                  href="https://www.prompted.software/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Prompted Studio
                </a>
                .
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-surface border border-accent/30 rounded-lg p-6 border-glow"
            >
              <h3 className="font-mono text-accent text-sm font-bold mb-2">
                Agentic Design Curriculum
              </h3>
              <p className="font-mono text-text-primary text-xs mb-3">
                You&apos;re looking at it.
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                A comprehensive curriculum on Agentic Design Patterns and Model
                Context Protocol (MCP), teaching developers how to build
                production-grade AI agents by mapping 21 patterns to SWE concepts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="The Mission" decorator="→" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-surface border border-border rounded-lg p-8 space-y-4 text-text-secondary leading-relaxed"
          >
            <p>
              Help senior developers overcome the fear and ambiguity around
              Agentic AI by mapping 21 agentic design patterns back to the
              Software Engineering concepts they already master.
            </p>
            <p>
              No hype. No buzzwords. No &ldquo;just use this framework.&rdquo;
              Instead: a systematic, pattern-by-pattern curriculum that treats AI
              agents as engineering constructs with architectures, trade-offs,
              and production considerations, just like every other system
              you&apos;ve built.
            </p>
            <p>
              By the end, you won&apos;t just understand agentic AI. You&apos;ll
              be able to architect it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Acknowledgment */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Standing on Shoulders" decorator="ref" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-surface border border-border rounded-lg p-8 text-text-secondary leading-relaxed"
          >
            <p className="mb-4">
              This curriculum is inspired by and builds upon the framework
              established in{" "}
              <span className="text-text-primary font-semibold italic">
                &ldquo;Agentic Design Patterns: A Hands-On Guide to Building
                Intelligent Systems&rdquo;
              </span>{" "}
              by{" "}
              <span className="text-primary">Antonio Gull&iacute;</span>, an
              Engineering Leader at Google, alongside insights from{" "}
              <span className="text-text-primary font-semibold italic">
                AI Engineering
              </span>{" "}
              by Chip Huyen.
            </p>
            <p>
              Their work provided the foundational taxonomy of agentic patterns
              and the engineering rigor needed to evaluate AI systems. This
              curriculum extends that foundation by creating explicit bridges
              between each pattern and its Software Engineering parallel, making
              the concepts immediately accessible to developers who think in
              architectural terms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sign Up CTA */}
      <section className="py-24 bg-code-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            title="Sign Up Free: Unlock All 21 Patterns"
            subtitle="No credit card. No catch. Instant access to every pattern, code example, and architecture diagram."
            decorator="→"
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              Create Free Account
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium text-base px-8 py-3.5 rounded-md transition-all"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
