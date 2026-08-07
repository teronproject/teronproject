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

export const metadata = {
  title: "Teron — Launch Your Token on BNB Chain",
  description:
    "Create, deploy, and manage BEP-20 tokens with premium smart contract verification, on-chain metadata publishing, and a public token profile — all on BNB Smart Chain.",
};

export default function LandingPage() {
  return (
    <>
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
