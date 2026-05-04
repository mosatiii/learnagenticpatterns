/**
 * In-memory sliding-window rate limiter.
 *
 * Two patterns supported:
 *   1) `rateLimit(key, config)` — legacy API. Checks AND records in one call.
 *      Used for endpoints where every request should count (signup,
 *      forgot-password, lesson-feedback, prompt-evaluate, etc.).
 *   2) `peek(key, config)` + `recordAttempt(key, config)` — new API.
 *      Use when you only want to count *failures* (login, reset-password
 *      bad token). Call `peek` to gate the request; if auth fails, call
 *      `recordAttempt`. On success, call `resetKey` to wipe the user's
 *      failure history.
 *
 * Window is sliding (per-timestamp), not fixed: we keep the timestamps of
 * the last N attempts and drop ones older than `windowMs` on every check.
 * Avoids the burst-at-edge problem of fixed windows.
 *
 * Deferred / not implemented (intentional):
 *   - Redis/Postgres-backed store: state is in a single Node process. Wipes
 *     on deploy and doesn't share across instances. For our scale that's
 *     acceptable; revisit if Railway scales horizontally.
 *   - CAPTCHA fallback at high attempt rates: needs a provider (reCAPTCHA /
 *     hCaptcha) and a UX flow.
 *   - x-forwarded-for spoof protection: assumes Railway's proxy strips any
 *     client-supplied X-Forwarded-For. Direct connections to the container
 *     could spoof. Not a concern as long as the container isn't publicly
 *     reachable outside the proxy.
 */

type Entry = number[]; // ascending timestamps in ms

const store = new Map<string, Entry>();

const CLEANUP_INTERVAL_MS = 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  store.forEach((entry, key) => {
    if (entry.length === 0) store.delete(key);
  });
}

function pruneOlderThan(entry: Entry, cutoff: number): Entry {
  // Entries are appended in order, so we can drop from the front.
  let i = 0;
  while (i < entry.length && entry[i] <= cutoff) i++;
  return i === 0 ? entry : entry.slice(i);
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface PeekResult {
  blocked: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * Check whether the key is at/over its limit, *without* recording a new
 * attempt. Use this to gate a request before doing the work.
 */
export function peek(key: string, config: RateLimitConfig): PeekResult {
  cleanup();
  const now = Date.now();
  const cutoff = now - config.windowMs;
  const pruned = pruneOlderThan(store.get(key) ?? [], cutoff);
  if (pruned.length === 0) {
    store.delete(key);
  } else {
    store.set(key, pruned);
  }
  const blocked = pruned.length >= config.maxRequests;
  const oldest = pruned[0];
  return {
    blocked,
    remaining: Math.max(0, config.maxRequests - pruned.length),
    retryAfterMs: blocked && oldest != null ? config.windowMs - (now - oldest) : 0,
  };
}

/** Record one attempt against the key (e.g., a failed login). */
export function recordAttempt(key: string, config: RateLimitConfig): void {
  const now = Date.now();
  const cutoff = now - config.windowMs;
  const pruned = pruneOlderThan(store.get(key) ?? [], cutoff);
  pruned.push(now);
  store.set(key, pruned);
}

/** Wipe a key's history (e.g., on successful login). */
export function resetKey(key: string): void {
  store.delete(key);
}

/**
 * Legacy: check + record in a single call. Returns success/failure shape
 * compatible with the original signature. Prefer peek/recordAttempt for
 * auth endpoints where you only want to count failures.
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig
): { success: true } | { success: false; retryAfterMs: number } {
  const result = peek(key, config);
  if (result.blocked) {
    return { success: false, retryAfterMs: result.retryAfterMs };
  }
  recordAttempt(key, config);
  return { success: true };
}

export function getClientIp(request: Request): string {
  // Assumes a trusted single-hop proxy (Railway). If the container is ever
  // exposed without a proxy, attackers could spoof X-Forwarded-For.
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
