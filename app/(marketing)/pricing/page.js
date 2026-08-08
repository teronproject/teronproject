"use client";

import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import CanvasBackground from "@/components/landing/CanvasBackground";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="relative w-full pt-32 pb-10 sm:pt-40 sm:pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
             <CanvasBackground />
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050403] to-transparent" />
             <div className="absolute inset-0 bg-[#0a0a0a]/30" />
          </div>
          
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="title text-5xl sm:text-6xl font-medium text-white tracking-tight leading-[1.05] mb-6 drop-shadow-sm">
              Simple Pricing <br className="hidden sm:block" /> No Hidden Fees
            </h1>
            <p className="text-[18px] sm:text-[20px] text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
              Deploy your core smart contract for free. Only pay when you need premium ecosystem features like BscScan verification or custom on-chain metadata.
            </p>
          </div>
        </section>
        <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
        {/* Integrated Components */}
        <Pricing />

        {/* Content-heavy Value Section */}
        <section className="py-14 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <h2 className="title text-3xl sm:text-4xl font-medium text-white tracking-tight mb-6">Why we charge for premium features</h2>
            <div className="text-[16px] text-text-tertiary text-balance leading-relaxed space-y-3 text-left">
              <p>
                The core BEP-20 smart contract deployment is completely free because we believe basic access to Web3 should not be gated. You only pay the standard network gas fee required by the BNB Chain to process the transaction.
              </p>
              <p>
                Premium features like automated BscScan Verification and On-Chain Metadata require us to maintain complex server infrastructure. We pay external API costs, maintain high-speed indexing nodes, and manage automated compiler microservices to ensure your contract is verified within seconds of deployment. 
              </p>
              <p>
                By charging a flat, transparent fee for these upgrades, we ensure the Teron platform remains fast, reliable, and entirely ad-free. You pay once, and your token's premium status lives on the blockchain forever.
              </p>
            </div>
          </div>
        </section>
        <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
        <FAQ />
        
        <CTA />
      </main>
    </div>
  );
}
