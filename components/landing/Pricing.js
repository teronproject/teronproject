"use client";

import Link from "next/link";
import { CheckmarkBadge01Icon } from "hugeicons-react";

const DashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 shrink-0 mt-0.5">
    <line x1="6" y1="12" x2="18" y2="12"></line>
  </svg>
);

const plans = [
  {
    name: "Free",
    desc: "Fun to own a coin.",
    price: "$0",
    priceSub: "",
    highlight: false,
    button: "Get Started Free",
    buttonClasses: "bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-text-primary",
    features: [
      { text: "BEP-20 smart contract deployment", included: true },
      { text: "Token public profile page", included: true },
      { text: "BscScan verified source code", included: false },
      { text: "Green checkmark on BscScan", included: false },
      { text: "On-chain logo & metadata", included: false },
      { text: "Visible in Trust Wallet & DEXs", included: false },
    ]
  },
  {
    name: "Basic",
    desc: "Perfect for testing and small communities.",
    price: "$2",
    priceSub: "/ paid in BNB",
    highlight: true, // Middle highlighted card
    button: "Launch Basic",
    buttonClasses: "cta",
    features: [
      { text: "BEP-20 smart contract deployment", included: true },
      { text: "Token public profile page", included: true },
      { text: "BscScan verified source code", included: true },
      { text: "Green checkmark on BscScan", included: true },
      { text: "On-chain logo & metadata", included: false },
      { text: "Visible in Trust Wallet & DEXs", included: false },
    ]
  },
  {
    name: "Pro",
    desc: "Required for the good exchange and serious projects.",
    price: "$5",
    priceSub: "/ paid in BNB",
    highlight: false,
    button: "Launch Pro",
    buttonClasses: "bg-white text-text-primary hover:bg-gray-200 card",
    features: [
      { text: "BEP-20 smart contract deployment", included: true },
      { text: "Token public profile page", included: true },
      { text: "BscScan verified source code", included: true },
      { text: "Green checkmark on BscScan", included: true },
      { text: "On-chain logo & metadata", included: true },
      { text: "Visible in Trust Wallet & DEXs", included: true },
    ]
  }
];

export default function Pricing() {
  return (
    <section className="w-full pt-20 relative z-10 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        
        {/* Header */}
        <div className="text-left max-w-2xl mb-14">
          <h2 className="title text-3xl sm:text-4xl font-medium text-text-primary tracking-tight leading-[1.15] mb-5">
            Simple, transparent pricing
          </h2>
          <p className="text-sm text-balance text-text-tertiary leading-relaxed">
            Deploy your smart contract for free. Only pay a small fee when you need premium verification or ecosystem integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`rounded-3xl p-8 lg:p-10 flex flex-col relative transition-all ${
                plan.highlight 
                  ? "border border-accent/20" 
                  : "border border-white/5"
              }`}
            >
              {plan.highlight && (
                <>
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                  <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-[#1a1500] border border-accent/30 text-accent text-[11px] font-medium rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                </>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-medium text-text-primary mb-1">{plan.name}</h3>
                <p className="text-sm text-text-tertiary text-balance h-10 pr-4">
                  {plan.desc}
                </p>
              </div>
              
              <div className="flex items-baseline gap-2 mb-8 h-12">
                <span className="text-5xl font-semibold text-text-primary tracking-tight">{plan.price}</span>
                {plan.priceSub && <span className="text-[13px] text-text-tertiary">{plan.priceSub}</span>}
              </div>

              <Link 
                href="/dashboard/create" 
                className={`w-full h-12 rounded-lg font-semibold text-[14px] flex items-center justify-center transition-all mb-10 ${plan.buttonClasses}`}
              >
                {plan.button}
              </Link>

              <div className="flex flex-col gap-4">
                <span className="text-sm font-medium text-text-secondary  mb-2">Included Features</span>
                {plan.features.map((feature, i) => (
                  <div key={i} className={`flex items-start gap-3 ${!feature.included ? 'opacity-40' : ''}`}>
                    {feature.included ? (
                      <CheckmarkBadge01Icon size={18} className={`${plan.highlight ? 'text-accent' : 'text-text-tertiary'} shrink-0 mt-0.5`} strokeWidth={2} />
                    ) : (
                      <DashIcon />
                    )}
                    <span className={`text-[14px] leading-snug ${feature.included && plan.highlight ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
       <div className="h-12 w-full border-t border-white/5 bg-[repeating-linear-gradient(to_right,transparent,transparent_3px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)] opacity-70" />
    </section>
  );
}
