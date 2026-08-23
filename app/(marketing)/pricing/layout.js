import { generateOGImageUrl } from "@/services/seo";

export const metadata = {
  title: "Teron Pricing | Free Token Deployment on BNB Chain",
  description: "Deploy your BEP-20 token for free on BNB Smart Chain. Only pay for optional premium features like BscScan verification and on-chain metadata. No hidden fees, no subscriptions.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Teron Pricing | Free Token Deployment on BNB Chain",
    description: "Deploy your BEP-20 token for free. Only pay for optional premium features like BscScan verification.",
    url: "/pricing",
    images: [
      {
        url: generateOGImageUrl({
          title: "Transparent Pricing",
          desc: "Free BEP-20 deployment. Pay only for optional premium features.",
          route: "/pricing",
        }),
        width: 1200,
        height: 630,
        alt: "Teron Pricing — Free Token Deployment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teron Pricing | Free Token Deployment on BNB Chain",
    description: "Deploy your BEP-20 token for free. Only pay for optional premium features like BscScan verification.",
  },
};

export default function PricingLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
