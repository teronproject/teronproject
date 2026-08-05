import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export const metadata = {
  title: "Teron — Launch Your Token on BNB Chain",
  description:
    "Create, deploy, and manage BEP-20 tokens with premium smart contract verification, on-chain metadata publishing, and a public token profile — all on BNB Smart Chain.",
};

export default function LandingPage() {
  return (
    <>
      <Header />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-accent/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Live on BNB Smart Chain
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-tight">
              Launch Your Token.{" "}
              <span className="text-accent">Verify It.</span>{" "}
              <span className="text-text-secondary">Own It.</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary mt-6 max-w-2xl mx-auto leading-relaxed">
              Teron is the premium token launch platform for BNB Chain. Deploy
              production-grade BEP-20 smart contracts, get verified on-chain, and
              build credibility — all from one dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link
                href="/dashboard/create"
                className="h-14 px-10 bg-accent text-accent-text font-bold rounded-xl text-base inline-flex items-center justify-center hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5"
              >
                Launch Token — Free
              </Link>
              <Link
                href="/leaderboard"
                className="h-14 px-10 border border-border-secondary text-text-primary font-semibold rounded-xl text-base inline-flex items-center justify-center hover:bg-surface-primary transition-colors"
              >
                Explore Projects
              </Link>
            </div>

            <p className="text-xs text-text-tertiary mt-6">
              No credit card required. Deploy for only gas fees. Premium add-ons optional.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TRUST BAR ═══════════════════════ */}
      <section className="border-y border-border-primary bg-surface-primary/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-extrabold text-accent">BNB Chain</p>
              <p className="text-xs text-text-tertiary mt-1">Network</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-text-primary">BEP-20</p>
              <p className="text-xs text-text-tertiary mt-1">Token Standard</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-text-primary">~$0.05</p>
              <p className="text-xs text-text-tertiary mt-1">Avg Gas Cost</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-success">Immutable</p>
              <p className="text-xs text-text-tertiary mt-1">Smart Contracts</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-bold uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
              Three Steps to Launch
            </h2>
            <p className="text-text-secondary mt-3 max-w-lg mx-auto">
              From idea to a live token on BNB Chain in under 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Configure Your Token",
                description:
                  "Set your token name, symbol, decimals, and total supply. Add social links, a logo, and a description to build your public profile.",
                accent: "bg-accent/10 text-accent border-accent/20",
              },
              {
                step: "02",
                title: "Deploy On-Chain",
                description:
                  "Connect your wallet and sign the deployment transaction. Your BEP-20 contract is deployed directly to BNB Smart Chain — immutable and yours.",
                accent: "bg-success/10 text-success border-success/20",
              },
              {
                step: "03",
                title: "Verify & Go Live",
                description:
                  "Optionally verify your contract source code and publish on-chain metadata. Your token gets a public profile page on Teron's leaderboard.",
                accent: "bg-warning/10 text-warning border-warning/20",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-surface-primary border border-border-primary rounded-2xl p-8 hover:border-border-secondary transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl ${item.accent} border flex items-center justify-center font-extrabold text-lg mb-6`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-surface-primary/30 border-y border-border-primary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-bold uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
              Everything You Need to Launch
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🔗",
                title: "BEP-20 Smart Contract",
                description: "Production-grade, OpenZeppelin-based token contract deployed directly to BNB Chain. Fully ownable and standard-compliant.",
              },
              {
                icon: "✅",
                title: "Contract Verification",
                description: "Get your smart contract source code verified on BscScan. Builds trust with investors and exchanges. Optional premium add-on.",
              },
              {
                icon: "📊",
                title: "On-Chain Metadata",
                description: "Publish your token logo, description, and social links directly on-chain. Visible in wallets and explorers that support token info.",
              },
              {
                icon: "🏆",
                title: "Token Leaderboard",
                description: "Every token gets a public profile page on the Teron leaderboard. Show off your community, social links, and deployment status.",
              },
              {
                icon: "💼",
                title: "Creator Dashboard",
                description: "Manage all your deployed tokens from a single dashboard. Track deployment status, update profiles, and manage premium services.",
              },
              {
                icon: "🔒",
                title: "Wallet-First Identity",
                description: "No accounts, no passwords. Connect your BNB Chain wallet and your profile is auto-created. Your wallet is your identity.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-surface-primary border border-border-primary rounded-xl p-6 hover:border-accent/30 transition-colors"
              >
                <span className="text-2xl mb-4 block">{feature.icon}</span>
                <h3 className="font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRICING ═══════════════════ */}
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

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-surface-primary/50 border-t border-border-primary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
            Ready to Launch Your Token?
          </h2>
          <p className="text-text-secondary mt-4 max-w-lg mx-auto">
            Join creators who trust Teron to deploy production-grade tokens on BNB Chain.
            It takes under 5 minutes.
          </p>
          <Link
            href="/dashboard/create"
            className="mt-8 h-14 px-12 bg-accent text-accent-text font-bold rounded-xl text-base inline-flex items-center justify-center hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5"
          >
            Start Building Now
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
