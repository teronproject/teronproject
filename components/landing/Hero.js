"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center pt-24 sm:pt-32 pb-0">
      {/* Background Dots with Linear Gradient Mask */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 60%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 60%)"
        }}
      />

      {/* Top Section - Typography and CTA */}
      <div className="max-w-5xl w-full mx-auto px-4 z-10 flex flex-col items-center text-center">
        {/* Big Premium Headline */}
        <h1 className="title text-5xl sm:text-6xl font-semibold text-text-primary tracking-tight leading-[1.05] mb-6 drop-shadow-sm">
          Launch Your Token
          <br className="hidden sm:block" />
          Secure, Simple, Trusted
        </h1>

        {/* Minimal Subheading */}
        <p className="text-lg text-balance text-text-secondary max-w-2xl leading-relaxed mb-10">
          Create secure BEP-20 smart contracts. Manage your project from a simple dashboard. Fast and trusted by builders.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/dashboard/create"
            className="cta h-12 px-8 bg-surface-primary text-text-primary rounded-full text-[15px] font-semibold inline-flex items-center justify-center transition-all w-full sm:w-auto shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_2px_rgba(0,0,0,0.2)] hover:scale-[1.02]"
          >
            Create Your Token
          </Link>
          <Link
            href="/dashboard"
            className="h-12 px-8 text-text-secondary hover:text-text-primary rounded-lg text-[15px] font-medium inline-flex items-center justify-center transition-colors w-full sm:w-auto border border-transparent hover:bg-white/5"
          >
            View Dashboard
          </Link>
        </div>
      </div>

      {/* The Canvas and Custom Animation Section (Full Width) */}
      <div className="relative w-full mt-24 h-[400px] sm:h-[480px]">
         {/* Canvas Background Container - Full Width */}
         <div className="absolute inset-0 overflow-hidden border-t border-white/5 bg-[#050403]">
            <CanvasBackground />
            
            {/* Premium Tactile Noise/Grain Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
         </div>
         
         {/* Floating UI Widget overlapping the canvas (Unchanged) */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl pointer-events-none">
            <div className="card rounded-2xl p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-xl bg-surface-primary/70 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] pointer-events-auto">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
                  <div className="flex items-center gap-4">
                     <div>
                        <div className="text-base font-semibold text-text-primary">Welcome to Teron</div>
                        <div className="text-sm text-text-secondary mt-0.5">Let's build your project</div>
                     </div>
                  </div>
                  <div className="text-xs font-semibold card px-3 py-1.5 bg-white/5 rounded-full text-text-secondary border border-white/5 whitespace-nowrap">
                    BEP-20 Standard
                  </div>
               </div>
               
               <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                 <Link href="/dashboard/create" className="w-full sm:w-auto h-11 px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[14px] font-medium text-text-primary transition-colors flex items-center justify-center gap-2 cta">
                    Start Building
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                 </Link>
                 <Link href="/leaderboard" className="w-full sm:w-auto h-11 px-5 hover:bg-white/5 rounded-full text-[14px] font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    Explore Projects
                 </Link>
               </div>
            </div>
         </div>
      </div>
    </section>
  );
}

// Custom Canvas Background replicating the dynamic clustered dot-matrix
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
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);
      
      const spacing = 16; // Grid spacing for the dots
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing + spacing / 2;
          const y = j * spacing + spacing / 2;
          
          // Generate block coordinates to create the "clustered" look
          // Macro blocks (large areas)
          const bx1 = Math.floor(i / 10);
          const by1 = Math.floor(j / 10);
          // Micro blocks (smaller intersecting patterns)
          const bx2 = Math.floor(i / 4);
          const by2 = Math.floor(j / 4);
          
          const t = time * 0.5;
          
          // Smooth noise calculation for block movement
          const n1 = Math.sin(bx1 * 0.4 + t) * Math.cos(by1 * 0.4 + t * 0.7);
          const n2 = Math.sin(bx2 * 0.7 - t * 1.1) * Math.cos(by2 * 0.7 + t * 0.8);
          
          // Static deterministic scatter value (0 to 1) for texture
          const scatter = Math.abs(Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1;
          
          // Combine and normalize (-1 to 1) -> (0 to 1)
          let density = (n1 * 0.6) + (n2 * 0.4);
          density = (density + 1) / 2; 
          
          let dotSize = 0;
          let alpha = 0;
          let glow = 0;

          // Apply thresholds to mimic the exact visual clusters from the reference image
          if (density > 0.72) {
            // Core solid blocks (large, bright dots)
            dotSize = spacing * 0.35;
            alpha = 0.85 + scatter * 0.15;
            glow = 6; // Subtle bloom for premium feel
          } else if (density > 0.55) {
            // Surrounding medium dense areas
            dotSize = spacing * 0.22;
            alpha = 0.4 + scatter * 0.2;
            glow = 0;
          } else if (density > 0.4 && scatter > 0.65) {
            // Scattered, digital "falloff" dots extending from blocks
            dotSize = spacing * 0.12;
            alpha = 0.25 + scatter * 0.2;
            glow = 0;
          } else if (scatter > 0.96) {
            // Occasional tiny ambient background blips
            dotSize = spacing * 0.08;
            alpha = 0.15;
            glow = 0;
          }
          
          // Draw the calculated dot
          if (dotSize > 0) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            
            // Rich golden theme (Hue 43-48)
            const lightness = 60 + scatter * 15;
            ctx.fillStyle = `hsla(45, 95%, ${lightness}%, ${alpha})`;
            
            // Apply lightweight glow only to the brightest clusters to maintain performance
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
      
      time += 0.015; // Smooth, relaxed speed
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
      className="w-full h-full"
    />
  );
}