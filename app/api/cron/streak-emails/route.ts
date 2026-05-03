import { NextRequest, NextResponse } from "next/server";
import { runStreakReminders } from "@/lib/streak-mailer";
import { runBadgeSweep } from "@/lib/badge-sweep";

export const dynamic = "force-dynamic";

/**
 * Daily cron entry. Wire to a scheduled job (Railway scheduled service,
 * Vercel cron, or external pinger) and protect with CRON_SECRET.
 *
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *        https://learnagenticpatterns.com/api/cron/streak-emails
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, message: "CRON_SECRET not configured." },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  const provided = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (provided !== secret) {
    return NextResponse.json(
      { success: false, message: "Forbidden." },
      { status: 403 }
    );
  }

  try {
    const [streak, badges] = await Promise.all([
      runStreakReminders(),
      runBadgeSweep(7),
    ]);
    return NextResponse.json({ success: true, streak, badges });
  } catch (error) {
    console.error("Cron streak-emails error:", error);
    return NextResponse.json(
      { success: false, message: "Run failed." },
      { status: 500 }
    );
  }
}
