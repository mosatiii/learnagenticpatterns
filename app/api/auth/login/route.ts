import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";
import { query } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { signToken, setAuthCookie } from "@/lib/jwt";

interface DbUser {
  id: number;
  email: string;
  first_name: string;
  password_hash: string;
  role: string;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limiter = rateLimit(ip, { maxRequests: 5, windowMs: 15 * 60 * 1000 });
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = loginSchema.parse(body);

    const rows = await query<DbUser>(
      "SELECT id, email, first_name, password_hash, role FROM users WHERE email = $1",
      [validated.email.toLowerCase().trim()]
    );

    const GENERIC_AUTH_ERROR = "Invalid email or password.";

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: GENERIC_AUTH_ERROR },
        { status: 401 }
      );
    }

    const user = rows[0];
    const passwordValid = await bcrypt.compare(validated.password, user.password_hash);

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: GENERIC_AUTH_ERROR },
        { status: 401 }
      );
    }

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
