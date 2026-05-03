const BRAND_COLOR = "#00D4FF";
const ACCENT_COLOR = "#FF6B35";
const BG_COLOR = "#0A0E1A";
const SURFACE_COLOR = "#131829";
const TEXT_COLOR = "#E8ECF4";
const TEXT_SECONDARY = "#8B95A5";

/** Escape user/LLM content before embedding in HTML emails. */
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:${BG_COLOR};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG_COLOR};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:${BRAND_COLOR};font-family:monospace;font-size:18px;font-weight:700;padding-right:8px;">$</td>
                  <td style="color:${TEXT_COLOR};font-family:monospace;font-size:14px;">learnagenticpatterns.com</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Accent line -->
          <tr>
            <td style="height:2px;background:linear-gradient(90deg,${BRAND_COLOR},${ACCENT_COLOR});border-radius:1px;"></td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="background:${SURFACE_COLOR};border:1px solid rgba(255,255,255,0.08);border-top:none;border-radius:0 0 8px 8px;padding:40px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="color:${TEXT_SECONDARY};font-size:12px;margin:0;font-family:monospace;">
                Learn Agentic Patterns · Built by Mousa Al-Jawaheri
              </p>
              <p style="color:${TEXT_SECONDARY};font-size:11px;margin:8px 0 0 0;font-family:monospace;">
                21 Agentic AI patterns mapped to SWE concepts you already know.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(text: string, href: string): string {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr>
        <td style="background:${ACCENT_COLOR};border-radius:6px;">
          <a href="${href}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            ${text} →
          </a>
        </td>
      </tr>
    </table>`;
}

export function welcomeEmail(firstName: string, role: string): string {
  const safeName = esc(firstName);
  const isPM = role === "Product Manager";

  const headline = isPM
    ? "You're in. All 11 PM modules are unlocked."
    : "You're in. All 21 patterns are unlocked.";

  const intro = isPM
    ? `You now have full access to all 11 Product Manager modules — decision frameworks,
      tradeoff analysis, and interactive games designed for PMs who own or influence AI product decisions.`
    : `You now have full access to all 21 Agentic Design Patterns, each one mapped to a
      Software Engineering concept you already know.`;

  const features = isPM
    ? `<tr>
        <td style="color:${BRAND_COLOR};font-family:monospace;padding:4px 12px 4px 0;vertical-align:top;">›</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:4px 0;">11 decision-focused modules (zero code)</td>
      </tr>
      <tr>
        <td style="color:${BRAND_COLOR};font-family:monospace;padding:4px 12px 4px 0;vertical-align:top;">›</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:4px 0;">Tradeoff frameworks: cost vs. quality vs. latency</td>
      </tr>
      <tr>
        <td style="color:${BRAND_COLOR};font-family:monospace;padding:4px 12px 4px 0;vertical-align:top;">›</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:4px 0;">Interactive games: Ship or Skip, Budget Builder, Stakeholder Simulator</td>
      </tr>
      <tr>
        <td style="color:${BRAND_COLOR};font-family:monospace;padding:4px 12px 4px 0;vertical-align:top;">›</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:4px 0;">Questions to ask your engineering team for each pattern</td>
      </tr>`
    : `<tr>
        <td style="color:${BRAND_COLOR};font-family:monospace;padding:4px 12px 4px 0;vertical-align:top;">›</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:4px 0;">21 patterns with code examples</td>
      </tr>
      <tr>
        <td style="color:${BRAND_COLOR};font-family:monospace;padding:4px 12px 4px 0;vertical-align:top;">›</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:4px 0;">SWE ↔ Agentic mappings for each</td>
      </tr>
      <tr>
        <td style="color:${BRAND_COLOR};font-family:monospace;padding:4px 12px 4px 0;vertical-align:top;">›</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:4px 0;">Production notes & architecture considerations</td>
      </tr>
      <tr>
        <td style="color:${BRAND_COLOR};font-family:monospace;padding:4px 12px 4px 0;vertical-align:top;">›</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:4px 0;">Progress tracking as you learn</td>
      </tr>`;

  const ctaUrl = isPM
    ? "https://learnagenticpatterns.com/pm/agentic-ai-landscape"
    : "https://learnagenticpatterns.com/#curriculum";

  const ctaText = isPM ? "Start PM Track" : "Start Learning";

  return baseLayout(`
    <h1 style="color:${TEXT_COLOR};font-size:24px;margin:0 0 8px 0;font-family:monospace;">
      Welcome, ${safeName}!
    </h1>
    <p style="color:${BRAND_COLOR};font-size:14px;font-family:monospace;margin:0 0 24px 0;">
      ${headline}
    </p>
    <p style="color:${TEXT_SECONDARY};font-size:15px;line-height:1.6;margin:0 0 8px 0;">
      ${intro}
    </p>
    <p style="color:${TEXT_SECONDARY};font-size:15px;line-height:1.6;margin:0 0 4px 0;">
      Here's what's waiting for you:
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:16px 0;">
      ${features}
    </table>
    ${button(ctaText, ctaUrl)}
    <p style="color:${TEXT_SECONDARY};font-size:14px;margin:0;">
      Mousa
    </p>
  `);
}

export function adminNotificationEmail(data: {
  firstName: string;
  email: string;
  role: string;
}): string {
  return baseLayout(`
    <h1 style="color:${TEXT_COLOR};font-size:20px;margin:0 0 20px 0;font-family:monospace;">
      New Signup
    </h1>
    <table cellpadding="0" cellspacing="0" style="width:100%;">
      <tr>
        <td style="color:${TEXT_SECONDARY};font-size:13px;font-family:monospace;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">Name</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;">${esc(data.firstName)}</td>
      </tr>
      <tr>
        <td style="color:${TEXT_SECONDARY};font-size:13px;font-family:monospace;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">Email</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;">${esc(data.email)}</td>
      </tr>
      <tr>
        <td style="color:${TEXT_SECONDARY};font-size:13px;font-family:monospace;padding:8px 0;">Role</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:8px 0;text-align:right;">${esc(data.role)}</td>
      </tr>
    </table>
  `);
}

export function assessmentReportEmail(
  result: {
    score: number;
    strengths: string[];
    vulnerabilities: string[];
    actionPlan: { step: number; title: string; description: string; link?: string }[];
    elevatorPitch: string;
  },
  role: string
): string {
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const strengthRows = result.strengths
    .map(
      (s) => `
      <tr>
        <td style="color:${BRAND_COLOR};font-family:monospace;padding:4px 12px 4px 0;vertical-align:top;">✓</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:4px 0;">${esc(s)}</td>
      </tr>`
    )
    .join("");

  const vulnRows = result.vulnerabilities
    .map(
      (v) => `
      <tr>
        <td style="color:${ACCENT_COLOR};font-family:monospace;padding:4px 12px 4px 0;vertical-align:top;">!</td>
        <td style="color:${TEXT_COLOR};font-size:14px;padding:4px 0;">${esc(v)}</td>
      </tr>`
    )
    .join("");

  const actionRows = result.actionPlan
    .map(
      (a) => `
      <tr>
        <td style="color:${BRAND_COLOR};font-family:monospace;padding:8px 12px 8px 0;vertical-align:top;font-weight:bold;">${a.step}.</td>
        <td style="padding:8px 0;">
          <p style="color:${TEXT_COLOR};font-size:14px;font-weight:600;margin:0;">${esc(a.title)}</p>
          <p style="color:${TEXT_SECONDARY};font-size:13px;margin:4px 0 0 0;">${esc(a.description)}</p>
          ${a.link ? `<a href="${esc(a.link)}" style="color:${BRAND_COLOR};font-size:12px;font-family:monospace;text-decoration:none;">${esc(a.link)} →</a>` : ""}
        </td>
      </tr>`
    )
    .join("");

  return baseLayout(`
    <h1 style="color:${TEXT_COLOR};font-size:24px;margin:0 0 4px 0;font-family:monospace;">
      Your AI-Readiness Report
    </h1>
    <p style="color:${BRAND_COLOR};font-size:14px;font-family:monospace;margin:0 0 24px 0;">
      ${roleLabel} Assessment · Score: ${result.score}/100
    </p>

    <!-- Score -->
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 28px 0;">
      <tr>
        <td style="background:rgba(255,255,255,0.05);border-radius:8px;padding:24px;text-align:center;">
          <p style="color:${BRAND_COLOR};font-family:monospace;font-size:48px;font-weight:700;margin:0;">${result.score}%</p>
          <p style="color:${TEXT_SECONDARY};font-size:13px;margin:8px 0 0 0;">AI-Proof Score</p>
        </td>
      </tr>
    </table>

    <!-- Strengths -->
    <h2 style="color:${TEXT_COLOR};font-size:16px;font-family:monospace;margin:0 0 12px 0;">
      What AI Can't Replace About You
    </h2>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">${strengthRows}</table>

    <!-- Vulnerabilities -->
    <h2 style="color:${TEXT_COLOR};font-size:16px;font-family:monospace;margin:0 0 12px 0;">
      Where You're Vulnerable
    </h2>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">${vulnRows}</table>

    <!-- Action Plan -->
    <h2 style="color:${TEXT_COLOR};font-size:16px;font-family:monospace;margin:0 0 12px 0;">
      Your 30-Day Action Plan
    </h2>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">${actionRows}</table>

    <!-- Elevator Pitch -->
    <h2 style="color:${TEXT_COLOR};font-size:16px;font-family:monospace;margin:0 0 12px 0;">
      Your Elevator Pitch
    </h2>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 28px 0;">
      <tr>
        <td style="background:rgba(255,255,255,0.05);border-radius:8px;padding:20px;border-left:3px solid ${BRAND_COLOR};">
          <p style="color:${TEXT_COLOR};font-size:14px;line-height:1.6;margin:0;font-style:italic;">
            "${esc(result.elevatorPitch)}"
          </p>
        </td>
      </tr>
    </table>

    ${button("Explore the Full Curriculum", "https://learnagenticpatterns.com/#curriculum")}

    <p style="color:${TEXT_SECONDARY};font-size:13px;margin:0;">
      This assessment was generated by Learn Agentic Patterns using AI analysis.
    </p>
  `);
}

function unsubFooter(unsubUrl: string): string {
  return `
    <p style="color:${TEXT_SECONDARY};font-size:11px;line-height:1.6;margin:24px 0 0 0;font-family:monospace;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;">
      Don't want these? <a href="${unsubUrl}" style="color:${TEXT_SECONDARY};text-decoration:underline;">Unsubscribe from this kind of email</a>.
    </p>`;
}

export function streakReminderEmail(args: {
  firstName: string;
  currentStreak: number;
  ctaUrl: string;
  unsubUrl: string;
}): string {
  const safeName = esc(args.firstName);
  const days = args.currentStreak;
  const heading = days >= 7
    ? `Don't break a ${days}-day streak`
    : `Your ${days}-day streak is at risk`;
  return baseLayout(`
    <h1 style="color:${TEXT_COLOR};font-size:24px;margin:0 0 8px 0;font-family:monospace;">
      ${heading}
    </h1>
    <p style="color:${ACCENT_COLOR};font-size:14px;font-family:monospace;margin:0 0 24px 0;">
      🔥 ${days} day${days === 1 ? "" : "s"} and counting
    </p>
    <p style="color:${TEXT_SECONDARY};font-size:15px;line-height:1.6;margin:0 0 16px 0;">
      Hi ${safeName}, you've been showing up. One pattern read or one challenge attempt today
      keeps the streak alive — that's it.
    </p>
    ${button("Keep the Streak", args.ctaUrl)}
    <p style="color:${TEXT_SECONDARY};font-size:14px;margin:0;">
      Mousa
    </p>
    ${unsubFooter(args.unsubUrl)}
  `);
}

export function badgeEarnedEmail(args: {
  firstName: string;
  badgeName: string;
  badgeDescription: string;
  ctaUrl: string;
  unsubUrl: string;
}): string {
  const safeName = esc(args.firstName);
  return baseLayout(`
    <h1 style="color:${TEXT_COLOR};font-size:24px;margin:0 0 8px 0;font-family:monospace;">
      You earned a badge
    </h1>
    <p style="color:${BRAND_COLOR};font-size:14px;font-family:monospace;margin:0 0 24px 0;">
      ${esc(args.badgeName)}
    </p>
    <p style="color:${TEXT_SECONDARY};font-size:15px;line-height:1.6;margin:0 0 16px 0;">
      Nice, ${safeName}. ${esc(args.badgeDescription)}
    </p>
    ${button("See your badges", args.ctaUrl)}
    <p style="color:${TEXT_SECONDARY};font-size:14px;margin:0;">
      Mousa
    </p>
    ${unsubFooter(args.unsubUrl)}
  `);
}

export function passwordResetEmail(firstName: string, resetUrl: string): string {
  return baseLayout(`
    <h1 style="color:${TEXT_COLOR};font-size:24px;margin:0 0 8px 0;font-family:monospace;">
      Password Reset
    </h1>
    <p style="color:${BRAND_COLOR};font-size:14px;font-family:monospace;margin:0 0 24px 0;">
      You requested a password reset.
    </p>
    <p style="color:${TEXT_SECONDARY};font-size:15px;line-height:1.6;margin:0 0 4px 0;">
      Hi ${esc(firstName)},
    </p>
    <p style="color:${TEXT_SECONDARY};font-size:15px;line-height:1.6;margin:0;">
      Click the button below to set a new password. This link expires in <strong style="color:${TEXT_COLOR};">1 hour</strong>.
    </p>
    ${button("Reset Password", resetUrl)}
    <p style="color:${TEXT_SECONDARY};font-size:13px;line-height:1.6;margin:0 0 16px 0;">
      If you didn't request this, you can safely ignore this email. Your password won't change.
    </p>
    <p style="color:${TEXT_SECONDARY};font-size:14px;margin:0;">
      Mousa
    </p>
  `);
}
