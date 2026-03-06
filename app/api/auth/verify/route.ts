import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser, setAuthCookie } from "@/lib/jwt";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

interface DbUser {
  id: number;
  email: string;
  first_name: string;
  role: string;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limiter = rateLimit(ip, { maxRequests: 30, windowMs: 15 * 60 * 1000 });
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: "Too many requests." },
        { status: 429 }
      );
    }

    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired session." },
        { status: 401 }
      );
    }

    const rows = await query<DbUser>(
      "SELECT id, email, first_name, role FROM users WHERE id = $1 AND email = $2",
      [auth.userId, auth.email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 401 }
      );
    }

    const user = rows[0];

    const token = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
    const res = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, firstName: user.first_name, role: user.role },
    });
    if (token) setAuthCookie(res, token);
    return res;
  } catch (error) {
    console.error("Auth verify error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
