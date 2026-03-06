"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LeaderboardPage() {
  const { leaderboard, userRank, user } = useAuth();

  const podiumColors = ["text-yellow-400", "text-gray-300", "text-amber-600"];
  const podiumIcons = [Trophy, Medal, Star];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={20} className="text-yellow-400" />
          <span className="font-mono text-xs text-yellow-400 uppercase tracking-wider">Rankings</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Leaderboard</h1>
        <p className="text-text-secondary">Top practitioners across all challenges.</p>
      </div>

      {user && userRank && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-text-secondary">Your Rank</p>
              <p className="text-2xl font-bold text-accent">#{userRank}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-text-secondary">Player</p>
              <p className="text-text-primary font-bold">{user.firstName}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {leaderboard && leaderboard.length > 0 ? (
          leaderboard.map((entry: { first_name: string; avg_percent: number; games_played: number }, i: number) => {
            const Icon = podiumIcons[i] ?? Star;
            const isTopThree = i < 3;
            return (
              <motion.div
                key={`${entry.first_name}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors ${
                  isTopThree
                    ? "bg-surface border-primary/20"
                    : "bg-surface/50 border-border"
                }`}
              >
                <div className="w-8 text-center">
                  {isTopThree ? (
                    <Icon size={18} className={podiumColors[i]} />
                  ) : (
                    <span className="font-mono text-sm text-text-secondary">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-text-primary font-medium text-sm">{entry.first_name}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm text-primary">{entry.avg_percent}%</span>
                  <span className="text-text-secondary text-xs ml-2">({entry.games_played} games)</span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-16 text-text-secondary">
            <Trophy size={40} className="mx-auto mb-4 opacity-20" />
            <p className="font-mono text-sm">No scores yet. Be the first to compete!</p>
          </div>
        )}
      </div>
    </div>
  );
}
