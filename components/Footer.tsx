import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Blog", href: "/blog" },
  { label: "Practice", href: "/practice" },
  { label: "Free Cheat Sheet", href: "/agentic-ai-design-patterns-cheatsheet" },
  { label: "Career Guide", href: "/guide/from-software-engineer-to-agentic-architect" },
  { label: "About", href: "/about" },
  { label: "Sign Up", href: "/signup" },
];

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/mosatiii/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/mosatiii", label: "GitHub" },
];

export default function Footer() {
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
              Where Senior Developers Become Agentic Architects
            </p>
            <div className="flex items-center gap-1 mt-4 text-xs text-text-secondary font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
              Curriculum in development
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-sm text-primary mb-4">{">"} Navigation</h4>
            <div className="space-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
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

        {/* CTA banner */}
        <div className="my-8 bg-code-bg border border-border rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-text-primary font-semibold">
              Want to build your own AI agents?
            </p>
            <p className="text-text-secondary text-xs mt-1">
              We help teams ship AI-powered products, fast.
            </p>
          </div>
          <a
            href="https://www.prompted.software/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-5 py-2.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20 whitespace-nowrap"
          >
            Talk to Prompted Studio →
          </a>
        </div>

        <div className="circuit-line my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>
            © 2026 learnagenticpatterns.com · Built by{" "}
            <a
              href="https://www.prompted.software/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Prompted Studio
            </a>
          </p>
          <p>
            Based on &ldquo;Agentic Design Patterns&rdquo; by Antonio Gull&iacute;
          </p>
        </div>
      </div>
    </footer>
  );
}
