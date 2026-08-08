"use client";

import React from "react";

export default function HowItWorks() {
  return (
    <section className="w-full overflow-hidden relative z-10">
      <div className="max-w mx-auto px-4">
        
        {/* Container mimicking Cartesia */}
        <div className="rounded-2xl overflow-hidden flex flex-col">
          
          <div className="grid grid-cols-1 lg:grid-cols-3">
            
            {/* Column 1: Configure */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 relative min-h-[420px] group">
               {/* Text Content */}
               <div className="p-8 xl:p-10 flex gap-4">
                  
                  <p className="text-[15px] leading-relaxed tracking-tight">
                     <span className="font-semibold text-text-primary">Configure your token </span>
                     <span className="text-text-secondary">Set your token name, symbol, decimals, and total supply. Add social links and a logo to build your public profile.</span>
                  </p>
               </div>
               {/* Visual */}
               <div className="mt-auto pt-4 pb-16 px-8 xl:px-10 flex justify-start items-end">
                  <VisualConfigure />
               </div>
            </div>

            {/* Column 2: Deploy */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 relative min-h-[420px] group">
               {/* Text Content */}
               <div className="p-8 xl:p-10 flex gap-4">
                  
                  <p className="text-[15px] leading-relaxed tracking-tight">
                     <span className="font-semibold text-text-primary">Deploy on-chain </span>
                     <span className="text-text-secondary">Connect your wallet and sign the deployment transaction. Your contract is deployed directly to BNB Smart Chain.</span>
                  </p>
               </div>
               {/* Visual */}
               <div className="mt-auto pt-4 pb-16 px-8 xl:px-10 flex justify-center items-end">
                  <VisualDeploy />
               </div>
            </div>

            {/* Column 3: Verify */}
            <div className="flex flex-col relative min-h-[420px] group">
               {/* Text Content */}
               <div className="p-8 xl:p-10 flex gap-4">
                  
                  <p className="text-[15px] leading-relaxed tracking-tight">
                     <span className="font-semibold text-text-primary">Verify & go live </span>
                     <span className="text-text-secondary">Publish on-chain metadata and verify your source code. Your token gets a premium public profile page on the Teron leaderboard.</span>
                  </p>
               </div>
               {/* Visual */}
               <div className="mt-auto pt-4 pb-8 flex justify-center items-end relative overflow-hidden">
                  <VisualVerify />
               </div>
            </div>

          </div>
        </div>
      </div>
        <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </section>
  );
}

function VisualConfigure() {
  return (
    <div className="w-full max-w-[260px] flex flex-col gap-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
      <div className="flex items-center gap-4">
        <div className="h-3.5 w-20 bg-gradient-to-r from-accent to-accent/30 rounded-[2px]" />
        {/* Premium Cube/Block Icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-80">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-2.5 w-[75%] bg-white/10 rounded-[1px]" />
        <div className="h-2.5 w-[85%] bg-white/10 rounded-[1px]" />
        <div className="h-2.5 w-[100%] bg-white/10 rounded-[1px]" />
      </div>
    </div>
  );
}

function VisualDeploy() {
  return (
    <div className="w-full max-w-[260px] flex flex-col gap-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
      <div className="self-start px-6 py-4 rounded-3xl rounded-bl-sm border border-white/5 bg-white/[0.03] flex items-center gap-3.5 shadow-lg">
         {[1, 2, 3, 4, 5].map(i => (
           <div 
             key={i} 
             className={`w-3.5 h-3.5 rounded-full ${i <= 3 ? 'bg-gradient-to-tr from-accent to-accent/50' : 'border border-white/10 bg-transparent'}`} 
           />
         ))}
      </div>
      <div className="self-end px-6 py-4 rounded-3xl rounded-br-sm border border-white/5 bg-white/[0.03] flex items-center gap-3.5 shadow-lg mt-2">
         {[1, 2, 3, 4, 5].map(i => (
           <div 
             key={i} 
             className={`w-3.5 h-3.5 rounded-full ${i > 2 ? 'bg-gradient-to-tr from-accent to-accent/50' : 'border border-white/10 bg-transparent'}`} 
           />
         ))}
      </div>
    </div>
  );
}

function VisualVerify() {
  return (
    <div className="w-full h-[200px] relative flex justify-center items-end opacity-60 group-hover:opacity-100 transition-opacity duration-700">
      <svg viewBox="0 0 400 200" className="w-[110%] max-w-[400px] h-auto overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        <defs>
          <linearGradient id="domeGlow" x1="200" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="1" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="domeFade" x1="200" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal Ellipses (Rings) */}
        <ellipse cx="200" cy="180" rx="180" ry="40" stroke="url(#domeFade)" strokeWidth="1" />
        <ellipse cx="200" cy="140" rx="175" ry="20" stroke="url(#domeFade)" strokeWidth="1" />
        <ellipse cx="200" cy="80" rx="150" ry="27" stroke="url(#domeFade)" strokeWidth="1" />

        {/* Vertical Arcs */}
        <path d="M 20 180 A 180 180 0 0 1 380 180" stroke="url(#domeGlow)" strokeWidth="1.5" />
        <path d="M 50 180 A 150 180 0 0 1 350 180" stroke="url(#domeGlow)" strokeWidth="1.5" />
        <path d="M 90 180 A 110 180 0 0 1 310 180" stroke="url(#domeGlow)" strokeWidth="1.5" />
        <path d="M 140 180 A 60 180 0 0 1 260 180" stroke="url(#domeGlow)" strokeWidth="1.5" />
        <line x1="200" y1="0" x2="200" y2="180" stroke="url(#domeGlow)" strokeWidth="1.5" />
        
      </svg>
    </div>
  );
}
