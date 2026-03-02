"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language = "typescript",
  title,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-code-bg">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface/50 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/40" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
            <span className="w-3 h-3 rounded-full bg-green-500/40" />
          </div>
          {title && (
            <span className="font-mono text-xs text-text-secondary ml-2">
              {title}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors text-xs font-mono"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} className="text-success" />
              Copied ✓
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className={`language-${language}`}>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="select-none text-text-secondary/30 text-right w-8 mr-4 flex-shrink-0 font-mono">
                    {i + 1}
                  </span>
                )}
                <span className="text-text-primary font-code whitespace-pre">
                  {highlightSyntax(line)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function highlightSyntax(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const rules = [
    { pattern: /(\/\/.*)/, className: "text-text-secondary/60 italic" },
    { pattern: /(["'`].*?["'`])/, className: "text-success" },
    {
      pattern:
        /\b(const|let|var|function|async|await|return|if|else|switch|case|for|while|new|import|export|default|class|extends|throw|try|catch|break)\b/,
      className: "text-purple-400",
    },
    { pattern: /\b(true|false|null|undefined|this)\b/, className: "text-accent" },
    { pattern: /\b(\d+)\b/, className: "text-accent" },
  ];

  // Simple single-pass highlighting
  if (remaining.trimStart().startsWith("//")) {
    return (
      <span key={key} className="text-text-secondary/60 italic">
        {remaining}
      </span>
    );
  }

  // Check for string content
  const stringMatch = remaining.match(/(["'`])/);
  if (!stringMatch) {
    return highlightKeywords(remaining);
  }

  return highlightKeywords(remaining);
}

function highlightKeywords(text: string): React.ReactNode {
  const keywords =
    /\b(const|let|var|function|async|await|return|if|else|switch|case|for|while|new|import|export|default|class|extends|throw|try|catch|type|interface|break)\b/g;

  const parts = text.split(keywords);

  return parts.map((part, i) => {
    if (
      part.match(
        /^(const|let|var|function|async|await|return|if|else|switch|case|for|while|new|import|export|default|class|extends|throw|try|catch|type|interface|break)$/
      )
    ) {
      return (
        <span key={i} className="text-purple-400">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
