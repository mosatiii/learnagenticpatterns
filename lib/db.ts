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

    CREATE TABLE IF NOT EXISTS game_scores (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
      pattern_slug    TEXT NOT NULL,
      score_total     INTEGER NOT NULL,
      score_max       INTEGER NOT NULL,
      architecture    INTEGER NOT NULL DEFAULT 0,
      resilience      INTEGER NOT NULL DEFAULT 0,
      efficiency      INTEGER NOT NULL DEFAULT 0,
      passed          BOOLEAN NOT NULL DEFAULT FALSE,
      played_at       TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS lesson_feedback (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
      lesson_slug     TEXT NOT NULL,
      track           TEXT NOT NULL DEFAULT 'developer',
      helpful         BOOLEAN NOT NULL,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, lesson_slug)
    );

    CREATE TABLE IF NOT EXISTS challenge_scores (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
      pattern_slug    TEXT NOT NULL,
      challenge_type  TEXT NOT NULL,
      difficulty      TEXT NOT NULL DEFAULT 'apprentice',
      score_total     INTEGER NOT NULL,
      score_max       INTEGER NOT NULL,
      passed          BOOLEAN NOT NULL DEFAULT FALSE,
      metadata        JSONB DEFAULT '{}',
      played_at       TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ambassador_applications (
      id              SERIAL PRIMARY KEY,
      name            TEXT NOT NULL,
      email           TEXT NOT NULL,
      channel_url     TEXT NOT NULL,
      platform        TEXT NOT NULL,
      follower_count  TEXT NOT NULL,
      why_audience    TEXT NOT NULL,
      status          TEXT NOT NULL DEFAULT 'pending',
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS community_partner_applications (
      id              SERIAL PRIMARY KEY,
      name            TEXT NOT NULL,
      email           TEXT NOT NULL,
      channel_url     TEXT NOT NULL,
      platform        TEXT NOT NULL,
      why_partner     TEXT NOT NULL,
      status          TEXT NOT NULL DEFAULT 'pending',
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ambassadors (
      id              SERIAL PRIMARY KEY,
      name            TEXT NOT NULL,
      platform        TEXT NOT NULL,
      channel_name    TEXT NOT NULL,
      channel_url     TEXT UNIQUE NOT NULL,
      topics          TEXT[] DEFAULT '{}',
      bio             TEXT NOT NULL DEFAULT '',
      tier            TEXT NOT NULL DEFAULT 'ambassador',
      visible         BOOLEAN NOT NULL DEFAULT TRUE,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS user_badges (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
      badge_slug      TEXT NOT NULL,
      earned_at       TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, badge_slug)
    );

    CREATE TABLE IF NOT EXISTS email_sends (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
      kind            TEXT NOT NULL,
      meta            JSONB DEFAULT '{}',
      sent_at         TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS email_sends_user_kind_idx ON email_sends(user_id, kind, sent_at);
  `);

  // Add password_hash column if upgrading from the old schema
  await pool.query(`
    DO $$ BEGIN
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$;
  `).catch(() => {});

  // Per-channel email opt-out preferences. Defaults: all channels on.
  await pool.query(`
    DO $$ BEGIN
      ALTER TABLE users ADD COLUMN IF NOT EXISTS email_preferences JSONB
        NOT NULL DEFAULT '{"streak": true, "badge": true}'::jsonb;
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
