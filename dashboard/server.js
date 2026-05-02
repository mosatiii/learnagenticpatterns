import express from "express";
import crypto from "node:crypto";
import { loadAll, endPool, pingDatabase, validateDatabaseUrl } from "./queries.js";
import { renderDashboard, renderUnauthorized, renderError } from "./render.js";

const PORT = Number(process.env.PORT || 3000);
const ACCESS_CODE = process.env.DASHBOARD_ACCESS_CODE;
const COOKIE_NAME = "lap_dashboard_session";
const COOKIE_MAX_AGE_DAYS = 7;

if (!ACCESS_CODE || ACCESS_CODE.length < 16) {
  console.error("FATAL: DASHBOARD_ACCESS_CODE env var is missing or shorter than 16 chars. Refusing to start.");
  process.exit(1);
}

let dbStartupError = null;
try {
  const u = validateDatabaseUrl(process.env.DATABASE_URL);
  console.log(`DATABASE_URL parsed OK. Host: ${u.hostname}, db: ${u.pathname.replace(/^\//, "")}`);
} catch (err) {
  console.error(`FATAL: ${err.message}`);
  dbStartupError = err.message;
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

app.get("/healthz", async (_req, res) => {
  if (dbStartupError) return res.status(503).json({ ok: false, error: dbStartupError });
  try {
    await pingDatabase();
    res.json({ ok: true });
  } catch (err) {
    res.status(503).json({ ok: false, error: err?.message || "db unreachable" });
  }
});

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

  if (dbStartupError) {
    return res.status(503).type("html").send(renderError(dbStartupError));
  }

  try {
    const data = await loadAll();
    res.type("html").send(renderDashboard(data));
  } catch (err) {
    console.error("Dashboard render failed:", err);
    const msg = err?.code === "ECONNREFUSED"
      ? `Postgres refused the connection. The dashboard is reaching ${err.address || "localhost"}:${err.port || "5432"}, which usually means DATABASE_URL is missing, malformed, or set to a literal placeholder like \${{Postgres.DATABASE_URL}}. Check the dashboard service Variables in Railway.\n\nOriginal error: ${err.message}`
      : err?.message || "Unknown error";
    res.status(500).type("html").send(renderError(msg));
  }
});

app.use((req, res) => {
  res.status(404).type("html").send(renderUnauthorized());
});

const server = app.listen(PORT, async () => {
  console.log(`lap-dashboard listening on :${PORT}`);
  if (dbStartupError) {
    console.error("Server is up but DB is misconfigured. Requests will return a 503 with the diagnostic message above.");
    return;
  }
  try {
    await pingDatabase();
    console.log("DB ping OK.");
  } catch (err) {
    console.error(
      `DB ping FAILED on startup: ${err?.message || err}. ` +
        `If this is ECONNREFUSED at localhost, DATABASE_URL is likely a literal placeholder. ` +
        `Server stays up so /healthz can report the failure.`,
    );
  }
});

async function shutdown(sig) {
  console.log(`${sig} received, shutting down`);
  server.close(() => {});
  await endPool().catch(() => {});
  process.exit(0);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
