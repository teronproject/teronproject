export default function Features() {
  return (
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
  );
}
