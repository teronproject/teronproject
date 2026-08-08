"use client";

import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  DashboardSquare01Icon, 
  CoinsSwapIcon, 
  UserMultiple02Icon, 
  MoneyBag02Icon,
  SecurityCheckIcon,
  Task01Icon,
} from "hugeicons-react";
import { motion } from "motion/react";

const adminNavItems = [
  { name: "Overview", href: "/admin", icon: DashboardSquare01Icon },
  { name: "Tokens", href: "/admin/tokens", icon: CoinsSwapIcon },
  { name: "Users", href: "/admin/users", icon: UserMultiple02Icon },
  { name: "Tasks", href: "/admin/tasks", icon: Task01Icon },
  { name: "Pricing", href: "/admin/pricing", icon: MoneyBag02Icon },
];

export default function AdminLayout({ children }) {
  const { isConnected, isAdmin, address } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) {
    return <div className="min-h-[60vh]"></div>;
  }

  if (!isConnected || !isAdmin) {
    return (
      <div className="max-w-3xl mx-auto py-32 px-4 text-center space-y-6 min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-error/10 border border-error/30 rounded-full flex items-center justify-center">
          <SecurityCheckIcon size={36} className="text-error" variant="stroke-rounded" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Admin Access Required</h1>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            {!isConnected
              ? "Connect your wallet to access the admin panel."
              : "Your wallet does not have admin privileges. Only wallets listed in ADMIN_WALLET_ADDRESSES can access this panel."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] mx-auto w-full overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border-primary  backdrop-blur-xl h-full sticky top-16 shrink-0 z-10">
        <div className="p-6">
          <h2 className="text-xs font-bold text-error uppercase tracking-wider mb-1">Admin Panel</h2>
          <p className="text-[10px] text-text-tertiary font-mono mb-4 truncate">{address}</p>
          <nav className="space-y-2">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? "text-accent cta font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  }`}
                >
                  <Icon variant={isActive ? "solid" : "stroke-rounded"} size={20} className="relative z-10" />
                  <span className="relative z-10 text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Admin Nav */}
      <nav className="md:hidden border-b border-border-primary bg-surface-primary/80 backdrop-blur-xl sticky top-16 z-30">
        <div className="flex items-center overflow-x-auto px-4 gap-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive ? "border-accent text-accent" : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="flex-1 w-full pb-20 md:pb-0 overflow-y-auto">{children}</main>
    </div>
  );
}
