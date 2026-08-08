"use client";

import { useEffect, useRef } from "react";

export default function CanvasBackground({ className = "w-full h-full opacity-50" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    
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
      ctx.clearRect(0, 0, width, height);
      
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
      className={className}
    />
  );
}
