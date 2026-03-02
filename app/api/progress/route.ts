import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface ProgressRow {
  pattern_slug: string;
  read_at: string;
}

// GET /api/progress?email=user@example.com — fetch all read patterns for a user
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const rows = await query<ProgressRow>(
      `SELECT rp.pattern_slug, rp.read_at
       FROM reading_progress rp
       JOIN users u ON u.id = rp.user_id
       WHERE u.email = $1
       ORDER BY rp.read_at ASC`,
      [email.toLowerCase().trim()]
    );

    return NextResponse.json({
      success: true,
      progress: rows.map((r) => r.pattern_slug),
      total: rows.length,
    });
  } catch (error) {
    console.error("Progress GET error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}

// POST /api/progress — mark a pattern as read
export async function POST(request: Request) {
  try {
    const { email, patternSlug } = await request.json();

    if (!email || !patternSlug) {
      return NextResponse.json(
        { success: false, message: "Email and patternSlug are required." },
        { status: 400 }
      );
    }

    // Insert reading progress (ignore if already marked)
    await query(
      `INSERT INTO reading_progress (user_id, pattern_slug)
       SELECT u.id, $2
       FROM users u
       WHERE u.email = $1
       ON CONFLICT (user_id, pattern_slug) DO NOTHING`,
      [email.toLowerCase().trim(), patternSlug]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Progress POST error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
