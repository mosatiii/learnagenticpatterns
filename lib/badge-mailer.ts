import { Resend } from "resend";
import { query } from "@/lib/db";
import { badgeEarnedEmail } from "@/lib/email-templates";
import {
  alreadySent, getPreferences, recordSend, siteOrigin, unsubscribeUrl,
} from "@/lib/email-prefs";
import type { BadgeDef } from "@/lib/badges";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "Mousa <mousa@learnagenticpatterns.com>";

/** Email each newly-earned badge, idempotent per (user, badge). */
export async function sendBadgeEarnedEmails(userId: number, badges: BadgeDef[]): Promise<void> {
  if (!resend || badges.length === 0) return;

  const prefs = await getPreferences(userId);
  if (!prefs.badge) return;

  const userRows = await query<{ email: string; first_name: string }>(
    `SELECT email, first_name FROM users WHERE id = $1`,
    [userId]
  );
  const user = userRows[0];
  if (!user) return;

  for (const b of badges) {
    const kind = `badge:${b.slug}`;
    if (await alreadySent(userId, kind, 24 * 365)) continue;

    const html = badgeEarnedEmail({
      firstName: user.first_name,
      badgeName: b.name,
      badgeDescription: b.description,
      ctaUrl: `${siteOrigin()}/practice/profile`,
      unsubUrl: unsubscribeUrl(userId, "badge"),
    });

    try {
      await resend.emails.send({
        from: FROM,
        to: user.email,
        subject: `You earned: ${b.name}`,
        html,
      });
      await recordSend(userId, kind, { badgeSlug: b.slug });
    } catch (err) {
      console.error("badge email send failed:", err);
    }
  }
}
