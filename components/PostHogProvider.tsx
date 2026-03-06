"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { POSTHOG_KEY, POSTHOG_HOST } from "@/lib/posthog-config";

export default function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      enable_heatmaps: true,
      enable_recording_console_log: true,
    });
  }, []);

  if (!POSTHOG_KEY) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export function PostHogIdentify() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !POSTHOG_KEY) return;

    posthog.identify(user.email, {
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      track: user.role === "Product Manager" ? "pm" : "developer",
    });
  }, [user]);

  return null;
}
