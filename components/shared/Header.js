"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { motion, AnimatePresence } from "motion/react";
import { Menu01Icon, Cancel01Icon } from "hugeicons-react";
import { usePathname } from "next/navigation";

/**
 * Shared header/navigation for public-facing pages.
 */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      <header className="fixed top-0 -ml-[1px] z-50 w-full max-w-[1500px] mx-auto border-b border-border-primary bg-bg-primary/80 backdrop-blur-xl border-x overflow-hidden">
        <div className="px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group shrink-0">
              <Logo className="h-4 sm:h-5 w-auto" />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors relative group py-2 ${
                    pathname === link.href 
                      ? "text-text-primary font-medium" 
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className="absolute bottom-2 left-0 right-0 h-px bg-accent" 
                    />
                  )}
                  <div className="absolute bottom-2 left-0 right-0 h-px bg-accent/0 group-hover:bg-accent/50 rounded-full transition-colors" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden md:inline-flex cta items-center justify-center h-10 px-6 bg-accent text-accent-text font-bold rounded-lg text-sm hover:bg-accent-hover active:bg-accent-active transition-all shadow-sm hover:shadow-[0_0_15px_rgba(var(--color-accent-rgb,234,179,8),0.3)]"
            >
              Launch Token
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 -mr-2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <Cancel01Icon size={24} />
              ) : (
                <Menu01Icon size={24} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed h-full inset-x-0 top-16 z-40 md:hidden max-w-[1500px] mx-auto border-x border-border-primary border-b bg-bg-primary/95 backdrop-blur-3xl shadow-2xl"
          >
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    pathname === link.href 
                      ? "bg-surface-secondary text-text-primary" 
                      : "text-text-secondary hover:bg-surface-secondary/50 hover:text-text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 pb-2 px-2 border-t border-border-primary mt-2">
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex cta w-full items-center justify-center h-12 px-6 bg-accent text-accent-text font-bold rounded-xl text-base hover:bg-accent-hover active:bg-accent-active transition-all shadow-sm"
                >
                  Launch Token
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to push content down below fixed header */}
      <div className="h-16 w-full" aria-hidden="true" />
    </>
  );
}
