"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Toast notification component.
 * Use the `useToast` hook to trigger toasts from anywhere.
 *
 * @param {object} props
 * @param {"success"|"error"|"warning"|"info"} props.variant
 * @param {string} props.message
 * @param {number} [props.duration=5000]
 * @param {function} props.onDismiss
 */
export function Toast({ variant = "info", message, duration = 5000, onDismiss }) {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => onDismiss?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const variants = {
    success: "border-success bg-success-subtle text-success",
    error: "border-error bg-error-subtle text-error",
    warning: "border-warning bg-warning-subtle text-warning",
    info: "border-info bg-info-subtle text-info",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-md border-l-4 text-sm font-medium ${variants[variant]}`}
      role="alert"
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Toast container — renders at bottom-right of viewport.
 */
export function ToastContainer({ toasts = [], onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          message={toast.message}
          duration={toast.duration}
          onDismiss={() => onDismiss?.(toast.id)}
        />
      ))}
    </div>
  );
}

/**
 * Simple toast state hook.
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ variant = "info", message, duration = 5000 }) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, variant, message, duration }]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}

export default Toast;
