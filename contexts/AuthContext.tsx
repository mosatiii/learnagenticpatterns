"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import posthog from "posthog-js";
import { POSTHOG_KEY } from "@/lib/posthog-config";

const STORAGE_KEY = "lap_auth";
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

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
  expiresAt: number;
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

  const saveToStorage = (email: string, firstName: string, role: string) => {
    const data: StoredAuth = {
      email,
      firstName,
      role,
      expiresAt: Date.now() + NINETY_DAYS_MS,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const fetchProgress = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/progress?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setReadSlugs(data.progress || []);
      }
    } catch {
      // Progress is non-critical
    }
  }, []);

  const fetchGameScores = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/game-scores?email=${encodeURIComponent(email)}`);
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

  // On mount: check localStorage and verify with DB
  useEffect(() => {
    async function init() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) { setIsLoading(false); return; }

        const stored: StoredAuth = JSON.parse(raw);

        if (Date.now() > stored.expiresAt) {
          clearStorage();
          setIsLoading(false);
          return;
        }

        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: stored.email }),
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          saveToStorage(stored.email, data.user.firstName, data.user.role || stored.role || "Other");
          await Promise.all([
            fetchProgress(stored.email),
            fetchGameScores(stored.email),
          ]);
        } else {
          clearStorage();
        }
      } catch {
        clearStorage();
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
    saveToStorage(data.user.email, data.user.firstName, data.user.role || formData.role);
    await Promise.all([
      fetchProgress(data.user.email),
      fetchGameScores(data.user.email),
    ]);

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
    saveToStorage(data.user.email, data.user.firstName, data.user.role || "Other");
    await Promise.all([
      fetchProgress(data.user.email),
      fetchGameScores(data.user.email),
    ]);

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, ...scoreData }),
        });
        await fetchGameScores(user.email);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, patternSlug: slug }),
      }).catch(() => {});
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user, isLoading, isProductManager, readSlugs, signup, login, logout, markRead, progressPercent,
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
