const esc = (v) =>
  v === null || v === undefined
    ? "—"
    : String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const fmtDate = (v) => (v ? new Date(v).toISOString().slice(0, 16).replace("T", " ") : "—");
const fmtSeconds = (s) => {
  if (s === null || s === undefined) return "—";
  const n = Number(s);
  if (n < 60) return `${Math.round(n)}s`;
  if (n < 3600) return `${Math.round(n / 60)}m`;
  if (n < 86400) return `${(n / 3600).toFixed(1)}h`;
  return `${(n / 86400).toFixed(1)}d`;
};

function statCard(label, value, sub = "") {
  return `
    <div class="stat">
      <div class="stat-label">${esc(label)}</div>
      <div class="stat-value">${esc(value)}</div>
      ${sub ? `<div class="stat-sub">${esc(sub)}</div>` : ""}
    </div>
  `;
}

function table(headers, rows) {
  if (!rows || rows.length === 0) return `<p class="empty">No rows.</p>`;
  return `
    <table>
      <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows
          .map(
            (r) =>
              `<tr>${r
                .map((c) => `<td>${typeof c === "string" && c.startsWith("<") ? c : esc(c)}</td>`)
                .join("")}</tr>`,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function bar(value, max, color = "#6366f1") {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return `
    <div class="bar-wrap">
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>
      <span class="bar-label">${value}</span>
    </div>
  `;
}

export function renderDashboard(d) {
  const o = d.overview;
  const completersDev = d.completers.filter((r) => r.finished === "dev" || r.finished === "both");
  const completersPm = d.completers.filter((r) => r.finished === "pm" || r.finished === "both");

  const maxCohortSignups = Math.max(...d.cohortByWeek.map((r) => Number(r.signups) || 0), 1);
  const maxFunnel = Number(d.activationFunnel[0].step_1_signed_up) || 1;

  const histMax = Math.max(...d.progressHistogram.map((r) => Number(r.users) || 0), 1);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>LAP Internal Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<style>
  :root {
    --bg: #0b0d12;
    --panel: #11141b;
    --panel-2: #161a23;
    --border: #1f2533;
    --text: #e6e9ef;
    --muted: #8b93a7;
    --accent: #f59e0b;
    --primary: #6366f1;
    --success: #10b981;
    --danger: #ef4444;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    font-size: 14px; line-height: 1.5;
  }
  header { padding: 24px; border-bottom: 1px solid var(--border); display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:12px; }
  h1 { margin: 0; font-size: 18px; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  h2 { margin: 32px 0 12px; font-size: 13px; font-family: ui-monospace, "SF Mono", Menlo, monospace; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
  main { padding: 24px; max-width: 1280px; margin: 0 auto; }
  .ts { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 11px; color: var(--muted); }
  .grid { display: grid; gap: 12px; }
  .grid-stats { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
  .stat { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; }
  .stat-label { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 6px; }
  .stat-value { font-size: 24px; font-weight: 600; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  .stat-sub { font-size: 11px; color: var(--muted); margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; background: var(--panel); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
  th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--border); font-size: 13px; }
  th { background: var(--panel-2); font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
  tr:last-child td { border-bottom: 0; }
  tr:hover td { background: rgba(99,102,241,0.06); }
  .bar-wrap { display: flex; align-items: center; gap: 8px; }
  .bar-track { flex: 1; height: 6px; background: var(--panel-2); border-radius: 3px; overflow: hidden; min-width: 80px; }
  .bar-fill { height: 100%; }
  .bar-label { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 11px; color: var(--muted); min-width: 28px; text-align: right; }
  .empty { color: var(--muted); font-style: italic; padding: 12px; }
  .pill { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  .pill-dev { background: rgba(99,102,241,0.15); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.3); }
  .pill-pm { background: rgba(245,158,11,0.15); color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
  .pill-both { background: rgba(16,185,129,0.15); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3); }
  .warn { background: rgba(239,68,68,0.10); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 10px 14px; border-radius: 8px; margin: 12px 0; font-size: 13px; }
  .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width: 900px) { .row-2 { grid-template-columns: 1fr; } }
  footer { padding: 24px; color: var(--muted); font-size: 11px; font-family: ui-monospace, "SF Mono", Menlo, monospace; text-align: center; border-top: 1px solid var(--border); margin-top: 48px; }
  a { color: var(--primary); }
</style>
</head>
<body>
<header>
  <h1>$ lap.dashboard / internal</h1>
  <span class="ts">${new Date().toISOString()}</span>
</header>

<main>
  ${
    d.unknownSlugs.length > 0
      ? `<div class="warn">⚠ ${d.unknownSlugs.length} slug(s) in <code>reading_progress</code> are not in the dashboard's curriculum list. Update <code>dashboard/curriculum.js</code> to keep completion counts accurate. Unknown: ${d.unknownSlugs.map((r) => esc(r.pattern_slug)).join(", ")}</div>`
      : ""
  }

  <h2>// overview</h2>
  <div class="grid grid-stats">
    ${statCard("Total users", o.total_users)}
    ${statCard("Signups (7d)", o.signups_7d, `${o.signups_30d} in 30d`)}
    ${statCard("Active readers (7d)", o.active_readers_7d)}
    ${statCard("Ever read 1+", o.ever_read, `${Math.round((o.ever_read / o.total_users) * 100)}% of signups`)}
    ${statCard("Read nothing", o.read_nothing, `${Math.round((o.read_nothing / o.total_users) * 100)}% of signups`)}
    ${statCard("Finished Dev (21/21)", o.finished_dev)}
    ${statCard("Finished PM (15/15)", o.finished_pm)}
    ${statCard("Finished both", o.finished_both)}
  </div>

  <div class="row-2">
    <div>
      <h2>// activation funnel</h2>
      ${(() => {
        const f = d.activationFunnel[0];
        const steps = [
          ["1. Signed up", f.step_1_signed_up],
          ["2. Read within 24h of signup", f.step_2_read_within_24h],
          ["3. Read at least one lesson", f.step_3_read_at_least_one],
          ["4. Read 5 or more lessons", f.step_4_read_5_plus],
          ["5. Read 10 or more lessons", f.step_5_read_10_plus],
          ["6. Completed their track", f.step_6_completed_track],
        ];
        return table(
          ["Step", "Users", "% of signups", ""],
          steps.map(([label, val]) => [
            label,
            val,
            `${maxFunnel ? Math.round((val / maxFunnel) * 100) : 0}%`,
            bar(val, maxFunnel),
          ]),
        );
      })()}
    </div>

    <div>
      <h2>// progress distribution</h2>
      ${table(
        ["Bucket", "Users", ""],
        d.progressHistogram.map((r) => [r.bucket.slice(4), r.users, bar(Number(r.users), histMax, "#10b981")]),
      )}
    </div>
  </div>

  <h2>// time from signup to first read</h2>
  ${(() => {
    const t = d.timeToFirstRead[0];
    return `
      <div class="grid grid-stats">
        ${statCard("Median", fmtSeconds(t.median_seconds), `n=${t.sample}`)}
        ${statCard("Average", fmtSeconds(t.avg_seconds))}
        ${statCard("p90", fmtSeconds(t.p90_seconds))}
      </div>
    `;
  })()}

  <h2>// signed up vs activated, by signup week</h2>
  ${table(
    ["Cohort week", "Signups", "Activated", "Read 5+", "Completed track", ""],
    d.cohortByWeek.map((r) => [
      fmtDate(r.cohort).slice(0, 10),
      r.signups,
      `${r.activated} (${r.signups ? Math.round((r.activated / r.signups) * 100) : 0}%)`,
      r.read_5_plus,
      r.completed,
      bar(Number(r.signups), maxCohortSignups),
    ]),
  )}

  <h2>// who finished a track (${d.completers.length})</h2>
  <p style="color: var(--muted); font-size: 12px; margin: 0 0 8px;">These are the people to email for testimonials, advanced track interest, or contributor outreach.</p>
  ${table(
    ["Email", "First name", "Track signed up as", "Dev / 21", "PM / 15", "Finished", "Last read", "Joined"],
    d.completers.map((r) => [
      r.email,
      r.first_name,
      r.role,
      r.dev_done,
      r.pm_done,
      `<span class="pill pill-${r.finished}">${esc(r.finished)}</span>`,
      fmtDate(r.last_read),
      fmtDate(r.created_at),
    ]),
  )}

  <h2>// top engaged users</h2>
  ${table(
    ["Email", "Role", "Distinct slugs read", "Dev / 21", "PM / 15", "Last read", "Joined"],
    d.topUsers.map((r) => [
      r.email,
      r.role,
      r.total_distinct,
      r.dev_done,
      r.pm_done,
      fmtDate(r.last_read),
      fmtDate(r.created_at),
    ]),
  )}

  <div class="row-2">
    <div>
      <h2>// most-read dev patterns</h2>
      ${(() => {
        const max = Math.max(...d.mostReadDev.map((r) => Number(r.readers) || 0), 1);
        return table(
          ["Pattern", "Readers", ""],
          d.mostReadDev.map((r) => [r.pattern_slug, r.readers, bar(Number(r.readers), max)]),
        );
      })()}
    </div>
    <div>
      <h2>// most-read PM modules</h2>
      ${(() => {
        const max = Math.max(...d.mostReadPm.map((r) => Number(r.readers) || 0), 1);
        return table(
          ["Module", "Readers", ""],
          d.mostReadPm.map((r) => [r.pattern_slug, r.readers, bar(Number(r.readers), max, "#f59e0b")]),
        );
      })()}
    </div>
  </div>

  <h2>// cross-track readers (read at least one of each)</h2>
  ${table(
    ["Email", "Signed up as", "Dev read", "PM read"],
    d.crossTrack.map((r) => [r.email, r.role, r.dev_done, r.pm_done]),
  )}

  <h2>// game leaderboard</h2>
  ${table(
    ["Game", "Top score", "Distinct players", "Total attempts"],
    d.gameLeaderboard.map((r) => [r.pattern_slug, r.top_score, r.players, r.attempts]),
  )}

  <h2>// signup track distribution</h2>
  ${table(
    ["Role", "Users"],
    d.trackMix.map((r) => [r.role, r.users]),
  )}

  <h2>// lesson feedback</h2>
  ${(() => {
    const f = d.feedback[0];
    if (f._note) return `<p class="empty">${esc(f._note)}. Add a thumbs / rating column to <code>lesson_feedback</code> to populate this section.</p>`;
    return `
      <div class="grid grid-stats">
        ${statCard("Total feedback rows", f.total)}
        ${statCard("Avg rating", f.avg_rating ?? "—")}
        ${statCard("With comment", f.with_comment)}
      </div>
    `;
  })()}
</main>

<footer>
  Internal use only. State of truth = Postgres. PostHog stays for behavioral and acquisition analysis.
</footer>
</body>
</html>`;
}

export function renderUnauthorized() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Restricted</title>
<meta name="robots" content="noindex, nofollow" />
<style>
  body { margin:0; background:#0b0d12; color:#e6e9ef; font-family: ui-monospace, "SF Mono", Menlo, monospace; display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .box { text-align:center; }
  form { display:inline-flex; gap:8px; margin-top:16px; }
  input { background:#11141b; border:1px solid #1f2533; color:#e6e9ef; padding:10px 14px; border-radius:6px; font-family:inherit; min-width:280px; }
  button { background:#6366f1; color:white; border:0; padding:10px 18px; border-radius:6px; font-family:inherit; cursor:pointer; }
  button:hover { background:#4f46e5; }
  p { color:#8b93a7; font-size:13px; }
</style>
</head>
<body>
<div class="box">
  <p>$ access denied</p>
  <form method="get" action="/">
    <input type="password" name="code" placeholder="access code" autofocus required />
    <button type="submit">enter</button>
  </form>
</div>
</body>
</html>`;
}

export function renderError(message) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Error</title><meta name="robots" content="noindex"></head>
<body style="margin:0;padding:40px;background:#0b0d12;color:#fca5a5;font-family:ui-monospace,monospace;">
<h1 style="font-size:16px">$ error</h1>
<pre style="white-space:pre-wrap;background:#11141b;padding:16px;border-radius:6px;border:1px solid #1f2533;color:#e6e9ef;">${esc(message)}</pre>
</body></html>`;
}
