import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";
import { query } from "@/lib/db";
import {
  peek, recordAttempt, resetKey, getClientIp,
  type RateLimitConfig,
} from "@/lib/rate-limit";
import { signToken, setAuthCookie } from "@/lib/jwt";
import { getPostHogServerClient } from "@/lib/posthog-server";
import { POSTHOG_KEY } from "@/lib/posthog-config";

interface DbUser {
  id: number;
  email: string;
  first_name: string;
  password_hash: string;
  role: string;
}

// Per-IP guard: catches scripted abuse from one source.
const IP_LIMIT: RateLimitConfig = { maxRequests: 10, windowMs: 15 * 60 * 1000 };
// Per-account guard: defends against distributed credential stuffing
// (botnet hits one account from many IPs). Tighter than IP because
// legitimate users rarely fail >5 times in an hour.
const ACCOUNT_LIMIT: RateLimitConfig = { maxRequests: 5, windowMs: 60 * 60 * 1000 };

const TOO_MANY = "Too many login attempts. Please try again later.";
const GENERIC_AUTH_ERROR = "Invalid email or password.";

function captureLockout(scope: "ip" | "account", key: string) {
  if (!POSTHOG_KEY) return;
  try {
    getPostHogServerClient().capture({
      distinctId: `lockout:${scope}:${key}`,
      event: "login_rate_limited",
      properties: { scope },
    });
  } catch {
    // Telemetry must not break the request.
  }
}

function captureFailure(email: string, ip: string) {
  if (!POSTHOG_KEY) return;
  try {
    getPostHogServerClient().capture({
      distinctId: email,
      event: "login_failed",
      properties: { ip },
    });
  } catch {
    // Telemetry must not break the request.
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const ipKey = `login:ip:${ip}`;

    // First gate: per-IP. Peek without recording — only failures count.
    const ipPeek = peek(ipKey, IP_LIMIT);
    if (ipPeek.blocked) {
      captureLockout("ip", ip);
      return NextResponse.json(
        { success: false, message: TOO_MANY },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = loginSchema.parse(body);
    const email = validated.email.toLowerCase().trim();
    const accountKey = `login:account:${email}`;

    // Second gate: per-account. Defends against distributed stuffing.
    const acctPeek = peek(accountKey, ACCOUNT_LIMIT);
    if (acctPeek.blocked) {
      captureLockout("account", email);
      return NextResponse.json(
        { success: false, message: TOO_MANY },
        { status: 429 }
      );
    }

    const rows = await query<DbUser>(
      "SELECT id, email, first_name, password_hash, role FROM users WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      recordAttempt(ipKey, IP_LIMIT);
      recordAttempt(accountKey, ACCOUNT_LIMIT);
      captureFailure(email, ip);
      return NextResponse.json(
        { success: false, message: GENERIC_AUTH_ERROR },
        { status: 401 }
      );
    }

    const user = rows[0];
    const passwordValid = await bcrypt.compare(validated.password, user.password_hash);

    if (!passwordValid) {
      recordAttempt(ipKey, IP_LIMIT);
      recordAttempt(accountKey, ACCOUNT_LIMIT);
      captureFailure(email, ip);
      return NextResponse.json(
        { success: false, message: GENERIC_AUTH_ERROR },
        { status: 401 }
      );
    }

    // Success: clear the per-account counter so a user who mistyped
    // a few times then succeeded doesn't carry forward strikes.
    // IP counter is left alone — others may share the IP.
    resetKey(accountKey);

    const token = await signToken({ userId: user.id, email: user.email });

    const res = NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, firstName: user.first_name, role: user.role },
    });
    return setAuthCookie(res, token);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Invalid form data." },
        { status: 400 }
      );
    }

    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
