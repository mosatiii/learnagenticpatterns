"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Youtube,
  Instagram,
  MonitorPlay,
  Linkedin,
  Globe,
  Award,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Ambassador {
  id: number;
  name: string;
  platform: string;
  channelName: string;
  channelUrl: string;
  topics: string[];
  bio: string;
  tier: string;
}

const platformIcons: Record<string, typeof Youtube> = {
  YouTube: Youtube,
  TikTok: MonitorPlay,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  Other: Globe,
};

const filterOptions = ["All", "YouTube", "TikTok", "Instagram", "LinkedIn", "Other"] as const;

function AmbassadorCard({ ambassador }: { ambassador: Ambassador }) {
  const PlatformIcon = platformIcons[ambassador.platform] || Globe;

  return (
    <motion.a
      href={ambassador.channelUrl}
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
            {ambassador.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-mono text-text-primary font-bold text-sm truncate">
              {ambassador.name}
            </h3>
            {ambassador.tier === "partner" && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 font-mono text-[10px] text-accent border border-accent/30 rounded-full px-2 py-0.5 bg-accent/5">
                <Award size={10} /> Partner
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2.5">
            <PlatformIcon size={14} className="text-text-secondary flex-shrink-0" />
            <span className="font-mono text-primary/70 text-xs truncate">
              {ambassador.channelName}
            </span>
            <ExternalLink
              size={12}
              className="text-text-secondary/40 group-hover:text-primary transition-colors flex-shrink-0"
            />
          </div>

          <p className="text-text-secondary text-xs leading-relaxed mb-3 line-clamp-2">
            {ambassador.bio}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {ambassador.topics.map((topic) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface border border-dashed border-primary/20 rounded-xl p-6 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary/5 border border-primary/15 flex items-center justify-center mb-3">
              <span className="font-mono text-primary/30 text-lg font-bold">?</span>
            </div>
            <p className="font-mono text-text-secondary/40 text-sm font-medium mb-1">
              Your Name
            </p>
            <p className="font-mono text-primary/30 text-xs">your-channel</p>
          </div>
        ))}
      </div>
      <p className="text-text-secondary text-sm mb-2">
        No featured ambassadors yet — be the first!
      </p>
      <Link
        href="/ambassador#apply"
        className="inline-flex items-center gap-2 text-primary font-mono text-sm hover:underline"
      >
        Apply to become an ambassador <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-text-secondary text-sm mb-1">
        No ambassadors found for &ldquo;{query}&rdquo;
      </p>
      <p className="text-text-secondary/50 text-xs">
        Try a different search term or filter
      </p>
    </div>
  );
}

export default function FeaturedAmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("All");

  useEffect(() => {
    fetch("/api/ambassadors")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAmbassadors(data.ambassadors);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ambassadors.filter((a) => {
      if (platformFilter !== "All" && a.platform !== platformFilter) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.channelName.toLowerCase().includes(q) ||
        a.bio.toLowerCase().includes(q) ||
        a.topics.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [ambassadors, search, platformFilter]);

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
              Our Community
            </span>
            <h1 className="font-mono text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
              Featured{" "}
              <span className="text-gradient">Ambassadors</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
              Meet the creators and partners helping spread Agentic AI
              education to developers and product managers worldwide.
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
          ) : ambassadors.length > 0 ? (
            <>
              {/* Search + Platform filter */}
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
                {filtered.length} ambassador{filtered.length !== 1 ? "s" : ""}
              </p>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((ambassador) => (
                      <AmbassadorCard
                        key={ambassador.id}
                        ambassador={ambassador}
                      />
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-mono text-2xl text-text-primary font-bold mb-3">
              Want to Be Featured Here?
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-md mx-auto">
              Create a dedicated video about learnagenticpatterns.com and get
              your own searchable profile card on this page.
            </p>
            <Link
              href="/ambassador#apply"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-sm px-7 py-3 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              Become an Ambassador <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
