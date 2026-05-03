import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/jwt";
import { evaluateAndAward } from "@/lib/badges";
import { sendBadgeEarnedEmails } from "@/lib/badge-mailer";

const VALID_CHALLENGE_TYPES = new Set([
  "build", "debug", "prompt", "optimize",
  "pm-ship-or-skip", "pm-budget-builder", "pm-stakeholder-sim",
]);

const VALID_DIFFICULTIES = new Set(["apprentice", "practitioner", "architect"]);

interface ChallengeScoreRow {
  id: number;
  pattern_slug: string;
  challenge_type: string;
  difficulty: string;
  score_total: number;
  score_max: number;
  passed: boolean;
  metadata: Record<string, unknown>;
  played_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const scores = await query<ChallengeScoreRow>(
      `SELECT id, pattern_slug, challenge_type, difficulty, score_total, score_max,
              passed, metadata, played_at
       FROM challenge_scores
       WHERE user_id = $1
       ORDER BY played_at DESC`,
      [auth.userId],
    );

    const bestByChallenge = new Map<string, ChallengeScoreRow>();
    for (const row of scores) {
      const key = `${row.pattern_slug}:${row.challenge_type}`;
      const existing = bestByChallenge.get(key);
      if (!existing || row.score_total > existing.score_total) {
        bestByChallenge.set(key, row);
      }
    }

    const tierUnlocks: Record<string, { apprentice: boolean; practitioner: boolean; architect: boolean }> = {};
    bestByChallenge.forEach((row) => {
      const slug = row.pattern_slug;
      if (!tierUnlocks[slug]) {
        tierUnlocks[slug] = { apprentice: true, practitioner: false, architect: false };
      }
      const pct = row.score_max > 0 ? (row.score_total / row.score_max) * 100 : 0;
      if (row.challenge_type === "build" && pct >= 70) {
        tierUnlocks[slug].practitioner = true;
      }
      if ((row.challenge_type === "debug" || row.challenge_type === "prompt") && pct >= 70) {
        tierUnlocks[slug].architect = true;
      }
    });

    return NextResponse.json({
      success: true,
      scores: Array.from(bestByChallenge.values()),
      allScores: scores,
      tierUnlocks,
      totalAttempts: scores.length,
    });
  } catch (error) {
    console.error("Challenge scores GET error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { patternSlug, challengeType, difficulty, scoreTotal, scoreMax, passed, metadata } = body;

    if (!patternSlug || !challengeType || scoreTotal == null || scoreMax == null) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    if (!VALID_CHALLENGE_TYPES.has(challengeType)) {
      return NextResponse.json({ success: false, message: "Invalid challenge type." }, { status: 400 });
    }

    if (difficulty && !VALID_DIFFICULTIES.has(difficulty)) {
      return NextResponse.json({ success: false, message: "Invalid difficulty." }, { status: 400 });
    }

    await query(
      `INSERT INTO challenge_scores (user_id, pattern_slug, challenge_type, difficulty, score_total, score_max, passed, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        auth.userId,
        patternSlug,
        challengeType,
        difficulty || "apprentice",
        scoreTotal,
        scoreMax,
        passed ?? false,
        JSON.stringify(metadata || {}),
      ],
    );

    evaluateAndAward(auth.userId)
      .then((newly) => sendBadgeEarnedEmails(auth.userId, newly))
      .catch((err) => console.error("badge eval failed:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Challenge scores POST error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}
