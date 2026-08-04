import Link from "next/link";
import Logo from "./Logo";

/**
 * Shared footer for public-facing pages.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border-primary bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo size="lg" />
            <p className="mt-3 text-sm text-text-tertiary max-w-xs">
              Premium Web3 token launch platform for BNB Chain.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Launch Token
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/tasks" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Tasks
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/disclaimer" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/legal/risk-disclosure" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Risk Disclosure
                </Link>
              </li>
              <li>
                <Link href="/legal/security-policy" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border-primary flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-tertiary">
            © {new Date().getFullYear()} Teron. All rights reserved.
          </p>
          <p className="text-sm text-text-tertiary">
            Built for BNB Chain
          </p>
        </div>
      </div>
    </footer>
  );
}
