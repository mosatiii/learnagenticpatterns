import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export interface TokenPayload extends JWTPayload {
  userId: number;
  email: string;
}

const ALG = "HS256";
const TOKEN_TTL = "90d";

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

/** Convenience: extract + verify from a Request's Authorization header. */
export async function getAuthUser(request: Request): Promise<TokenPayload | null> {
  return verifyToken(request.headers.get("authorization"));
}
