"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import TurnstileOverlay from "@/components/shared/TurnstileOverlay";

const TurnstileContext = createContext({
  turnstileToken: null,
  isVerified: false,
  setTurnstileToken: () => {},
  requireVerification: async () => {},
  openVerificationModal: () => {},
  closeVerificationModal: () => {},
  isModalOpen: false,
});

export function TurnstileProvider({ children }) {
  const [turnstileToken, setTurnstileTokenState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pendingCallbackRef = useRef(null);

  const setTurnstileToken = useCallback((token) => {
    setTurnstileTokenState(token);
  }, []);

  const openVerificationModal = useCallback((callback = null) => {
    pendingCallbackRef.current = callback;
    setIsModalOpen(true);
  }, []);

  const closeVerificationModal = useCallback(() => {
    setIsModalOpen(false);
    pendingCallbackRef.current = null;
  }, []);

  const handleSuccess = useCallback((token) => {
    setTurnstileTokenState(token);
    // Brief delay to let the user see the green "Success!" checkmark
    setTimeout(() => {
      setIsModalOpen(false);
      if (pendingCallbackRef.current) {
        pendingCallbackRef.current(token);
        pendingCallbackRef.current = null;
      }
    }, 600);
  }, []);

  const handleError = useCallback((err) => {
    console.warn("Turnstile verification error:", err);
  }, []);

  return (
    <TurnstileContext.Provider
      value={{
        turnstileToken,
        isVerified: !!turnstileToken,
        setTurnstileToken,
        openVerificationModal,
        closeVerificationModal,
        isModalOpen,
      }}
    >
      {children}
      <TurnstileOverlay
        isOpen={isModalOpen}
        onSuccess={handleSuccess}
        onError={handleError}
        onClose={closeVerificationModal}
      />
    </TurnstileContext.Provider>
  );
}

export function useTurnstile() {
  const context = useContext(TurnstileContext);
  if (!context) {
    throw new Error("useTurnstile must be used within a TurnstileProvider");
  }
  return context;
}
