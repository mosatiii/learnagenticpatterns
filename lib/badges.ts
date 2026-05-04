import { query } from "@/lib/db";

export interface BadgeDef {
  slug: string;
  name: string;
  description: string;
  /** Lucide icon name — resolved at render time. */
  icon: string;
  tier: "bronze" | "silver" | "gold";
}

export const BADGES: BadgeDef[] = [
  {
    slug: "first-step",
    name: "First Step",
    description: "Read your first pattern lesson.",
    icon: "BookOpen",
    tier: "bronze",
  },
  {
    slug: "five-patterns",
    name: "Pattern Explorer",
    description: "Read 5 pattern lessons.",
    icon: "Compass",
    tier: "bronze",
  },
  {
    slug: "ten-patterns",
    name: "Pattern Practitioner",
    description: "Read 10 pattern lessons.",
    icon: "Layers",
    tier: "silver",
  },
  {
    slug: "all-patterns",
    name: "Patterns Mastered",
    description: "Read all 21 pattern lessons.",
    icon: "Award",
    tier: "gold",
  },
  {
    slug: "first-game",
    name: "First Build",
    description: "Complete your first practice challenge.",
    icon: "Play",
    tier: "bronze",
  },
  {
    slug: "game-passed",
    name: "Architect",
    description: "Pass a practice challenge.",
    icon: "CheckCircle2",
    tier: "bronze",
  },
  {
    slug: "all-pm-games",
    name: "PM Operator",
    description: "Complete all 3 PM games.",
    icon: "Briefcase",
    tier: "silver",
  },
  {
    slug: "feedback-giver",
    name: "Helpful Voice",
    description: "Leave feedback on 3 lessons.",
    icon: "MessageCircle",
    tier: "bronze",
  },
  {
    slug: "day-7-returner",
    name: "Week One",
    description: "Return on day 7 after signing up.",
    icon: "CalendarCheck",
    tier: "silver",
  },
  {
    slug: "streak-7",
    name: "Streak 7",
    description: "Stay active 7 days in a row.",
    icon: "Flame",
    tier: "silver",
  },
  {
    slug: "streak-30",
    name: "Streak 30",
    description: "Stay active 30 days in a row.",
    icon: "Trophy",
    tier: "gold",
  },
];

// Must match the slugs the 3 PM games actually save under (see PMGameSection +
// each game's saveGameScore call). There are only 3 games, not 4.
const PM_GAME_SLUGS = ["pm-ship-or-skip", "pm-budget-builder", "pm-stakeholder-sim"];

interface UserStats {
  patternsRead: number;
  gamesPlayed: number;
  gamesPassed: number;
  pmGamesPassed: number;
  feedbackCount: number;
  daysSinceSignup: number;
  currentStreak: number;
}

export async function getUserStats(userId: number): Promise<UserStats> {
  const [patterns, games, gamesPassed, pmGames, feedback, signup, streakDays] = await Promise.all([
    query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM reading_progress WHERE user_id = $1`, [userId]),
    query<{ c: string }>(
      `SELECT COUNT(*)::text AS c FROM (
         SELECT id FROM game_scores      WHERE user_id = $1
         UNION ALL
         SELECT id FROM challenge_scores WHERE user_id = $1
       ) x`,
      [userId]
    ),
    query<{ c: string }>(
      `SELECT COUNT(*)::text AS c FROM (
         SELECT id FROM game_scores      WHERE user_id = $1 AND passed = TRUE
         UNION ALL
         SELECT id FROM challenge_scores WHERE user_id = $1 AND passed = TRUE
       ) x`,
      [userId]
    ),
    query<{ c: string }>(
      `SELECT COUNT(DISTINCT pattern_slug)::text AS c FROM (
         SELECT pattern_slug FROM game_scores      WHERE user_id = $1 AND passed = TRUE AND pattern_slug = ANY($2::text[])
         UNION ALL
         SELECT pattern_slug FROM challenge_scores WHERE user_id = $1 AND passed = TRUE AND pattern_slug = ANY($2::text[])
       ) x`,
      [userId, PM_GAME_SLUGS]
    ),
    query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM lesson_feedback WHERE user_id = $1`, [userId]),
    query<{ created_at: string }>(`SELECT created_at FROM users WHERE id = $1`, [userId]),
    query<{ d: string }>(
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
    ),
  ]);

  const daysSinceSignup = signup[0]
    ? Math.floor((Date.now() - new Date(signup[0].created_at).getTime()) / 86_400_000)
    : 0;

  const activeDays = streakDays.map((r) => r.d);
  let currentStreak = 0;
  if (activeDays.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let cursor = new Date(today);
    const todayIso = cursor.toISOString().slice(0, 10);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yIso = yesterday.toISOString().slice(0, 10);
    if (activeDays[0] !== todayIso && activeDays[0] !== yIso) {
      currentStreak = 0;
    } else {
      if (activeDays[0] === yIso) cursor = yesterday;
      const set = new Set(activeDays);
      while (set.has(cursor.toISOString().slice(0, 10))) {
        currentStreak += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
    }
  }

  return {
    patternsRead: parseInt(patterns[0]?.c ?? "0", 10),
    gamesPlayed: parseInt(games[0]?.c ?? "0", 10),
    gamesPassed: parseInt(gamesPassed[0]?.c ?? "0", 10),
    pmGamesPassed: parseInt(pmGames[0]?.c ?? "0", 10),
    feedbackCount: parseInt(feedback[0]?.c ?? "0", 10),
    daysSinceSignup,
    currentStreak,
  };
}

function meets(slug: string, s: UserStats): boolean {
  switch (slug) {
    case "first-step":      return s.patternsRead >= 1;
    case "five-patterns":   return s.patternsRead >= 5;
    case "ten-patterns":    return s.patternsRead >= 10;
    case "all-patterns":    return s.patternsRead >= 21;
    case "first-game":      return s.gamesPlayed >= 1;
    case "game-passed":     return s.gamesPassed >= 1;
    case "all-pm-games":    return s.pmGamesPassed >= 3;
    case "feedback-giver":  return s.feedbackCount >= 3;
    case "day-7-returner":  return s.daysSinceSignup >= 7 && s.currentStreak >= 1;
    case "streak-7":        return s.currentStreak >= 7;
    case "streak-30":       return s.currentStreak >= 30;
    default: return false;
  }
}

/**
 * Award any badges the user has newly qualified for. Returns the newly-earned
 * badges so callers can trigger emails or toasts.
 */
export async function evaluateAndAward(userId: number): Promise<BadgeDef[]> {
  const stats = await getUserStats(userId);
  const earnedRows = await query<{ badge_slug: string }>(
    `SELECT badge_slug FROM user_badges WHERE user_id = $1`,
    [userId]
  );
  const already = new Set(earnedRows.map((r) => r.badge_slug));
  const newly: BadgeDef[] = [];

  for (const def of BADGES) {
    if (already.has(def.slug)) continue;
    if (!meets(def.slug, stats)) continue;
    await query(
      `INSERT INTO user_badges (user_id, badge_slug)
       VALUES ($1, $2)
       ON CONFLICT (user_id, badge_slug) DO NOTHING`,
      [userId, def.slug]
    );
    newly.push(def);
  }
  return newly;
}

export async function getEarnedBadges(userId: number): Promise<{ slug: string; earned_at: string }[]> {
  return query<{ slug: string; earned_at: string }>(
    `SELECT badge_slug AS slug, earned_at FROM user_badges WHERE user_id = $1 ORDER BY earned_at DESC`,
    [userId]
  );
}
