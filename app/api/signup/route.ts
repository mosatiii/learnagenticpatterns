import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validations";
import { query } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { welcomeEmail, adminNotificationEmail } from "@/lib/email-templates";

interface DbUser {
  id: number;
  email: string;
  first_name: string;
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

    const passwordHash = await bcrypt.hash(validated.password, 12);

    // Check if email already exists
    const existing = await query<DbUser>(
      "SELECT id FROM users WHERE email = $1",
      [validated.email.toLowerCase().trim()]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    const rows = await query<DbUser>(
      `INSERT INTO users (email, first_name, password_hash, role, challenge)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name`,
      [
        validated.email.toLowerCase().trim(),
        validated.firstName,
        passwordHash,
        validated.role,
        validated.challenge || null,
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
            to: validated.email,
            subject: "Welcome to Learn Agentic Patterns!",
            html: welcomeEmail(validated.firstName),
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
              subject: `New signup: ${validated.firstName} (${validated.role})`,
              html: adminNotificationEmail({
                firstName: validated.firstName,
                email: validated.email,
                role: validated.role,
                challenge: validated.challenge,
              }),
            }),
          });
        }
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr);
      }
    }

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, firstName: user.first_name } },
      { status: 200 }
    );
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
