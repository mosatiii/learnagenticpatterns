"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MAIN_DOMAIN = "https://learnagenticpatterns.com";

const allFooterLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Blog", href: "/blog" },
  { label: "Career Guide", href: "/guide/from-software-engineer-to-agentic-architect" },
  { label: "About", href: "/about" },
  { label: "Ambassador", href: "/ambassador" },
  { label: "Sign Up", href: "/signup" },
];

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/mosatiii/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/mosatiii", label: "GitHub" },
];

export default function Footer() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOnSubdomain, setIsOnSubdomain] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    setIsOnSubdomain(host === "practice.learnagenticpatterns.com" || host.startsWith("practice."));
  }, []);

  const isPractice = isOnSubdomain || pathname === "/practice" || pathname.startsWith("/practice/");

  const footerLinks = user
    ? allFooterLinks.filter((link) => link.href !== "/signup")
    : allFooterLinks;

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-primary text-lg font-bold">
                {"$"}
              </span>
              <span className="font-mono text-text-primary text-sm">
                learnagenticpatterns.com
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              21 Agentic Design Patterns · Code Examples · Interactive Exercises
            </p>
            <div className="flex items-center gap-1 mt-4 text-xs text-text-secondary font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
              All 21 patterns live
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-sm text-primary mb-4">{">"} Navigation</h4>
            <div className="space-y-2">
              {footerLinks.map((link) => {
                const href = isPractice && !link.href.startsWith("/practice")
                  ? `${MAIN_DOMAIN}${link.href}`
                  : link.href;
                const isExternal = href.startsWith("http");

                if (isExternal) {
                  return (
                    <a
                      key={link.label}
                      href={href}
                      className="block text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={href}
                    className="block text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-mono text-sm text-primary mb-4">{">"} Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="circuit-line my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>© 2026 learnagenticpatterns.com</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
          <p>
            Based on &ldquo;Agentic Design Patterns&rdquo; by Antonio Gull&iacute;
          </p>
        </div>
      </div>
    </footer>
  );
}
