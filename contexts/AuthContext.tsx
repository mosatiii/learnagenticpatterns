"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import posthog from "posthog-js";
import { POSTHOG_KEY } from "@/lib/posthog-config";
import { pmModules } from "@/data/pm-curriculum";

const STORAGE_KEY = "lap_auth";
const TOKEN_KEY = "lap_token";
const COOKIE_NAME = "lap_token_shared";
const TOKEN_MAX_AGE = 14 * 24 * 60 * 60; // 14 days, matches JWT TTL

/** Set a cookie readable across all *.learnagenticpatterns.com subdomains. */
function setSharedCookie(token: string) {
  if (typeof document === "undefined") return;
  const isLocalhost = window.location.hostname === "localhost";
  const domain = isLocalhost ? "" : "; domain=.learnagenticpatterns.com";
  const secure = isLocalhost ? "" : "; secure";
  document.cookie = `${COOKIE_NAME}=${token}${domain}; path=/; max-age=${TOKEN_MAX_AGE}; samesite=lax${secure}`;
}

function clearSharedCookie() {
  if (typeof document === "undefined") return;
  const isLocalhost = window.location.hostname === "localhost";
  const domain = isLocalhost ? "" : "; domain=.learnagenticpatterns.com";
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0${domain}`;
}

function getSharedCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? match[1] : null;
}

interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  role: string;
}

interface StoredAuth {
  email: string;
  firstName: string;
  role: string;
}

export interface PatternScore {
  pattern_slug: string;
  score_total: number;
  score_max: number;
  architecture: number;
  resilience: number;
  efficiency: number;
  passed: boolean;
  played_at: string;
}

export interface LeaderboardEntry {
  first_name: string;
  avg_percent: number;
  games_played: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isProductManager: boolean;
  readSlugs: string[];
  pmReadSlugs: string[];
  pmProgressPercent: number;
  signup: (data: {
    firstName: string;
    email: string;
    password: string;
    role: string;
    challenge?: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  markRead: (slug: string) => void;
  progressPercent: number;
  gameScores: PatternScore[];
  totalAttempts: number;
  avgPercent: number;
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  saveGameScore: (data: {
    patternSlug: string;
    scoreTotal: number;
    scoreMax: number;
    architecture: number;
    resilience: number;
    efficiency: number;
    passed: boolean;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children, totalPatterns }: { children: ReactNode; totalPatterns: number }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readSlugs, setReadSlugs] = useState<string[]>([]);
  const [gameScores, setGameScores] = useState<PatternScore[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [avgPercent, setAvgPercent] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  const progressPercent = totalPatterns > 0
    ? Math.round((readSlugs.length / totalPatterns) * 100)
    : 0;

  const isProductManager = user?.role === "Product Manager";

  const pmSlugs = useMemo(() => new Set(pmModules.map((m) => m.slug)), []);
  const pmReadSlugs = useMemo(() => readSlugs.filter((s) => pmSlugs.has(s)), [readSlugs, pmSlugs]);
  const pmProgressPercent = pmModules.length > 0
    ? Math.round((pmReadSlugs.length / pmModules.length) * 100)
    : 0;

  const saveToStorage = (token: string, email: string, firstName: string, role: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    const data: StoredAuth = { email, firstName, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSharedCookie(token);
  };

  /** Clear local session only (keeps cross-subdomain cookie for retries). */
  const clearLocal = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  /** Full logout: clear everything including the cross-subdomain cookie. */
  const clearStorage = () => {
    clearLocal();
    clearSharedCookie();
  };

  /** Build headers with the JWT for authenticated API calls. */
  function authHeaders(): Record<string, string> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return { "Content-Type": "application/json" };
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  }

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch("/api/progress", { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setReadSlugs(data.progress || []);
      }
    } catch {
      // Progress is non-critical
    }
  }, []);

  const fetchGameScores = useCallback(async () => {
    try {
      const res = await fetch("/api/game-scores", { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setGameScores(data.scores || []);
        setTotalAttempts(data.totalAttempts || 0);
        setAvgPercent(data.avgPercent || 0);
        setLeaderboard(data.leaderboard || []);
        setUserRank(data.userRank ?? null);
      }
    } catch {
      // Game scores are non-critical
    }
  }, []);

  // On mount: verify saved JWT with the server
  useEffect(() => {
    async function init() {
      try {
        let token = localStorage.getItem(TOKEN_KEY);

        // Cross-subdomain: fall back to the shared cookie when
        // localStorage is empty (e.g. first visit to practice.*)
        if (!token) {
          token = getSharedCookie();
        }

        if (!token) { setIsLoading(false); return; }

        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          saveToStorage(token, data.user.email, data.user.firstName, data.user.role || "Other");
          await Promise.all([fetchProgress(), fetchGameScores()]);
        } else if (res.status === 401) {
          // Token is genuinely invalid/expired — clear everything
          clearStorage();
        } else {
          // Server error (5xx) — only clear local, keep cookie for retry
          clearLocal();
        }
      } catch {
        // Network error — only clear local, keep cookie for retry
        clearLocal();
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [fetchProgress, fetchGameScores]);

  const signup = async (formData: {
    firstName: string;
    email: string;
    password: string;
    role: string;
    challenge?: string;
  }) => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");

    setUser(data.user);
    saveToStorage(data.token, data.user.email, data.user.firstName, data.user.role || formData.role);
    await Promise.all([fetchProgress(), fetchGameScores()]);

    if (typeof window !== "undefined" && POSTHOG_KEY) {
      posthog.capture("user_signed_up", { role: formData.role });
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    setUser(data.user);
    saveToStorage(data.token, data.user.email, data.user.firstName, data.user.role || "Other");
    await Promise.all([fetchProgress(), fetchGameScores()]);

    if (typeof window !== "undefined" && POSTHOG_KEY) {
      posthog.capture("user_logged_in");
    }
  };

  const logout = () => {
    clearStorage();
    setUser(null);
    setReadSlugs([]);
    setGameScores([]);
    setTotalAttempts(0);
    setAvgPercent(0);
    setLeaderboard([]);
    setUserRank(null);
    if (typeof window !== "undefined" && POSTHOG_KEY) {
      posthog.reset();
    }
  };

  const saveGameScore = useCallback(
    async (scoreData: {
      patternSlug: string;
      scoreTotal: number;
      scoreMax: number;
      architecture: number;
      resilience: number;
      efficiency: number;
      passed: boolean;
    }) => {
      if (!user) return;
      try {
        await fetch("/api/game-scores", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(scoreData),
        });
        await fetchGameScores();
      } catch {
        // Score saving is non-critical
      }
    },
    [user, fetchGameScores],
  );

  const markRead = useCallback(
    (slug: string) => {
      if (!user) return;
      setReadSlugs((prev) => {
        if (prev.includes(slug)) return prev;
        const updated = [...prev, slug];

        if (typeof window !== "undefined" && POSTHOG_KEY) {
          posthog.capture("pattern_read", {
            pattern: slug,
            track: user.role === "Product Manager" ? "pm" : "developer",
            totalRead: updated.length,
            percentComplete: Math.round((updated.length / 21) * 100),
          });
        }

        return updated;
      });
      fetch("/api/progress", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ patternSlug: slug }),
      }).catch(() => {});
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user, isLoading, isProductManager, readSlugs, pmReadSlugs, pmProgressPercent, signup, login, logout, markRead, progressPercent,
        gameScores, totalAttempts, avgPercent, leaderboard, userRank, saveGameScore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
