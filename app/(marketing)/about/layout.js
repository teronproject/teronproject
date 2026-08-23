import { generateOGImageUrl } from "@/services/seo";

export const metadata = {
  title: "About Teron | The #1 BNB Chain Token Launchpad",
  description: "Teron is the premier no-code platform for deploying production-grade BEP-20 smart contracts on BNB Smart Chain. BscScan verification, on-chain metadata, community leaderboard, and BNB gas assistance — all built in.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Teron | The #1 BNB Chain Token Launchpad",
    description: "The premier no-code platform for deploying production-grade BEP-20 smart contracts on BNB Smart Chain.",
    url: "/about",
    images: [
      {
        url: generateOGImageUrl({
          title: "About Teron",
          desc: "The premier no-code platform for deploying BEP-20 tokens on BNB Smart Chain.",
          route: "/about",
        }),
        width: 1200,
        height: 630,
        alt: "About Teron — BNB Chain Token Launchpad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Teron | The #1 BNB Chain Token Launchpad",
    description: "The premier no-code platform for deploying production-grade BEP-20 smart contracts on BNB Smart Chain.",
  },
};

export default function AboutLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
