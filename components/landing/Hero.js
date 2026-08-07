"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center pt-24 sm:pt-32 pb-20">
      {/* Top Section - Typography and CTA */}
      <div className="max-w-5xl w-full mx-auto px-4 z-10 flex flex-col items-center text-center">
        {/* Big Premium Headline */}
        <h1 className="title text-5xl sm:text-6xl  font-semibold text-text-primary tracking-tight leading-[1.05] mb-6">
          Launch Your Token
          <br className="hidden sm:block" />
          Secure, Simple, Trusted
        </h1>

        {/* Minimal Subheading */}
        <p className=" text-lg text-balance  text-text-secondary max-w-2xl leading-relaxed mb-10">
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

      {/* The Canvas and Custom Animation Section */}
      <div className="relative w-full max-w-5xl mx-auto mt-24 px-4 h-[400px] sm:h-[480px]">
         {/* Canvas Background Container */}
         <div className="absolute inset-x-4 inset-y-0 sm:inset-0 rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-[#111]">
            <CanvasBackground />
            
            {/* Vignette overlays to blend edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0a0a0a_120%)]" />
         </div>
         
         {/* Floating UI Widget overlapping the canvas */}
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

// Custom Canvas Background replicating the premium block layout
function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // High DPI support
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
      // Background base
      ctx.fillStyle = "#0d0d0d";
      ctx.fillRect(0, 0, width, height);
      
      const blockW = Math.max(80, width / 12);
      const blockH = 40;
      
      const cols = Math.ceil(width / blockW) + 2;
      const rows = Math.ceil(height / blockH) + 2;
      
      for (let y = -1; y < rows; y++) {
        for (let x = -1; x < cols; x++) {
          const stagger = (y % 2 === 0) ? 0 : blockW / 2;
          const xPos = x * blockW - stagger;
          
          // Animate rows slowly in opposite directions
          const direction = y % 2 === 0 ? 1 : -1;
          const animatedX = xPos + (time * 10 * direction) % blockW;
          const yPos = y * blockH;
          
          // Deterministic noise for color variation
          const noise = Math.sin((x + y * cols) * 12.9898) * 43758.5453;
          const random = Math.abs(noise - Math.floor(noise));
          
          // Premium Gold/Yellow theme colors mimicking the accent
          const hue = 42 + random * 5; // 42-47
          const saturation = 70 + random * 20; // 70-90%
          const lightness = 10 + random * 20; // 10-30%
          const alpha = 0.4 + random * 0.4;
          
          // Occasional highlight blocks
          const isHighlight = random > 0.95;
          const finalLightness = isHighlight ? lightness + 20 : lightness;
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${finalLightness}%, ${alpha})`;
          
          // Draw rectangle with tiny gap
          ctx.beginPath();
          ctx.roundRect(animatedX, yPos, blockW - 2, blockH - 2, 4);
          ctx.fill();
        }
      }
      
      time += 0.01;
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
