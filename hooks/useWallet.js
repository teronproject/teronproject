"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { BNB_CHAIN_ID, BNB_TESTNET_CHAIN_ID } from "@/lib/constants";

/**
 * Custom hook for wallet connection state and actions.
 * Wraps wagmi hooks with Teron-specific logic and DB session syncing.
 */
export function useWallet() {
  const { address, isConnected, chain, connector } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const [userProfile, setUserProfile] = useState(null);

  const isBnbChain =
    chain?.id === BNB_CHAIN_ID || chain?.id === BNB_TESTNET_CHAIN_ID;
  const isWrongChain = isConnected && !isBnbChain;

  // Sync wallet with Teron database session
  useEffect(() => {
    if (isConnected && address) {
      fetch("/api/auth/wallet-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUserProfile(data.user);
          }
        })
        .catch(console.error);
    } else {
      setUserProfile(null);
    }
  }, [isConnected, address]);

  return {
    address,
    isConnected,
    chain,
    connector,
    isBnbChain,
    isWrongChain,
    isConnecting,
    connect,
    connectors,
    disconnect,
    userProfile, // Extracted from Teron DB
  };
}
