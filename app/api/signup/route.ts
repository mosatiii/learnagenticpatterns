import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validations";
import { query } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { welcomeEmail, adminNotificationEmail } from "@/lib/email-templates";
import { signToken, setAuthCookie } from "@/lib/jwt";
import { addContactToAudience } from "@/lib/resend-audience";

interface DbUser {
  id: number;
  email: string;
  first_name: string;
  role: string;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limiter = rateLimit(ip, { maxRequests: 5, windowMs: 15 * 60 * 1000 });
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = signupSchema.parse(body);
    // agreedToTerms is validated by the schema but not stored in the database
    const { agreedToTerms: _, ...userData } = validated;

    const passwordHash = await bcrypt.hash(userData.password, 12);

    // Check if email already exists
    const existing = await query<DbUser>(
      "SELECT id FROM users WHERE email = $1",
      [userData.email.toLowerCase().trim()]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Unable to create account. Try logging in instead." },
        { status: 409 }
      );
    }

    const rows = await query<DbUser>(
      `INSERT INTO users (email, first_name, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, first_name, role`,
      [
        userData.email.toLowerCase().trim(),
        userData.firstName,
        passwordHash,
        userData.role,
      ]
    );

    const user = rows[0];

    // Send welcome email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey !== "your_resend_key") {
      try {
        const fromEmail = process.env.FROM_EMAIL || "noreply@learnagenticpatterns.com";

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: userData.email,
            subject: "Welcome to Learn Agentic Patterns!",
            html: welcomeEmail(userData.firstName, userData.role),
          }),
        });

        const adminAddr = process.env.ADMIN_EMAIL;
        if (adminAddr) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: fromEmail,
              to: adminAddr,
              subject: `New signup: ${userData.firstName} (${userData.role})`,
              html: adminNotificationEmail({
                firstName: userData.firstName,
                email: userData.email,
                role: userData.role,
              }),
            }),
          });
        }
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr);
      }
    }

    // Sync to Resend Audience for newsletters (fire-and-forget, never blocks signup)
    try {
      addContactToAudience({ email: userData.email, firstName: userData.firstName });
    } catch (audienceErr) {
      console.error("Audience sync failed (non-blocking):", audienceErr);
    }

    const token = await signToken({ userId: user.id, email: user.email });

    const res = NextResponse.json(
      { success: true, token, user: { id: user.id, email: user.email, firstName: user.first_name, role: user.role } },
      { status: 200 }
    );
    return setAuthCookie(res, token);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Invalid form data. Please check your inputs." },
        { status: 400 }
      );
    }

    console.error("Signup API error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
