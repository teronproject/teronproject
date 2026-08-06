"use client";

import { useEffect, useState, useCallback } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useSearchParams } from "next/navigation";
import { BNB_CHAIN_ID, BNB_TESTNET_CHAIN_ID } from "@/lib/constants";

/**
 * Custom hook for wallet connection state and actions.
 * Wraps wagmi hooks with Teron-specific logic and DB session syncing.
 */
export function useWallet() {
  const { address, isConnected, chain, connector } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Get referral code from URL params (e.g., ?ref=abc123)
  let referralCodeFromUrl = null;
  try {
    const searchParams = useSearchParams();
    referralCodeFromUrl = searchParams?.get("ref") || null;
  } catch (_) {
    // useSearchParams may fail in some contexts
  }

  const isBnbChain = chain?.id === BNB_CHAIN_ID;
  const isWrongChain = isConnected && !isBnbChain;
  const isAdmin = userProfile?.role === "ADMIN";

  /**
   * Sync wallet with the Teron backend.
   * Creates or resumes a DB session and returns the user profile.
   */
  const syncSession = useCallback(async (walletAddress) => {
    if (!walletAddress) return null;
    setIsProfileLoading(true);
    try {
      const res = await fetch("/api/auth/wallet-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: walletAddress,
          referralCode: referralCodeFromUrl,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUserProfile(data.user);
        return data.user;
      }
      return null;
    } catch (err) {
      console.error("Session sync failed:", err);
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  }, [referralCodeFromUrl]);

  /**
   * Refresh user profile from the backend (e.g. after profile update).
   */
  const refreshProfile = useCallback(async () => {
    if (address) {
      return syncSession(address);
    }
  }, [address, syncSession]);

  // Sync wallet with Teron database session on connect
  useEffect(() => {
    if (isConnected && address) {
      syncSession(address);
    } else {
      setUserProfile(null);
    }
  }, [isConnected, address, syncSession]);

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
    disconnect,
    switchChain,
    isConnecting,
    // Teron user profile
    userProfile,
    isProfileLoading,
    isAdmin,
    refreshProfile,
  };
}
