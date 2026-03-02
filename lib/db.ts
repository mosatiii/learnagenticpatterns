import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

let initialized = false;

async function ensureTables() {
  if (initialized) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id              SERIAL PRIMARY KEY,
      email           TEXT UNIQUE NOT NULL,
      first_name      TEXT NOT NULL,
      password_hash   TEXT NOT NULL,
      role            TEXT,
      challenge       TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reading_progress (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
      pattern_slug    TEXT NOT NULL,
      read_at         TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, pattern_slug)
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token           TEXT UNIQUE NOT NULL,
      expires_at      TIMESTAMPTZ NOT NULL,
      used            BOOLEAN DEFAULT FALSE,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Add password_hash column if upgrading from the old schema
  await pool.query(`
    DO $$ BEGIN
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$;
  `).catch(() => {});

  initialized = true;
}

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  await ensureTables();
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export default pool;
