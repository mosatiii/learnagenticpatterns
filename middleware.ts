import { NextRequest, NextResponse } from "next/server";

const PRACTICE_HOSTNAME = "practice.learnagenticpatterns.com";

const ALLOWED_ORIGINS = new Set([
  "https://learnagenticpatterns.com",
  "https://www.learnagenticpatterns.com",
  "https://practice.learnagenticpatterns.com",
]);

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.i.posthog.com https://*.posthog.com https://*.sentry.io",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.i.posthog.com https://*.posthog.com https://*.sentry.io https://api.resend.com",
    "frame-ancestors 'none'",
  ].join("; "),
};

const MUTATING_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

function isValidOrigin(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  return ALLOWED_ORIGINS.has(origin);
}

export function middleware(request: NextRequest) {
  // CSRF: reject mutating requests from unknown origins
  if (MUTATING_METHODS.has(request.method) && !isValidOrigin(request)) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Forbidden" }, { status: 403 })
    );
  }

  const hostname = request.headers.get("host") ?? "";
  const isPracticeSubdomain =
    hostname === PRACTICE_HOSTNAME || hostname.startsWith("practice.");

  // Redirect main domain /practice → subdomain
  if (!isPracticeSubdomain && request.nextUrl.pathname.startsWith("/practice")) {
    const res = NextResponse.redirect(
      `https://${PRACTICE_HOSTNAME}${request.nextUrl.pathname.replace("/practice", "") || "/"}`
    );
    return applySecurityHeaders(res);
  }

  // Rewrite practice.learnagenticpatterns.com → /practice routes
  if (isPracticeSubdomain) {
    const url = request.nextUrl.clone();

    if (url.pathname === "/") {
      url.pathname = "/practice";
      return applySecurityHeaders(NextResponse.rewrite(url));
    }

    if (
      !url.pathname.startsWith("/practice") &&
      !url.pathname.startsWith("/api") &&
      !url.pathname.startsWith("/_next") &&
      !url.pathname.startsWith("/favicon") &&
      !url.pathname.startsWith("/opengraph") &&
      !url.pathname.startsWith("/icon")
    ) {
      url.pathname = `/practice${url.pathname}`;
      return applySecurityHeaders(NextResponse.rewrite(url));
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|ingest).*)",
  ],
};
