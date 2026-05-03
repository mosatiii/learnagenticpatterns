import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getAuthUser } from "@/lib/jwt";
import { isValidSlug } from "@/lib/valid-slugs";
import { evaluateAndAward } from "@/lib/badges";
import { sendBadgeEarnedEmails } from "@/lib/badge-mailer";

interface FeedbackRow {
  id: number;
  helpful: boolean;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limiter = rateLimit(ip, { maxRequests: 60, windowMs: 15 * 60 * 1000 });
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: "Too many requests." },
        { status: 429 }
      );
    }

    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { lessonSlug, track, helpful } = await request.json();

    if (!lessonSlug || typeof helpful !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!isValidSlug(lessonSlug)) {
      return NextResponse.json(
        { success: false, message: "Invalid lesson slug." },
        { status: 400 }
      );
    }

    const validTrack = track === "pm" ? "pm" : "developer";

    const rows = await query<FeedbackRow>(
      `INSERT INTO lesson_feedback (user_id, lesson_slug, track, helpful)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, lesson_slug)
       DO UPDATE SET helpful = $4, created_at = NOW()
       RETURNING id, helpful`,
      [auth.userId, lessonSlug, validTrack, helpful]
    );

    evaluateAndAward(auth.userId)
      .then((newly) => sendBadgeEarnedEmails(auth.userId, newly))
      .catch((err) => console.error("badge eval failed:", err));

    return NextResponse.json({ success: true, feedback: rows[0] });
  } catch (error) {
    console.error("Lesson feedback API error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lessonSlug = searchParams.get("lessonSlug");

    if (!lessonSlug) {
      return NextResponse.json(
        { success: false, message: "Missing lessonSlug." },
        { status: 400 }
      );
    }

    const rows = await query<FeedbackRow>(
      `SELECT id, helpful FROM lesson_feedback WHERE user_id = $1 AND lesson_slug = $2`,
      [auth.userId, lessonSlug]
    );

    return NextResponse.json({
      success: true,
      feedback: rows[0] ?? null,
    });
  } catch (error) {
    console.error("Lesson feedback GET error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
