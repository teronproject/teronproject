import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import SpeedComparison from "@/components/landing/SpeedComparison";
import SupportedChains from "@/components/landing/SupportedChains";
import Pricing from "@/components/landing/Pricing";
import Earn from "@/components/landing/Earn";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { generateOGImageUrl } from "@/services/seo";

const faqData = [
  {
    question: "What is Teron and how does it work?",
    answer: "Teron is a smart contract launchpad built natively for the BNB Smart Chain. It allows you to create, deploy, and verify standard BEP-20 tokens in minutes without writing a single line of code.",
  },
  {
    question: "Do I need coding experience to launch a token?",
    answer: "Not at all. Our intuitive dashboard handles all the complex Solidity code, compilation, and blockchain deployment in the background. You just define your token's details and deploy with a single click.",
  },
  {
    question: "Are the smart contracts secure and who owns them?",
    answer: "Yes, completely. We use battle-tested, standard OpenZeppelin libraries that are industry-recognized for maximum security. Once deployed, you have 100% exclusive ownership of your contract — we do not have any access to your tokens.",
  },
  {
    question: "Why should I verify my contract on BscScan?",
    answer: "Verification publishes your exact source code to BscScan, adding a trusted green checkmark to your contract profile. This transparency is essential for building investor confidence and is usually required to get listed on major exchanges and tracking sites.",
  },
  {
    question: "How do I add a logo and social links to my token?",
    answer: "Through our Enterprise suite, we help you publish standardized on-chain metadata. This ensures that decentralized wallets (like Trust Wallet) and DEXs can automatically fetch and display your official logo and project links.",
  },
  {
    question: "How much does it cost to use Teron?",
    answer: "Core contract generation and deployment is completely free — you only pay the standard BNB gas fee to the network. Optional features like BscScan verification and on-chain metadata cost a small, flat fee paid directly in BNB.",
  },
];

export const metadata = {
  title: "Teron — Create & Deploy BEP-20 Tokens on BNB Chain | Free Token Launchpad",
  description:
    "Create, deploy, and manage BEP-20 tokens on BNB Smart Chain for free. BscScan contract verification, on-chain metadata publishing, public token profiles, community leaderboard, and BNB gas assistance. The #1 no-code token launchpad.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Teron — Create & Deploy BEP-20 Tokens on BNB Chain",
    description:
      "The premium Web3 token launchpad. Free BEP-20 deployment on BNB Chain with BscScan verification and on-chain metadata.",
    url: "/",
    images: [
      {
        url: generateOGImageUrl({
          title: "Web3 Token Launch Platform",
          desc: "Create, deploy, and manage BEP-20 tokens on BNB Chain.",
          route: "/",
        }),
        width: 1200,
        height: 630,
        alt: "Teron — Web3 Token Launch Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teron — Create & Deploy BEP-20 Tokens on BNB Chain",
    description:
      "Free BEP-20 deployment on BNB Chain with BscScan verification and on-chain metadata. The #1 no-code token launchpad.",
  },
};

export default function LandingPage() {
  return (
    <>
      <FAQJsonLd faqs={faqData} />
      <Header />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Features />
      <SpeedComparison />
      <SupportedChains />
      <Pricing />
      <Earn />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
