import Link from "next/link";

export default function Hero() {
  return (
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
  );
}
