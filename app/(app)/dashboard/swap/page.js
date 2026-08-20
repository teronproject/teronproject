"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Exchange01Icon, Settings02Icon, InformationCircleIcon, Cancel01Icon } from "hugeicons-react";
import { useWallet } from "@/hooks/useWallet";

/**
 * Premium Swap UI for TERR <-> TER
 */
export default function SwapPage() {
  const { address } = useWallet();
  const [payAmount, setPayAmount] = useState("");
  const [isHoveringSwap, setIsHoveringSwap] = useState(false);
  const [balance, setBalance] = useState("0.00");
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState("0.5");

  useEffect(() => {
    if (!address) return;
    async function loadBalance() {
      try {
        const res = await fetch("/api/rewards/balance", {
          headers: { "x-wallet-address": address },
        });
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
      } catch (err) {
        console.error("Failed to load balance", err);
      }
    }
    loadBalance();
  }, [address]);

  // Hardcoded for UI mockup
  const receiveAmount = payAmount ? (parseFloat(payAmount) * 0.95).toFixed(2) : "";

  return (
    <div className="min-h-[90vh] pt-4 pb-20 px-4 flex flex-col items-center justify-start sm:justify-center">
      {/* Header Info */}
      <div className="w-full max-w-[460px] flex items-center justify-between mb-6 px-2">
        <h1 className="text-xl font-bold text-text-primary tracking-tight">Swap</h1>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-full transition-colors"
        >
          <Settings02Icon size={20} variant="stroke-rounded" />
        </button>
      </div>

      {/* Main Swap Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-[460px] relative"
      >
        <div className="bg-[#050403]/80 backdrop-blur-2xl border border-white/5 p-4 rounded-[28px] shadow-2xl relative z-10">
          
          {/* You Pay Section */}
          <div className="bg-[#111111]/80 rounded-[20px] p-4 border border-white/[0.02] hover:border-white/5 transition-colors group">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-text-secondary">You Pay</span>
              <span className="text-xs font-medium text-text-tertiary">Balance: {balance}</span>
            </div>
            <div className="flex justify-between items-center">
              <input
                type="number"
                placeholder="0.00"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="bg-transparent text-4xl font-semibold text-text-primary w-full outline-none placeholder:text-text-tertiary/50 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222222] border border-white/5 px-3 py-1.5 rounded-full transition-all shrink-0 shadow-lg">
                <img src="/token.png" alt="TERR" className="w-6 h-6 rounded-full shadow-inner object-cover" />
                <span className="text-sm font-bold text-text-primary tracking-wide">TERR</span>
              </button>
            </div>
            {/* <div className="mt-2 text-xs text-text-tertiary font-medium">
              ~$0.00
            </div> */}
          </div>

          {/* Swap Divider Button */}
          <div className="relative h-2 w-full flex justify-center items-center z-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onHoverStart={() => setIsHoveringSwap(true)}
              onHoverEnd={() => setIsHoveringSwap(false)}
              className="absolute bg-[#1a1a1a] border-4 border-[#050403] p-2 rounded-xl text-text-secondary hover:text-text-primary transition-colors shadow-xl"
            >
              <motion.div
                animate={{ rotate: isHoveringSwap ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Exchange01Icon size={20} variant="stroke-rounded" />
              </motion.div>
            </motion.button>
          </div>

          {/* You Receive Section */}
          <div className="bg-[#111111]/80 rounded-[20px] p-4 border border-white/[0.02] hover:border-white/5 transition-colors group">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-text-secondary">You Receive</span>
              <span className="text-xs font-medium text-text-tertiary">Balance: 0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="0.00"
                value={receiveAmount}
                readOnly
                className="bg-transparent text-4xl font-semibold text-text-primary w-full outline-none placeholder:text-text-tertiary/50"
              />
              <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222222] border border-white/5 px-3 py-1.5 rounded-full transition-all shrink-0 shadow-lg">
                <img src="/token.svg" alt="TER" className="w-6 h-6 rounded-full shadow-inner object-cover" />
                <span className="text-sm font-bold text-text-primary tracking-wide">TER</span>
              </button>
            </div>
            {/* <div className="mt-2 text-xs text-text-tertiary font-medium">
              ~$0.00
            </div> */}
          </div>

          {/* Action Button (Disabled state) */}
          <div className="mt-4">
            <button
              disabled
              className="w-full relative overflow-hidden bg-white/5 border border-white/10 text-white/50 font-bold text-lg py-4 rounded-[16px] transition-all cursor-not-allowed group flex items-center justify-center gap-2"
            >
              {/* Stripe overlay for disabled look */}
              <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,1)_10px,rgba(255,255,255,1)_20px)]" />
              <span className="relative z-10 flex items-center gap-2">
                Live Soon
              </span>
            </button>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-4 px-4 flex justify-between items-center text-xs text-text-tertiary font-medium">
          <span className="flex items-center gap-1.5 hover:text-text-secondary transition-colors cursor-pointer">
            <InformationCircleIcon size={14} />
            1 TERR = 0.95 TER
          </span>
          <span className="flex items-center gap-1.5">
            Network Fee: <span className="text-text-primary">Free</span>
          </span>
        </div>
      </motion.div>
      
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[360px] bg-[#111111] border border-white/10 rounded-3xl p-5 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-bold text-white">Transaction Settings</h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-1.5 text-text-tertiary hover:text-white rounded-full transition-colors"
                >
                  <Cancel01Icon size={20} />
                </button>
              </div>

              <div className="mb-2">
                <span className="text-sm font-medium text-text-secondary">Slippage Tolerance</span>
              </div>
              
              <div className="flex gap-2 mb-4">
                {["0.1", "0.5", "1.0"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setSlippage(val)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      slippage === val 
                        ? "bg-accent/20 text-accent border border-accent/30" 
                        : "bg-white/5 text-text-secondary border border-transparent hover:bg-white/10"
                    }`}
                  >
                    {val}%
                  </button>
                ))}
                <div className="flex-1 relative flex items-center bg-white/5 rounded-xl border border-transparent focus-within:border-white/10 transition-colors">
                  <input 
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm font-semibold text-text-primary px-3 text-right [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Custom"
                  />
                  <span className="text-sm font-medium text-text-secondary pr-3">%</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
