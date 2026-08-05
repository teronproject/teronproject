import Link from "next/link";

export const metadata = {
  title: "About Teron — Premium Token Launch Platform",
  description: "Learn about Teron, the premium Web3 token launch platform built for BNB Smart Chain.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 sm:py-28">
      <div className="text-center mb-16">
        <p className="text-accent text-sm font-bold uppercase tracking-wider mb-3">About</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
          The Premium Token Launch Platform
        </h1>
        <p className="text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
          Teron empowers Web3 creators to deploy production-grade BEP-20 tokens on BNB Smart Chain
          with built-in verification, on-chain metadata, and a public token profile — all from a single dashboard.
        </p>
      </div>

      {/* Mission */}
      <div className="space-y-12 mb-20">
        <div className="bg-surface-primary border border-border-primary rounded-2xl p-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">Our Mission</h2>
          <p className="text-text-secondary leading-relaxed">
            We believe launching a token should be as straightforward as creating a website. Too many
            projects fail because deploying a smart contract requires deep Solidity expertise, and
            getting verified on BscScan is a manual, error-prone process. Teron automates all of this
            into a simple, guided wizard — so you can focus on building your community, not fighting
            with tooling.
          </p>
        </div>

        <div className="bg-surface-primary border border-border-primary rounded-2xl p-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">Why BNB Chain?</h2>
          <p className="text-text-secondary leading-relaxed">
            BNB Smart Chain offers the ideal balance of low fees, fast confirmation times, and a massive
            ecosystem of DeFi protocols, wallets, and explorers. With average gas costs under $0.05 and
            3-second block times, it's the most accessible chain for new token projects. Teron is built
            exclusively for BNB Chain to provide the deepest possible integration — from BscScan
            verification to Trust Wallet metadata publishing.
          </p>
        </div>

        <div className="bg-surface-primary border border-border-primary rounded-2xl p-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">How We Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[
              {
                title: "No Custodial Risk",
                description: "We never hold your funds or private keys. You deploy directly from your own wallet. The contract is yours.",
              },
              {
                title: "Open-Source Contracts",
                description: "Our BEP-20 contract is based on OpenZeppelin's audited libraries. When verified, anyone can read the source code on BscScan.",
              },
              {
                title: "Wallet-First Identity",
                description: "No email signups, no passwords. Your wallet address IS your account. Connect and start building immediately.",
              },
              {
                title: "Transparent Pricing",
                description: "Basic deployment is free (gas only). Premium services have fixed USD prices converted to BNB using live market data.",
              },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <h3 className="font-semibold text-text-primary">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Ready to Launch Your Token?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <Link
            href="/dashboard/create"
            className="h-12 px-8 bg-accent text-accent-text font-bold rounded-xl inline-flex items-center justify-center hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
          >
            Launch Token
          </Link>
          <Link
            href="/pricing"
            className="h-12 px-8 border border-border-secondary text-text-primary font-semibold rounded-xl inline-flex items-center justify-center hover:bg-surface-primary transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
