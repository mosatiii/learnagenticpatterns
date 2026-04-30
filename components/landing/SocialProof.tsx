"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Linkedin } from "lucide-react";

export default function SocialProof() {
  return (
    <section className="py-16 bg-surface/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center font-mono text-xs uppercase tracking-wider text-text-secondary/60 mb-6">
          {">"} What people are saying
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {/* Antonio Gulli LinkedIn comment screenshot */}
          <motion.a
            href="https://www.linkedin.com/in/searchguy/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group block md:col-span-2 bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-code-bg/50">
              <div className="flex items-center gap-2">
                <Linkedin size={14} className="text-[#0A66C2]" />
                <span className="font-mono text-[11px] text-text-secondary uppercase tracking-wider">
                  LinkedIn comment
                </span>
              </div>
              <span className="font-mono text-[10px] text-text-secondary/60">
                from the author of the book this is based on
              </span>
            </div>
            <div className="relative aspect-[1084/1140] bg-code-bg">
              <Image
                src="/social-proof/antonio-gulli-comment.png"
                alt="Antonio Gulli, Google Sr Director and author of Agentic Design Patterns, commenting 'this is cool' on the launch post for learnagenticpatterns.com"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority={false}
              />
            </div>
          </motion.a>

          {/* Side stats / context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-surface border border-accent/30 rounded-xl p-5 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent mb-2">
                Antonio Gull&iacute;
              </p>
              <p className="text-text-primary text-sm font-bold leading-snug mb-1">
                Sr Director, Distinguished Engineer, CTO at Google
              </p>
              <p className="text-text-secondary text-xs leading-relaxed">
                Author of &ldquo;Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems.&rdquo; The 21 patterns this curriculum is built on.
              </p>
            </div>
            <div className="bg-surface border border-primary/30 rounded-xl p-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-primary mb-2">
                Open source
              </p>
              <p className="text-text-primary text-sm font-bold leading-snug mb-1">
                Inspect the code, fork it, contribute.
              </p>
              <a
                href="https://github.com/mosatiii/learnagenticpatterns"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline mt-1"
              >
                github.com/mosatiii/learnagenticpatterns &rarr;
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
