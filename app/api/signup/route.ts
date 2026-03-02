import { NextResponse } from "next/server";
import { waitlistSchema } from "@/lib/validations";
import { query } from "@/lib/db";

interface DbUser {
  id: number;
  email: string;
  first_name: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = waitlistSchema.parse(body);

    // Upsert: if email already exists, just return the existing user
    const rows = await query<DbUser>(
      `INSERT INTO users (email, first_name, role, challenge)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name
       RETURNING id, email, first_name`,
      [validated.email, validated.firstName, validated.role, validated.challenge || null]
    );

    const user = rows[0];

    // Send confirmation email via Resend (if configured)
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
            to: validated.email,
            subject: "Welcome to Learn Agentic Patterns!",
            html: `
              <h2>Welcome, ${validated.firstName}! You're in.</h2>
              <p>You now have access to all 21 Agentic Design Patterns — completely free.</p>
              <p>Here's what's waiting for you:</p>
              <ul>
                <li>21 Agentic Design Patterns mapped to SWE concepts you already know</li>
                <li>Before & after code examples for every pattern</li>
                <li>Architecture diagrams and production notes</li>
              </ul>
              <p><a href="https://learnagenticpatterns.com/#curriculum">Start learning now →</a></p>
              <p>— Mousa</p>
            `,
          }),
        });

        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: process.env.FROM_EMAIL || "noreply@learnagenticpatterns.com",
              to: adminEmail,
              subject: `New signup: ${validated.firstName} (${validated.role})`,
              html: `
                <h3>New Lead</h3>
                <p><strong>Name:</strong> ${validated.firstName}</p>
                <p><strong>Email:</strong> ${validated.email}</p>
                <p><strong>Role:</strong> ${validated.role}</p>
                <p><strong>Challenge:</strong> ${validated.challenge || "Not provided"}</p>
              `,
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
