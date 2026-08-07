export default function TrustBar() {
  return (
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
  );
}
