import Link from "next/link";
import Logo from "@/components/ui/Logo";

/**
 * Shared footer for public-facing pages.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border-primary ">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block group">
              <Logo className="h-9 w-auto opacity-90 group-hover:opacity-100 transition-opacity" />
            </Link>
            <p className="mt-1 text-xs text-balance max-w-50 text-text-tertiary">
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
                <Link href="/dashboard/create" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
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
                <Link href="/dashboard/tasks" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
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
              <li>
                <Link href="/legal" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Legal
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
                <Link href="/investment" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Investment
                </Link>
              </li>
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
                <Link href="/legal/security-policy" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dashed border-border-primary flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-tertiary">
            © {new Date().getFullYear()} Teron. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
