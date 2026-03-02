import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Tag,
  Lightbulb,
  BookOpen,
  Zap,
  Share2,
} from "lucide-react";
import { getAllBlogPosts, getBlogPostBySlug } from "@/data/blog";
import { getPatternBySlug } from "@/data/patterns";
import { BlogPostJsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPattern = post.relatedPatternSlug
    ? getPatternBySlug(post.relatedPatternSlug)
    : null;

  const allPosts = getAllBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <>
      <BlogPostJsonLd post={post} />
      <main className="min-h-screen pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            All posts
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] uppercase tracking-wider text-primary/70 bg-primary/5 px-2.5 py-1 rounded"
                >
                  <Tag size={10} className="inline mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-sans text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-text-primary leading-tight mb-5">
              {post.title}
            </h1>

            <p className="text-text-secondary text-lg leading-relaxed mb-5">
              {post.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-text-secondary font-mono">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-primary" />
                {post.readingTime} min read
              </span>
              <span className="text-border">|</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.updatedAt !== post.publishedAt && (
                <>
                  <span className="text-border">|</span>
                  <span>
                    Updated{" "}
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
          </header>

          {/* TL;DR Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 sm:p-6 mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-primary" />
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                TL;DR — The One Thing to Know
              </span>
            </div>
            <p className="text-text-primary text-sm sm:text-base leading-relaxed font-sans">
              {post.tldr}
            </p>
          </div>

          {/* Article body */}
          <div className="space-y-10">
            {post.sections.map((section, i) => (
              <section key={i}>
                {section.heading && (
                  <h2 className="font-sans text-xl sm:text-2xl font-bold text-text-primary mb-4">
                    {section.heading}
                  </h2>
                )}
                <p className="text-text-secondary leading-relaxed text-[15px] sm:text-base">
                  {section.body}
                </p>
                {section.code && (
                  <div className="mt-5 rounded-lg overflow-hidden border border-border">
                    {section.code.label && (
                      <div className="bg-surface px-4 py-2 border-b border-border flex items-center justify-between">
                        <span className="font-mono text-xs text-text-secondary">
                          {section.code.label}
                        </span>
                        <span className="font-mono text-[10px] text-text-secondary/50 uppercase">
                          {section.code.language}
                        </span>
                      </div>
                    )}
                    <pre className="bg-code-bg p-4 overflow-x-auto">
                      <code className="font-code text-sm text-text-primary leading-relaxed whitespace-pre">
                        {section.code.snippet}
                      </code>
                    </pre>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Key Takeaway */}
          <div className="mt-12 bg-accent/5 border border-accent/20 rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={16} className="text-accent" />
              <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                Key Takeaway
              </span>
            </div>
            <p className="text-text-primary text-sm sm:text-base leading-relaxed font-sans">
              {post.keyTakeaway}
            </p>
          </div>

          {/* Related Pattern CTA */}
          {relatedPattern && (
            <div className="mt-10 bg-surface border border-border rounded-xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-primary" />
                <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                  Go Deeper — Full Pattern Breakdown
                </span>
              </div>
              <p className="text-text-secondary text-sm mb-4">
                This post covers the basics. The full curriculum page for{" "}
                <strong className="text-text-primary">{relatedPattern.name}</strong>{" "}
                includes the SWE mapping, code examples, production notes, and an
                interactive building exercise.
              </p>
              <Link
                href={`/patterns/${relatedPattern.slug}`}
                className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-mono text-sm px-5 py-2.5 rounded-lg transition-all border border-primary/20 hover:border-primary/40"
              >
                {relatedPattern.name} → {relatedPattern.sweParallel}
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Share */}
          <div className="mt-10 flex items-center gap-4">
            <span className="font-mono text-xs text-text-secondary flex items-center gap-1.5">
              <Share2 size={14} />
              Share this post:
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://learnagenticpatterns.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-text-secondary hover:text-primary transition-colors"
            >
              Twitter/X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://learnagenticpatterns.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-text-secondary hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
          </div>

          {/* Prev / Next navigation */}
          <nav className="mt-14 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group bg-surface/40 border border-border hover:border-primary/30 rounded-xl p-5 transition-all"
              >
                <span className="font-mono text-[10px] text-text-secondary uppercase tracking-wider">
                  ← Previous
                </span>
                <p className="font-sans text-sm font-semibold text-text-primary group-hover:text-primary transition-colors mt-1 line-clamp-2">
                  {prevPost.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group bg-surface/40 border border-border hover:border-primary/30 rounded-xl p-5 transition-all text-right"
              >
                <span className="font-mono text-[10px] text-text-secondary uppercase tracking-wider">
                  Next →
                </span>
                <p className="font-sans text-sm font-semibold text-text-primary group-hover:text-primary transition-colors mt-1 line-clamp-2">
                  {nextPost.title}
                </p>
              </Link>
            )}
          </nav>
        </article>

        {/* Hidden AI-readable summary */}
        <div className="sr-only" aria-hidden="false">
          <h2>AI-Readable Summary</h2>
          <p>Question: {post.aiQuestion}</p>
          <p>Answer: {post.aiAnswer}</p>
          <p>Key Takeaway: {post.keyTakeaway}</p>
          <p>
            Source: learnagenticpatterns.com/blog/{post.slug}
          </p>
        </div>
      </main>
    </>
  );
}
