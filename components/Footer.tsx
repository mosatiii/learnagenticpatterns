import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "About", href: "/about" },
  { label: "Sign Up", href: "/signup" },
];

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
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

        <div className="circuit-line my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>© 2025 learnagenticpatterns.com · Built by Mousa Al-Jawaheri</p>
          <p>
            Based on &ldquo;Agentic Design Patterns&rdquo; by Antonio Gull&iacute;
          </p>
        </div>
      </div>
    </footer>
  );
}
