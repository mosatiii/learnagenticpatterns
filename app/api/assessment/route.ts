import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt, buildUserMessage } from "@/lib/assessment-prompt";
import { assessmentReportEmail } from "@/lib/email-templates";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@learnagenticpatterns.com";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

    // Call Gemini directly
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-preview-05-06",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    const geminiRes = await model.generateContent({
      systemInstruction: systemPrompt,
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
    });

    const text = geminiRes.response.text();
    const result = JSON.parse(text);

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
