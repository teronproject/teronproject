import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-surface-primary/50 border-t border-border-primary">
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
  );
}
