import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { NextResponse } from "next/server";

export interface TokenPayload extends JWTPayload {
  userId: number;
  email: string;
}

const ALG = "HS256";
const TOKEN_TTL = "14d";
const COOKIE_NAME = "lap_token_shared";
const COOKIE_MAX_AGE = 14 * 24 * 60 * 60; // 14 days

function getSecret() {
  const raw = process.env.JWT_SECRET;
  if (!raw || raw.length < 32) {
    throw new Error("JWT_SECRET env var must be set (min 32 chars)");
  }
  return new TextEncoder().encode(raw);
}

/** Issue a signed JWT containing the user's id and email. */
export async function signToken(payload: { userId: number; email: string }): Promise<string> {
  return new SignJWT({ userId: payload.userId, email: payload.email })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecret());
}

/**
 * Verify and decode a JWT. Returns the payload or null if invalid/expired.
 * Extracts the token from a raw header value like "Bearer <token>".
 */
export async function verifyToken(headerValue: string | null): Promise<TokenPayload | null> {
  if (!headerValue) return null;

  const token = headerValue.startsWith("Bearer ")
    ? headerValue.slice(7)
    : headerValue;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.userId || !payload.email) return null;
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

/** Parse the auth cookie value from a Request's Cookie header. */
function getTokenFromCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? match[1] : null;
}

/**
 * Extract + verify auth from Authorization header first, then fall back
 * to the httpOnly cookie. Works for both API calls and page navigations.
 */
export async function getAuthUser(request: Request): Promise<TokenPayload | null> {
  const fromHeader = await verifyToken(request.headers.get("authorization"));
  if (fromHeader) return fromHeader;

  const cookieToken = getTokenFromCookie(request);
  return verifyToken(cookieToken);
}

/** Get the raw token string from the request (header or cookie). */
export function getRawToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  }
  return getTokenFromCookie(request);
}

/**
 * Decide the Set-Cookie Domain attribute. We only want the cross-subdomain
 * `.learnagenticpatterns.com` value when actually deployed to that hostname —
 * otherwise (Railway dev URL, localhost) the browser rejects the cookie.
 * Returning undefined => host-only cookie, which works on any host.
 */
function getCookieDomain(): string | undefined {
  if (process.env.NODE_ENV !== "production") return undefined;
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  return siteUrl.includes("learnagenticpatterns.com")
    ? ".learnagenticpatterns.com"
    : undefined;
}

/**
 * Attach a Set-Cookie header so the JWT is shared across all
 * *.learnagenticpatterns.com subdomains in prod (practice.*, www.*).
 * On any other host (dev Railway URL, local) the cookie is host-only.
 */
export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  const isProd = process.env.NODE_ENV === "production";
  const domain = getCookieDomain();
  response.cookies.set(COOKIE_NAME, token, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: isProd,
    httpOnly: true,
    ...(domain ? { domain } : {}),
  });
  return response;
}

/** Clear the auth cookie (for logout). Domain must match how it was set. */
export function clearAuthCookie(response: NextResponse): NextResponse {
  const isProd = process.env.NODE_ENV === "production";
  const domain = getCookieDomain();
  response.cookies.set(COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: isProd,
    httpOnly: true,
    ...(domain ? { domain } : {}),
  });
  return response;
}
