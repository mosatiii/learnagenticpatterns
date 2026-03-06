"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProgressBadge from "@/components/ProgressBadge";
import { useAuth } from "@/contexts/AuthContext";

const MAIN_DOMAIN = "https://learnagenticpatterns.com";

const mainNavLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Blog", href: "/blog" },
  { label: "Assessment", href: "/assessment" },
  { label: "About", href: "/about" },
];

const practiceNavLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: `${MAIN_DOMAIN}/#curriculum` },
  { label: "Blog", href: `${MAIN_DOMAIN}/blog` },
  { label: "Assessment", href: `${MAIN_DOMAIN}/assessment` },
  { label: "About", href: `${MAIN_DOMAIN}/about` },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isOnSubdomain, setIsOnSubdomain] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    setIsOnSubdomain(host === "practice.learnagenticpatterns.com" || host.startsWith("practice."));
  }, []);

  const isPractice = isOnSubdomain || pathname === "/practice" || pathname.startsWith("/practice/");
  const baseLinks = isPractice ? practiceNavLinks : mainNavLinks;
  const navLinks = user
    ? baseLinks.filter((link) => link.label !== "Assessment" && link.label !== "Curriculum" && link.label !== "About")
    : baseLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
                {isPractice ? "practice." : ""}learnagenticpatterns
                <span className="text-primary animate-pulse">_</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isExternal = link.href.startsWith("http");
                const Tag = isExternal ? "a" : Link;
                return (
                  <Tag
                    key={link.href}
                    href={link.href}
                    className="font-mono text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Tag>
                );
              })}

              {!isLoading && (
                user ? (
                  <div className="flex items-center gap-4">
                    <ProgressBadge />

                    {/* User dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-surface border border-transparent hover:border-border"
                      >
                        <User size={14} />
                        {user.firstName}
                      </button>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl overflow-hidden"
                          >
                            <div className="px-4 py-3 border-b border-border">
                              <p className="font-mono text-xs text-text-primary font-bold truncate">
                                {user.firstName}
                              </p>
                              <p className="font-mono text-xs text-text-secondary truncate">
                                {user.email}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setDropdownOpen(false);
                                logout();
                              }}
                              className="w-full flex items-center gap-2 px-4 py-3 text-left font-mono text-xs text-text-secondary hover:text-red-400 hover:bg-red-500/5 transition-colors"
                            >
                              <LogOut size={14} />
                              Log out
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {isPractice ? (
                      <>
                        <a
                          href={`${MAIN_DOMAIN}/login`}
                          className="font-mono text-sm text-text-secondary hover:text-primary transition-colors"
                        >
                          Log In
                        </a>
                        <a
                          href={`${MAIN_DOMAIN}/signup`}
                          className="bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-5 py-2.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                        >
                          Sign Up Free
                        </a>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="font-mono text-sm text-text-secondary hover:text-primary transition-colors"
                        >
                          Log In
                        </Link>
                        <Link
                          href="/signup"
                          className="bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-5 py-2.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
                        >
                          Sign Up Free
                        </Link>
                      </>
                    )}
                  </div>
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
              {navLinks.map((link) => {
                const isExternal = link.href.startsWith("http");
                const Tag = isExternal ? "a" : Link;
                return (
                  <Tag
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block font-mono text-sm text-text-secondary hover:text-primary transition-colors py-2"
                  >
                    {">"} {link.label}
                  </Tag>
                );
              })}

              {!isLoading && (
                user ? (
                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-text-secondary" />
                        <span className="font-mono text-xs text-text-primary">
                          {user.firstName}
                        </span>
                      </div>
                      <ProgressBadge />
                    </div>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-red-400 transition-colors py-2"
                    >
                      <LogOut size={14} />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-border space-y-3">
                    {isPractice ? (
                      <>
                        <a
                          href={`${MAIN_DOMAIN}/login`}
                          onClick={() => setMobileOpen(false)}
                          className="block w-full text-center border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-semibold text-sm px-5 py-2.5 rounded-md transition-all"
                        >
                          Log In
                        </a>
                        <a
                          href={`${MAIN_DOMAIN}/signup`}
                          onClick={() => setMobileOpen(false)}
                          className="block w-full text-center bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-5 py-2.5 rounded-md transition-all"
                        >
                          Sign Up Free
                        </a>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setMobileOpen(false)}
                          className="block w-full text-center border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-semibold text-sm px-5 py-2.5 rounded-md transition-all"
                        >
                          Log In
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setMobileOpen(false)}
                          className="block w-full text-center bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-5 py-2.5 rounded-md transition-all"
                        >
                          Sign Up Free
                        </Link>
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
