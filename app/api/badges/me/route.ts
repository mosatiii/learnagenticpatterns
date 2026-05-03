import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/jwt";
import { BADGES, evaluateAndAward, getEarnedBadges } from "@/lib/badges";
import { sendBadgeEarnedEmails } from "@/lib/badge-mailer";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    // Evaluate-on-read: award any newly qualified badges, then return all.
    try {
      const newly = await evaluateAndAward(auth.userId);
      if (newly.length > 0) {
        sendBadgeEarnedEmails(auth.userId, newly).catch((err) =>
          console.error("badge email send failed:", err)
        );
      }
    } catch (err) {
      console.error("badge eval failed:", err);
    }

    const earned = await getEarnedBadges(auth.userId);
    const earnedMap = new Map(earned.map((e) => [e.slug, e.earned_at]));

    const badges = BADGES.map((b) => ({
      ...b,
      earned: earnedMap.has(b.slug),
      earnedAt: earnedMap.get(b.slug) ?? null,
    }));

    return NextResponse.json({
      success: true,
      badges,
      earnedCount: earned.length,
      totalCount: BADGES.length,
    });
  } catch (error) {
    console.error("Badges GET error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
