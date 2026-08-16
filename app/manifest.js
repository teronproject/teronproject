export default function manifest() {
  return {
    name: "Teron — Web3 Token Launch Platform",
    short_name: "Teron",
    description:
      "Create, deploy, and manage BEP-20 tokens on BNB Chain with contract verification, on-chain metadata, and a public token profile.",
    start_url: "/",
    display: "standalone",
    background_color: "#050403",
    theme_color: "#EAB308",
    orientation: "portrait-primary",
    categories: ["finance", "crypto", "web3", "blockchain"],
    icons: [
      {
        src: "/token.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
