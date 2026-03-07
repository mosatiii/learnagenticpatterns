export interface Ambassador {
  name: string;
  platform: "YouTube" | "TikTok" | "Instagram" | "LinkedIn" | "Other";
  channelName: string;
  channelUrl: string;
  topics: string[];
  bio: string;
  tier: "partner" | "ambassador";
}

/**
 * Add new ambassadors here. The featured-ambassadors page reads from
 * this array — no other file changes needed.
 *
 * `tier`:
 *   - "ambassador" = paid video creators
 *   - "partner"    = community partners (featured badge, no payout)
 */
export const ambassadors: Ambassador[] = [
  // Example — replace with real ambassadors as they publish:
  //
  // {
  //   name: "Jane Doe",
  //   platform: "YouTube",
  //   channelName: "@janedoe-ai",
  //   channelUrl: "https://youtube.com/@janedoe-ai",
  //   topics: ["AI", "No-Code"],
  //   bio: "Teaching AI to non-technical founders.",
  //   tier: "ambassador",
  // },
];
