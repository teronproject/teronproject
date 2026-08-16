"use client";

import { Rocket01Icon, Shield01Icon, Coins01Icon } from "hugeicons-react";
import Link from "next/link";

export default function SpeedComparison() {
  return (
    <section className="w-full pt-24 relative overflow-hidden">
      {/* Top subtle border */}
      <div className="absolute top-0 inset-x-0 h-px bg-white/5" />
      
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 mb-20 lg:mb-24">
          <div className="max-w-xl">
            <h2 className="title text-3xl sm:text-4xl font-medium text-text-primary tracking-tight leading-[1.15] mb-6">
              Quality at full speed
            </h2>
            <p className="text-sm sm:text-base text-text-tertiary text-balance leading-relaxed mb-3">
              With a Time-to-Deploy of under 5 minutes, Teron is the fastest smart contract platform built for the BNB Chain ecosystem.
            </p>
            <Link 
              href="/dashboard/create"
              className="inline-flex items-center justify-center px-5 py-3 mt-3 rounded-full border border-white/10 hover:bg-white/5 text-[14px] font-medium text-text-primary transition-colors cta"
            >
              Compare benchmarks
            </Link>
          </div>
          
          <div className="flex flex-col lg:items-end">
            <div className="title text-5xl sm:text-[90px] font-medium text-accent mb-2 tracking-tighter leading-none">
              100x
            </div>
            <p className="text-base text-text-tertiary">
              faster than the manual<br className="hidden lg:block"/> deployment process
            </p>
          </div>
        </div>

        {/* Graph Section */}
        <div className="relative w-full border-y border-dashed border-white/5 py-12 sm:py-16 my-10 flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
           
           {/* Y-axis Label */}
           <div className="hidden sm:block absolute left-4 top-[60%] -translate-y-1/2 -rotate-90 origin-left text-[11px] font-semibold text-text-tertiary ">
             Quality & Security
           </div>

           {/* X-axis Label */}
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-text-tertiary ">
             Fast to Launch
           </div>

           {/* SVG Graph */}
           <div className="w-full h-full max-w-[1000px] mx-auto px-2 sm:px-10 pb-6">
              <svg viewBox="0 0 1000 400" className="w-full h-full overflow-visible">
                 {/* Horizontal Axis Lines */}
                 <path d="M 80 60 L 1000 60" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" strokeDasharray="4 4" />
                 <path d="M 80 160 L 1000 160" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" strokeDasharray="4 4" />
                 <path d="M 80 350 L 1000 350" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />

                 {/* Vertical Markers */}
                 <path d="M 250 60 L 250 380" stroke="var(--color-accent)" strokeWidth="1" opacity="0.3" />
                 <path d="M 850 160 L 850 380" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                 
                 {/* Manual Process Line Glow & Path */}
                 <path d="M 80 350 L 500 350 L 850 160 L 1000 160" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="10" strokeLinejoin="miter" opacity="0.1" />
                 <path d="M 80 350 L 500 350 L 850 160 L 1000 160" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinejoin="miter" />
                 
                 {/* Teron Line Glow & Path */}
                 <path d="M 80 350 L 150 350 L 250 60 L 1000 60" fill="none" stroke="var(--color-accent)" strokeWidth="12" strokeLinejoin="miter" opacity="0.15" />
                 <path d="M 80 350 L 150 350 L 250 60 L 1000 60" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinejoin="miter" />

                 {/* Data Points / Crosshairs */}
                 {/* Teron Data Point */}
                 <g transform="translate(250, 60)">
                   <path d="M -12 0 L 12 0 M 0 -12 L 0 12" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
                   <rect x="-4" y="-4" width="8" height="8" fill="#050403" stroke="var(--color-accent)" strokeWidth="2" />
                 </g>
                 
                 {/* Manual Data Point */}
                 <g transform="translate(850, 160)">
                   <path d="M -12 0 L 12 0 M 0 -12 L 0 12" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
                   <rect x="-4" y="-4" width="8" height="8" fill="#050403" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
                 </g>

                 {/* Origin Data Point */}
                 <g transform="translate(80, 350)">
                   <rect x="-3" y="-3" width="6" height="6" fill="#050403" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
                 </g>

                 {/* Value Labels */}
                 <text x="260" y="375" fill="var(--color-accent)" fontSize="14" fontWeight="600" className="tracking-widest uppercase font-mono">05 MINS</text>
                 <text x="860" y="375" fill="rgba(255, 255, 255, 0.5)" fontSize="14" fontWeight="600" className="tracking-widest uppercase font-mono">14+ DAYS</text>

                 {/* Series Labels */}
                 <g transform="translate(265, 80)">
                    <rect x="-6" y="-20" width="68" height="26" fill="var(--color-accent)" opacity="0.1" rx="2" />
                    <text x="0" y="0" fill="var(--color-accent)" fontSize="14" fontWeight="600" className="tracking-widest uppercase">Teron</text>
                 </g>

                 <g transform="translate(865, 154)">
                    <text x="0" y="0" fill="rgba(255, 255, 255, 0.7)" fontSize="15" fontWeight="500" className="tracking-tight">Manual Process</text>
                 </g>

              </svg>
           </div>
        </div>

        {/* Bottom Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 my-10">
           <div className="flex flex-col gap-4 group">
              <div className="flex items-center gap-3 text-text-primary">
                 <Rocket01Icon size={22} strokeWidth={2} className="text-white opacity-70 group-hover:opacity-100 group-hover:text-accent transition-colors" />
                 <h4 className="font-semibold text-[16px] tracking-tight">Real-time responses</h4>
              </div>
              <p className="text-sm text-text-tertiary text-balance leading-relaxed">
                 Speed designed for real-time interactions means token launches feel seamless and fluid to your community.
              </p>
           </div>
           
           <div className="flex flex-col gap-4 group">
              <div className="flex items-center gap-3 text-text-primary">
                 <Shield01Icon size={22} strokeWidth={2} className="text-white opacity-70 group-hover:opacity-100 group-hover:text-accent transition-colors" />
                 <h4 className="font-semibold text-[16px] tracking-tight">Proven at scale, worldwide</h4>
              </div>
              <p className="text-sm text-text-tertiary text-balance leading-relaxed">
                 From testnet to mainnet, Teron leads in deployment latency consistently and reliably.
              </p>
           </div>

           <div className="flex flex-col gap-4 group">
              <div className="flex items-center gap-3 text-text-primary">
                 <Coins01Icon size={22} strokeWidth={2} className="text-white opacity-70 group-hover:opacity-100 group-hover:text-accent transition-colors" />
                 <h4 className="font-semibold text-[16px] tracking-tight">Performance budget</h4>
              </div>
              <p className="text-sm text-text-tertiary text-balance leading-relaxed">
                 Low-latency from our deployment engine creates affordances across the rest of your web3 stack.
              </p>
           </div>
        </div>

      </div>

     <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </section>
  );
}
