const esc = (v) =>
  v === null || v === undefined
    ? "—"
    : String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const fmtDate = (v) => (v ? new Date(v).toISOString().slice(0, 10) : "—");
const fmtDateTime = (v) => (v ? new Date(v).toISOString().slice(0, 16).replace("T", " ") : "—");
const fmtSeconds = (s) => {
  if (s === null || s === undefined) return "—";
  const n = Number(s);
  if (n < 60) return `${Math.round(n)}s`;
  if (n < 3600) return `${Math.round(n / 60)}m`;
  if (n < 86400) return `${(n / 3600).toFixed(1)}h`;
  return `${(n / 86400).toFixed(1)}d`;
};
const pct = (a, b) => (b > 0 ? Math.round((Number(a) / Number(b)) * 100) : 0);

function statCard(label, value, sub = "", tone = "") {
  return `<div class="stat ${tone ? `stat-${tone}` : ""}"><div class="stat-label">${esc(label)}</div><div class="stat-value">${esc(value)}</div>${sub ? `<div class="stat-sub">${esc(sub)}</div>` : ""}</div>`;
}

function table(headers, rows, opts = {}) {
  if (!rows || rows.length === 0) return `<div class="empty">${esc(opts.empty || "No rows yet.")}</div>`;
  return `<div class="table-wrap"><table>
    <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${typeof c === "string" && c.trimStart().startsWith("<") ? c : esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}

function bar(value, max, color = "var(--primary)") {
  const p = max ? Math.min(100, Math.round((Number(value) / Number(max)) * 100)) : 0;
  return `<div class="bar-wrap"><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${color}"></div></div><span class="bar-label">${value}</span></div>`;
}

function pill(text, kind = "neutral") {
  return `<span class="pill pill-${kind}">${esc(text)}</span>`;
}

function section(id, title, sub, body) {
  return `<section id="${id}" class="section">
    <header class="section-head">
      <h2><span class="section-num">${id.padStart(2, "0").slice(-2)}</span> ${esc(title)}</h2>
      ${sub ? `<p class="section-sub">${esc(sub)}</p>` : ""}
    </header>
    ${body}
  </section>`;
}

function callout(text, kind = "info") {
  return `<div class="callout callout-${kind}">${text}</div>`;
}

export function renderDashboard(d) {
  const o = d.overview;
  const totalUsers = Number(o.total_users) || 0;
  const completersDev = d.completers.filter((r) => r.finished === "dev" || r.finished === "both");
  const completersPm = d.completers.filter((r) => r.finished === "pm" || r.finished === "both");
  const f = d.activationFunnel[0];
  const t = d.timeToFirstRead[0];

  const sections = [
    { id: "01", label: "Pulse" },
    { id: "02", label: "Acquisition" },
    { id: "03", label: "Activation" },
    { id: "04", label: "Engagement" },
    { id: "05", label: "Power users" },
    { id: "06", label: "Content" },
    { id: "07", label: "Games & feedback" },
  ];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>LAP Internal Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<style>
  :root {
    --bg: #0a0c12;
    --panel: #11141c;
    --panel-2: #161a23;
    --panel-3: #1c2130;
    --border: #232938;
    --border-strong: #2e364a;
    --text: #e6e9ef;
    --text-2: #b8bfd0;
    --muted: #7d869b;
    --primary: #818cf8;
    --primary-dim: rgba(129,140,248,0.15);
    --accent: #fbbf24;
    --accent-dim: rgba(251,191,36,0.12);
    --success: #34d399;
    --success-dim: rgba(52,211,153,0.12);
    --danger: #f87171;
    --danger-dim: rgba(248,113,113,0.12);
    --mono: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace;
    --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; background: var(--bg); color: var(--text); font-family: var(--sans); font-size: 14px; line-height: 1.55; }

  /* ─── Top bar ─── */
  .topbar { position: sticky; top: 0; z-index: 50; background: rgba(10,12,18,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
  .topbar-inner { max-width: 1400px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .brand { font-family: var(--mono); font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }
  .brand-dot { color: var(--primary); }
  .topnav { display: flex; gap: 4px; flex-wrap: wrap; }
  .topnav a { font-family: var(--mono); font-size: 11px; color: var(--text-2); text-decoration: none; padding: 6px 10px; border-radius: 6px; border: 1px solid transparent; transition: all .15s; }
  .topnav a:hover { background: var(--panel); border-color: var(--border); color: var(--text); }
  .topbar-meta { font-family: var(--mono); font-size: 10px; color: var(--muted); text-align: right; }

  /* ─── Layout ─── */
  main { max-width: 1400px; margin: 0 auto; padding: 32px 24px 96px; }
  .section { margin-top: 56px; padding-top: 8px; }
  .section:first-of-type { margin-top: 16px; }
  .section-head { margin-bottom: 18px; }
  .section-head h2 { margin: 0; font-family: var(--mono); font-size: 18px; font-weight: 600; letter-spacing: -0.01em; display: flex; align-items: baseline; gap: 12px; }
  .section-num { font-size: 11px; color: var(--muted); padding: 3px 8px; border: 1px solid var(--border); border-radius: 999px; font-weight: 500; letter-spacing: 0.05em; }
  .section-sub { margin: 6px 0 0; color: var(--muted); font-size: 13px; max-width: 720px; }

  /* ─── Stat cards ─── */
  .grid { display: grid; gap: 12px; }
  .grid-stats-4 { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
  .grid-stats-3 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  .stat { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; transition: border-color .15s; }
  .stat:hover { border-color: var(--border-strong); }
  .stat-label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 8px; }
  .stat-value { font-size: 28px; font-weight: 600; font-family: var(--mono); letter-spacing: -0.02em; line-height: 1.1; }
  .stat-sub { font-size: 12px; color: var(--text-2); margin-top: 6px; }
  .stat-success .stat-value { color: var(--success); }
  .stat-accent .stat-value  { color: var(--accent); }
  .stat-danger .stat-value  { color: var(--danger); }
  .stat-primary .stat-value { color: var(--primary); }

  /* ─── Tables ─── */
  .table-wrap { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 11px 16px; border-bottom: 1px solid var(--border); font-size: 13px; vertical-align: middle; }
  th { background: var(--panel-2); font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-weight: 500; }
  tr:last-child td { border-bottom: 0; }
  tbody tr { transition: background .12s; }
  tbody tr:hover td { background: rgba(129,140,248,0.04); }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; font-family: var(--mono); }
  td.email { font-family: var(--mono); font-size: 12px; }
  td.slug { font-family: var(--mono); font-size: 12px; color: var(--text-2); }

  /* ─── Bars ─── */
  .bar-wrap { display: flex; align-items: center; gap: 10px; min-width: 140px; }
  .bar-track { flex: 1; height: 6px; background: var(--panel-3); border-radius: 3px; overflow: hidden; min-width: 60px; }
  .bar-fill { height: 100%; transition: width .3s; }
  .bar-label { font-family: var(--mono); font-size: 11px; color: var(--text-2); min-width: 24px; text-align: right; }

  /* ─── Pills ─── */
  .pill { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-family: var(--mono); font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; border: 1px solid; }
  .pill-dev     { background: var(--primary-dim); color: #c4cbf8; border-color: rgba(129,140,248,0.35); }
  .pill-pm      { background: var(--accent-dim); color: #fde68a; border-color: rgba(251,191,36,0.35); }
  .pill-both    { background: var(--success-dim); color: #6ee7b7; border-color: rgba(52,211,153,0.35); }
  .pill-neutral { background: var(--panel-3); color: var(--text-2); border-color: var(--border); }
  .pill-danger  { background: var(--danger-dim); color: #fca5a5; border-color: rgba(248,113,113,0.35); }
  .pill-success { background: var(--success-dim); color: #6ee7b7; border-color: rgba(52,211,153,0.35); }

  /* ─── Callouts & misc ─── */
  .callout { padding: 12px 16px; border-radius: 10px; font-size: 13px; margin: 0 0 16px; border: 1px solid; }
  .callout-info    { background: var(--primary-dim); color: #c4cbf8; border-color: rgba(129,140,248,0.3); }
  .callout-success { background: var(--success-dim); color: #a7f3d0; border-color: rgba(52,211,153,0.3); }
  .callout-warn    { background: var(--danger-dim); color: #fca5a5; border-color: rgba(248,113,113,0.3); }
  .callout-action  { background: var(--accent-dim); color: #fde68a; border-color: rgba(251,191,36,0.3); font-weight: 500; }
  .callout code { background: rgba(0,0,0,0.3); padding: 1px 6px; border-radius: 4px; font-size: 12px; }
  .empty { color: var(--muted); font-style: italic; padding: 18px; text-align: center; background: var(--panel); border: 1px dashed var(--border); border-radius: 10px; }
  .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
  .row-2-tight { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
  @media (max-width: 900px) { .row-2, .row-2-tight { grid-template-columns: 1fr; } .topbar-inner { flex-direction: column; align-items: flex-start; } }
  details.more { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; margin-top: 8px; }
  details.more summary { padding: 10px 16px; cursor: pointer; font-family: var(--mono); font-size: 12px; color: var(--text-2); user-select: none; list-style: none; }
  details.more summary::-webkit-details-marker { display: none; }
  details.more summary::before { content: "▸ "; color: var(--muted); }
  details.more[open] summary::before { content: "▾ "; }
  details.more .table-wrap { border: 0; border-top: 1px solid var(--border); border-radius: 0; }
  footer { margin-top: 64px; padding: 24px; color: var(--muted); font-size: 11px; font-family: var(--mono); text-align: center; border-top: 1px solid var(--border); }
  a { color: var(--primary); }
</style>
</head>
<body>

<div class="topbar">
  <div class="topbar-inner">
    <div class="brand">$<span class="brand-dot">.</span>lap_dashboard</div>
    <nav class="topnav">
      ${sections.map((s) => `<a href="#${s.id}">${s.id} · ${s.label}</a>`).join("")}
    </nav>
    <div class="topbar-meta">
      ${esc(new Date().toISOString().slice(0, 16).replace("T", " "))} UTC<br>
      <a href="/logout" style="color:var(--muted)">logout</a>
    </div>
  </div>
</div>

<main>

  ${
    d.unknownSlugs.length > 0
      ? callout(
          `${d.unknownSlugs.length} slug(s) in <code>reading_progress</code> are not in the dashboard's curriculum list. Update <code>dashboard/curriculum.js</code> to keep completion counts accurate. Unknown: ${d.unknownSlugs.map((r) => `<code>${esc(r.pattern_slug)}</code>`).join(", ")}`,
          "warn",
        )
      : ""
  }

  ${section(
    "01",
    "Pulse",
    "Health check at a glance. Anything missing here means a leak in the funnel before this dashboard can help.",
    `
    <div class="grid grid-stats-4">
      ${statCard("Total users", o.total_users, `${o.signups_30d} in last 30 days`, "primary")}
      ${statCard("Active readers (7d)", o.active_readers_7d, `Read at least one lesson in last 7 days`)}
      ${statCard("Ever read 1+ lesson", o.ever_read, `${pct(o.ever_read, totalUsers)}% of all signups`)}
      ${statCard("Read nothing", o.read_nothing, `${pct(o.read_nothing, totalUsers)}% of all signups`, pct(o.read_nothing, totalUsers) > 30 ? "danger" : "")}
      ${statCard("Finished Dev (21/21)", o.finished_dev, `Out of ${trackCount(d.trackMix, "Developer")} devs`, "success")}
      ${statCard("Finished PM (15/15)", o.finished_pm, `Out of ${trackCount(d.trackMix, "Product Manager")} PMs`, "success")}
      ${statCard("Finished both tracks", o.finished_both, "Cross-track masters")}
      ${statCard("Signups (last 7d)", o.signups_7d, `${o.signups_30d} in last 30d`)}
    </div>
    `,
  )}

  ${section(
    "02",
    "Acquisition",
    "Where signups come from — by week and by track choice. PostHog has the channel breakdown; this view is volume + intent.",
    `
    <div class="row-2">
      <div>
        <h3 class="subhead">// signups by week</h3>
        ${table(
          ["Week of", "Signups", "Activated (read 1+)", "Read 5+", "Completed", ""],
          d.cohortByWeek.map((r) => {
            const max = Math.max(...d.cohortByWeek.map((x) => Number(x.signups) || 0), 1);
            return [
              fmtDate(r.cohort),
              r.signups,
              `${r.activated} <span class="pill pill-neutral">${pct(r.activated, r.signups)}%</span>`,
              r.read_5_plus,
              r.completed,
              bar(Number(r.signups), max),
            ];
          }),
        )}
      </div>
      <div>
        <h3 class="subhead">// signed up as</h3>
        ${table(
          ["Track", "Users", "% of total", ""],
          d.trackMix.map((r) => [
            r.role,
            r.users,
            `${pct(r.users, totalUsers)}%`,
            bar(Number(r.users), totalUsers, r.role === "Product Manager" ? "var(--accent)" : "var(--primary)"),
          ]),
        )}
        <div style="height:16px"></div>
        <h3 class="subhead">// signup velocity</h3>
        <div class="grid grid-stats-3">
          ${statCard("Signups today", o.signups_7d, "rolling 7d total")}
          ${statCard("First signup", fmtDate(o.first_signup || null))}
          ${statCard("Latest signup", fmtDate(o.latest_signup || null))}
        </div>
      </div>
    </div>
    `,
  )}

  ${section(
    "03",
    "Activation",
    "Do new signups become readers? The cliff between 1 read and 5 reads is usually where most products lose people.",
    `
    <div class="row-2">
      <div>
        <h3 class="subhead">// the funnel</h3>
        ${(() => {
          const sub = Number(f.step_1_signed_up) || 1;
          const steps = [
            ["1. Signed up",                   f.step_1_signed_up],
            ["2. Read within 24h of signup",   f.step_2_read_within_24h],
            ["3. Read at least one lesson",    f.step_3_read_at_least_one],
            ["4. Read 5+ lessons",             f.step_4_read_5_plus],
            ["5. Read 10+ lessons",            f.step_5_read_10_plus],
            ["6. Completed their track",       f.step_6_completed_track],
          ];
          return table(
            ["Step", "Users", "% of signups", ""],
            steps.map(([label, val]) => [
              label,
              val,
              `<span class="pill pill-neutral">${pct(val, sub)}%</span>`,
              bar(Number(val), sub),
            ]),
          );
        })()}
        ${(() => {
          const drop1to5 = pct(f.step_3_read_at_least_one, f.step_1_signed_up) - pct(f.step_4_read_5_plus, f.step_1_signed_up);
          if (drop1to5 >= 30) {
            return callout(
              `<strong>Cliff:</strong> ${drop1to5}-point drop between step 3 (read 1+) and step 4 (read 5+). This is the biggest leak. Investigate the 4th lesson people open.`,
              "action",
            );
          }
          return "";
        })()}
      </div>
      <div>
        <h3 class="subhead">// time from signup to first read</h3>
        <div class="grid grid-stats-3">
          ${statCard("Median", fmtSeconds(t.median_seconds), `n=${t.sample}`)}
          ${statCard("Average", fmtSeconds(t.avg_seconds))}
          ${statCard("p90", fmtSeconds(t.p90_seconds))}
        </div>
        <div style="height:24px"></div>
        <h3 class="subhead">// progress distribution (% of own track)</h3>
        ${(() => {
          const max = Math.max(...d.progressHistogram.map((r) => Number(r.users) || 0), 1);
          return table(
            ["Bucket", "Users", ""],
            d.progressHistogram.map((r) => [r.bucket.slice(4), r.users, bar(Number(r.users), max, "var(--success)")]),
          );
        })()}
      </div>
    </div>
    `,
  )}

  ${section(
    "04",
    "Engagement",
    "Who is actually using this. The top of this list is your power-user roster — names worth knowing personally.",
    `
    <h3 class="subhead">// top engaged users <span style="color:var(--muted);font-size:11px">(by distinct lessons read)</span></h3>
    ${table(
      ["Email", "Role", "Distinct read", "Dev / 21", "PM / 15", "Last read", "Joined"],
      d.topUsers
        .slice(0, 10)
        .map((r) => [
          `<span class="email-cell" style="font-family:var(--mono);font-size:12px">${esc(r.email)}</span>`,
          pill(r.role || "—", r.role === "Product Manager" ? "pm" : "dev"),
          `<strong>${r.total_distinct}</strong>`,
          r.dev_done,
          r.pm_done,
          fmtDateTime(r.last_read),
          fmtDate(r.created_at),
        ]),
    )}
    ${
      d.topUsers.length > 10
        ? `<details class="more"><summary>Show next ${d.topUsers.length - 10} engaged users</summary>${table(
            ["Email", "Role", "Distinct read", "Dev / 21", "PM / 15", "Last read", "Joined"],
            d.topUsers.slice(10).map((r) => [
              `<span style="font-family:var(--mono);font-size:12px">${esc(r.email)}</span>`,
              pill(r.role || "—", r.role === "Product Manager" ? "pm" : "dev"),
              r.total_distinct,
              r.dev_done,
              r.pm_done,
              fmtDateTime(r.last_read),
              fmtDate(r.created_at),
            ]),
          )}</details>`
        : ""
    }
    `,
  )}

  ${section(
    "05",
    "Power users",
    "These people deserve a personal email. They finished a track or read across both. Highest LTV in the database.",
    `
    ${
      d.completers.length > 0
        ? callout(
            `<strong>${d.completers.length} track completer${d.completers.length === 1 ? "" : "s"}.</strong> Email them. Ask what made them finish, what they want next, and whether they'd write a testimonial.`,
            "success",
          )
        : callout("No track completers yet.", "info")
    }
    ${table(
      ["Email", "First name", "Signed up as", "Dev / 21", "PM / 15", "Finished", "Last read", "Joined"],
      d.completers.map((r) => [
        `<span style="font-family:var(--mono);font-size:12px">${esc(r.email)}</span>`,
        r.first_name,
        pill(r.role || "—", r.role === "Product Manager" ? "pm" : "dev"),
        r.dev_done,
        r.pm_done,
        pill(r.finished, r.finished),
        fmtDateTime(r.last_read),
        fmtDate(r.created_at),
      ]),
    )}

    <div style="height:24px"></div>
    <h3 class="subhead">// cross-track readers <span style="color:var(--muted);font-size:11px">(read at least one lesson in each track)</span></h3>
    ${table(
      ["Email", "Signed up as", "Dev read", "PM read"],
      d.crossTrack.map((r) => [
        `<span style="font-family:var(--mono);font-size:12px">${esc(r.email)}</span>`,
        pill(r.role || "—", r.role === "Product Manager" ? "pm" : "dev"),
        r.dev_done,
        r.pm_done,
      ]),
    )}
    `,
  )}

  ${section(
    "06",
    "Content",
    "Which lessons earn attention, which get ignored. Use this to decide what to rewrite, promote, or retire.",
    `
    <div class="row-2-tight">
      <div>
        <h3 class="subhead">// most-read dev patterns</h3>
        ${(() => {
          const max = Math.max(...d.mostReadDev.map((r) => Number(r.readers) || 0), 1);
          return table(
            ["Pattern", "Readers", ""],
            d.mostReadDev.map((r) => [
              `<span class="slug">${esc(r.pattern_slug)}</span>`,
              r.readers,
              bar(Number(r.readers), max, "var(--primary)"),
            ]),
          );
        })()}
      </div>
      <div>
        <h3 class="subhead">// most-read PM modules</h3>
        ${(() => {
          const max = Math.max(...d.mostReadPm.map((r) => Number(r.readers) || 0), 1);
          return table(
            ["Module", "Readers", ""],
            d.mostReadPm.map((r) => [
              `<span class="slug">${esc(r.pattern_slug)}</span>`,
              r.readers,
              bar(Number(r.readers), max, "var(--accent)"),
            ]),
          );
        })()}
      </div>
    </div>
    `,
  )}

  ${section(
    "07",
    "Games & feedback",
    "Game leaderboard, lesson thumbs up/down. Low feedback volume is itself a signal — add a feedback prompt at the bottom of every lesson.",
    `
    <h3 class="subhead">// games (game_scores)</h3>
    ${(() => {
      const og = d.games.overall;
      return `<div class="grid grid-stats-4">
        ${statCard("Total game attempts", og.total_attempts || 0)}
        ${statCard("Distinct players", og.players || 0, `${pct(og.players, totalUsers)}% of all signups`)}
        ${statCard("Pass attempts", og.pass_attempts || 0)}
        ${statCard("Pass rate", `${og.pass_rate ?? 0}%`, "across all attempts", (og.pass_rate ?? 0) >= 60 ? "success" : (og.pass_rate ?? 0) < 30 ? "danger" : "")}
      </div>`;
    })()}
    <div style="height:16px"></div>
    ${
      d.games.perGame.length > 0
        ? table(
            ["Game", "Players", "Attempts", "Top score", "Avg score", "Pass rate", ""],
            d.games.perGame.map((r) => [
              `<span class="slug">${esc(r.pattern_slug)}</span>`,
              r.players,
              r.attempts,
              r.score_max ? `${r.top_score} / ${r.score_max}` : r.top_score,
              r.avg_score,
              `<span class="pill ${r.pass_rate >= 60 ? "pill-success" : r.pass_rate < 30 ? "pill-danger" : "pill-neutral"}">${r.pass_rate}%</span>`,
              bar(Number(r.players), Math.max(...d.games.perGame.map((g) => Number(g.players) || 0), 1)),
            ]),
            { empty: "No game scores recorded." },
          )
        : `<div class="empty">No game scores recorded.</div>`
    }

    <div style="height:32px"></div>
    <h3 class="subhead">// challenges (challenge_scores)</h3>
    ${(() => {
      const c = d.challenges[0];
      if (!c.total_attempts) {
        return callout(
          `No challenge attempts yet. The <code>challenge_scores</code> table is empty. Either nobody is finding the challenge UI, or the challenge feature isn't shipped. Worth checking which.`,
          "warn",
        );
      }
      return `<div class="grid grid-stats-3">
        ${statCard("Challenge attempts", c.total_attempts)}
        ${statCard("Distinct players", c.players)}
      </div>`;
    })()}

    <div style="height:32px"></div>
    <h3 class="subhead">// lesson feedback <span style="color:var(--muted);font-size:11px">(lesson_feedback table, helpful = true / false)</span></h3>
    ${(() => {
      const fb = d.feedback.overall;
      if (!fb.total) {
        return callout(
          `<strong>Zero feedback rows.</strong> The <code>lesson_feedback</code> table exists but nobody has used the thumbs UI. Either it's not surfaced enough, or the lessons feel un-rateable. Adding a "Was this helpful?" prompt at the bottom of every lesson would change this.`,
          "warn",
        );
      }
      return `
        <div class="grid grid-stats-4">
          ${statCard("Total feedback", fb.total)}
          ${statCard("Helpful 👍", fb.helpful_count, `${fb.helpful_rate ?? 0}% of all feedback`, "success")}
          ${statCard("Not helpful 👎", fb.not_helpful_count, "", fb.not_helpful_count > 0 ? "danger" : "")}
          ${statCard("Lessons rated", fb.lessons_with_any_feedback, "out of 36 total")}
        </div>
        <div style="height:16px"></div>
        ${table(
          ["Lesson", "Track", "Total", "Helpful", "Not helpful", "Helpful %"],
          d.feedback.perLesson.map((r) => [
            `<span class="slug">${esc(r.lesson_slug)}</span>`,
            pill(r.track === "pm" ? "pm" : "dev", r.track === "pm" ? "pm" : "dev"),
            r.total,
            r.helpful_count,
            r.not_helpful_count,
            `<span class="pill ${r.helpful_rate >= 75 ? "pill-success" : r.helpful_rate < 50 ? "pill-danger" : "pill-neutral"}">${r.helpful_rate}%</span>`,
          ]),
        )}
      `;
    })()}
    `,
  )}

</main>

<footer>
  Internal use only · Source of truth = Postgres · PostHog complements with behavioral and acquisition data.
</footer>

<style>
  .subhead { margin: 0 0 10px; font-family: var(--mono); font-size: 11px; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }
</style>

</body>
</html>`;
}

function trackCount(trackMix, role) {
  const row = trackMix.find((r) => r.role === role);
  return row ? row.users : 0;
}

export function renderUnauthorized() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Restricted</title>
<meta name="robots" content="noindex, nofollow" />
<style>
  body { margin:0; background:#0a0c12; color:#e6e9ef; font-family: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace; display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .box { text-align:center; max-width:380px; padding:32px; border:1px solid #232938; border-radius:12px; background:#11141c; }
  .lock { font-size:32px; margin-bottom:12px; }
  h1 { font-size:14px; margin:0 0 6px; font-weight:500; }
  .sub { color:#7d869b; font-size:12px; margin-bottom:20px; }
  form { display:flex; gap:8px; margin-top:8px; }
  input { flex:1; background:#0a0c12; border:1px solid #232938; color:#e6e9ef; padding:10px 14px; border-radius:8px; font-family:inherit; font-size:13px; }
  input:focus { outline:none; border-color:#818cf8; }
  button { background:#818cf8; color:#0a0c12; border:0; padding:10px 18px; border-radius:8px; font-family:inherit; font-size:13px; font-weight:600; cursor:pointer; }
  button:hover { background:#a5b4fc; }
</style>
</head>
<body>
<div class="box">
  <div class="lock">⌘</div>
  <h1>$ lap_dashboard</h1>
  <div class="sub">Access code required.</div>
  <form method="get" action="/">
    <input type="password" name="code" placeholder="enter code" autofocus required />
    <button type="submit">unlock</button>
  </form>
</div>
</body>
</html>`;
}

export function renderError(message) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Error</title><meta name="robots" content="noindex"></head>
<body style="margin:0;padding:48px;background:#0a0c12;color:#fca5a5;font-family:ui-monospace,monospace;">
<h1 style="font-size:14px;margin:0 0 12px;color:#f87171;">$ dashboard error</h1>
<pre style="white-space:pre-wrap;background:#11141c;padding:18px;border-radius:10px;border:1px solid #232938;color:#e6e9ef;font-size:13px;line-height:1.6;">${esc(message)}</pre>
</body></html>`;
}
