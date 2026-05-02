import pg from "pg";
import { DEV_SLUGS, PM_SLUGS, DEV_TOTAL, PM_TOTAL } from "./curriculum.js";

const { Pool } = pg;

export function validateDatabaseUrl(raw) {
  if (!raw || typeof raw !== "string" || raw.trim() === "") {
    throw new Error("DATABASE_URL is not set. Add it under the dashboard service Variables in Railway.");
  }
  if (raw.includes("${{") || raw.includes("}}")) {
    throw new Error(
      `DATABASE_URL is a literal placeholder string ("${raw}"), not a resolved value. ` +
        `In Railway, delete this variable and re-add it using the variable picker (the icon to the right of the value field) ` +
        `to create a reference like \${{Postgres.DATABASE_URL}}. Typing the placeholder by hand does not work.`,
    );
  }
  let u;
  try {
    u = new URL(raw);
  } catch {
    throw new Error(`DATABASE_URL is not a valid URL: "${raw.slice(0, 30)}…"`);
  }
  if (!u.protocol.startsWith("postgres")) {
    throw new Error(`DATABASE_URL must use the postgres:// or postgresql:// scheme. Got "${u.protocol}".`);
  }
  if (["localhost", "127.0.0.1", "::1", ""].includes(u.hostname)) {
    throw new Error(
      `DATABASE_URL points at "${u.hostname}", which is the dashboard container itself. ` +
        `Use the public Postgres URL (e.g. *.rlwy.net) or a Railway internal reference like \${{Postgres.DATABASE_URL}}.`,
    );
  }
  return u;
}

let _pool;
export function getPool() {
  if (_pool) return _pool;
  const raw = process.env.DATABASE_URL;
  validateDatabaseUrl(raw); // throws on bad config; surfaces clear message
  const useSsl = /rlwy\.net|render\.com|amazonaws\.com|supabase\.co|neon\.tech/.test(raw);
  _pool = new Pool({
    connectionString: raw,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 4,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
  });
  return _pool;
}

export async function endPool() {
  if (_pool) await _pool.end();
}

export async function pingDatabase() {
  const p = getPool();
  const res = await p.query("SELECT 1 AS ok");
  return res.rows[0].ok === 1;
}

async function q(text, params = []) {
  const res = await getPool().query(text, params);
  return res.rows;
}

export async function loadAll() {
  const [
    overview,
    trackMix,
    completers,
    topUsers,
    progressHistogram,
    activationFunnel,
    cohortByWeek,
    timeToFirstRead,
    crossTrack,
    mostReadDev,
    mostReadPm,
    feedback,
    games,
    challenges,
    unknownSlugs,
  ] = await Promise.all([
    overviewStats(),
    trackDistribution(),
    finishedTrack(),
    topEngagedUsers(),
    progressDistribution(),
    activation(),
    weeklyCohorts(),
    timeFromSignupToFirstRead(),
    crossTrackReaders(),
    mostRead(DEV_SLUGS),
    mostRead(PM_SLUGS),
    feedbackSummary(),
    gameStats(),
    challengeStats(),
    unknownSlugCheck(),
  ]);

  return {
    overview,
    trackMix,
    completers,
    topUsers,
    progressHistogram,
    activationFunnel,
    cohortByWeek,
    timeToFirstRead,
    crossTrack,
    mostReadDev,
    mostReadPm,
    feedback,
    games,
    challenges,
    unknownSlugs,
  };
}

async function overviewStats() {
  const rows = await q(
    `
    WITH per_user AS (
      SELECT u.id,
        COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($1) THEN rp.pattern_slug END) AS dev_done,
        COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($2) THEN rp.pattern_slug END) AS pm_done,
        MAX(rp.read_at) AS last_read
      FROM users u
      LEFT JOIN reading_progress rp ON rp.user_id = u.id
      GROUP BY u.id
    )
    SELECT
      (SELECT COUNT(*) FROM users)                                                  AS total_users,
      (SELECT COUNT(*) FROM users WHERE created_at >= now() - INTERVAL '7 days')    AS signups_7d,
      (SELECT COUNT(*) FROM users WHERE created_at >= now() - INTERVAL '30 days')   AS signups_30d,
      (SELECT COUNT(*) FROM users WHERE created_at >= now() - INTERVAL '24 hours')  AS signups_24h,
      (SELECT MIN(created_at) FROM users)                                           AS first_signup,
      (SELECT MAX(created_at) FROM users)                                           AS latest_signup,
      (SELECT COUNT(DISTINCT user_id) FROM reading_progress
        WHERE read_at >= now() - INTERVAL '7 days')                                 AS active_readers_7d,
      (SELECT COUNT(*) FROM per_user WHERE dev_done = $3)                           AS finished_dev,
      (SELECT COUNT(*) FROM per_user WHERE pm_done  = $4)                           AS finished_pm,
      (SELECT COUNT(*) FROM per_user WHERE dev_done = $3 AND pm_done = $4)          AS finished_both,
      (SELECT COUNT(*) FROM per_user WHERE dev_done = 0 AND pm_done = 0)            AS read_nothing,
      (SELECT COUNT(*) FROM per_user WHERE last_read IS NOT NULL)                   AS ever_read
    `,
    [DEV_SLUGS, PM_SLUGS, DEV_TOTAL, PM_TOTAL],
  );
  return rows[0];
}

async function trackDistribution() {
  return q(`
    SELECT COALESCE(role, 'Unset') AS role, COUNT(*) AS users
    FROM users
    GROUP BY role
    ORDER BY users DESC
  `);
}

async function finishedTrack() {
  return q(
    `
    WITH per_user AS (
      SELECT u.id, u.email, u.first_name, u.role, u.created_at,
        COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($1) THEN rp.pattern_slug END) AS dev_done,
        COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($2) THEN rp.pattern_slug END) AS pm_done,
        MAX(rp.read_at) AS last_read
      FROM users u
      LEFT JOIN reading_progress rp ON rp.user_id = u.id
      GROUP BY u.id
    )
    SELECT email, first_name, role, dev_done, pm_done, created_at, last_read,
      CASE
        WHEN dev_done = $3 AND pm_done = $4 THEN 'both'
        WHEN dev_done = $3 THEN 'dev'
        WHEN pm_done  = $4 THEN 'pm'
      END AS finished
    FROM per_user
    WHERE dev_done = $3 OR pm_done = $4
    ORDER BY last_read DESC NULLS LAST
    `,
    [DEV_SLUGS, PM_SLUGS, DEV_TOTAL, PM_TOTAL],
  );
}

async function topEngagedUsers() {
  return q(
    `
    SELECT u.email, u.first_name, u.role, u.created_at,
      COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($1) THEN rp.pattern_slug END) AS dev_done,
      COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($2) THEN rp.pattern_slug END) AS pm_done,
      COUNT(DISTINCT rp.pattern_slug) AS total_distinct,
      MAX(rp.read_at) AS last_read
    FROM users u
    LEFT JOIN reading_progress rp ON rp.user_id = u.id
    GROUP BY u.id, u.email, u.first_name, u.role, u.created_at
    HAVING COUNT(rp.pattern_slug) > 0
    ORDER BY total_distinct DESC, last_read DESC NULLS LAST
    LIMIT 25
    `,
    [DEV_SLUGS, PM_SLUGS],
  );
}

async function progressDistribution() {
  return q(
    `
    WITH per_user AS (
      SELECT u.id, u.role,
        COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($1) THEN rp.pattern_slug END) AS dev_done,
        COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($2) THEN rp.pattern_slug END) AS pm_done
      FROM users u
      LEFT JOIN reading_progress rp ON rp.user_id = u.id
      GROUP BY u.id, u.role
    ),
    bucketed AS (
      SELECT
        CASE role
          WHEN 'Product Manager' THEN pm_done::float / NULLIF($4, 0)
          ELSE dev_done::float / NULLIF($3, 0)
        END AS pct,
        role
      FROM per_user
    )
    SELECT
      CASE
        WHEN pct IS NULL OR pct = 0 THEN '00. 0%'
        WHEN pct <  0.10 THEN '01. 1-9%'
        WHEN pct <  0.25 THEN '02. 10-24%'
        WHEN pct <  0.50 THEN '03. 25-49%'
        WHEN pct <  0.75 THEN '04. 50-74%'
        WHEN pct <  1.00 THEN '05. 75-99%'
        ELSE '06. 100% (completed)'
      END AS bucket,
      COUNT(*) AS users
    FROM bucketed
    GROUP BY bucket
    ORDER BY bucket
    `,
    [DEV_SLUGS, PM_SLUGS, DEV_TOTAL, PM_TOTAL],
  );
}

async function activation() {
  return q(
    `
    WITH per_user AS (
      SELECT u.id, u.created_at,
        COUNT(DISTINCT rp.pattern_slug) AS reads,
        MIN(rp.read_at) AS first_read,
        COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($1) THEN rp.pattern_slug END) AS dev_done,
        COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($2) THEN rp.pattern_slug END) AS pm_done
      FROM users u
      LEFT JOIN reading_progress rp ON rp.user_id = u.id
      GROUP BY u.id, u.created_at
    )
    SELECT
      (SELECT COUNT(*) FROM users)                                          AS step_1_signed_up,
      (SELECT COUNT(*) FROM per_user WHERE first_read IS NOT NULL
        AND first_read <= created_at + INTERVAL '24 hours')                 AS step_2_read_within_24h,
      (SELECT COUNT(*) FROM per_user WHERE reads >= 1)                      AS step_3_read_at_least_one,
      (SELECT COUNT(*) FROM per_user WHERE reads >= 5)                      AS step_4_read_5_plus,
      (SELECT COUNT(*) FROM per_user WHERE reads >= 10)                     AS step_5_read_10_plus,
      (SELECT COUNT(*) FROM per_user WHERE dev_done = $3 OR pm_done = $4)   AS step_6_completed_track
    `,
    [DEV_SLUGS, PM_SLUGS, DEV_TOTAL, PM_TOTAL],
  );
}

async function weeklyCohorts() {
  return q(
    `
    WITH per_user AS (
      SELECT u.id,
        date_trunc('week', u.created_at)::date AS cohort,
        COUNT(DISTINCT rp.pattern_slug) AS reads,
        COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($1) THEN rp.pattern_slug END) AS dev_done,
        COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($2) THEN rp.pattern_slug END) AS pm_done,
        MIN(rp.read_at) AS first_read
      FROM users u
      LEFT JOIN reading_progress rp ON rp.user_id = u.id
      GROUP BY u.id, u.created_at
    )
    SELECT cohort,
      COUNT(*) AS signups,
      COUNT(*) FILTER (WHERE first_read IS NOT NULL) AS activated,
      COUNT(*) FILTER (WHERE reads >= 5) AS read_5_plus,
      COUNT(*) FILTER (WHERE dev_done = $3 OR pm_done = $4) AS completed
    FROM per_user
    GROUP BY cohort
    ORDER BY cohort DESC
    LIMIT 12
    `,
    [DEV_SLUGS, PM_SLUGS, DEV_TOTAL, PM_TOTAL],
  );
}

async function timeFromSignupToFirstRead() {
  return q(`
    WITH first_reads AS (
      SELECT u.id, u.created_at, MIN(rp.read_at) AS first_read
      FROM users u
      JOIN reading_progress rp ON rp.user_id = u.id
      GROUP BY u.id, u.created_at
    ),
    deltas AS (
      SELECT EXTRACT(EPOCH FROM (first_read - created_at)) AS seconds
      FROM first_reads
      WHERE first_read >= created_at
    )
    SELECT
      ROUND(AVG(seconds))                                                 AS avg_seconds,
      ROUND(percentile_cont(0.50) WITHIN GROUP (ORDER BY seconds)::numeric) AS median_seconds,
      ROUND(percentile_cont(0.90) WITHIN GROUP (ORDER BY seconds)::numeric) AS p90_seconds,
      COUNT(*)                                                            AS sample
    FROM deltas
  `);
}

async function crossTrackReaders() {
  return q(
    `
    SELECT u.email, u.role,
      COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($1) THEN rp.pattern_slug END) AS dev_done,
      COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($2) THEN rp.pattern_slug END) AS pm_done
    FROM users u
    JOIN reading_progress rp ON rp.user_id = u.id
    GROUP BY u.id, u.email, u.role
    HAVING COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($1) THEN rp.pattern_slug END) > 0
       AND COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($2) THEN rp.pattern_slug END) > 0
    ORDER BY (
      COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($1) THEN rp.pattern_slug END) +
      COUNT(DISTINCT CASE WHEN rp.pattern_slug = ANY($2) THEN rp.pattern_slug END)
    ) DESC
    LIMIT 20
    `,
    [DEV_SLUGS, PM_SLUGS],
  );
}

async function mostRead(slugs) {
  return q(
    `
    SELECT pattern_slug, COUNT(DISTINCT user_id) AS readers
    FROM reading_progress
    WHERE pattern_slug = ANY($1)
    GROUP BY pattern_slug
    ORDER BY readers DESC
    `,
    [slugs],
  );
}

async function feedbackSummary() {
  const overall = await q(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE helpful = true)::int  AS helpful_count,
      COUNT(*) FILTER (WHERE helpful = false)::int AS not_helpful_count,
      ROUND(100.0 * COUNT(*) FILTER (WHERE helpful = true) / NULLIF(COUNT(*), 0), 1)::float AS helpful_rate,
      COUNT(DISTINCT lesson_slug)::int AS lessons_with_any_feedback
    FROM lesson_feedback
  `);
  const perLesson = await q(`
    SELECT lesson_slug, track,
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE helpful)::int AS helpful_count,
      COUNT(*) FILTER (WHERE NOT helpful)::int AS not_helpful_count,
      ROUND(100.0 * COUNT(*) FILTER (WHERE helpful) / NULLIF(COUNT(*), 0), 0)::int AS helpful_rate
    FROM lesson_feedback
    GROUP BY lesson_slug, track
    ORDER BY total DESC, helpful_rate ASC
    LIMIT 25
  `);
  return { overall: overall[0], perLesson };
}

async function gameStats() {
  const overall = await q(`
    SELECT
      COUNT(*)::int AS total_attempts,
      COUNT(DISTINCT user_id)::int AS players,
      COUNT(*) FILTER (WHERE passed)::int AS pass_attempts,
      ROUND(100.0 * COUNT(*) FILTER (WHERE passed) / NULLIF(COUNT(*), 0), 1)::float AS pass_rate
    FROM game_scores
  `);
  const perGame = await q(`
    SELECT pattern_slug,
      COUNT(*)::int AS attempts,
      COUNT(DISTINCT user_id)::int AS players,
      MAX(score_total)::int AS top_score,
      MAX(score_max)::int   AS score_max,
      ROUND(AVG(score_total))::int AS avg_score,
      COUNT(*) FILTER (WHERE passed)::int AS passes,
      ROUND(100.0 * COUNT(*) FILTER (WHERE passed) / NULLIF(COUNT(*), 0), 0)::int AS pass_rate
    FROM game_scores
    GROUP BY pattern_slug
    ORDER BY players DESC, attempts DESC
  `);
  return { overall: overall[0], perGame };
}

async function challengeStats() {
  return q(`
    SELECT
      COUNT(*)::int AS total_attempts,
      COUNT(DISTINCT user_id)::int AS players
    FROM challenge_scores
  `);
}

async function unknownSlugCheck() {
  const known = [...DEV_SLUGS, ...PM_SLUGS];
  return q(
    `
    SELECT pattern_slug, COUNT(DISTINCT user_id) AS users
    FROM reading_progress
    WHERE NOT (pattern_slug = ANY($1))
    GROUP BY pattern_slug
    ORDER BY users DESC
    `,
    [known],
  );
}
