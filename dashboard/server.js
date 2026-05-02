import express from "express";
import crypto from "node:crypto";
import { loadAll, pool } from "./queries.js";
import { renderDashboard, renderUnauthorized, renderError } from "./render.js";

const PORT = Number(process.env.PORT || 3000);
const ACCESS_CODE = process.env.DASHBOARD_ACCESS_CODE;
const COOKIE_NAME = "lap_dashboard_session";
const COOKIE_MAX_AGE_DAYS = 7;

if (!ACCESS_CODE || ACCESS_CODE.length < 16) {
  console.error("FATAL: DASHBOARD_ACCESS_CODE env var is missing or shorter than 16 chars. Refusing to start.");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL env var is missing. Refusing to start.");
  process.exit(1);
}

// Cookie value is HMAC of the access code with itself as the key, hex-encoded.
// Validating it server-side without storing sessions: re-derive and compare.
const COOKIE_VALUE = crypto.createHmac("sha256", ACCESS_CODE).update("lap.dashboard.v1").digest("hex");

function safeEq(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function parseCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

function isAuthorized(req) {
  const fromQuery = typeof req.query.code === "string" && safeEq(req.query.code, ACCESS_CODE);
  const fromCookie = safeEq(parseCookie(req.headers.cookie, COOKIE_NAME) || "", COOKIE_VALUE);
  return { ok: fromQuery || fromCookie, viaQuery: fromQuery };
}

const app = express();
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.get("/logout", (_req, res) => {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
  res.status(200).type("html").send(renderUnauthorized());
});

app.get("/", async (req, res) => {
  const auth = isAuthorized(req);
  if (!auth.ok) {
    return res.status(401).type("html").send(renderUnauthorized());
  }

  if (auth.viaQuery) {
    res.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=${COOKIE_VALUE}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${COOKIE_MAX_AGE_DAYS * 24 * 60 * 60}`,
    );
  }

  try {
    const data = await loadAll();
    res.type("html").send(renderDashboard(data));
  } catch (err) {
    console.error("Dashboard render failed:", err);
    res.status(500).type("html").send(renderError(err?.message || "Unknown error"));
  }
});

app.use((req, res) => {
  res.status(404).type("html").send(renderUnauthorized());
});

const server = app.listen(PORT, () => {
  console.log(`lap-dashboard listening on :${PORT}`);
});

async function shutdown(sig) {
  console.log(`${sig} received, shutting down`);
  server.close(() => {});
  await pool.end().catch(() => {});
  process.exit(0);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
