import { NextRequest, NextResponse } from "next/server";

const PRACTICE_HOSTNAME = "practice.learnagenticpatterns.com";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const isPracticeSubdomain =
    hostname === PRACTICE_HOSTNAME || hostname.startsWith("practice.");

  // Redirect main domain /practice → subdomain
  if (!isPracticeSubdomain && request.nextUrl.pathname.startsWith("/practice")) {
    return NextResponse.redirect(
      `https://${PRACTICE_HOSTNAME}${request.nextUrl.pathname.replace("/practice", "") || "/"}`
    );
  }

  // Rewrite practice.learnagenticpatterns.com → /practice routes
  if (isPracticeSubdomain) {
    const url = request.nextUrl.clone();

    if (url.pathname === "/") {
      url.pathname = "/practice";
      return NextResponse.rewrite(url);
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
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
