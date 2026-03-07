import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { ambassadorSchema } from "@/lib/validations";

const MAX_APPLICATIONS_PER_DAY = 3;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const ipLimiter = rateLimit(ip, { maxRequests: 10, windowMs: 15 * 60 * 1000 });
    if (!ipLimiter.success) {
      return NextResponse.json(
        { success: false, message: "Too many submissions. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = ambassadorSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid form data.";
      return NextResponse.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { name, channelUrl, platform, followerCount, whyAudience } = parsed.data;

    const dailyKey = `ambassador:${ip}`;
    const dailyLimiter = rateLimit(dailyKey, {
      maxRequests: MAX_APPLICATIONS_PER_DAY,
      windowMs: ONE_DAY_MS,
    });
    if (!dailyLimiter.success) {
      return NextResponse.json(
        { success: false, message: "You've already applied. We'll be in touch!" },
        { status: 429 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || "noreply@learnagenticpatterns.com";

    if (!resendKey || !adminEmail) {
      console.error("Ambassador: RESEND_API_KEY or ADMIN_EMAIL not configured");
      return NextResponse.json(
        { success: false, message: "Application service unavailable. Please try again later." },
        { status: 500 }
      );
    }

    const esc = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject: `Ambassador Application: ${esc(name)} (${platform})`,
        html: `
          <div style="font-family:monospace;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="color:#00D4FF;margin-bottom:16px">New Ambassador Application</h2>
            <div style="background:#0F1629;border:1px solid #1E293B;border-radius:8px;padding:20px">
              <table style="width:100%;border-collapse:collapse;color:#E2E8F0;font-size:14px">
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#64748B;white-space:nowrap;vertical-align:top">Name</td>
                  <td style="padding:8px 0">${esc(name)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#64748B;white-space:nowrap;vertical-align:top">Platform</td>
                  <td style="padding:8px 0">${esc(platform)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#64748B;white-space:nowrap;vertical-align:top">Channel</td>
                  <td style="padding:8px 0"><a href="${esc(channelUrl)}" style="color:#00D4FF">${esc(channelUrl)}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#64748B;white-space:nowrap;vertical-align:top">Followers</td>
                  <td style="padding:8px 0">${esc(followerCount)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#64748B;white-space:nowrap;vertical-align:top">Why</td>
                  <td style="padding:8px 0;white-space:pre-wrap">${esc(whyAudience)}</td>
                </tr>
              </table>
            </div>
            <p style="color:#64748B;font-size:12px;margin-top:16px">
              Submitted from the Ambassador Program page on learnagenticpatterns.com
            </p>
          </div>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ambassador API error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
