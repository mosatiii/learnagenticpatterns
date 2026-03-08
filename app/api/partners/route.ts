import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface DbPartner {
  id: number;
  name: string;
  platform: string;
  channel_name: string;
  channel_url: string;
  topics: string[];
  bio: string;
}

export async function GET() {
  try {
    const rows = await query<DbPartner>(
      `SELECT id, name, platform, channel_name, channel_url, topics, bio
       FROM ambassadors
       WHERE visible = TRUE AND tier = 'partner'
       ORDER BY created_at DESC`
    );

    const partners = rows.map((r) => ({
      id: r.id,
      name: r.name,
      platform: r.platform,
      channelName: r.channel_name,
      channelUrl: r.channel_url,
      topics: r.topics,
      bio: r.bio,
    }));

    return NextResponse.json({ success: true, partners });
  } catch (error) {
    console.error("Partners GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load partners." },
      { status: 500 }
    );
  }
}
