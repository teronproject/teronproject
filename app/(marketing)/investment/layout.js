import { generateOGImageUrl } from "@/services/seo";

export const metadata = {
  title: "Invest in Teron | Strategic Partnership & Funding Opportunities",
  description: "Partner with the premier token launch infrastructure on BNB Smart Chain. Submit a strategic investment inquiry to the Teron team.",
  alternates: {
    canonical: "/investment",
  },
  openGraph: {
    title: "Invest in Teron | Strategic Partnership Opportunities",
    description: "Partner with the premier token launch infrastructure on BNB Smart Chain.",
    url: "/investment",
    images: [
      {
        url: generateOGImageUrl({
          title: "Invest in Teron",
          desc: "Strategic partnership and funding opportunities on BNB Smart Chain.",
          route: "/investment",
        }),
        width: 1200,
        height: 630,
        alt: "Invest in Teron",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invest in Teron | Strategic Partnership Opportunities",
    description: "Partner with the premier token launch infrastructure on BNB Smart Chain.",
  },
};

export default function InvestmentLayout({ children }) {
  return children;
}
