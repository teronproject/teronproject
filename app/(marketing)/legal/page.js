import Link from "next/link";

export const metadata = {
  title: "Legal — Teron",
  description: "Access all Teron legal documents including Terms of Service, Privacy Policy, Cookie Policy, Disclaimer, Risk Disclosure, and Security Policy. Clear and transparent policies for our BNB Chain token launch platform.",
};

const legalPages = [
  {
    title: "Terms of Service",
    href: "/legal/terms",
    description: "The agreement between you and Teron when you use our platform. Covers account responsibilities, acceptable use, intellectual property, and service limitations.",
    updated: "August 10, 2026",
  },
  {
    title: "Privacy Policy",
    href: "/legal/privacy",
    description: "How we collect, use, store, and protect your personal data. Covers wallet addresses, analytics, cookies, third-party integrations, and your rights over your information.",
    updated: "August 10, 2026",
  },
  {
    title: "Cookie Policy",
    href: "/legal/cookies",
    description: "What cookies and similar tracking technologies we use, why we use them, and how you can manage your preferences.",
    updated: "August 10, 2026",
  },
  {
    title: "Disclaimer",
    href: "/legal/disclaimer",
    description: "Important information about the nature of our services, the risks involved in token creation and blockchain interactions, and the limits of our liability.",
    updated: "August 10, 2026",
  },
  {
    title: "Risk Disclosure",
    href: "/legal/risk-disclosure",
    description: "A transparent overview of the financial, technical, and regulatory risks associated with creating and holding digital tokens on BNB Chain.",
    updated: "August 10, 2026",
  },
  {
    title: "Security Policy",
    href: "/legal/security-policy",
    description: "How we protect the Teron platform, our approach to smart contract security, infrastructure safeguards, and how to report vulnerabilities.",
    updated: "August 10, 2026",
  },
];

export default function LegalIndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="w-full pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-white/5">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary mb-4 font-medium">Legal</p>
          <h1 className="title text-4xl sm:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-5">
            Legal Documents
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed">
            Transparency matters. These documents explain exactly how Teron works, how we handle your data, and what responsibilities apply when you use our BNB Chain token launch platform.
          </p>
        </div>
      </section>

      {/* Legal Pages List */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-0 divide-y divide-white/5">
            {legalPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group block py-8 first:pt-0 last:pb-0 transition-colors"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-medium text-white group-hover:text-accent transition-colors tracking-tight mb-2">
                      {page.title}
                    </h2>
                    <p className="text-sm text-text-tertiary leading-relaxed max-w-xl">
                      {page.description}
                    </p>
                    <p className="text-xs text-text-tertiary/60 mt-3">
                      Last updated {page.updated}
                    </p>
                  </div>
                  <span className="text-text-tertiary group-hover:text-accent transition-colors mt-1 shrink-0">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
