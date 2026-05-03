import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/jwt";

interface DayRow {
  day: string;
  count: string;
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

    const url = new URL(request.url);
    const daysParam = parseInt(url.searchParams.get("days") || "365", 10);
    const days = Math.min(Math.max(daysParam, 30), 730);

    const rows = await query<DayRow>(
      `WITH activity AS (
         SELECT DATE(read_at)    AS day FROM reading_progress  WHERE user_id = $1
         UNION ALL
         SELECT DATE(played_at)  AS day FROM game_scores       WHERE user_id = $1
         UNION ALL
         SELECT DATE(played_at)  AS day FROM challenge_scores  WHERE user_id = $1
         UNION ALL
         SELECT DATE(created_at) AS day FROM lesson_feedback   WHERE user_id = $1
       )
       SELECT day::text AS day, COUNT(*)::text AS count
       FROM activity
       WHERE day >= (CURRENT_DATE - ($2::int - 1))
       GROUP BY day
       ORDER BY day ASC`,
      [auth.userId, days]
    );

    const days_data = rows.map((r) => ({
      day: r.day,
      count: parseInt(r.count, 10),
    }));

    return NextResponse.json({
      success: true,
      days: days_data,
      window: days,
    });
  } catch (error) {
    console.error("Activity GET error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
