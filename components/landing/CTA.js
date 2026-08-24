"use client";

import Link from "next/link";
import { ArrowRight01Icon } from "hugeicons-react";
import CanvasBackground from "@/components/landing/CanvasBackground";

export default function CTA() {
  return (
    <>
    <section className="relative w-full py-20 overflow-hidden border-t border-white/5 bg-[#0a0a0a]">
      <div className="absolute inset-0 pointer-events-none opacity-50">
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
          className="cta h-12 px-10 bg-white text-black font-semibold rounded-full text-[15px] inline-flex items-center justify-center transition-all hover:bg-gray-200 group shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
        >
          Launch your Token
          <ArrowRight01Icon size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
     <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </>
  );
}
