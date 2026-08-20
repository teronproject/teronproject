"use client";

import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { motion } from "motion/react";
import { Home01Icon, ArrowLeft01Icon } from "hugeicons-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden pt-32 pb-20 px-4">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(circle at center, black 20%, transparent 70%)"
          }}
        />

        <div className="text-center z-10 max-w-2xl mx-auto">
          {/* Glowing 404 Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block"
          >
            <h1 className="text-4xl sm:text-7xl font-bold leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20 select-none">
              404
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 space-y-4"
          >
            <p className="text-text-secondary text-sm max-w-md mx-auto text-balance leading-relaxed">
              We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="flex items-center cta gap-2 bg-accent hover:bg-accent/90 text-bg-primary px-8 py-3.5 rounded-full font-bold transition-all shadow-[0_0_30px_rgba(243,186,47,0.3)] hover:shadow-[0_0_40px_rgba(243,186,47,0.5)] hover:-translate-y-0.5"
            >
              <Home01Icon size={20} variant="solid" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
