/**
 * One-time script to backfill existing users into a Resend Audience.
 *
 * Usage:
 *   DATABASE_URL="..." RESEND_API_KEY="..." RESEND_AUDIENCE_ID="..." node scripts/backfill-audience.mjs
 *
 * Safe to run multiple times — Resend deduplicates contacts by email.
 */

import pg from "pg";

const { DATABASE_URL, RESEND_API_KEY, RESEND_AUDIENCE_ID } = process.env;

if (!DATABASE_URL || !RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
  console.error(
    "Missing required env vars: DATABASE_URL, RESEND_API_KEY, RESEND_AUDIENCE_ID"
  );
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

const { rows: users } = await pool.query(
  "SELECT email, first_name FROM users ORDER BY id"
);

console.log(`Found ${users.length} users to sync.\n`);

let succeeded = 0;
let failed = 0;

for (const user of users) {
  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          first_name: user.first_name,
          unsubscribed: false,
        }),
      }
    );

    if (res.ok) {
      console.log(`  OK  ${user.email}`);
      succeeded++;
    } else {
      const body = await res.text();
      console.error(`  FAIL ${user.email} — ${res.status}: ${body}`);
      failed++;
    }
  } catch (err) {
    console.error(`  ERR  ${user.email} — ${err.message}`);
    failed++;
  }

  // 200ms delay between calls to respect rate limits
  await new Promise((r) => setTimeout(r, 200));
}

await pool.end();

console.log(`\nDone. ${succeeded} succeeded, ${failed} failed.`);
