"use client";

import { ArrowRight01Icon } from "hugeicons-react";
import Link from "next/link";
import Image from "next/image";

const chains = [
  { name: "BNB Smart Chain", logo: "https://cryptologos.cc/logos/bnb-bnb-logo.svg", active: true, tag: "Native" },
  { name: "Ethereum", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg", active: false },
  { name: "Polygon", logo: "https://cryptologos.cc/logos/polygon-matic-logo.svg", active: false },
  { name: "Arbitrum", logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg", active: false },
  { name: "Optimism", logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg", active: false },
  { name: "Avalanche", logo: "https://cryptologos.cc/logos/avalanche-avax-logo.svg", active: false },
  { name: "Solana", logo: "https://cryptologos.cc/logos/solana-sol-logo.svg", active: false },
  { name: "Tron", logo: "https://cryptologos.cc/logos/tron-trx-logo.svg", active: false },
];

export default function SupportedChains() {
  return (
    <section className="w-full pt-20 relative overflow-hidden flex flex-col">
      {/* Top subtle border */}
      <div className="absolute top-0 inset-x-0 h-px bg-white/5" />
      
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 w-full flex-1">
        
        {/* Header Section */}
        <div className="flex flex-col max-w-xl relative z-10 mb-16">
          <h2 className="title text-3xl sm:text-4xl title text-text-primary tracking-tight leading-[1.15] mb-3">
            Multi chain deployment
          </h2>
          <p className="text-sm text-text-tertiary leading-relaxed max-w-md">
            Teron is built natively on BNB Smart Chain, with support for the most popular EVM and non-EVM networks coming soon.
          </p>
          <div>
          </div>
        </div>

        {/* Chains List Container */}
        <div className="w-full max-w-[900px] mx-auto relative z-10 mb-20">
           <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl border border-white/5 overflow-hidden shadow-2xl">
              {chains.map((chain, idx) => {
                 const isLastRow = idx >= chains.length - 2;
                 const borderClasses = "border-white/5 " +
                   (idx % 2 === 0 ? "md:border-r " : "") +
                   (!isLastRow ? "border-b " : "") +
                   (idx === chains.length - 2 ? "border-b md:border-b-0" : "");

                 return (
                   <div 
                     key={chain.name} 
                     className={`flex items-center p-5 sm:p-6 group transition-all duration-300 ${chain.active ? 'hover:bg-white/[0.04] cursor-pointer' : 'cursor-default'} ${borderClasses}`}
                   >
                       <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 mr-4 shrink-0 overflow-hidden relative">
                          <img 
                            src={chain.logo} 
                            alt={chain.name} 
                            className={`w-5 h-5 object-contain transition-all duration-300 ${chain.active ? 'opacity-100 group-hover:scale-110' : ' opacity-80'}`} 
                          />
                       </div>
                       <span className={`text-[15px] font-medium tracking-tight ${chain.active ? 'text-text-primary' : 'text-text-secondary'}`}>
                         {chain.name}
                       </span>
                       <div className="flex-1" />
                       
                       {chain.active && chain.tag && (
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-text-secondary font-medium mr-4">
                            {chain.tag}
                          </span>
                       )}
                       
                       {chain.active ? (
                          <ArrowRight01Icon size={18} strokeWidth={2} className="text-text-primary opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                       ) : (
                          <span className="text-[13px] text-text-tertiary">Coming soon...</span>
                       )}
                   </div>
                 );
              })}
           </div>
        </div>

      </div>

      {/* Subtle background striping mimicking Cartesia footer */}
      <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70 mt-auto" />
    </section>
  );
}
