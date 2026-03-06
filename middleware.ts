import { NextRequest, NextResponse } from "next/server";

const PRACTICE_HOSTNAME = "practice.learnagenticpatterns.com";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export function middleware(request: NextRequest) {
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
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
