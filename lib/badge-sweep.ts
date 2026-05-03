import { query } from "@/lib/db";
import { evaluateAndAward } from "@/lib/badges";
import { sendBadgeEarnedEmails } from "@/lib/badge-mailer";

interface SweepResult {
  scanned: number;
  awarded: number;
  emailed: number;
}

/**
 * Evaluate badges for every user with any activity in the last N days.
 * Awards new badges and sends emails (idempotent via email_sends).
 */
export async function runBadgeSweep(withinDays: number = 7): Promise<SweepResult> {
  const result: SweepResult = { scanned: 0, awarded: 0, emailed: 0 };

  const userRows = await query<{ id: number }>(
    `SELECT DISTINCT user_id AS id FROM (
       SELECT user_id, read_at    AS t FROM reading_progress  WHERE read_at    > NOW() - ($1::int * INTERVAL '1 day')
       UNION ALL
       SELECT user_id, played_at  AS t FROM game_scores       WHERE played_at  > NOW() - ($1::int * INTERVAL '1 day')
       UNION ALL
       SELECT user_id, played_at  AS t FROM challenge_scores  WHERE played_at  > NOW() - ($1::int * INTERVAL '1 day')
       UNION ALL
       SELECT user_id, created_at AS t FROM lesson_feedback   WHERE created_at > NOW() - ($1::int * INTERVAL '1 day')
     ) x WHERE user_id IS NOT NULL`,
    [withinDays]
  );

  result.scanned = userRows.length;
  for (const u of userRows) {
    try {
      const newly = await evaluateAndAward(u.id);
      if (newly.length > 0) {
        result.awarded += newly.length;
        await sendBadgeEarnedEmails(u.id, newly);
        result.emailed += newly.length;
      }
    } catch (err) {
      console.error(`badge sweep failed for user ${u.id}:`, err);
    }
  }
  return result;
}
