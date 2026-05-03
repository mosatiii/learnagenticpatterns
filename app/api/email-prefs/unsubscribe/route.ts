import { NextRequest, NextResponse } from "next/server";
import { setPreference, verifyUnsubToken, type EmailKind } from "@/lib/email-prefs";

export const dynamic = "force-dynamic";

const VALID_KINDS: EmailKind[] = ["streak", "badge"];

function htmlPage(title: string, body: string, ok: boolean): string {
  const accent = ok ? "#00D4FF" : "#FF6B35";
  return `<!doctype html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<style>
  body{margin:0;background:#0A0E1A;color:#E8ECF4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
       display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px;}
  .card{max-width:480px;background:#131829;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px;text-align:center;}
  h1{font-family:monospace;font-size:18px;margin:0 0 12px 0;color:${accent};}
  p{color:#8B95A5;font-size:14px;line-height:1.6;margin:0 0 16px 0;}
  a{color:${accent};text-decoration:none;font-family:monospace;font-size:13px;}
</style></head>
<body><div class="card"><h1>${title}</h1>${body}<p><a href="https://learnagenticpatterns.com">← learnagenticpatterns.com</a></p></div></body></html>`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const uid = parseInt(url.searchParams.get("uid") || "", 10);
  const kindRaw = url.searchParams.get("kind") || "";
  const token = url.searchParams.get("t") || "";

  if (!uid || !VALID_KINDS.includes(kindRaw as EmailKind) || !token) {
    return new NextResponse(
      htmlPage("Invalid link", "<p>This unsubscribe link is malformed.</p>", false),
      { status: 400, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }
  const kind = kindRaw as EmailKind;

  if (!verifyUnsubToken(uid, kind, token)) {
    return new NextResponse(
      htmlPage("Invalid link", "<p>This unsubscribe link couldn't be verified.</p>", false),
      { status: 403, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  try {
    await setPreference(uid, kind, false);
  } catch (err) {
    console.error("unsubscribe error:", err);
    return new NextResponse(
      htmlPage("Something went wrong", "<p>We couldn't save your preference. Try again later.</p>", false),
      { status: 500, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  return new NextResponse(
    htmlPage(
      "Unsubscribed",
      `<p>You will no longer receive <strong style="color:#E8ECF4">${kind}</strong> emails.</p>
       <p>You can change this anytime from your profile.</p>`,
      true
    ),
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}
