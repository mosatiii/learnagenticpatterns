import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getAuthUser } from "@/lib/jwt";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MAX_FEEDBACK_PER_DAY = 10;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const ipLimiter = rateLimit(ip, { maxRequests: 15, windowMs: 15 * 60 * 1000 });
    if (!ipLimiter.success) {
      return NextResponse.json(
        { success: false, message: "Too many submissions. Try again later." },
        { status: 429 }
      );
    }

    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "You must be signed in to submit feedback." },
        { status: 401 }
      );
    }

    const { message } = await request.json();
    const email = auth.email;

    const userKey = `feedback:${email}`;
    const userLimiter = rateLimit(userKey, {
      maxRequests: MAX_FEEDBACK_PER_DAY,
      windowMs: ONE_DAY_MS,
    });
    if (!userLimiter.success) {
      return NextResponse.json(
        { success: false, message: `You've reached the daily limit of ${MAX_FEEDBACK_PER_DAY} feedback submissions. Try again tomorrow.` },
        { status: 429 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Message is required." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { success: false, message: "Message too long (max 2000 chars)." },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || "noreply@learnagenticpatterns.com";

    if (!resendKey || !adminEmail) {
      console.error("Feedback: RESEND_API_KEY or ADMIN_EMAIL not configured");
      return NextResponse.json(
        { success: false, message: "Feedback service unavailable." },
        { status: 500 }
      );
    }

    const sanitizedEmail = email.toLowerCase().trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject: `Feedback from ${sanitizedEmail}`,
        html: `
          <div style="font-family:monospace;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="color:#00D4FF;margin-bottom:16px">New Feedback</h2>
            <p style="color:#64748B;font-size:12px;margin-bottom:12px">From: ${sanitizedEmail}</p>
            <div style="background:#0F1629;border:1px solid #1E293B;border-radius:8px;padding:16px">
              <p style="color:#E2E8F0;white-space:pre-wrap;margin:0">${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </div>
            <p style="color:#64748B;font-size:12px;margin-top:16px">
              Sent from the feedback widget on learnagenticpatterns.com
            </p>
          </div>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
