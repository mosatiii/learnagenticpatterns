"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-code-bg border-b border-border">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="font-mono text-xs text-text-secondary ml-2">
              terminal
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-6 font-mono text-sm space-y-3">
            <div className="text-text-secondary">
              <span className="text-primary">$</span> navigate /patterns/unknown
            </div>
            <div className="text-red-400">
              Error 404: Pattern not found.
            </div>
            <div className="text-text-secondary">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </div>
            <div className="pt-4 border-t border-border/50">
              <span className="text-primary">$</span>{" "}
              <Link
                href="/"
                className="text-success hover:underline"
              >
                cd /home →
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-text-secondary/60 text-xs mt-6 font-mono">
          learnagenticpatterns.com
        </p>
      </motion.div>
    </main>
  );
}
