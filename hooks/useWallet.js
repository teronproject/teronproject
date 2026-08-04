"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { BNB_CHAIN_ID, BNB_TESTNET_CHAIN_ID } from "@/lib/constants";

/**
 * Custom hook for wallet connection state and actions.
 * Wraps wagmi hooks with Teron-specific logic.
 */
export function useWallet() {
  const { address, isConnected, chain, connector } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  const isBnbChain =
    chain?.id === BNB_CHAIN_ID || chain?.id === BNB_TESTNET_CHAIN_ID;
  const isWrongChain = isConnected && !isBnbChain;

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
  };
}
