"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from "@/components/WalletButton";
import { useWallet } from "@/hooks/useWallet";
import { ChampionIcon, Layout01Icon, Settings01Icon, Shield01Icon } from "hugeicons-react";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { href: "/leaderboard", label: "Leaderboard", icon: ChampionIcon },
  // { href: "/dashboard/create", label: "Create Token", requiresAuth: true },
  { href: "/dashboard", label: "Dashboard", requiresAuth: true, icon: Layout01Icon },
];

/**
 * Top header navigation for the (app) layout group.
 */
export default function Header() {
  const pathname = usePathname();
  const { isConnected, isAdmin } = useWallet();

  return (
    <header className="sticky top-0 z-40 w-full bg-bg-primary/60 backdrop-blur-2xl">
      <div className="border-b border-border-primary flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center group shrink-0">
          <Logo className="h-4 sm:h-5 w-auto text-white group-hover:text-accent transition-colors" />
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            if (link.requiresAuth && !isConnected) return null;

            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-surface-secondary text-accent shadow-sm ring-1 ring-border-secondary"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-primary"
                }`}
              >
                {link.icon && <link.icon size={16} variant={isActive ? "solid" : "stroke-rounded"} />}
                {link.label}
              </Link>
            );
          })}

          {/* Admin link — only for admin wallets */}
          {isConnected && isAdmin && (
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all flex items-center gap-2 ${
                pathname.startsWith("/admin")
                  ? "bg-error/10 text-error shadow-sm ring-1 ring-error/20"
                  : "text-error/70 hover:text-error hover:bg-error/5"
              }`}
            >
              <Shield01Icon size={16} variant={pathname.startsWith("/admin") ? "solid" : "stroke-rounded"} />
              Admin
            </Link>
          )}
        </nav>

        {/* Right: Wallet Button */}
        <div className="flex items-center gap-3">
          {isConnected && (
            <Link
              href="/dashboard/settings"
              className="w-10 h-10 rounded-[10px] card bg-surface-primary border border-border-primary text-text-tertiary hover:text-text-primary hover:border-border-secondary transition-all flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5"
              title="Profile Settings"
            >
              <Settings01Icon size={18} variant="stroke-rounded" />
            </Link>
          )}
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
