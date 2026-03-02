import { NextResponse } from "next/server";
import crypto from "crypto";
import { forgotPasswordSchema } from "@/lib/validations";
import { query } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { passwordResetEmail } from "@/lib/email-templates";

interface DbUser {
  id: number;
  first_name: string;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limiter = rateLimit(ip, { maxRequests: 3, windowMs: 15 * 60 * 1000 });
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = forgotPasswordSchema.parse(body);
    const email = validated.email.toLowerCase().trim();

    const rows = await query<DbUser>(
      "SELECT id, first_name FROM users WHERE email = $1",
      [email]
    );

    // Always return success to avoid revealing whether an email exists
    if (rows.length === 0) {
      return NextResponse.json({ success: true });
    }

    const user = rows[0];

    // Generate a secure random token, expires in 1 hour
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Invalidate any existing tokens for this user
    await query(
      "UPDATE password_resets SET used = TRUE WHERE user_id = $1 AND used = FALSE",
      [user.id]
    );

    await query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt.toISOString()]
    );

    // Send reset email
    const siteUrl = process.env.SITE_URL || "https://learnagenticpatterns.com";
    const resetUrl = `${siteUrl}/reset-password?token=${token}`;
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey && resendKey !== "your_resend_key") {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.FROM_EMAIL || "noreply@learnagenticpatterns.com",
            to: email,
            subject: "Reset your password — Learn Agentic Patterns",
            html: passwordResetEmail(user.first_name, resetUrl),
          }),
        });
      } catch (emailErr) {
        console.error("Reset email failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
