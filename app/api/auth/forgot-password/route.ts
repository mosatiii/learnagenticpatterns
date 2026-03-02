import { NextResponse } from "next/server";
import crypto from "crypto";
import { forgotPasswordSchema } from "@/lib/validations";
import { query } from "@/lib/db";

interface DbUser {
  id: number;
  first_name: string;
}

export async function POST(request: Request) {
  try {
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
            html: `
              <h2>Password Reset</h2>
              <p>Hi ${user.first_name},</p>
              <p>Click the link below to reset your password. This link expires in 1 hour.</p>
              <p><a href="${resetUrl}" style="display:inline-block;background:#FF6B35;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">Reset Password</a></p>
              <p style="color:#999;font-size:12px;">If you didn't request this, just ignore this email.</p>
              <p>— Mousa</p>
            `,
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
