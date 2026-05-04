/**
 * Cross-device draft sync layer on top of localStorage.
 *
 * Strategy:
 *   - localStorage stays the primary store (instant, no auth needed).
 *   - When the user is authenticated, draft writes are also POSTed to
 *     /api/game-drafts (debounced ~1s — we don't want a request per
 *     keystroke). Reads pull both and use whichever is newer.
 *   - Anonymous users get the existing localStorage-only experience.
 *   - On clear (game completion), both stores are wiped.
 *
 * Conflict resolution is last-write-wins by `savedAt` (ms epoch).
 *
 * Not handled (intentional):
 *   - Real-time collaboration / multi-tab merge. If a user has two tabs
 *     open and edits both, the later save overwrites. Acceptable for a
 *     single-user lesson context.
 *   - Offline queueing. If the DB POST fails, we don't retry — the next
 *     local change will trigger another save attempt.
 */

import { saveDraft as saveDraftLocal, loadDraft as loadDraftLocal, clearDraft as clearDraftLocal } from "./draft-storage";

interface DraftEnvelope<T> {
  data: T;
  savedAt: number;
}

interface RemoteDraft<T> {
  slug: string;
  draft: DraftEnvelope<T>;
  updated_at: string;
}

const DEBOUNCE_MS = 1000;
const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();

function fetchWithCreds(input: RequestInfo, init?: RequestInit) {
  return fetch(input, { ...(init || {}), credentials: "include" });
}

/** Save draft locally (instant) and queue a debounced remote save. */
export function syncSaveDraft<T>(gameKey: string, data: T, opts?: { authenticated?: boolean }): void {
  saveDraftLocal(gameKey, data);
  if (!opts?.authenticated) return;

  const existing = pendingTimers.get(gameKey);
  if (existing) clearTimeout(existing);

  const t = setTimeout(() => {
    pendingTimers.delete(gameKey);
    const envelope: DraftEnvelope<T> = { data, savedAt: Date.now() };
    fetchWithCreds("/api/game-drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: gameKey, draft: envelope }),
    }).catch(() => {
      // Remote save is best-effort. Local copy is still authoritative.
    });
  }, DEBOUNCE_MS);
  pendingTimers.set(gameKey, t);
}

/**
 * Load the freshest draft. Returns local immediately if no auth; otherwise
 * compares local vs remote by savedAt and returns the newer one. Also
 * back-syncs the winner to whichever store is stale.
 */
export async function syncLoadDraft<T>(gameKey: string, opts?: { authenticated?: boolean }): Promise<T | null> {
  const local = loadDraftLocal<T>(gameKey);
  if (!opts?.authenticated) return local;

  let remote: DraftEnvelope<T> | null = null;
  try {
    const res = await fetchWithCreds(`/api/game-drafts?slug=${encodeURIComponent(gameKey)}`);
    if (res.ok) {
      const json = (await res.json()) as { success: boolean; draft: RemoteDraft<T> | null };
      remote = json.draft?.draft ?? null;
    }
  } catch {
    // Network error — fall back to local
    return local;
  }

  if (!remote) return local;
  if (!local) {
    // Push remote back to local so subsequent loads are instant
    saveDraftLocal(gameKey, remote.data);
    return remote.data;
  }

  const localStamp = readLocalStamp(gameKey);
  const remoteStamp = remote.savedAt;

  if (remoteStamp > localStamp) {
    saveDraftLocal(gameKey, remote.data);
    return remote.data;
  }
  // Local is at least as fresh — make sure remote knows
  syncSaveDraft(gameKey, local, { authenticated: true });
  return local;
}

function readLocalStamp(gameKey: string): number {
  try {
    const raw = localStorage.getItem(`lap_game_draft_${gameKey}`);
    if (!raw) return 0;
    const env = JSON.parse(raw) as { savedAt?: number };
    return env.savedAt ?? 0;
  } catch {
    return 0;
  }
}

/** Clear both local and remote copies. Safe to call without auth. */
export function syncClearDraft(gameKey: string, opts?: { authenticated?: boolean }): void {
  // Cancel any pending debounced save so we don't recreate the row.
  const pending = pendingTimers.get(gameKey);
  if (pending) {
    clearTimeout(pending);
    pendingTimers.delete(gameKey);
  }
  clearDraftLocal(gameKey);
  if (!opts?.authenticated) return;
  fetchWithCreds(`/api/game-drafts?slug=${encodeURIComponent(gameKey)}`, {
    method: "DELETE",
  }).catch(() => {
    // Best-effort
  });
}
