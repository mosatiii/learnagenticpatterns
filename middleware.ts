import { NextRequest, NextResponse } from "next/server";

const PRACTICE_HOSTNAME = "practice.learnagenticpatterns.com";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";

  // Rewrite practice.learnagenticpatterns.com → /practice routes
  if (hostname === PRACTICE_HOSTNAME || hostname.startsWith("practice.")) {
    const url = request.nextUrl.clone();

    // If visiting the root of the subdomain, serve the /practice page
    if (url.pathname === "/") {
      url.pathname = "/practice";
      return NextResponse.rewrite(url);
    }

    // For any other path on the subdomain, prepend /practice
    // e.g. practice.learnagenticpatterns.com/about → /practice/about
    // But let API routes, _next, and static assets pass through
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
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
