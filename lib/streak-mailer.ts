import { Resend } from "resend";
import { query } from "@/lib/db";
import { streakReminderEmail } from "@/lib/email-templates";
import {
  alreadySent, getPreferences, recordSend, siteOrigin, unsubscribeUrl,
} from "@/lib/email-prefs";
import { computeStreak } from "@/lib/streak";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "Mousa <mousa@learnagenticpatterns.com>";

interface CandidateRow {
  id: number;
  email: string;
  first_name: string;
}

interface RunResult {
  considered: number;
  sent: number;
  skipped: number;
}

/**
 * Find users with an active streak (≥2 days) whose last activity was yesterday
 * (i.e., they're at risk of breaking the streak today) and email them once.
 * Idempotent — won't double-send within 20 hours.
 */
export async function runStreakReminders(): Promise<RunResult> {
  const result: RunResult = { considered: 0, sent: 0, skipped: 0 };
  if (!resend) return result;

  // Candidates: had any activity yesterday but none today.
  const candidates = await query<CandidateRow>(
    `WITH activity AS (
       SELECT user_id, DATE(read_at)    AS day FROM reading_progress
       UNION
       SELECT user_id, DATE(played_at)  AS day FROM game_scores
       UNION
       SELECT user_id, DATE(played_at)  AS day FROM challenge_scores
       UNION
       SELECT user_id, DATE(created_at) AS day FROM lesson_feedback
     )
     SELECT u.id, u.email, u.first_name
     FROM users u
     WHERE EXISTS (SELECT 1 FROM activity a WHERE a.user_id = u.id AND a.day = CURRENT_DATE - 1)
       AND NOT EXISTS (SELECT 1 FROM activity a WHERE a.user_id = u.id AND a.day = CURRENT_DATE)`
  );

  result.considered = candidates.length;

  for (const c of candidates) {
    const prefs = await getPreferences(c.id);
    if (!prefs.streak) { result.skipped += 1; continue; }
    if (await alreadySent(c.id, "streak", 20)) { result.skipped += 1; continue; }

    const streak = await computeStreak(c.id);
    if (streak.current < 2) { result.skipped += 1; continue; }

    const html = streakReminderEmail({
      firstName: c.first_name,
      currentStreak: streak.current,
      ctaUrl: `${siteOrigin()}/practice`,
      unsubUrl: unsubscribeUrl(c.id, "streak"),
    });

    try {
      await resend.emails.send({
        from: FROM,
        to: c.email,
        subject: `🔥 Don't break your ${streak.current}-day streak`,
        html,
      });
      await recordSend(c.id, "streak", { streak: streak.current });
      result.sent += 1;
    } catch (err) {
      console.error("streak email send failed:", err);
      result.skipped += 1;
    }
  }
  return result;
}
