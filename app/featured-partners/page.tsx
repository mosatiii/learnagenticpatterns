"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Youtube,
  Instagram,
  MonitorPlay,
  Linkedin,
  Globe,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface Partner {
  id: number;
  name: string;
  platform: string;
  channelName: string;
  channelUrl: string;
  topics: string[];
  bio: string;
}

const platformIcons: Record<string, typeof Youtube> = {
  YouTube: Youtube,
  TikTok: MonitorPlay,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  Other: Globe,
};

const filterOptions = ["All", "YouTube", "TikTok", "Instagram", "LinkedIn", "Other"] as const;

function PartnerCard({ partner }: { partner: Partner }) {
  const PlatformIcon = platformIcons[partner.platform] || Globe;

  return (
    <motion.a
      href={partner.channelUrl}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-surface border border-border rounded-xl p-6 hover:border-primary/30 transition-all block"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="font-mono text-primary text-lg font-bold">
            {partner.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-mono text-text-primary font-bold text-sm truncate mb-2">
            {partner.name}
          </h3>

          <div className="flex items-center gap-2 mb-2.5">
            <PlatformIcon size={14} className="text-text-secondary flex-shrink-0" />
            <span className="font-mono text-primary/70 text-xs truncate">
              {partner.channelName}
            </span>
            <ExternalLink
              size={12}
              className="text-text-secondary/40 group-hover:text-primary transition-colors flex-shrink-0"
            />
          </div>

          <p className="text-text-secondary text-xs leading-relaxed mb-3 line-clamp-2">
            {partner.bio}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {partner.topics.map((topic) => (
              <span
                key={topic}
                className="inline-block font-mono text-[10px] text-primary/60 border border-primary/15 rounded-full px-2.5 py-0.5 bg-primary/5"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface border border-dashed border-primary/20 rounded-xl p-6 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary/5 border border-primary/15 flex items-center justify-center mb-3">
              <span className="font-mono text-primary/30 text-lg font-bold">?</span>
            </div>
            <p className="font-mono text-text-secondary/40 text-sm font-medium mb-1">
              Partner Name
            </p>
            <p className="font-mono text-primary/30 text-xs">channel</p>
          </div>
        ))}
      </div>
      <p className="text-text-secondary text-sm mt-8">
        No featured partners yet.
      </p>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-text-secondary text-sm mb-1">
        No partners found for &ldquo;{query}&rdquo;
      </p>
      <p className="text-text-secondary/50 text-xs">
        Try a different search term or filter
      </p>
    </div>
  );
}

export default function FeaturedPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("All");

  useEffect(() => {
    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPartners(data.partners);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return partners.filter((p) => {
      if (platformFilter !== "All" && p.platform !== platformFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.channelName.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q) ||
        p.topics.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [partners, search, platformFilter]);

  return (
    <main className="relative z-10 pt-24">
      {/* Hero */}
      <section className="py-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block font-mono text-primary text-xs tracking-wider uppercase mb-6 border border-primary/20 rounded-full px-4 py-1.5 bg-primary/5">
              Community Partners
            </span>
            <h1 className="font-mono text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
              Featured{" "}
              <span className="text-gradient">Partners</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
              Thought leaders and creators helping spread Agentic AI education
              to developers and product managers worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Filter + Grid */}
      <section className="py-16 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : partners.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, channel, or topic..."
                    className="w-full bg-code-bg border border-border rounded-md pl-10 pr-4 py-2.5 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors font-sans text-sm"
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setPlatformFilter(opt)}
                      className={`font-mono text-xs px-3.5 py-2 rounded-md border transition-all cursor-pointer ${
                        platformFilter === opt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-code-bg text-text-secondary hover:border-text-secondary/40"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-text-secondary/50 text-xs font-mono mb-4">
                {filtered.length} partner{filtered.length !== 1 ? "s" : ""}
              </p>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((partner) => (
                      <PartnerCard key={partner.id} partner={partner} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <NoResults query={search} />
              )}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </main>
  );
}
