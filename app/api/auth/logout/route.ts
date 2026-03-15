import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/jwt";

export async function POST() {
  const res = NextResponse.json({ success: true });
  return clearAuthCookie(res);
}
