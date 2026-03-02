import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";
import { query } from "@/lib/db";

interface DbUser {
  id: number;
  email: string;
  first_name: string;
  password_hash: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    const rows = await query<DbUser>(
      "SELECT id, email, first_name, password_hash FROM users WHERE email = $1",
      [validated.email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "No account found with this email." },
        { status: 401 }
      );
    }

    const user = rows[0];
    const passwordValid = await bcrypt.compare(validated.password, user.password_hash);

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, firstName: user.first_name },
    });
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
