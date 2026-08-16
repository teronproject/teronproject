import { generateOGImageUrl } from "@/services/seo";

export const metadata = {
  title: "Teron Leaderboard — Top BEP-20 Tokens on BNB Chain",
  description: "Explore the definitive directory of top-tier BEP-20 tokens deployed on BNB Smart Chain via Teron. View verified contracts, deployment details, and on-chain statistics.",
  alternates: {
    canonical: "/leaderboard",
  },
  openGraph: {
    title: "Teron Leaderboard — Top BEP-20 Tokens on BNB Chain",
    description: "Explore the definitive directory of top-tier BEP-20 tokens deployed on BNB Smart Chain via Teron.",
    url: "/leaderboard",
    images: [
      {
        url: generateOGImageUrl({
          title: "Teron Leaderboard",
          desc: "The definitive directory of BEP-20 tokens on BNB Smart Chain.",
          route: "/leaderboard",
        }),
        width: 1200,
        height: 630,
        alt: "Teron Leaderboard — BNB Chain Tokens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teron Leaderboard — Top BEP-20 Tokens on BNB Chain",
    description: "Explore the definitive directory of top-tier BEP-20 tokens deployed on BNB Smart Chain via Teron.",
  },
};

export default function LeaderboardLayout({ children }) {
  return (
    <div className="min-h-dvh flex flex-col relative bg-[#0a0a0a]">
      <div className="flex-1 flex flex-col relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
