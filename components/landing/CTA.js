"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight01Icon } from "hugeicons-react";

export default function CTA() {
  return (
    <>
    <section className="relative w-full py-20 overflow-hidden border-t border-white/5 bg-[#0a0a0a]">
      <div className="absolute inset-0 pointer-events-none">
         <CanvasBackground />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
        <h2 className="title text-4xl sm:text-5xl font-medium text-text-primary tracking-tight leading-[1.1] mb-5">
          Ready to launch your token?
        </h2>
        <p className="text-[17px] text-text-secondary text-balance max-w-xl mx-auto leading-relaxed mb-10">
          Join creators who trust Teron to deploy production-grade tokens on BNB Chain. It takes under 5 minutes.
        </p>
        
        <Link
          href="/dashboard/create"
          className="cta h-14 px-10 bg-white text-black font-semibold rounded-full text-[15px] inline-flex items-center justify-center transition-all hover:bg-gray-200 group shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
        >
          Start Building Now
          <ArrowRight01Icon size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
     <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </>
  );
}

// Custom Canvas Background - Transparent
function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true }); // Enable alpha for transparency
    
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
      // Clear the canvas to keep it completely transparent
      ctx.clearRect(0, 0, width, height);
      
      const spacing = 16;
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing + spacing / 2;
          const y = j * spacing + spacing / 2;
          
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
      className="w-full h-full opacity-50"
    />
  );
}
