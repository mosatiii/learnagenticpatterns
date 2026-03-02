import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface DbUser {
  id: number;
  email: string;
  first_name: string;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const rows = await query<DbUser>(
      "SELECT id, email, first_name FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Email not found. Please sign up first." },
        { status: 404 }
      );
    }

    const user = rows[0];

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, firstName: user.first_name },
    });
  } catch (error) {
    console.error("Auth verify error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
