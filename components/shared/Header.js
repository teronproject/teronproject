import Link from "next/link";
import Logo from "./Logo";

/**
 * Shared header/navigation for public-facing pages.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-primary bg-bg-primary/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/leaderboard"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/create"
            className="inline-flex items-center justify-center h-10 px-6 bg-accent text-accent-text font-semibold rounded text-sm hover:bg-accent-hover active:bg-accent-active transition-colors"
          >
            Launch Token
          </Link>
        </div>
      </div>
    </header>
  );
}
