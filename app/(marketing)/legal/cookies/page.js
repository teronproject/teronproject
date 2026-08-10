import Link from "next/link";

export const metadata = {
  title: "Cookie Policy — Teron",
  description: "Teron Cookie Policy. Learn what cookies we use, why we use them, and how to manage your cookie preferences on our BNB Chain token creation platform.",
  keywords: "Teron cookies, cookie policy, crypto platform cookies, Web3 cookies, BNB Chain cookie settings",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="w-full pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-white/5">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/legal" className="text-xs uppercase tracking-[0.2em] text-text-tertiary mb-4 font-medium inline-block hover:text-accent transition-colors">← Legal</Link>
          <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-5">
            Cookie Policy
          </h1>
          <p className="text-sm text-text-tertiary">
            Effective date: August 10, 2026 · Last updated: August 10, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-legal">
            <p className="text-text-secondary leading-relaxed mb-8">
              This Cookie Policy explains how Teron uses cookies and similar tracking technologies when you visit our platform at teron.io. We keep our cookie usage minimal and transparent.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">1. What Are Cookies</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, such as your preferences and login state. Cookies can be "session" cookies that expire when you close your browser, or "persistent" cookies that remain on your device for a set period.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">2. Cookies We Use</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              <span className="text-white font-medium">Essential Cookies.</span> These are required for the platform to function. They handle wallet session authentication, security tokens, and basic application state. Without these cookies, you cannot use Teron. These do not track you across other websites.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              <span className="text-white font-medium">Preference Cookies.</span> These remember your settings and choices, such as your preferred theme or dismissed notifications. They improve your experience but are not strictly necessary.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              <span className="text-white font-medium">Analytics Cookies.</span> We use privacy-respecting analytics to understand how visitors use Teron. This includes which pages are visited most, how users navigate the platform, and where errors occur. This data is aggregated and does not identify individual users. We use this information to improve the platform.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">3. Third-Party Cookies</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Some third-party services integrated into Teron may set their own cookies:
            </p>
            <ul className="list-none space-y-3 mb-10 pl-0">
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary"><span className="text-white">WalletConnect</span> — may store session data for wallet connections</li>
              <li className="text-text-secondary leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-text-tertiary"><span className="text-white">Cloudinary</span> — may set cookies when serving uploaded images such as token logos</li>
            </ul>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">4. What We Do Not Use</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              Teron does not use advertising cookies or tracking pixels. We do not serve ads on our platform. We do not share cookie data with advertising networks or data brokers. We do not build behavioral profiles for marketing purposes.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">5. Managing Cookies</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. However, blocking essential cookies will prevent Teron from functioning properly.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              Common browser cookie settings can be found in your browser's help documentation. Each browser has its own process for managing cookies.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">6. Local Storage</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              In addition to cookies, Teron may use browser local storage and session storage to maintain application state. This includes wallet connection status and UI preferences. Local storage works similarly to cookies but is not sent with every HTTP request, making it more efficient for storing application data.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">7. Updates</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              We may update this Cookie Policy as we add new features or integrations. Changes will be reflected in the "Last updated" date at the top. We encourage you to review this page periodically.
            </p>

            <h2 className="text-xl font-medium text-white mb-4 tracking-tight">8. Contact</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              For questions about our cookie practices, contact us at:
            </p>
            <p className="text-text-secondary leading-relaxed">
              <span className="text-white">Email:</span> privacy@teron.io
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
