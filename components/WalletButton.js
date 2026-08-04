"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Modal from "@/components/ui/Modal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnect = (connector) => {
    try {
      connect(
        { connector, chainId: bscTestnet.id },
        {
          onSuccess: () => {
            addToast({ variant: "success", message: "Wallet connected!" });
            setIsModalOpen(false);
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
      <>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          isLoading={isConnecting}
        >
          Connect Wallet
        </Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Connect Wallet"
        >
          <div className="space-y-3">
            <p className="text-sm text-text-secondary mb-4">
              Connect your BNB Chain wallet to start using Teron. A profile will be
              automatically created for your wallet address.
            </p>

            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={isConnecting}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-border-secondary bg-surface-primary hover:bg-surface-secondary hover:border-accent transition-all text-left group disabled:opacity-50"
              >
                <span className="text-2xl">{getConnectorIcon(connector)}</span>
                <div className="flex-1">
                  <span className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {getConnectorLabel(connector)}
                  </span>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {connector.name === "WalletConnect"
                      ? "Scan QR code with any mobile wallet"
                      : "Connect via your browser extension"}
                  </p>
                </div>
                <span className="text-text-tertiary group-hover:text-accent transition-colors">
                  →
                </span>
              </button>
            ))}

            <p className="text-xs text-text-disabled text-center pt-3">
              By connecting, you agree to Teron's Terms of Service.
            </p>
          </div>
        </Modal>
      </>
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
