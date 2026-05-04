import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/jwt";
import { isValidSlug } from "@/lib/valid-slugs";

interface VisitRow {
  track: string;
  slug: string;
  tab_id: string;
  visited_at: string;
}

const VALID_TRACKS = new Set(["developer", "pm"]);

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    let rows: VisitRow[];
    if (slug) {
      if (!isValidSlug(slug)) {
        return NextResponse.json(
          { success: false, message: "Invalid slug." },
          { status: 400 }
        );
      }
      rows = await query<VisitRow>(
        `SELECT track, slug, tab_id, visited_at
         FROM tab_visits
         WHERE user_id = $1 AND slug = $2`,
        [auth.userId, slug]
      );
    } else {
      rows = await query<VisitRow>(
        `SELECT track, slug, tab_id, visited_at
         FROM tab_visits
         WHERE user_id = $1`,
        [auth.userId]
      );
    }

    return NextResponse.json({ success: true, visits: rows });
  } catch (error) {
    console.error("Tab visits GET error:", error);
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

    const { track, slug, tabId } = await request.json();

    if (!track || !slug || !tabId) {
      return NextResponse.json(
        { success: false, message: "track, slug, tabId required." },
        { status: 400 }
      );
    }
    if (!VALID_TRACKS.has(track)) {
      return NextResponse.json(
        { success: false, message: "Invalid track." },
        { status: 400 }
      );
    }
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { success: false, message: "Invalid slug." },
        { status: 400 }
      );
    }
    if (typeof tabId !== "string" || tabId.length > 32 || !/^[a-z0-9-]+$/.test(tabId)) {
      return NextResponse.json(
        { success: false, message: "Invalid tabId." },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO tab_visits (user_id, track, slug, tab_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, track, slug, tab_id) DO NOTHING`,
      [auth.userId, track, slug, tabId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tab visits POST error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
