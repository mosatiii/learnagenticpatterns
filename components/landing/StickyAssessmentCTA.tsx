"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function StickyAssessmentCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show after scrolling past 40% of viewport height
      setVisible(window.scrollY > window.innerHeight * 0.4);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Link
            href="/assessment"
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-6 py-3 rounded-full shadow-xl shadow-accent/25 transition-all hover:shadow-2xl hover:shadow-accent/30 hover:scale-105"
          >
            <Sparkles size={16} />
            Will AI Replace Me?
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
