import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limiter = rateLimit(`health:${ip}`, { maxRequests: 30, windowMs: 60 * 1000 });
  if (!limiter.success) {
    return NextResponse.json({ status: "rate_limited" }, { status: 429 });
  }

  try {
    await pool.query("SELECT 1");

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { status: "unhealthy", timestamp: new Date().toISOString() },
      { status: 503 },
    );
  }
}
