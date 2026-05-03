import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/jwt";
import { computeStreak } from "@/lib/streak";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const streak = await computeStreak(auth.userId);

    return NextResponse.json({
      success: true,
      ...streak,
    });
  } catch (error) {
    console.error("Streak GET error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
