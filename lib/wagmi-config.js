import { http, createConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { walletConnect, injected } from "wagmi/connectors";

/**
 * Wagmi configuration for Teron.
 * BNB Chain only (Phase 1).
 */

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [
    walletConnect({
      projectId,
      showQrModal: true,
      metadata: {
        name: "Teron",
        description: "Premium Web3 Token Launch Platform",
        url: process.env.NEXT_PUBLIC_APP_URL || "https://teron.io",
        icons: ["/icon.svg"],
      },
    }),
  ],
  transports: {
    [bsc.id]: http(
      process.env.NEXT_PUBLIC_BNB_RPC_URL || "https://bsc-dataseed1.binance.org"
    ),
    [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.bnbchain.org:8545"),
  },
});

export default wagmiConfig;
