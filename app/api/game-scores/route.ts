import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/jwt";
import { isValidSlug } from "@/lib/valid-slugs";
import { evaluateAndAward } from "@/lib/badges";
import { sendBadgeEarnedEmails } from "@/lib/badge-mailer";

interface ScoreRow {
  pattern_slug: string;
  score_total: number;
  score_max: number;
  architecture: number;
  resilience: number;
  efficiency: number;
  passed: boolean;
  played_at: string;
}

interface LeaderboardRow {
  first_name: string;
  avg_percent: number;
  games_played: number;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }

    const scores = await query<ScoreRow>(
      `SELECT gs.pattern_slug, gs.score_total, gs.score_max,
              gs.architecture, gs.resilience, gs.efficiency,
              gs.passed, gs.played_at
       FROM game_scores gs
       WHERE gs.user_id = $1
       ORDER BY gs.played_at DESC`,
      [auth.userId],
    );

    const bestByPattern = new Map<string, ScoreRow>();
    for (const row of scores) {
      const existing = bestByPattern.get(row.pattern_slug);
      if (!existing || row.score_total > existing.score_total) {
        bestByPattern.set(row.pattern_slug, row);
      }
    }

    let avgPercent = 0;
    if (scores.length > 0) {
      const sum = scores.reduce(
        (acc, r) => acc + (r.score_total / r.score_max) * 100,
        0,
      );
      avgPercent = Math.round(sum / scores.length);
    }

    const leaderboard = await query<LeaderboardRow>(
      `SELECT u.first_name,
              ROUND(AVG(gs.score_total::numeric / NULLIF(gs.score_max, 0) * 100)) AS avg_percent,
              COUNT(gs.id)::int AS games_played
       FROM game_scores gs
       JOIN users u ON u.id = gs.user_id
       GROUP BY u.id, u.first_name
       HAVING COUNT(gs.id) >= 1
       ORDER BY avg_percent DESC, games_played DESC
       LIMIT 20`,
    );

    const rankRows = await query<{ rank: number }>(
      `SELECT rank FROM (
         SELECT u.id,
                RANK() OVER (
                  ORDER BY AVG(gs.score_total::numeric / NULLIF(gs.score_max, 0) * 100) DESC,
                           COUNT(gs.id) DESC
                ) AS rank
         FROM game_scores gs
         JOIN users u ON u.id = gs.user_id
         GROUP BY u.id
       ) ranked
       WHERE id = $1`,
      [auth.userId],
    );

    return NextResponse.json({
      success: true,
      scores: Array.from(bestByPattern.values()),
      totalAttempts: scores.length,
      avgPercent,
      leaderboard,
      userRank: rankRows[0]?.rank ?? null,
    });
  } catch (error) {
    console.error("Game scores GET error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { patternSlug, scoreTotal, scoreMax, architecture, resilience, efficiency, passed } = body;

    if (!patternSlug || scoreTotal == null || scoreMax == null) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 },
      );
    }

    if (!isValidSlug(patternSlug)) {
      return NextResponse.json(
        { success: false, message: "Invalid pattern slug." },
        { status: 400 },
      );
    }

    await query(
      `INSERT INTO game_scores (user_id, pattern_slug, score_total, score_max, architecture, resilience, efficiency, passed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        auth.userId,
        patternSlug,
        scoreTotal,
        scoreMax,
        architecture ?? 0,
        resilience ?? 0,
        efficiency ?? 0,
        passed ?? false,
      ],
    );

    evaluateAndAward(auth.userId)
      .then((newly) => sendBadgeEarnedEmails(auth.userId, newly))
      .catch((err) => console.error("badge eval failed:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Game scores POST error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
