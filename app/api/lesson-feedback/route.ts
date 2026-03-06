import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

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

    const { userId, lessonSlug, track, helpful } = await request.json();

    if (!userId || !lessonSlug || typeof helpful !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const validTrack = track === "pm" ? "pm" : "developer";

    // Upsert: one vote per user per lesson, changeable
    const rows = await query<FeedbackRow>(
      `INSERT INTO lesson_feedback (user_id, lesson_slug, track, helpful)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, lesson_slug)
       DO UPDATE SET helpful = $4, created_at = NOW()
       RETURNING id, helpful`,
      [userId, lessonSlug, validTrack, helpful]
    );

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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const lessonSlug = searchParams.get("lessonSlug");

    if (!userId || !lessonSlug) {
      return NextResponse.json(
        { success: false, message: "Missing userId or lessonSlug." },
        { status: 400 }
      );
    }

    const rows = await query<FeedbackRow>(
      `SELECT id, helpful FROM lesson_feedback WHERE user_id = $1 AND lesson_slug = $2`,
      [userId, lessonSlug]
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
