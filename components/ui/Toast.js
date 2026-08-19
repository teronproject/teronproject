"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Premium Toast notification component with dark theme & glassmorphism.
 */
export function Toast({ variant = "info", title, message, duration = 5000, onDismiss }) {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => onDismiss?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const defaultTitles = {
    info: "Just so you know",
    success: "You're all set",
    warning: "Take a quick look",
    error: "Something went wrong",
  };

  const displayTitle = title || defaultTitles[variant] || "Notification";

  // Using inline SVGs for guaranteed polished look matching the vibe
  const icons = {
    info: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 11V16M12 8.5H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    success: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    warning: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
        <path d="M12 4L4 18H20L12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 10V14M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    error: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  const closeIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const config = {
    info: {
      bg: "bg-[#050403]/40",
      border: "border-white/10",
      shadow: "shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_inset_0_0_20px_rgba(59,130,246,0.15),_0_8px_32px_rgba(0,0,0,0.6)]",
    },
    success: {
      bg: "bg-[#050403]/40",
      border: "border-white/10",
      shadow: "shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_inset_0_0_20px_rgba(16,185,129,0.15),_0_8px_32px_rgba(0,0,0,0.6)]",
    },
    warning: {
      bg: "bg-[#050403]/40",
      border: "border-white/10",
      shadow: "shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_inset_0_0_20px_rgba(245,158,11,0.15),_0_8px_32px_rgba(0,0,0,0.6)]",
    },
    error: {
      bg: "bg-[#050403]/40",
      border: "border-white/10",
      shadow: "shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_inset_0_0_20px_rgba(239,68,68,0.2),_0_8px_32px_rgba(0,0,0,0.6)]",
    },
  };

  const current = config[variant] || config.info;

  // Error shake animation
  const animate = variant === "error"
    ? { opacity: 1, y: 0, scale: 1, x: [0, -6, 6, -4, 4, 0] }
    : { opacity: 1, y: 0, scale: 1, x: 0 };

  const transition = variant === "error"
    ? { duration: 0.4 }
    : { type: "spring", stiffness: 400, damping: 25 };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={animate}
      exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } }}
      transition={transition}
      className={`relative flex items-start gap-3 w-[340px] px-4 py-3.5 rounded-2xl border ${current.bg} ${current.border} ${current.shadow} backdrop-blur-[24px] backdrop-saturate-[150%]`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[variant] || icons.info}</div>
      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-[14px] font-semibold text-[#fafafa] tracking-tight leading-tight mb-0.5">
          {displayTitle}
        </h4>
        {message && (
          <p className="text-xs font-medium text-[#a1a1aa] leading-relaxed break-words">
            {message}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="absolute top-4 right-3 text-a1a1aa opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
        aria-label="Dismiss"
      >
        {closeIcon}
      </button>
    </motion.div>
  );
}

/**
 * Toast container — renders at bottom-right of viewport.
 */
export function ToastContainer({ toasts = [], onDismiss }) {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              variant={toast.variant}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              onDismiss={() => onDismiss?.(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Simple toast state hook.
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ variant = "info", title, message, duration = 5000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, variant, title, message, duration }]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}

export default Toast;
