"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Button from "@/components/ui/Button";
import { bsc, bscTestnet } from "wagmi/chains";

/**
 * WalletButton — primary wallet connection UI.
 * Shows "Connect Wallet" when disconnected, shows address + profile when connected.
 */
export default function WalletButton() {
  const {
    address,
    isConnected,
    chain,
    connectors,
    isBnbChain,
    isWrongChain,
    isConnecting,
    connect,
    disconnect,
    switchChain,
    userProfile,
    isProfileLoading,
  } = useWallet();

  const { addToast } = useToastContext();

  const handleConnect = (connector) => {
    try {
      connect(
        { connector, chainId: bscTestnet.id },
        {
          onSuccess: () => {
            addToast({ variant: "success", message: "Wallet connected!" });
          },
          onError: (err) => {
            addToast({
              variant: "error",
              message: err.shortMessage || err.message || "Connection failed",
            });
          },
        }
      );
    } catch (err) {
      addToast({ variant: "error", message: "Failed to initiate connection" });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    addToast({ variant: "info", message: "Wallet disconnected" });
  };

  const handleSwitchChain = () => {
    switchChain(
      { chainId: bscTestnet.id },
      {
        onSuccess: () =>
          addToast({ variant: "success", message: "Switched to BNB Chain" }),
        onError: (err) =>
          addToast({
            variant: "error",
            message: err.shortMessage || "Failed to switch chain",
          }),
      }
    );
  };

  const truncateAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  // Connector labels
  const getConnectorLabel = (connector) => {
    if (connector.name === "WalletConnect") return "WalletConnect";
    if (connector.name === "MetaMask") return "MetaMask";
    if (connector.name === "Injected") return "Browser Wallet";
    return connector.name;
  };

  const getConnectorIcon = (connector) => {
    if (connector.name === "WalletConnect") return "🔗";
    if (connector.name === "MetaMask") return "🦊";
    return "💼";
  };

  // If not connected — show "Connect Wallet" button
  if (!isConnected) {
    return (
      <Button
        variant="primary"
        size="md"
        onClick={() => handleConnect(connectors[0])}
        isLoading={isConnecting}
      >
        Connect Wallet
      </Button>
    );
  }

  // If connected but wrong chain
  if (isWrongChain) {
    return (
      <Button variant="danger" size="md" onClick={handleSwitchChain}>
        Switch to BNB Chain
      </Button>
    );
  }

  // Connected and on BNB Chain — show profile pill
  return (
    <div className="flex items-center gap-3">
      {/* Profile avatar & address */}
      <div className="flex items-center gap-2.5 pl-3 pr-1 py-1 bg-surface-primary border border-border-primary rounded-full">
        <div className="flex flex-col items-end">
          {isProfileLoading ? (
            <span className="text-xs text-text-tertiary">Loading...</span>
          ) : userProfile?.displayName ? (
            <span className="text-sm font-semibold text-text-primary leading-tight">
              {userProfile.displayName}
            </span>
          ) : null}
          <span className="text-xs font-mono text-text-secondary">
            {truncateAddress(address)}
          </span>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-surface-tertiary border border-border-secondary flex items-center justify-center overflow-hidden shrink-0">
          {userProfile?.avatar ? (
            <img
              src={userProfile.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-accent">
              {address?.slice(2, 4).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Disconnect button */}
      <button
        onClick={handleDisconnect}
        className="w-8 h-8 rounded-full bg-surface-primary border border-border-primary text-text-tertiary hover:text-error hover:border-error/50 transition-colors flex items-center justify-center text-xs"
        aria-label="Disconnect wallet"
        title="Disconnect wallet"
      >
        ✕
      </button>
    </div>
  );
}
