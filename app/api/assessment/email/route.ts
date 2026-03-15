import { NextResponse } from "next/server";
import { z } from "zod";
import { assessmentReportEmail } from "@/lib/email-templates";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const emailSchema = z.object({
  role: z.enum(["product-manager", "developer", "designer", "writer"]),
  email: z.string().email(),
  result: z.object({
    score: z.number(),
    strengths: z.array(z.string()),
    vulnerabilities: z.array(z.string()),
    actionPlan: z.array(z.object({
      step: z.number(),
      title: z.string(),
      description: z.string(),
      link: z.string().optional(),
    })),
    elevatorPitch: z.string(),
    patternsYouKnow: z.array(z.string()).optional(),
    patternsToLearn: z.array(z.string()).optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limiter = rateLimit(ip, { maxRequests: 10, windowMs: 60 * 60 * 1000 });
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = emailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    const { role, email, result } = parsed.data;

    const resendKey = process.env.RESEND_API_KEY || "";
    if (!resendKey || resendKey === "your_resend_key") {
      return NextResponse.json(
        { success: false, error: "Email service not configured" },
        { status: 503 }
      );
    }

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || "noreply@learnagenticpatterns.com",
        to: email,
        subject: `Your AI-Readiness Score: ${result.score}% — Will AI Replace Me?`,
        html: assessmentReportEmail(result, role),
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Assessment email error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 }
    );
  }
}
