import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface DbAmbassador {
  id: number;
  name: string;
  platform: string;
  channel_name: string;
  channel_url: string;
  topics: string[];
  bio: string;
  tier: string;
}

export async function GET() {
  try {
    const rows = await query<DbAmbassador>(
      `SELECT id, name, platform, channel_name, channel_url, topics, bio, tier
       FROM ambassadors
       WHERE visible = TRUE
       ORDER BY created_at DESC`
    );

    const ambassadors = rows.map((r) => ({
      id: r.id,
      name: r.name,
      platform: r.platform,
      channelName: r.channel_name,
      channelUrl: r.channel_url,
      topics: r.topics,
      bio: r.bio,
      tier: r.tier,
    }));

    return NextResponse.json({ success: true, ambassadors });
  } catch (error) {
    console.error("Ambassadors GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load ambassadors." },
      { status: 500 }
    );
  }
}
