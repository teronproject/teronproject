"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight01Icon, UserGroupIcon, Tick01Icon } from "hugeicons-react";

export default function Earn() {
  return (
    <section className="relative w-full overflow-hidden border-t border-white/5 py-20 bg-[#050403]">
      {/* Canvas Background Container - Full Width */}
      <div className="absolute inset-0 overflow-hidden">
         <CanvasBackground />
         
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
           <div className="card rounded-3xl p-8 lg:p-10 flex flex-col gap-6 backdrop-blur-2xl bg-[#0a0a0a]/70 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-transform">
             <h3 className="text-2xl font-semibold text-white tracking-tight">Referrals</h3>
             <p className="text-[15px] text-text-secondary leading-relaxed">
               Share your unique referral link with your community. Earn a massive <strong>30% commission</strong> in BNB on all premium upgrades made by users you refer, paid directly to your wallet.
             </p>
             
             <div className="mt-auto pt-6 flex items-center">
                <Link href="/dashboard" className="text-[14px] font-semibold text-white flex items-center hover:text-accent transition-colors">
                  Get your referral link <ArrowRight01Icon size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
             </div>
           </div>

           {/* Card 2: Tasks */}
           <div className="card rounded-3xl p-8 lg:p-10 flex flex-col gap-6 backdrop-blur-2xl bg-[#0a0a0a]/70 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-transform duration-300">
             <h3 className="text-2xl font-semibold text-white tracking-tight">Task to Earn</h3>
             <p className="text-[15px] text-text-secondary leading-relaxed">
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
  );
}

// Custom Canvas Background replicating the dynamic clustered dot-matrix from Hero
function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // High DPI support for premium crisp dots
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }
    });
    
    resizeObserver.observe(canvas);

    let time = 0;
    let animationFrameId;

    const draw = () => {
      // Deep dark background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);
      
      const spacing = 16; // Grid spacing for the dots
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing + spacing / 2;
          const y = j * spacing + spacing / 2;
          
          // Generate block coordinates to create the "clustered" look
          const bx1 = Math.floor(i / 10);
          const by1 = Math.floor(j / 10);
          const bx2 = Math.floor(i / 4);
          const by2 = Math.floor(j / 4);
          
          const t = time * 0.5;
          
          const n1 = Math.sin(bx1 * 0.4 + t) * Math.cos(by1 * 0.4 + t * 0.7);
          const n2 = Math.sin(bx2 * 0.7 - t * 1.1) * Math.cos(by2 * 0.7 + t * 0.8);
          
          const scatter = Math.abs(Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1;
          
          let density = (n1 * 0.6) + (n2 * 0.4);
          density = (density + 1) / 2; 
          
          let dotSize = 0;
          let alpha = 0;
          let glow = 0;

          if (density > 0.72) {
            dotSize = spacing * 0.35;
            alpha = 0.85 + scatter * 0.15;
            glow = 6;
          } else if (density > 0.55) {
            dotSize = spacing * 0.22;
            alpha = 0.4 + scatter * 0.2;
            glow = 0;
          } else if (density > 0.4 && scatter > 0.65) {
            dotSize = spacing * 0.12;
            alpha = 0.25 + scatter * 0.2;
            glow = 0;
          } else if (scatter > 0.96) {
            dotSize = spacing * 0.08;
            alpha = 0.15;
            glow = 0;
          }
          
          if (dotSize > 0) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            
            const lightness = 60 + scatter * 15;
            ctx.fillStyle = `hsla(45, 95%, ${lightness}%, ${alpha})`;
            
            if (glow > 0) {
                ctx.shadowBlur = glow;
                ctx.shadowColor = `hsla(45, 100%, 55%, ${alpha})`;
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.fill();
          }
        }
      }
      
      time += 0.015;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full opacity-100"
    />
  );
}
