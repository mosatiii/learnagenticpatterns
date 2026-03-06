import { PostHog } from "posthog-node";
import { POSTHOG_KEY, POSTHOG_HOST } from "./posthog-config";

let posthogServerClient: PostHog | null = null;

export function getPostHogServerClient(): PostHog {
  if (!posthogServerClient) {
    posthogServerClient = new PostHog(POSTHOG_KEY, {
      host: POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogServerClient;
}
