import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

/**
 * Auto-creates tables on first connection if they don't exist.
 * Called once at startup via the first query.
 */
let initialized = false;

async function ensureTables() {
  if (initialized) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      first_name    TEXT NOT NULL,
      role          TEXT,
      challenge     TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reading_progress (
      id            SERIAL PRIMARY KEY,
      user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
      pattern_slug  TEXT NOT NULL,
      read_at       TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, pattern_slug)
    );
  `);

  initialized = true;
}

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  await ensureTables();
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export default pool;
