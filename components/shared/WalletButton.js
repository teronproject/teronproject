"use client";

import { useWallet } from "@/hooks/useWallet";

/**
 * Wallet connect/disconnect button.
 * Shows connected address when connected, connect prompt when disconnected.
 */
export default function WalletButton() {
  const { address, isConnected, isConnecting, connect, connectors, disconnect } =
    useWallet();

  if (isConnected && address) {
    const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <button
        onClick={() => disconnect()}
        className="inline-flex items-center gap-2 h-10 px-4 bg-surface-primary border border-border-primary rounded text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-success" />
        {truncated}
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        const connector = connectors[0];
        if (connector) connect({ connector });
      }}
      disabled={isConnecting}
      className="inline-flex items-center justify-center h-10 px-6 bg-accent text-accent-text font-semibold rounded text-sm hover:bg-accent-hover active:bg-accent-active disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
