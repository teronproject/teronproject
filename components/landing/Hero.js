"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import CanvasBackground from "@/components/landing/CanvasBackground";

export default function Hero() {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", label: "Smart Dashboard" },
    { id: "token", label: "Token Launch" },
    { id: "rewards", label: "Rewards" },
  ];
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
        <h1 className="title text-3xl sm:text-5xl lg:text-6xl font-semibold text-text-primary tracking-tight leading-[1.05] mb-6 drop-shadow-sm">
          Launch Your Token
          <br className="hidden sm:block" />
          Secure, Simple, Trusted
        </h1>

        {/* Minimal Subheading */}
        <p className="text-sm sm:text-lg text-balance text-text-secondary max-w-2xl leading-relaxed mb-10">
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

      {/* Tab Bar matching premium aesthetic */}
      <div className="w-full border-y border-border-primary backdrop-blur-2xl mt-16 sticky top-16 z-30 flex justify-center">
        <div className="flex w-full overflow-x-auto hide-scrollbar">
          <div
            className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(243,186,47,0.1)_3px,rgba(243,186,47,0.1)_5px)] opacity-50 mix-blend-screen pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
          />
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 border-r border-border-primary sm:flex-none sm:w-48 py-4 px-4 text-sm font-medium transition-all text-center whitespace-nowrap ${isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-white/[0.02] bg-bg-primary"
                  }`}
              >
                {tab.label}
                {/* {isActive && (
                  <motion.div
                    layoutId="heroTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
                    style={{
                      boxShadow: "0 -2px 10px rgba(255,255,255,0.3)"
                    }}
                  />
                )} */}
              </button>
            );
          })}
        </div>
      </div>

      {/* The Canvas and Custom Animation Section (Full Width) */}
      <div className="relative w-full h-[250px] sm:h-[480px]">
        {/* Canvas Background Container - Full Width */}
        <div className="absolute inset-0 overflow-hidden bg-[#050403]">
          <CanvasBackground className="w-full h-full opacity-50" />

          {/* Premium Tactile Noise/Grain Overlay */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content Showcase Area */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10 px-4 sm:px-8 py-8 perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.98, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -15, scale: 0.98, rotateX: -5 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl h-full flex justify-center items-center relative"
            >
              {activeTab === "about" && (
                <div className="relative w-[95%] sm:w-full h-[200px] sm:h-full sm:aspect-[16/10] rounded-t-2xl sm:rounded-t-3xl overflow-hidden border-t border-x border-white/10 shadow-[0_-30px_100px_rgba(0,0,0,0.8)] pointer-events-auto bg-[#0a0a0a] mt-26 sm:mt-16 scale-110 sm:scale-100">
                  <Image
                    src="/vid/dashboard.svg"
                    alt="Smart Dashboard Preview"
                    width={1920}
                    height={1080}
                    priority
                    quality={100}
                    className="w-full h-auto max-w-none object-bottom absolute left-1/2 -translate-x-1/2 z-0 contrast-[1.15] brightness-[1.1] saturate-[1.05] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                  />
                </div>
              )}

              {activeTab === "token" && (
                <div className="flex flex-col w-full max-w-4xl max-h-75 sm:max-h-95 aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] pointer-events-auto bg-[#0a0a0a] ring-1 ring-white/5">
                  <div className="relative w-full h-full flex-1 overflow-hidden bg-black">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-90"
                    >
                      <source src="/vid/tokenlaunch.webm" type="video/webm" />
                    </video>
                  </div>
                </div>
              )}

              {activeTab === "rewards" && (
                <div className="flex flex-col w-full max-w-4xl max-h-[300px] sm:max-h-[380px] aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] pointer-events-auto bg-[#0a0a0a] ring-1 ring-white/5">
                  <div className="relative w-full h-full flex-1 overflow-hidden bg-black">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-90"
                    >
                      <source src="/vid/tasks.webm" type="video/webm" />
                    </video>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="h-12 w-full bg-bg-primary border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-100 z-10" />
    </section>
  );
}