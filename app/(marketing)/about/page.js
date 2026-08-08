"use client";

import CTA from "@/components/landing/CTA";
import CanvasBackground from "@/components/landing/CanvasBackground";
import { Shield01Icon, Rocket01Icon, CodeIcon, GlobalIcon } from "hugeicons-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden border-t border-white/5">
          {/* Canvas Background */}
          <div className="absolute inset-0 pointer-events-none">
             <CanvasBackground />
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050403] to-transparent" />
             <div className="absolute inset-0 bg-[#0a0a0a]/30" />
          </div>
          
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="title text-5xl sm:text-6xl font-medium text-white tracking-tight leading-[1.05] mb-6 drop-shadow-sm">
              Build Your Token <br className="hidden sm:block" /> on BNB Chain
            </h1>
            <p className="text-sm sm:text-base text-text-secondary max-w-3xl mx-auto leading-relaxed mb-10">
              We believe launching a token should be simple. Teron handles smart contract development, compilation, and BscScan verification. You get a single dashboard to manage everything.
            </p>
          </div>
        </section>
        <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
        <section className="py-10 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-10">
              <h2 className="title text-3xl sm:text-4xl font-medium text-white tracking-tight mb-3">Our Core Philosophy</h2>
              <p className="text-text-secondary">The principles that guide every feature we build</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              <div className="card rounded-3xl p-8 bg-[#0d0d0d] border border-white/5 shadow-xl transition-all hover:bg-[#111]">
                <div className="w-12 h-12 card rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <Shield01Icon size={24} className="text-accent" variant="solid" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 tracking-tight">Secure Smart Contracts</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Every token you deploy uses standard OpenZeppelin contracts. We do not add hidden fees or backdoors. You own your private keys. You control your contract.
                </p>
              </div>

              <div className="card rounded-3xl p-8 bg-[#0d0d0d] border border-white/5 shadow-xl transition-all hover:bg-[#111]">
                <div className="w-12 h-12 card rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <Rocket01Icon size={24} className="text-white" variant="solid" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 tracking-tight">Simple Creation Process</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Building a crypto project can be complex. We replace command-line tools with a clear dashboard. You can create and publish your verified token fast.
                </p>
              </div>

              <div className="card rounded-3xl p-8 bg-[#0d0d0d] border border-white/5 shadow-xl transition-all hover:bg-[#111]">
                <div className="w-12 h-12 card rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <CodeIcon size={24} className="text-white" variant="solid" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 tracking-tight">Clear Transparency</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Trust is important for any blockchain project. We built automatic BscScan verification into our platform. Your exact source code is published to the block explorer for anyone to read.
                </p>
              </div>

            </div>
          </div>
        </section>
        <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
        {/* Why BNB Chain Section */}
        <section className="py-14 border-t border-white/5 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full">
                <h2 className="title text-3xl sm:text-4xl font-medium text-white tracking-tight mb-6 leading-tight">
                  Built for <span className="text-accent">BNB Chain</span>
                </h2>
                <div className="space-y-2 text-balance text-text-tertiary leading-relaxed">
                  <p>
                    BNB Chain is the best network for launching new tokens. It offers high liquidity, fast block times, and low fees. Average gas fees are under $0.05. It is highly accessible for users.
                  </p>
                  <p>
                    By focusing only on BNB Chain, we built deep native integrations. Teron connects directly to BscScan and follows the BEP-20 standard perfectly.
                  </p>
                  <p>
                    This approach allows us to publish on-chain metadata for your project automatically. You get features that are optimized for a single, trusted network.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
        <section className="py-10 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
             <h2 className="title text-3xl sm:text-4xl font-medium text-white tracking-tight mb-3">
                Manage Your Project
             </h2>
             <p className=" text-text-secondary mb-3 text-balance">
                Deploying a contract is just the first step. Teron gives you an ecosystem for your project. Every token receives a public profile page. We also maintain a leaderboard to give your project visibility.
             </p>
             <p className="text-text-secondary">
                Our creator dashboard lets you manage your contract easily. You can mint, burn, and transfer ownership from one simple interface.
             </p>
          </div>
        </section>
        <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
        <CTA />
      </main>
    </div>
  );
}
