const DRAFT_PREFIX = "lap_game_draft_";
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface DraftEnvelope<T> {
  data: T;
  savedAt: number;
}

export function saveDraft<T>(gameKey: string, data: T): void {
  try {
    const envelope: DraftEnvelope<T> = { data, savedAt: Date.now() };
    localStorage.setItem(DRAFT_PREFIX + gameKey, JSON.stringify(envelope));
  } catch {
    // Storage full or unavailable — non-critical
  }
}

export function loadDraft<T>(gameKey: string): T | null {
  try {
    const raw = localStorage.getItem(DRAFT_PREFIX + gameKey);
    if (!raw) return null;

    const envelope: DraftEnvelope<T> = JSON.parse(raw);
    if (Date.now() - envelope.savedAt > DRAFT_TTL_MS) {
      localStorage.removeItem(DRAFT_PREFIX + gameKey);
      return null;
    }
    return envelope.data;
  } catch {
    return null;
  }
}

export function clearDraft(gameKey: string): void {
  try {
    localStorage.removeItem(DRAFT_PREFIX + gameKey);
  } catch {
    // non-critical
  }
}
