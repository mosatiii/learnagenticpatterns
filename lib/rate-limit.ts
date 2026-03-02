const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const CLEANUP_INTERVAL_MS = 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  rateLimitMap.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  });
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Simple in-memory rate limiter keyed by IP.
 * Returns { success: true } if under limit, { success: false, retryAfterMs } if blocked.
 */
export function rateLimit(
  ip: string,
  config: RateLimitConfig
): { success: true } | { success: false; retryAfterMs: number } {
  cleanup();

  const now = Date.now();
  const key = ip;
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + config.windowMs });
    return { success: true };
  }

  if (entry.count >= config.maxRequests) {
    return { success: false, retryAfterMs: entry.resetTime - now };
  }

  entry.count++;
  return { success: true };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}
