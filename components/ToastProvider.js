"use client";

import { createContext, useContext, useCallback, useState } from "react";
import { ToastContainer } from "@/components/ui/Toast";

const ToastContext = createContext(null);

/**
 * Global Toast Provider — wraps the app so any component can trigger toasts.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ variant = "info", message, duration = 5000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, variant, message, duration }]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to access global toast system from any component.
 */
export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext must be used within <ToastProvider>");
  return ctx;
}
