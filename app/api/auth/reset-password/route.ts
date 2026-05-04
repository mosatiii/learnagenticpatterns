import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import {
  peek, recordAttempt, getClientIp, type RateLimitConfig,
} from "@/lib/rate-limit";

interface ResetRow {
  id: number;
  user_id: number;
  expires_at: string;
}

// Bad-token guesses count; valid resets do not. Slightly higher cap than
// login since the reset URL itself is the secret — guessing is hopeless.
const RESET_LIMIT: RateLimitConfig = { maxRequests: 10, windowMs: 15 * 60 * 1000 };

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const ipKey = `reset-pw:ip:${ip}`;

    const ipPeek = peek(ipKey, RESET_LIMIT);
    if (ipPeek.blocked) {
      return NextResponse.json(
        { success: false, message: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { token, password } = await request.json();

    if (!token || !password || typeof password !== "string" || password.length < 8) {
      recordAttempt(ipKey, RESET_LIMIT);
      return NextResponse.json(
        { success: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    // Find valid, unused, non-expired token
    const rows = await query<ResetRow>(
      `SELECT id, user_id, expires_at FROM password_resets
       WHERE token = $1 AND used = FALSE AND expires_at > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      recordAttempt(ipKey, RESET_LIMIT);
      return NextResponse.json(
        { success: false, message: "This reset link has expired or already been used. Please request a new one." },
        { status: 400 }
      );
    }

    const resetRecord = rows[0];
    const passwordHash = await bcrypt.hash(password, 12);

    // Update the user's password
    await query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      passwordHash,
      resetRecord.user_id,
    ]);

    // Mark token as used
    await query("UPDATE password_resets SET used = TRUE WHERE id = $1", [
      resetRecord.id,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
