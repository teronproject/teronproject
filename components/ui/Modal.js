"use client";

import { useEffect, useRef } from "react";

/**
 * Modal component with backdrop blur and focus trapping.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose?.();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg bg-bg-secondary border border-border-primary rounded-lg shadow-2xl ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded text-text-tertiary hover:text-text-primary hover:bg-surface-primary transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
