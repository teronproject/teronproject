"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi-config";
import { ToastProvider } from "@/components/ToastProvider";
import { useState } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";

createWeb3Modal({
  wagmiConfig,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
});

import { FeatureFlagProvider } from "@/components/FeatureFlagProvider";

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FeatureFlagProvider>
          <ToastProvider>{children}</ToastProvider>
        </FeatureFlagProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

