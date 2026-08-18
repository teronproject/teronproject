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
  CustomerSupportIcon,
} from "hugeicons-react";
import { motion } from "motion/react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home01Icon },
  { name: "Launch Token", href: "/dashboard/create", icon: Rocket01Icon },
  { name: "Deployments", href: "/dashboard/deployments", icon: Layers01Icon },
  { name: "Assistance", href: "/dashboard/assistance", icon: CustomerSupportIcon },
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
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 pb-safe">
        <div className="bg-[#111111]/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-x-auto shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex items-center px-1.5 py-1.5 gap-1 min-w-max mx-auto justify-start sm:justify-center">
            {navItems.map((item, index) => {
              const isActive = item.href === '/dashboard' 
                ? pathname === item.href 
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              
              return (
                <div key={item.name} className="flex items-center">
                  <Link
                    href={item.href}
                    className={`relative flex items-center justify-center p-3 transition-all duration-300${
                      isActive 
                        ? "bg-[#1a1a1a] text-white shadow-[0_0_20px_rgba(234,179,8,0.25)] border border-accent/40 cta rounded-full" 
                        : "text-text-secondary hover:text-white"
                    }`}
                  >
                    <Icon
                      variant={isActive ? "solid" : "stroke-rounded"}
                      size={22}
                    />
                  </Link>
                  {/* Subtle divider */}
                  {index < navItems.length - 1 && (
                    <div className="w-[1px] h-6 bg-white/5 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
