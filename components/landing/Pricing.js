import Link from "next/link";

export default function Pricing() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-accent text-sm font-bold uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
            Transparent, Simple Pricing
          </h2>
          <p className="text-text-secondary mt-3 max-w-lg mx-auto">
            Deploy for free (just gas). Pay only for the premium services you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="bg-surface-primary border border-border-primary rounded-2xl p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-text-primary">Free Launch</h3>
              <p className="text-3xl font-extrabold text-text-primary mt-2">$0</p>
              <p className="text-xs text-text-tertiary mt-1">+ network gas fees</p>
            </div>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                BEP-20 smart contract deployment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                Token public profile page
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                Leaderboard listing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                Creator dashboard access
              </li>
            </ul>
            <Link
              href="/dashboard/create"
              className="mt-8 h-11 w-full bg-surface-secondary border border-border-secondary text-text-primary font-semibold rounded-lg inline-flex items-center justify-center hover:bg-surface-tertiary transition-colors text-sm"
            >
              Get Started Free
            </Link>
          </div>

          {/* Verification */}
          <div className="bg-surface-primary border-2 border-accent rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent text-accent-text text-xs font-bold rounded-full">
              Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-text-primary">Contract Verification</h3>
              <p className="text-3xl font-extrabold text-accent mt-2">~$2</p>
              <p className="text-xs text-text-tertiary mt-1">paid in BNB</p>
            </div>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                Everything in Free Launch
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">★</span>
                BscScan verified source code
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">★</span>
                Green checkmark on BscScan
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">★</span>
                Builds investor confidence
              </li>
            </ul>
            <Link
              href="/dashboard/create"
              className="mt-8 h-11 w-full bg-accent text-accent-text font-bold rounded-lg inline-flex items-center justify-center hover:bg-accent-hover transition-colors text-sm shadow-lg shadow-accent/20"
            >
              Launch + Verify
            </Link>
          </div>

          {/* Full Suite */}
          <div className="bg-surface-primary border border-border-primary rounded-2xl p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-text-primary">Full Suite</h3>
              <p className="text-3xl font-extrabold text-text-primary mt-2">~$5</p>
              <p className="text-xs text-text-tertiary mt-1">paid in BNB</p>
            </div>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                Everything in Verification
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">★</span>
                On-chain logo & metadata
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">★</span>
                Visible in Trust Wallet & others
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">★</span>
                Priority support
              </li>
            </ul>
            <Link
              href="/dashboard/create"
              className="mt-8 h-11 w-full bg-surface-secondary border border-border-secondary text-text-primary font-semibold rounded-lg inline-flex items-center justify-center hover:bg-surface-tertiary transition-colors text-sm"
            >
              Launch Full Suite
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
