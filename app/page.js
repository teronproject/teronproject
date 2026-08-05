export default function LandingPage() {
  return (
    <main className="flex-1">
      <section className="flex items-center justify-center min-h-dvh">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold tracking-tight text-text-primary mb-6">
            Launch Your Token on{" "}
            <span className="text-accent">BNB Chain</span>
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
            Create, deploy, and manage BEP-20 tokens with a premium launch
            experience. Contract verification, metadata publishing, rewards,
            and more.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/dashboard/create"
              className="inline-flex items-center justify-center h-12 px-8 bg-accent text-accent-text font-semibold rounded hover:bg-accent-hover active:bg-accent-active transition-colors"
            >
              Launch Token
            </a>
            <a
              href="/leaderboard"
              className="inline-flex items-center justify-center h-12 px-8 border border-border-secondary text-text-primary font-medium rounded hover:bg-surface-primary transition-colors"
            >
              Explore Projects
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
