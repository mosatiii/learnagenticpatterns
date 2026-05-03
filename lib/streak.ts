import { query } from "@/lib/db";

export interface StreakInfo {
  current: number;
  longest: number;
  lastActivityDay: string | null;
  /** True when last activity is today; false if yesterday or older. */
  activeToday: boolean;
}

function isoDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function computeStreak(userId: number): Promise<StreakInfo> {
  const rows = await query<{ d: string }>(
    `WITH activity AS (
       SELECT DATE(read_at)    AS day FROM reading_progress  WHERE user_id = $1
       UNION
       SELECT DATE(played_at)  AS day FROM game_scores       WHERE user_id = $1
       UNION
       SELECT DATE(played_at)  AS day FROM challenge_scores  WHERE user_id = $1
       UNION
       SELECT DATE(created_at) AS day FROM lesson_feedback   WHERE user_id = $1
     )
     SELECT day::text AS d FROM activity ORDER BY day DESC`,
    [userId]
  );

  if (rows.length === 0) {
    return { current: 0, longest: 0, lastActivityDay: null, activeToday: false };
  }

  const days = rows.map((r) => r.d);
  const set = new Set(days);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = isoDay(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yIso = isoDay(yesterday);

  let current = 0;
  if (set.has(todayIso) || set.has(yIso)) {
    const cursor = set.has(todayIso) ? new Date(today) : new Date(yesterday);
    while (set.has(isoDay(cursor))) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  let longest = 0;
  let run = 1;
  const sortedAsc = [...set].sort();
  for (let i = 1; i < sortedAsc.length; i++) {
    const prev = new Date(sortedAsc[i - 1]);
    const cur = new Date(sortedAsc[i]);
    const gap = Math.round((cur.getTime() - prev.getTime()) / 86_400_000);
    if (gap === 1) run += 1;
    else { longest = Math.max(longest, run); run = 1; }
  }
  longest = Math.max(longest, run, current);

  return {
    current,
    longest,
    lastActivityDay: days[0],
    activeToday: days[0] === todayIso,
  };
}
