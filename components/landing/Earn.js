"use client";

import Link from "next/link";
import { ArrowRight01Icon, UserGroupIcon, Tick01Icon } from "hugeicons-react";
import CanvasBackground from "@/components/landing/CanvasBackground";

export default function Earn() {
  return (
    <>
    <section className="relative w-full overflow-hidden border-t border-white/5 py-20 bg-[#050403]">
      {/* Canvas Background Container - Full Width */}
      <div className="absolute inset-0 overflow-hidden">
         <CanvasBackground className="w-full h-full opacity-50" />
         
         {/* Premium Tactile Noise/Grain Overlay */}
         {/* <div 
           className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
           }}
         /> */}
         {/* Vertical gradients to blend borders seamlessly */}
         <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />
         <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left max-w-xl  mb-10">
          <h2 className="title text-3xl sm:text-4xl font-medium text-white tracking-tight leading-[1.15] mb-5">
            Grow and Earn
          </h2>
          <p className="text-sm text-balance text-text-secondary leading-relaxed">
            Invite friends to launch their tokens and complete simple tasks to earn BNB and free platform credits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
           {/* Card 1: Referrals */}
           <div className="card rounded-3xl p-8 lg:p-10 flex flex-col gap-4 backdrop-blur-2xl bg-[#0a0a0a]/70 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-transform">
             <h3 className="text-2xl title font-semibold text-white tracking-tight">Referrals</h3>
             <p className="text-sm text-text-secondary leading-relaxed">
               Share your unique referral link with your community. Earn a massive <strong>30% commission</strong> in BNB on all premium upgrades made by users you refer, paid directly to your wallet.
             </p>
             
             <div className="mt-auto pt-6 flex items-center">
                <Link href="/dashboard" className="text-[14px] font-semibold text-white flex items-center hover:text-accent transition-colors">
                  Get your referral link <ArrowRight01Icon size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
             </div>
           </div>

           {/* Card 2: Tasks */}
           <div className="card rounded-3xl p-8 lg:p-10 flex flex-col gap-4 backdrop-blur-2xl bg-[#0a0a0a]/70 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-transform duration-300">
             <h3 className="text-2xl title font-semibold text-white tracking-tight">Task to Earn</h3>
             <p className="text-sm text-text-secondary leading-relaxed">
               Engage with our ecosystem by following our socials, joining Discord, and launching tokens on testnet. Complete simple tasks to earn exclusive platform credits for free mainnet deployments.
             </p>
             
             <div className="mt-auto pt-6 flex items-center">
                <Link href="/dashboard/tasks" className="text-[14px] font-semibold text-white flex items-center hover:text-white/70 transition-colors">
                  View available tasks <ArrowRight01Icon size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
             </div>
           </div>
        </div>
      </div>
    </section>
    <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </>
  );
}
