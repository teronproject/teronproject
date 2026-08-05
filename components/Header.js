"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from "@/components/WalletButton";
import { useWallet } from "@/hooks/useWallet";

const navLinks = [
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/dashboard/create", label: "Create Token", requiresAuth: true },
  { href: "/dashboard", label: "Dashboard", requiresAuth: true },
];

/**
 * Top header navigation for the (app) layout group.
 */
export default function Header() {
  const pathname = usePathname();
  const { isConnected, isAdmin } = useWallet();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-primary bg-bg-primary/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-accent-text font-extrabold text-sm">T</span>
          </div>
          <span className="text-lg font-extrabold text-text-primary tracking-tight group-hover:text-accent transition-colors">
            Teron
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            if (link.requiresAuth && !isConnected) return null;

            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-surface-primary text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Admin link — only for admin wallets */}
          {isConnected && isAdmin && (
            <Link
              href="/admin"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-error/10 text-error"
                  : "text-error/70 hover:text-error hover:bg-error/10"
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right: Wallet Button */}
        <div className="flex items-center gap-3">
          {isConnected && (
            <Link
              href="/dashboard/settings"
              className="w-8 h-8 rounded-full bg-surface-primary border border-border-primary text-text-tertiary hover:text-text-primary hover:border-border-secondary transition-colors flex items-center justify-center text-sm"
              title="Profile Settings"
            >
              ⚙
            </Link>
          )}
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
