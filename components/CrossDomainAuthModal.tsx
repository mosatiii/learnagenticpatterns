"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AUTO_DISMISS_MS = 5000;
const LOGIN_URL = "https://learnagenticpatterns.com/login?from=practice&switchAccount=true";

export default function CrossDomainAuthModal() {
  const { user, crossDomainAutoLogin, dismissAutoLogin, logout } = useAuth();
  const [progress, setProgress] = useState(0);

  // Animate the progress bar and auto-dismiss after 5 seconds
  useEffect(() => {
    if (!crossDomainAutoLogin || !user) return;

    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / AUTO_DISMISS_MS) * 100, 100);
      setProgress(pct);
      if (elapsed >= AUTO_DISMISS_MS) {
        dismissAutoLogin();
      } else {
        frame = requestAnimationFrame(tick);
      }
    };
    let frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [crossDomainAutoLogin, user, dismissAutoLogin]);

  const handleDifferentAccount = () => {
    logout();
    dismissAutoLogin();
    window.location.href = LOGIN_URL;
  };

  if (!crossDomainAutoLogin || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-sm mx-4 bg-surface border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/30"
        >
          {/* Progress bar at the top */}
          <div className="h-1 bg-border">
            <div
              className="h-full bg-accent transition-[width] duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-text-primary font-semibold text-sm">
                  Signed in automatically
                </p>
                <p className="text-text-secondary text-xs font-mono">
                  via learnagenticpatterns.com
                </p>
              </div>
            </div>

            <div className="bg-code-bg border border-border rounded-lg p-3 mb-5">
              <p className="text-text-primary text-sm font-medium">
                {user.firstName}
              </p>
              <p className="text-text-secondary text-xs font-mono">
                {user.email}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={dismissAutoLogin}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-mono text-sm px-4 py-2.5 rounded-lg transition-colors"
              >
                Continue as {user.firstName}
                <ArrowRight size={14} />
              </button>

              <button
                onClick={handleDifferentAccount}
                className="w-full flex items-center justify-center gap-2 text-text-secondary hover:text-text-primary font-mono text-xs px-4 py-2 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <LogOut size={12} />
                Use a different account
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
