import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── GET /api/game-scores?email=... ──────────────────────────────────────────
// Returns user's per-pattern scores, overall average, and a global leaderboard.

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const scores = await query<ScoreRow>(
      `SELECT gs.pattern_slug, gs.score_total, gs.score_max,
              gs.architecture, gs.resilience, gs.efficiency,
              gs.passed, gs.played_at
       FROM game_scores gs
       JOIN users u ON u.id = gs.user_id
       WHERE u.email = $1
       ORDER BY gs.played_at DESC`,
      [normalizedEmail],
    );

    // Best score per pattern (highest total)
    const bestByPattern = new Map<string, ScoreRow>();
    for (const row of scores) {
      const existing = bestByPattern.get(row.pattern_slug);
      if (!existing || row.score_total > existing.score_total) {
        bestByPattern.set(row.pattern_slug, row);
      }
    }

    // Average percentage across all attempts
    let avgPercent = 0;
    if (scores.length > 0) {
      const sum = scores.reduce(
        (acc, r) => acc + (r.score_total / r.score_max) * 100,
        0,
      );
      avgPercent = Math.round(sum / scores.length);
    }

    // Global leaderboard: top 20 users by average score percentage
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

    // Find the requesting user's rank
    const rankRows = await query<{ rank: number }>(
      `SELECT rank FROM (
         SELECT u.email,
                RANK() OVER (
                  ORDER BY AVG(gs.score_total::numeric / NULLIF(gs.score_max, 0) * 100) DESC,
                           COUNT(gs.id) DESC
                ) AS rank
         FROM game_scores gs
         JOIN users u ON u.id = gs.user_id
         GROUP BY u.id, u.email
       ) ranked
       WHERE email = $1`,
      [normalizedEmail],
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

// ─── POST /api/game-scores ───────────────────────────────────────────────────
// Saves a single game attempt.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, patternSlug, scoreTotal, scoreMax, architecture, resilience, efficiency, passed } = body;

    if (!email || !patternSlug || scoreTotal == null || scoreMax == null) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 },
      );
    }

    await query(
      `INSERT INTO game_scores (user_id, pattern_slug, score_total, score_max, architecture, resilience, efficiency, passed)
       SELECT u.id, $2, $3, $4, $5, $6, $7, $8
       FROM users u
       WHERE u.email = $1`,
      [
        (email as string).toLowerCase().trim(),
        patternSlug,
        scoreTotal,
        scoreMax,
        architecture ?? 0,
        resilience ?? 0,
        efficiency ?? 0,
        passed ?? false,
      ],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Game scores POST error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
