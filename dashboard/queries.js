import pg from "pg";
import { DEV_SLUGS, PM_SLUGS, DEV_TOTAL, PM_TOTAL } from "./curriculum.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("rlwy.net")
    ? { rejectUnauthorized: false }
    : undefined,
  max: 4,
  idleTimeoutMillis: 30_000,
});

async function q(text, params = []) {
  const res = await pool.query(text, params);
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
    gameLeaderboard,
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
    gameTopScores(),
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
    gameLeaderboard,
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
  try {
    return await q(`
      SELECT
        COUNT(*) AS total,
        AVG(NULLIF(rating, 0))::numeric(10,2) AS avg_rating,
        COUNT(*) FILTER (WHERE comment IS NOT NULL AND length(comment) > 0) AS with_comment
      FROM lesson_feedback
    `);
  } catch {
    return [{ total: 0, avg_rating: null, with_comment: 0, _note: "lesson_feedback schema unknown" }];
  }
}

async function gameTopScores() {
  try {
    return await q(`
      SELECT pattern_slug, MAX(score) AS top_score, COUNT(DISTINCT user_id) AS players, COUNT(*) AS attempts
      FROM game_scores
      GROUP BY pattern_slug
      ORDER BY players DESC, top_score DESC
      LIMIT 25
    `);
  } catch {
    return [];
  }
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
