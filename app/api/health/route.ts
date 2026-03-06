import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const start = Date.now();

  try {
    await pool.query("SELECT 1");
    const dbLatency = Date.now() - start;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      db: { connected: true, latencyMs: dbLatency },
    });
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        db: { connected: false },
      },
      { status: 503 },
    );
  }
}
