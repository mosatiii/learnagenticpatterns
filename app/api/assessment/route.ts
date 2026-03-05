import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSystemPrompt, buildUserMessage } from "@/lib/assessment-prompt";
import { assessmentReportEmail } from "@/lib/email-templates";

const GEMINI_PROXY_URL = process.env.GEMINI_PROXY_URL || "";
const GEMINI_API_SECRET = process.env.GEMINI_API_SECRET || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@learnagenticpatterns.com";

const assessmentSchema = z.object({
  role: z.enum(["product-manager", "developer", "designer", "writer"]),
  answers: z.record(z.union([z.string(), z.array(z.string())])),
  email: z.string().email().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = assessmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    const { role, answers, email } = parsed.data;

    const systemPrompt = buildSystemPrompt(role);
    const userMessage = buildUserMessage(role, answers);

    // Call Railway Gemini proxy
    const geminiRes = await fetch(`${GEMINI_PROXY_URL}/assess`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": GEMINI_API_SECRET,
      },
      body: JSON.stringify({ systemPrompt, userMessage }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error("Gemini proxy error:", geminiRes.status, errBody);
      return NextResponse.json(
        { success: false, error: "Assessment generation failed. Please try again." },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();
    const result = geminiData.result;

    // Send email if provided
    if (email && RESEND_API_KEY && RESEND_API_KEY !== "your_resend_key") {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: email,
            subject: `Your AI-Readiness Score: ${result.score}% — Will AI Replace Me?`,
            html: assessmentReportEmail(result, role),
          }),
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
        // Don't fail the request — the assessment still succeeded
      }
    }

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("Assessment API error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
