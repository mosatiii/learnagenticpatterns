import { createHmac, timingSafeEqual } from "crypto";
import { query } from "@/lib/db";

export type EmailKind = "streak" | "badge";

export interface EmailPreferences {
  streak: boolean;
  badge: boolean;
}

const DEFAULT_PREFS: EmailPreferences = { streak: true, badge: true };

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error("JWT_SECRET must be set (min 32 chars) for unsubscribe tokens");
  }
  return s;
}

/** Public site origin for building absolute URLs in emails. */
export function siteOrigin(): string {
  return process.env.PUBLIC_SITE_ORIGIN || "https://learnagenticpatterns.com";
}

/** Build an unsubscribe URL for a given user + email kind. */
export function unsubscribeUrl(userId: number, kind: EmailKind): string {
  const token = signUnsubToken(userId, kind);
  const u = new URL("/api/email-prefs/unsubscribe", siteOrigin());
  u.searchParams.set("uid", String(userId));
  u.searchParams.set("kind", kind);
  u.searchParams.set("t", token);
  return u.toString();
}

export function signUnsubToken(userId: number, kind: EmailKind): string {
  return createHmac("sha256", getSecret())
    .update(`${userId}:${kind}`)
    .digest("hex");
}

export function verifyUnsubToken(userId: number, kind: EmailKind, token: string): boolean {
  const expected = signUnsubToken(userId, kind);
  if (expected.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(token, "hex"));
  } catch {
    return false;
  }
}

export async function getPreferences(userId: number): Promise<EmailPreferences> {
  const rows = await query<{ email_preferences: EmailPreferences | null }>(
    `SELECT email_preferences FROM users WHERE id = $1`,
    [userId]
  );
  const stored = rows[0]?.email_preferences;
  if (!stored) return { ...DEFAULT_PREFS };
  return { ...DEFAULT_PREFS, ...stored };
}

export async function setPreference(userId: number, kind: EmailKind, value: boolean): Promise<void> {
  const current = await getPreferences(userId);
  const next = { ...current, [kind]: value };
  await query(
    `UPDATE users SET email_preferences = $1::jsonb WHERE id = $2`,
    [JSON.stringify(next), userId]
  );
}

/**
 * True if we already sent this kind to this user within the given window.
 * Use to dedupe daily streak reminders, etc.
 */
export async function alreadySent(
  userId: number,
  kind: string,
  withinHours: number
): Promise<boolean> {
  const rows = await query<{ c: string }>(
    `SELECT COUNT(*)::text AS c
     FROM email_sends
     WHERE user_id = $1 AND kind = $2 AND sent_at > NOW() - ($3::int * INTERVAL '1 hour')`,
    [userId, kind, withinHours]
  );
  return parseInt(rows[0]?.c ?? "0", 10) > 0;
}

export async function recordSend(
  userId: number,
  kind: string,
  meta: Record<string, unknown> = {}
): Promise<void> {
  await query(
    `INSERT INTO email_sends (user_id, kind, meta) VALUES ($1, $2, $3::jsonb)`,
    [userId, kind, JSON.stringify(meta)]
  );
}
