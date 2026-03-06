"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, Trophy, Blocks, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const MAIN_DOMAIN = "https://learnagenticpatterns.com";
const PRACTICE_DOMAIN = "https://practice.learnagenticpatterns.com";

const navLinks = [
  { label: "Patterns", href: "/patterns", icon: Blocks },
  { label: "PM Labs", href: "/pm", icon: Briefcase },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

export default function PracticeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "/practice";
    const normalizedPath = pathname.replace(/^\/practice/, "");
    return normalizedPath.startsWith(href);
  };

  const resolveHref = (href: string) => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const isSubdomain = host === "practice.learnagenticpatterns.com" || host.startsWith("practice.");
      if (isSubdomain) return href;
    }
    return `/practice${href}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-primary/10 shadow-lg shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={resolveHref("/")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
              <Blocks size={16} className="text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-text-primary tracking-tight">
                practice<span className="text-accent">.</span>
              </span>
              <span className="font-mono text-[9px] text-text-secondary -mt-1 hidden sm:block">
                learnagenticpatterns
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={resolveHref(link.href)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                    active
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
                  }`}
                >
                  <Icon size={14} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth section */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-20 h-8 bg-surface/50 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="font-mono text-xs text-accent font-bold">
                      {user.firstName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-text-primary hidden sm:inline">
                    {user.firstName}
                  </span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl shadow-black/20 overflow-hidden"
                    >
                      <Link
                        href={resolveHref("/profile")}
                        className="flex items-center gap-2 px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-primary/5 transition-colors font-mono text-xs"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={14} />
                        Profile
                      </Link>
                      <Link
                        href={MAIN_DOMAIN}
                        className="flex items-center gap-2 px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-primary/5 transition-colors font-mono text-xs border-t border-border/50"
                      >
                        <Blocks size={14} />
                        Back to Learn
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors font-mono text-xs border-t border-border/50"
                      >
                        <LogOut size={14} />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={`${MAIN_DOMAIN}/login`}
                  className="font-mono text-xs text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5"
                >
                  Log In
                </Link>
                <Link
                  href={`${MAIN_DOMAIN}/signup`}
                  className="font-mono text-xs bg-accent hover:bg-accent/90 text-white px-4 py-1.5 rounded-lg transition-colors"
                >
                  Sign Up Free
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={resolveHref(link.href)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg font-mono text-sm transition-all ${
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
