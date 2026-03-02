"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <div className="text-center px-4">
          <h1
            style={{
              fontFamily: "monospace",
              color: "#00D4FF",
              fontSize: 48,
              marginBottom: 16,
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: "#8B95A5", fontSize: 16, marginBottom: 32 }}>
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#FF6B35",
              color: "#fff",
              border: "none",
              padding: "12px 32px",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
