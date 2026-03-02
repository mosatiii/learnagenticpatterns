"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import ProgressBadge from "@/components/ProgressBadge";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "About", href: "/about" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-mono text-primary text-lg font-bold">
                {"$"}
              </span>
              <span className="font-mono text-text-primary text-sm tracking-tight">
                learnagenticpatterns
                <span className="text-primary animate-pulse">_</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {!isLoading && (
                user ? (
                  <div className="flex items-center gap-4">
                    <ProgressBadge />
                    <span className="font-mono text-xs text-text-secondary">
                      {user.firstName}
                    </span>
                  </div>
                ) : (
                  <Link
                    href="/#signup"
                    className="bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-5 py-2.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                  >
                    Sign Up Free
                  </Link>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-text-secondary hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 bg-surface/95 backdrop-blur-xl border-b border-border md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block font-mono text-sm text-text-secondary hover:text-primary transition-colors py-2"
                >
                  {">"} {link.label}
                </Link>
              ))}

              {!isLoading && (
                user ? (
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="font-mono text-xs text-text-secondary">
                      {user.firstName}
                    </span>
                    <ProgressBadge />
                  </div>
                ) : (
                  <Link
                    href="/#signup"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-5 py-2.5 rounded-md transition-all mt-4"
                  >
                    Sign Up Free
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
