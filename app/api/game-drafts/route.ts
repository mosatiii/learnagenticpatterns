import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/jwt";

interface DraftRow {
  slug: string;
  draft: unknown;
  updated_at: string;
}

const SLUG_RE = /^[a-z0-9-]{1,80}$/;

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

    if (slug) {
      if (!SLUG_RE.test(slug)) {
        return NextResponse.json(
          { success: false, message: "Invalid slug." },
          { status: 400 }
        );
      }
      const rows = await query<DraftRow>(
        `SELECT slug, draft, updated_at FROM game_drafts
         WHERE user_id = $1 AND slug = $2`,
        [auth.userId, slug]
      );
      return NextResponse.json({ success: true, draft: rows[0] ?? null });
    }

    const rows = await query<DraftRow>(
      `SELECT slug, draft, updated_at FROM game_drafts WHERE user_id = $1`,
      [auth.userId]
    );
    return NextResponse.json({ success: true, drafts: rows });
  } catch (error) {
    console.error("Game drafts GET error:", error);
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

    const { slug, draft } = await request.json();

    if (!slug || !SLUG_RE.test(slug)) {
      return NextResponse.json(
        { success: false, message: "Invalid slug." },
        { status: 400 }
      );
    }
    if (draft === undefined || draft === null) {
      return NextResponse.json(
        { success: false, message: "draft required." },
        { status: 400 }
      );
    }

    // Cap payload size to prevent quota abuse — 10KB is generous for game state.
    const payload = JSON.stringify(draft);
    if (payload.length > 10_000) {
      return NextResponse.json(
        { success: false, message: "Draft too large." },
        { status: 413 }
      );
    }

    await query(
      `INSERT INTO game_drafts (user_id, slug, draft, updated_at)
       VALUES ($1, $2, $3::jsonb, NOW())
       ON CONFLICT (user_id, slug)
       DO UPDATE SET draft = EXCLUDED.draft, updated_at = NOW()`,
      [auth.userId, slug, payload]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Game drafts POST error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    if (!slug || !SLUG_RE.test(slug)) {
      return NextResponse.json(
        { success: false, message: "Invalid slug." },
        { status: 400 }
      );
    }

    await query(
      `DELETE FROM game_drafts WHERE user_id = $1 AND slug = $2`,
      [auth.userId, slug]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Game drafts DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
