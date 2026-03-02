"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (!key) return;

    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      // Heatmaps and session recordings
      enable_heatmaps: true,
      enable_recording_console_log: true,
    });
  }, []);

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

/**
 * Identifies the user in PostHog once they sign in,
 * so analytics are tied to their email.
 */
export function PostHogIdentify() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.identify(user.email, {
      firstName: user.firstName,
      email: user.email,
    });
  }, [user]);

  return null;
}
