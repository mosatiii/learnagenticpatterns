"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import posthog from "posthog-js";
import { POSTHOG_KEY } from "@/lib/posthog-config";
import { pmModules } from "@/data/pm-curriculum";

const STORAGE_KEY = "lap_auth";

function collectSignupSource() {
  if (typeof window === "undefined") return undefined;
  const get = (key: string): string | undefined => {
    if (!POSTHOG_KEY) return undefined;
    const val = posthog.get_property(key);
    return typeof val === "string" && val.length > 0 ? val : undefined;
  };
  return {
    referrer: document.referrer || get("$initial_referrer"),
    referringDomain: get("$initial_referring_domain"),
    utmSource: get("$initial_utm_source"),
    utmMedium: get("$initial_utm_medium"),
    utmCampaign: get("$initial_utm_campaign"),
    landingPath: get("$initial_pathname") || window.location.pathname,
  };
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

export interface ChallengeScore {
  pattern_slug: string;
  challenge_type: string;
  difficulty: string;
  score_total: number;
  score_max: number;
  passed: boolean;
  played_at: string;
}

export interface LeaderboardEntry {
  first_name: string;
  avg_percent: number;
  games_played: number;
}

export type Track = "developer" | "pm";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isProductManager: boolean;
  /** True when user was auto-signed-in via cross-subdomain cookie. */
  crossDomainAutoLogin: boolean;
  dismissAutoLogin: () => void;
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
  challengeScores: ChallengeScore[];
  saveChallengeScore: (data: {
    patternSlug: string;
    challengeType: string;
    difficulty?: string;
    scoreTotal: number;
    scoreMax: number;
    passed: boolean;
    metadata?: Record<string, unknown>;
  }) => Promise<void>;
  /** Set of `${slug}::${tabId}` strings the current user has visited. */
  visitedTabs: Set<string>;
  hasVisitedTab: (slug: string, tabId: string) => boolean;
  hasPlayedAnyGame: (slug: string) => boolean;
  markTabVisited: (track: Track, slug: string, tabId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Common fetch options — cookies sent automatically via httpOnly cookie. */
const jsonFetchOpts: RequestInit = {
  headers: { "Content-Type": "application/json" },
  credentials: "include",
};

export function AuthProvider({ children, totalPatterns }: { children: ReactNode; totalPatterns: number }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [crossDomainAutoLogin, setCrossDomainAutoLogin] = useState(false);
  const [readSlugs, setReadSlugs] = useState<string[]>([]);
  const [gameScores, setGameScores] = useState<PatternScore[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [avgPercent, setAvgPercent] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set());
  const [challengeScores, setChallengeScores] = useState<ChallengeScore[]>([]);

  const progressPercent = totalPatterns > 0
    ? Math.round((readSlugs.length / totalPatterns) * 100)
    : 0;

  const isProductManager = user?.role === "Product Manager";

  const pmSlugs = useMemo(() => new Set(pmModules.map((m) => m.slug)), []);
  const pmReadSlugs = useMemo(() => readSlugs.filter((s) => pmSlugs.has(s)), [readSlugs, pmSlugs]);
  const pmProgressPercent = pmModules.length > 0
    ? Math.round((pmReadSlugs.length / pmModules.length) * 100)
    : 0;

  const saveToStorage = (email: string, firstName: string, role: string) => {
    const data: StoredAuth = { email, firstName, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch("/api/progress", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setReadSlugs(data.progress || []);
      }
    } catch {
      // Progress is non-critical
    }
  }, []);

  const fetchTabVisits = useCallback(async () => {
    try {
      const res = await fetch("/api/tab-visits", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const visits: { slug: string; tab_id: string }[] = data.visits ?? [];
        setVisitedTabs(new Set(visits.map((v) => `${v.slug}::${v.tab_id}`)));
      }
    } catch {
      // Tab visits are non-critical
    }
  }, []);

  const fetchChallengeScores = useCallback(async () => {
    try {
      const res = await fetch("/api/challenge-scores", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setChallengeScores(data.scores ?? []);
      }
    } catch {
      // Challenge scores are non-critical
    }
  }, []);

  const fetchGameScores = useCallback(async () => {
    try {
      const res = await fetch("/api/game-scores", { credentials: "include" });
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

  const dismissAutoLogin = useCallback(() => setCrossDomainAutoLogin(false), []);

  // On mount: verify session via httpOnly cookie
  useEffect(() => {
    async function init() {
      try {
        const hadLocalData = !!localStorage.getItem(STORAGE_KEY);

        const res = await fetch("/api/auth/verify", {
          method: "POST",
          ...jsonFetchOpts,
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          saveToStorage(data.user.email, data.user.firstName, data.user.role || "Other");
          if (!hadLocalData) setCrossDomainAutoLogin(true);
          await Promise.all([fetchProgress(), fetchGameScores(), fetchTabVisits(), fetchChallengeScores()]);
        } else if (res.status === 401) {
          clearStorage();
        }
      } catch {
        // Network error — don't clear storage, allow retry
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [fetchProgress, fetchGameScores, fetchTabVisits, fetchChallengeScores]);

  const signup = async (formData: {
    firstName: string;
    email: string;
    password: string;
    role: string;
    challenge?: string;
  }) => {
    const source = collectSignupSource();

    const res = await fetch("/api/signup", {
      method: "POST",
      ...jsonFetchOpts,
      body: JSON.stringify({ ...formData, source }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");

    setUser(data.user);
    saveToStorage(data.user.email, data.user.firstName, data.user.role || formData.role);
    await Promise.all([fetchProgress(), fetchGameScores(), fetchTabVisits(), fetchChallengeScores()]);

    if (typeof window !== "undefined" && POSTHOG_KEY) {
      posthog.capture("user_signed_up", { role: formData.role });
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      ...jsonFetchOpts,
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    setUser(data.user);
    saveToStorage(data.user.email, data.user.firstName, data.user.role || "Other");
    await Promise.all([fetchProgress(), fetchGameScores(), fetchTabVisits(), fetchChallengeScores()]);

    if (typeof window !== "undefined" && POSTHOG_KEY) {
      posthog.capture("user_logged_in");
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // Best-effort
    }
    clearStorage();
    setUser(null);
    setReadSlugs([]);
    setGameScores([]);
    setTotalAttempts(0);
    setAvgPercent(0);
    setLeaderboard([]);
    setUserRank(null);
    setVisitedTabs(new Set());
    setChallengeScores([]);
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
          ...jsonFetchOpts,
          body: JSON.stringify(scoreData),
        });
        await fetchGameScores();
      } catch {
        // Score saving is non-critical
      }
    },
    [user, fetchGameScores],
  );

  const saveChallengeScore = useCallback(
    async (data: {
      patternSlug: string;
      challengeType: string;
      difficulty?: string;
      scoreTotal: number;
      scoreMax: number;
      passed: boolean;
      metadata?: Record<string, unknown>;
    }) => {
      if (!user) return;
      try {
        await fetch("/api/challenge-scores", {
          method: "POST",
          ...jsonFetchOpts,
          body: JSON.stringify(data),
        });
        await fetchChallengeScores();
      } catch {
        // Score saving is non-critical
      }
    },
    [user, fetchChallengeScores]
  );

  const hasVisitedTab = useCallback(
    (slug: string, tabId: string) => visitedTabs.has(`${slug}::${tabId}`),
    [visitedTabs]
  );

  const hasPlayedAnyGame = useCallback(
    (slug: string) => gameScores.some((s) => s.pattern_slug === slug),
    [gameScores]
  );

  const markTabVisited = useCallback(
    (track: Track, slug: string, tabId: string) => {
      if (!user) return;
      const key = `${slug}::${tabId}`;
      setVisitedTabs((prev) => {
        if (prev.has(key)) return prev;
        const next = new Set(prev);
        next.add(key);
        return next;
      });
      fetch("/api/tab-visits", {
        method: "POST",
        ...jsonFetchOpts,
        body: JSON.stringify({ track, slug, tabId }),
      }).catch(() => {});
    },
    [user]
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
        ...jsonFetchOpts,
        body: JSON.stringify({ patternSlug: slug }),
      }).catch(() => {});
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user, isLoading, isProductManager, crossDomainAutoLogin, dismissAutoLogin,
        readSlugs, pmReadSlugs, pmProgressPercent, signup, login, logout, markRead, progressPercent,
        gameScores, totalAttempts, avgPercent, leaderboard, userRank, saveGameScore,
        challengeScores, saveChallengeScore,
        visitedTabs, hasVisitedTab, hasPlayedAnyGame, markTabVisited,
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
