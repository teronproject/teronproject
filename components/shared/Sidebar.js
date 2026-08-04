"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

/**
 * App sidebar navigation.
 * Used in the (app) route group for authenticated users.
 */

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/create", label: "Create Token" },
  { href: "/deployments", label: "Deployments" },
  { href: "/tasks", label: "Tasks" },
  { href: "/swap", label: "Swap" },
  { href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border-primary bg-bg-secondary min-h-dvh">
      <div className="h-16 flex items-center px-6 border-b border-border-primary">
        <Logo size="md" />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 h-10 px-3 rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent-subtle text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-primary">
        <Link
          href="/leaderboard"
          className="flex items-center gap-3 h-10 px-3 rounded text-sm text-text-tertiary hover:text-text-primary hover:bg-surface-primary transition-colors"
        >
          Leaderboard
        </Link>
      </div>
    </aside>
  );
}
