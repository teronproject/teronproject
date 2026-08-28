"use client";

import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { SecurityCheckIcon, Cancel01Icon } from "hugeicons-react";

// Prevent SSR issues with Turbopack by forcing client-side rendering only
const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false }
);

export default function TurnstileOverlay({
  isOpen,
  onSuccess,
  onError,
  onClose,
}) {
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"; // Default interactive test key

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-md bg-[#0e0e0e] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f3ba2f]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-text-tertiary hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <Cancel01Icon size={18} />
              </button>
            )}

            {/* Header Icon & Title */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-[0_0_20px_rgba(243,186,47,0.15)]">
                <SecurityCheckIcon size={26} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Security Verification
                </h3>
                <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto leading-relaxed">
                  Please complete the verification checkbox below to enable wallet connection and protect against bots.
                </p>
              </div>
            </div>

            {/* Cloudflare Turnstile Widget Box */}
            <div className="mt-6 flex flex-col items-center justify-center min-h-[75px] py-2 px-3 bg-surface-secondary/40 border border-white/5 rounded-xl">
              <Turnstile
                siteKey={siteKey}
                onSuccess={onSuccess}
                onError={(err) => onError?.(err || "Verification failed")}
                onExpire={() => onError?.("Verification expired. Please try again.")}
                options={{
                  theme: "dark",
                  size: "normal",
                }}
              />
            </div>

            {/* Subtext info */}
            <div className="mt-5 text-center">
              <p className="text-[11px] text-text-tertiary">
                Secured by Cloudflare Turnstile • Automated bot traffic blocked
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
