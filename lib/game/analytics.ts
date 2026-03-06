/**
 * Centralized PostHog event tracking for all Agent Builder games.
 * Every game interaction flows through here so we have a single
 * place to enable, disable, or enrich analytics.
 */

import posthog from "posthog-js";
import { POSTHOG_KEY } from "@/lib/posthog-config";

export function trackGameEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
) {
  if (typeof window === "undefined" || !POSTHOG_KEY) return;
  posthog.capture(eventName, properties);
}
