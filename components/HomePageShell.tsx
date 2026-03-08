"use client";

import { useAuth } from "@/contexts/AuthContext";
import HomeDashboard from "@/components/HomeDashboard";

/**
 * Wraps the homepage. On the server (and during initial hydration), children
 * are always rendered so the landing page HTML is in the server response for
 * search engines. Once auth resolves on the client, signed-in users see the
 * dashboard instead.
 */
export default function HomePageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    isLoading,
    readSlugs,
    isProductManager,
    pmReadSlugs,
    pmProgressPercent,
    gameScores,
    totalAttempts,
    avgPercent,
    leaderboard,
    userRank,
  } = useAuth();

  // Render children (landing page) during SSR and while auth is loading.
  // isLoading starts as true on both server and client, so this matches
  // and avoids hydration mismatches. The landing page HTML is always in
  // the initial response for Googlebot and other crawlers.
  if (isLoading) {
    return <>{children}</>;
  }

  if (user) {
    return (
      <HomeDashboard
        user={user}
        readSlugs={readSlugs}
        isProductManager={isProductManager}
        pmReadSlugs={pmReadSlugs}
        pmProgressPercent={pmProgressPercent}
        gameScores={gameScores}
        totalAttempts={totalAttempts}
        avgPercent={avgPercent}
        leaderboard={leaderboard}
        userRank={userRank}
      />
    );
  }

  return <>{children}</>;
}
