"use client";

import { useEffect, useState, useCallback } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { BNB_CHAIN_ID, BNB_TESTNET_CHAIN_ID } from "@/lib/constants";
import { useTurnstile } from "@/components/TurnstileProvider";

/**
 * Custom hook for wallet connection state and actions.
 * Wraps wagmi hooks with Teron-specific logic, persistent referral tracking, and DB session syncing.
 */
export function useWallet() {
  const { address, isConnected, chain, connector } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { turnstileToken, isVerified, openVerificationModal, setTurnstileToken } = useTurnstile();
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Get referral code from URL params (e.g., ?ref=abc123) and persist in storage
  let referralCodeFromUrl = null;
  try {
    const searchParams = useSearchParams();
    referralCodeFromUrl = searchParams?.get("ref") || null;
  } catch (_) {
    // useSearchParams may fail in non-suspense SSR contexts
  }

  // Persist referral code into localStorage and cookie so it isn't lost during page navigation
  useEffect(() => {
    if (referralCodeFromUrl && typeof window !== "undefined") {
      try {
        const clean = referralCodeFromUrl.trim().toLowerCase();
        localStorage.setItem("teron_referral_code", clean);
        document.cookie = `teron_ref=${clean}; path=/; max-age=2592000; SameSite=Lax`;
      } catch (_) {}
    }
  }, [referralCodeFromUrl]);

  const isBnbChain = chain?.id === BNB_CHAIN_ID;
  const isWrongChain = isConnected && !isBnbChain;
  const isAdmin = userProfile?.role === "ADMIN";

  const identifyUser = useCallback((user) => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;

    const identifiedUserId = posthog.get_property("$user_id");

    if (identifiedUserId && identifiedUserId !== user.id) {
      posthog.reset();
    }

    if (identifiedUserId !== user.id) {
      posthog.identify(user.id, {
        email: user.email || undefined,
        name: user.displayName || undefined,
        role: user.role,
      });
    }
  }, []);

  /**
   * Sync wallet with the Teron backend.
   * Creates or resumes a DB session and returns the user profile.
   */
  const syncSession = useCallback(async (walletAddress, token = null) => {
    if (!walletAddress) return null;
    try {
      const activeToken = token || turnstileToken;
      // Check active referral code from URL or persistent storage
      let activeRefCode = referralCodeFromUrl;
      if (!activeRefCode && typeof window !== "undefined") {
        activeRefCode = localStorage.getItem("teron_referral_code") || null;
      }

      const res = await fetch("/api/auth/wallet-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: walletAddress,
          referralCode: activeRefCode || null,
          cfToken: activeToken, // Pass Turnstile token
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        identifyUser(data.user);
        return data.user;
      }
      return null;
    } catch (err) {
      console.error("Session sync failed:", err);
      return null;
    }
  }, [identifyUser, referralCodeFromUrl, turnstileToken]);

  const disconnectWallet = useCallback(() => {
    setUserProfile(null);
    if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
      posthog.reset();
    }
    disconnect();
  }, [disconnect]);

  /**
   * Refresh user profile from the backend (e.g. after profile update or referral apply).
   */
  const refreshProfile = useCallback(async () => {
    if (address) {
      setIsProfileLoading(true);
      try {
        const profile = await syncSession(address, turnstileToken);
        if (profile) setUserProfile(profile);
        return profile;
      } finally {
        setIsProfileLoading(false);
      }
    }
  }, [address, syncSession, turnstileToken]);

  // Sync wallet with Teron database session on connect
  useEffect(() => {
    let isCancelled = false;

    if (isConnected && address) {
      if (!turnstileToken) {
        // If we don't have a token yet, prompt the Turnstile verification
        openVerificationModal((token) => {
          if (!isCancelled && token) {
            syncSession(address, token).then((profile) => {
              if (!isCancelled && profile) {
                setUserProfile(profile);
              }
            });
          }
        });
      } else {
        // If we have a token, proceed with sync
        syncSession(address, turnstileToken).then((profile) => {
          if (!isCancelled && profile) {
            setUserProfile(profile);
          }
        });
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [isConnected, address, syncSession, turnstileToken, openVerificationModal]);

  const activeUserProfile = isConnected && address ? userProfile : null;

  return {
    // Wagmi state
    address,
    isConnected,
    chain,
    connector,
    connectors,
    // BNB Chain helpers
    isBnbChain,
    isWrongChain,
    // Actions
    connect,
    disconnect: disconnectWallet,
    switchChain,
    isConnecting,
    // Teron user profile
    userProfile: activeUserProfile,
    isProfileLoading,
    isAdmin,
    refreshProfile,
    // Turnstile
    turnstileToken,
    isVerified,
    openVerificationModal,
    setTurnstileToken,
  };
}
