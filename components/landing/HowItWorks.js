export default function HowItWorks() {
  return (
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
  );
}
