"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home01Icon, 
  Rocket01Icon, 
  Settings01Icon,
  Layout01Icon,
  Task01Icon,
  Coins01Icon,
  Layers01Icon,
} from "hugeicons-react";
import { motion } from "motion/react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home01Icon },
  { name: "Launch Token", href: "/dashboard/create", icon: Rocket01Icon },
  { name: "Deployments", href: "/dashboard/deployments", icon: Layers01Icon },
  { name: "Tasks", href: "/dashboard/tasks", icon: Task01Icon },
  { name: "Rewards", href: "/dashboard/rewards", icon: Coins01Icon },
  { name: "Token Profiles", href: "/dashboard/profiles", icon: Layout01Icon },
  { name: "Settings", href: "/dashboard/settings", icon: Settings01Icon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border-primary backdrop-blur-xl min-h-[calc(100vh-64px)] sticky top-16 shrink-0 z-10">
        <div className="p-6">
          {/* <h2 className="text-md text-text-tertiary stitle mb-4">
            Dashboard
          </h2> */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = item.href === '/dashboard' 
                ? pathname === item.href 
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-self-start w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? "text-accent cta font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  }`}
                >
                  <Icon
                    variant={isActive ? "solid" : "stroke-rounded"}
                    size={20}
                    className="relative z-10"
                  />
                  <span className="relative z-10 text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border-primary bg-surface-primary/80 backdrop-blur-xl z-50 pb-safe">
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === item.href 
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 min-w-[50px] transition-colors ${
                  isActive ? "text-accent" : "text-text-secondary"
                }`}
              >
                <Icon
                  variant={isActive ? "solid" : "stroke-rounded"}
                  size={20}
                  className="mb-1"
                />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
