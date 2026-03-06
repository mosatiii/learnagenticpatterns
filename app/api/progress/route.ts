import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/jwt";
import { isValidSlug } from "@/lib/valid-slugs";

interface ProgressRow {
  pattern_slug: string;
  read_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const rows = await query<ProgressRow>(
      `SELECT rp.pattern_slug, rp.read_at
       FROM reading_progress rp
       WHERE rp.user_id = $1
       ORDER BY rp.read_at ASC`,
      [auth.userId]
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

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { patternSlug } = await request.json();

    if (!patternSlug || typeof patternSlug !== "string") {
      return NextResponse.json(
        { success: false, message: "patternSlug is required." },
        { status: 400 }
      );
    }

    if (!isValidSlug(patternSlug)) {
      return NextResponse.json(
        { success: false, message: "Invalid pattern slug." },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO reading_progress (user_id, pattern_slug)
       VALUES ($1, $2)
       ON CONFLICT (user_id, pattern_slug) DO NOTHING`,
      [auth.userId, patternSlug]
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
