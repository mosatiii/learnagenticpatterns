"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import posthog from "posthog-js";

const STORAGE_KEY = "lap_auth";
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

interface AuthUser {
  id: number;
  email: string;
  firstName: string;
}

interface StoredAuth {
  email: string;
  firstName: string;
  expiresAt: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
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
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children, totalPatterns }: { children: ReactNode; totalPatterns: number }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readSlugs, setReadSlugs] = useState<string[]>([]);

  const progressPercent = totalPatterns > 0
    ? Math.round((readSlugs.length / totalPatterns) * 100)
    : 0;

  const saveToStorage = (email: string, firstName: string) => {
    const data: StoredAuth = {
      email,
      firstName,
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
          saveToStorage(stored.email, data.user.firstName);
          await fetchProgress(stored.email);
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
  }, [fetchProgress]);

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
    saveToStorage(data.user.email, data.user.firstName);
    await fetchProgress(data.user.email);

    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
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
    saveToStorage(data.user.email, data.user.firstName);
    await fetchProgress(data.user.email);

    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.capture("user_logged_in");
    }
  };

  const logout = () => {
    clearStorage();
    setUser(null);
    setReadSlugs([]);
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.reset();
    }
  };

  const markRead = useCallback(
    (slug: string) => {
      if (!user) return;
      setReadSlugs((prev) => {
        if (prev.includes(slug)) return prev;
        const updated = [...prev, slug];

        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
          posthog.capture("pattern_read", {
            pattern: slug,
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
      value={{ user, isLoading, readSlugs, signup, login, logout, markRead, progressPercent }}
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
