import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Learn Agentic Patterns",
  description: "How Learn Agentic Patterns collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 6, 2026";

  return (
    <main className="relative z-10 pt-24 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-surface border border-border rounded-lg p-8 sm:p-12">
          <h1 className="font-mono text-3xl text-text-primary font-bold mb-2">
            Privacy Policy
          </h1>
          <p className="text-text-secondary text-sm font-mono mb-8">
            Last updated: {lastUpdated}
          </p>

          <div className="space-y-8 text-text-secondary text-sm leading-relaxed">
            <section>
              <h2 className="font-mono text-lg text-primary mb-3">1. Who We Are</h2>
              <p>
                Learn Agentic Patterns (<strong className="text-text-primary">learnagenticpatterns.com</strong>) is
                a free educational platform that teaches agentic AI design patterns to software engineers and product
                managers. This policy explains how we handle your data when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect only what we need to give you a great learning experience:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-text-primary">Account info</strong> — first name, email address,
                  professional role, and an optional free-text response about your challenges with agentic AI.
                </li>
                <li>
                  <strong className="text-text-primary">Learning progress</strong> — which patterns you&apos;ve
                  completed, assessment scores, game scores, and exercise submissions so we can track your progress
                  and show leaderboards.
                </li>
                <li>
                  <strong className="text-text-primary">Feedback</strong> — lesson ratings and optional comments
                  you submit to help us improve content.
                </li>
                <li>
                  <strong className="text-text-primary">Technical data</strong> — IP address (for rate limiting
                  and abuse prevention only, not stored long-term), browser type, and general usage analytics.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Provide and personalise your learning experience (progress tracking, leaderboards).</li>
                <li>Send you a welcome email and occasional product updates (you can unsubscribe anytime).</li>
                <li>Prevent abuse through rate limiting and spam detection.</li>
                <li>Improve content based on aggregated, anonymized feedback and usage patterns.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">4. What We Never Do</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>We never sell, rent, or trade your personal data to third parties.</li>
                <li>We never share your email with advertisers or marketing partners.</li>
                <li>We never use your data to train AI models.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">5. Third-Party Services</h2>
              <p>We use a small set of trusted services to run the platform:</p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                <li>
                  <strong className="text-text-primary">Resend</strong> — for sending transactional emails
                  (welcome email, password reset).
                </li>
                <li>
                  <strong className="text-text-primary">Vercel</strong> — for hosting and serving the application.
                </li>
                <li>
                  <strong className="text-text-primary">PostgreSQL (Neon/Supabase)</strong> — for storing your
                  account and progress data securely.
                </li>
              </ul>
              <p className="mt-3">Each of these providers has their own privacy policies and maintains industry-standard security practices.</p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">6. Data Security</h2>
              <p>
                Passwords are hashed with bcrypt before storage — we never store plaintext passwords.
                All data is transmitted over HTTPS. Access to the database is restricted and requires authentication.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">7. Your Rights</h2>
              <p>You can:</p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                <li>Request a copy of all personal data we hold about you.</li>
                <li>Ask us to correct inaccurate information.</li>
                <li>Request deletion of your account and all associated data.</li>
                <li>Unsubscribe from emails at any time.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email us at{" "}
                <a href="mailto:privacy@learnagenticpatterns.com" className="text-primary hover:underline font-mono">
                  privacy@learnagenticpatterns.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">8. Cookies</h2>
              <p>
                We use a single authentication token stored in your browser&apos;s local storage to keep you logged in.
                We do not use tracking cookies or third-party advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">9. Children&apos;s Privacy</h2>
              <p>
                This platform is designed for professionals. We do not knowingly collect data from anyone under 16.
                If you believe a child has created an account, please contact us and we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. If we make significant changes, we&apos;ll notify you
                via email or a notice on the platform. The &ldquo;Last updated&rdquo; date at the top always reflects
                the latest version.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">11. Contact</h2>
              <p>
                Questions about this policy? Reach out at{" "}
                <a href="mailto:privacy@learnagenticpatterns.com" className="text-primary hover:underline font-mono">
                  privacy@learnagenticpatterns.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
