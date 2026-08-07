"use client";

import { 
  Coins01Icon, 
  CheckmarkBadge01Icon, 
  InformationSquareIcon, 
  CrownIcon, 
  Layout01Icon, 
  Wallet01Icon,
  ArrowRight01Icon
} from "hugeicons-react";

export default function Features() {
  const features = [
    {
      icon: Coins01Icon,
      title: "BEP-20 Standard",
      description: "Production-grade token contracts deployed directly to BNB Chain. Fully ownable and secure.",
      color: "from-[#EAB308] to-[#CA8A04]"
    },
    {
      icon: CheckmarkBadge01Icon,
      title: "Contract Verification",
      description: "Get your smart contract source code verified on BscScan to build trust with investors.",
      color: "from-[#10B981] to-[#059669]"
    },
    {
      icon: InformationSquareIcon,
      title: "On-Chain Metadata",
      description: "Publish your token logo, description, and social links directly on-chain for everyone to see.",
      color: "from-[#3B82F6] to-[#2563EB]"
    },
    {
      icon: CrownIcon,
      title: "Global Leaderboard",
      description: "Every token gets a public profile page on the Teron leaderboard. Show off your community.",
      color: "from-[#8B5CF6] to-[#6D28D9]"
    },
    {
      icon: Layout01Icon,
      title: "Creator Dashboard",
      description: "Manage all your deployed tokens from a single dashboard. Track status and update profiles easily.",
      color: "from-[#F43F5E] to-[#E11D48]"
    },
    {
      icon: Wallet01Icon,
      title: "Wallet-First Identity",
      description: "No passwords required. Connect your BNB Chain wallet and your profile is auto-created.",
      color: "from-[#0EA5E9] to-[#0284C7]"
    },
  ];

  return (
    <section className="w-full pt-24  relative z-10 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Header Section */}
        <div className="mb-10 max-w-2xl">
          <h2 className="title text-3xl sm:text-4xl title font-medium text-text-primary tracking-tight leading-[1.15] mb-4">
            Everything you need to launch and manage your token
          </h2>
          <p className="text-sm sm:text-base text-text-tertiary text-balance leading-relaxed">
            From smart contract deployment to community management, Teron provides the complete toolkit for modern founders on BNB Chain.
          </p>
        </div>

        {/* Features Grid mimicking Cartesia */}
        <div className="grid grid-cols-1 md:grid-cols-2 border mb-6 border-white/5  overflow-hidden shadow-2xl">
          {features.map((feature, idx) => {
            const borderClasses = "border-white/5 " +
              (idx % 2 === 0 ? "md:border-r " : "") +
              (idx < features.length - 1 ? "border-b " : "") +
              (idx === features.length - 2 ? "md:border-b-0 " : "");

            return (
              <div 
                key={idx}
                className={`relative flex items-center p-8 sm:p-10 group hover:bg-white/[0.02] transition-colors cursor-pointer ${borderClasses}`}
              >
                {/* Colored Edge Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${feature.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                
                {/* Content */}
                <div className="flex-1 flex gap-5 pl-2 sm:pl-0">
                   <div className="mt-0.5 shrink-0">
                      <feature.icon size={24} className="text-text-primary" strokeWidth={1.5} />
                   </div>
                   <div>
                      <h3 className="text-sm sm:text-base font-semibold text-text-secondary tracking-tight mb-1.5">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-balance text-text-tertiary leading-relaxed">
                        {feature.description}
                      </p>
                   </div>
                </div>

                {/* Action Icon */}
                {/* <div className="hidden sm:flex w-11 h-11 rounded-full bg-white/[0.03] border border-white/5 items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:scale-105 transition-all ml-6 shadow-sm">
                   <ArrowRight01Icon size={18} className="text-text-primary opacity-80" strokeWidth={2} />
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </section>
  );
}
