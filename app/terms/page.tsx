import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Learn Agentic Patterns",
  description: "Terms governing your use of the Learn Agentic Patterns educational platform.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "March 6, 2026";

  return (
    <main className="relative z-10 pt-24 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-surface border border-border rounded-lg p-8 sm:p-12">
          <h1 className="font-mono text-3xl text-text-primary font-bold mb-2">
            Terms of Service
          </h1>
          <p className="text-text-secondary text-sm font-mono mb-8">
            Last updated: {lastUpdated}
          </p>

          <div className="space-y-8 text-text-secondary text-sm leading-relaxed">
            <section>
              <h2 className="font-mono text-lg text-primary mb-3">1. Agreement</h2>
              <p>
                By creating an account or using Learn Agentic Patterns (<strong className="text-text-primary">learnagenticpatterns.com</strong>),
                you agree to these Terms of Service and our{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                If you don&apos;t agree, please don&apos;t use the platform.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">2. The Platform</h2>
              <p>
                Learn Agentic Patterns is a free educational platform that teaches agentic AI design patterns.
                We provide written lessons, code examples, interactive exercises, games, assessments, and
                progress tracking for software engineers and product managers.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">3. Your Account</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>You must provide accurate information when signing up.</li>
                <li>You are responsible for keeping your password secure.</li>
                <li>One account per person — don&apos;t share credentials or create multiple accounts.</li>
                <li>You must be at least 16 years old to create an account.</li>
                <li>We may suspend or delete accounts that violate these terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">4. Acceptable Use</h2>
              <p className="mb-3">When using the platform, you agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Attempt to gain unauthorised access to other accounts or our systems.</li>
                <li>Use automated tools (bots, scrapers) to bulk-download content.</li>
                <li>Submit malicious input (SQL injection, XSS, or similar attacks).</li>
                <li>Abuse the rate-limited APIs or attempt to overload the platform.</li>
                <li>Impersonate others or submit false information.</li>
                <li>Use the platform for any illegal purpose.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">5. Content & Intellectual Property</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  All lessons, code examples, diagrams, games, and other educational materials are owned by
                  Learn Agentic Patterns or used with permission.
                </li>
                <li>
                  The curriculum is based on &ldquo;Agentic Design Patterns&rdquo; by Antonio Gull&iacute;,
                  used with attribution.
                </li>
                <li>
                  You may use code examples from lessons in your own projects (personal or commercial).
                  You may not republish or resell the lesson content itself.
                </li>
                <li>
                  Any feedback, exercise submissions, or game responses you submit may be used anonymously
                  to improve the platform.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">6. Leaderboards & Scores</h2>
              <p>
                Game scores, assessment results, and progress are displayed on leaderboards using your first name.
                By participating, you consent to having your first name and scores visible to other users.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">7. Availability & Changes</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  The platform is provided &ldquo;as is&rdquo;. We aim for high uptime but don&apos;t guarantee
                  uninterrupted access.
                </li>
                <li>We may add, modify, or remove content and features at any time.</li>
                <li>We may update these terms — continued use after changes means you accept them.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">8. Limitation of Liability</h2>
              <p>
                Learn Agentic Patterns is an educational resource, not professional consulting.
                We are not liable for decisions you make based on the content. Code examples are for
                learning purposes and may need adaptation for production use. Use the platform at your own risk.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">9. Termination</h2>
              <p>
                You can delete your account at any time by contacting us. We may also terminate accounts
                that violate these terms. Upon termination, your personal data will be deleted in accordance
                with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-lg text-primary mb-3">10. Contact</h2>
              <p>
                Questions about these terms? Reach out at{" "}
                <a href="mailto:hello@learnagenticpatterns.com" className="text-primary hover:underline font-mono">
                  hello@learnagenticpatterns.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
