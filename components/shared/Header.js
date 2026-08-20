"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { motion, AnimatePresence } from "motion/react";
import { Menu01Icon, Cancel01Icon, ArrowRight01Icon } from "hugeicons-react";
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
    { name: "Docs", href: "https://docs.teron.io/", external: true },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="relative w-full max-w-[1500px] mx-auto bg-[#0a0a0a] border-b  flex items-center justify-center group overflow-hidden">
        
        {/* Full-width decorative pattern masked to only show on left & right edges */}
        <div 
          className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(243,186,47,0.1)_4px,rgba(243,186,47,0.1)_6px)] opacity-50 mix-blend-screen pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
          style={{ WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 20%, transparent 80%, black 100%)', maskImage: 'linear-gradient(to right, black 0%, transparent 20%, transparent 80%, black 100%)' }}
        />
        
        {/* Glowing edge accents */}
        <div className="absolute left-0 top-0 bottom-0 w-[25%] bg-gradient-to-r from-accent/10 to-transparent blur-xl pointer-events-none mix-blend-screen" />
        <div className="absolute right-0 top-0 bottom-0 w-[25%] bg-gradient-to-l from-accent/10 to-transparent blur-xl pointer-events-none mix-blend-screen" />
        
        <a 
          href="https://dappbay.bnbchain.org/detail/teron" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative z-10 w-full flex items-center justify-center px-4 py-2.5 text-xs font-medium text-text-secondary hover:text-white transition-colors"
        >
          <span className="flex items-center gap-1.5 tracking-wide">
            We are now live on the DappBay by BNB Chain!
            <ArrowRight01Icon size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </a>
      </div>

      <header className="sticky top-0  z-50 w-full max-w-[1500px] mx-auto border-b border-border-primary bg-bg-primary/80 backdrop-blur-xl overflow-hidden">
        <div className="px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group shrink-0">
              <Logo className="h-7 w-auto" />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={`relative px-2 py-0.5 text-sm font-medium transition-colors rounded-xs overflow-hidden group ${
                      isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    
                    {/* Active State Pill */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-accent/5 z-0 border-b"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      >
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(243,186,47,0.1)_2px,rgba(243,186,47,0.1)_3px)] opacity-50 mask-[linear-gradient(to_bottom,white,transparent)]" />
                      </motion.div>
                    )}
                    
                    {/* Hover State Pill */}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-full  group-hover:border-white/5 bg-white/0 z-0 transition-all duration-300">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(243,186,47,0.1)_2px,rgba(243,186,47,0.1)_3px)] opacity-0 group-hover:opacity-100 mask-[linear-gradient(to_bottom,white,transparent)] transition-opacity duration-300" />
                      </div>
                    )}
                  </Link>
                );
              })}
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
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={link.external ? undefined : closeMobileMenu}
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
