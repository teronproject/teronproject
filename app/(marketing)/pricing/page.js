"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckmarkBadge01Icon, SecurityCheckIcon } from "hugeicons-react";

export default function PricingPage() {
  const [pricing, setPricing] = useState([]);
  const [bnbPrice, setBnbPrice] = useState(600);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pricingRes, bnbRes] = await Promise.all([
          fetch("/api/pricing"),
          fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT"),
        ]);
        const pricingData = await pricingRes.json();
        const bnbData = await bnbRes.json();

        if (pricingData.success) setPricing(pricingData.services);
        if (bnbData?.price) setBnbPrice(parseFloat(bnbData.price));
      } catch (err) {
        console.error("Pricing load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const verificationService = pricing.find(p => p.serviceKey === "verification");
  const metadataService = pricing.find(p => p.serviceKey === "metadata");

  return (
    <div className="max-w-5xl mx-auto px-4 py-20 sm:py-28">
      <div className="text-center mb-16">
        <p className="text-accent text-sm font-bold uppercase tracking-wider mb-3">Pricing</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
          Simple, Transparent Pricing
        </h1>
        <p className="text-text-secondary mt-3 max-w-lg mx-auto">
          Deploy your token for free. Only pay for optional premium services. All payments in BNB with live market conversion.
        </p>
        {!isLoading && (
          <p className="text-xs text-text-tertiary mt-4">
            Current BNB Price: <span className="font-mono text-text-secondary">${bnbPrice.toFixed(2)}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Free Tier */}
        <div className="bg-surface-primary border border-border-primary rounded-2xl p-8">
          <h3 className="text-lg font-bold text-text-primary mb-1">Free Launch</h3>
          <p className="text-xs text-text-tertiary mb-6">Deploy your BEP-20 token</p>
          <p className="text-4xl font-extrabold text-text-primary mb-1">$0</p>
          <p className="text-xs text-text-tertiary mb-8">+ ~$0.05 gas</p>
          <ul className="space-y-3 text-sm text-text-secondary mb-8">
            <li className="flex gap-2"><span className="text-success">✓</span> BEP-20 smart contract</li>
            <li className="flex gap-2"><span className="text-success">✓</span> Public token profile</li>
            <li className="flex gap-2"><span className="text-success">✓</span> Leaderboard listing</li>
            <li className="flex gap-2"><span className="text-success">✓</span> Creator dashboard</li>
            <li className="flex gap-2"><span className="text-success">✓</span> Logo & banner upload</li>
          </ul>
          <Link href="/dashboard/create" className="h-11 w-full bg-surface-secondary border border-border-secondary text-text-primary font-semibold rounded-lg flex items-center justify-center hover:bg-surface-tertiary transition-colors text-sm">
            Start Free
          </Link>
        </div>

        {/* Verification */}
        <div className="bg-surface-primary border-2 border-accent rounded-2xl p-8 relative shadow-xl shadow-accent/5">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-text text-xs font-bold rounded-full">
            Recommended
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
            <CheckmarkBadge01Icon size={20} className="text-accent" variant="solid" />
            Contract Verification
          </h3>
          <p className="text-xs text-text-tertiary mb-6">Verified source code on BscScan</p>
          <p className="text-4xl font-extrabold text-accent mb-1">
            {verificationService ? `$${verificationService.priceUsd?.toFixed(2)}` : "~$2.00"}
          </p>
          <p className="text-xs text-text-tertiary mb-8">
            {verificationService ? `≈ ${verificationService.priceBnb?.toFixed(4)} BNB` : "≈ 0.0033 BNB"}
          </p>
          <ul className="space-y-3 text-sm text-text-secondary mb-8">
            <li className="flex gap-2"><span className="text-success">✓</span> Everything in Free</li>
            <li className="flex gap-2"><span className="text-accent">★</span> Verified source code</li>
            <li className="flex gap-2"><span className="text-accent">★</span> Green ✓ on BscScan</li>
            <li className="flex gap-2"><span className="text-accent">★</span> Investor confidence</li>
          </ul>
          <Link href="/dashboard/create" className="h-11 w-full bg-accent text-accent-text font-bold rounded-lg flex items-center justify-center hover:bg-accent-hover transition-colors text-sm shadow-lg shadow-accent/20">
            Launch + Verify
          </Link>
        </div>

        {/* Full Suite */}
        <div className="bg-surface-primary border border-border-primary rounded-2xl p-8">
          <h3 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
            <SecurityCheckIcon size={20} className="text-accent" variant="solid" />
            Full Suite
          </h3>
          <p className="text-xs text-text-tertiary mb-6">Verification + On-chain metadata</p>
          <p className="text-4xl font-extrabold text-text-primary mb-1">
            {verificationService && metadataService
              ? `$${(verificationService.priceUsd + metadataService.priceUsd).toFixed(2)}`
              : "~$5.00"}
          </p>
          <p className="text-xs text-text-tertiary mb-8">
            {verificationService && metadataService
              ? `≈ ${(verificationService.priceBnb + metadataService.priceBnb).toFixed(4)} BNB`
              : "≈ 0.0083 BNB"}
          </p>
          <ul className="space-y-3 text-sm text-text-secondary mb-8">
            <li className="flex gap-2"><span className="text-success">✓</span> Everything in Verification</li>
            <li className="flex gap-2"><span className="text-accent">★</span> On-chain logo & info</li>
            <li className="flex gap-2"><span className="text-accent">★</span> Trust Wallet visibility</li>
            <li className="flex gap-2"><span className="text-accent">★</span> Priority support</li>
          </ul>
          <Link href="/dashboard/create" className="h-11 w-full bg-surface-secondary border border-border-secondary text-text-primary font-semibold rounded-lg flex items-center justify-center hover:bg-surface-tertiary transition-colors text-sm">
            Launch Full Suite
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">FAQ</h2>
        <div className="space-y-4">
          {[
            {
              q: "Is deploying a token really free?",
              a: "Yes. You only pay the BNB Chain network gas fee (~$0.05). Teron does not charge any fee for the basic token deployment.",
            },
            {
              q: "How does the BNB pricing work?",
              a: "Prices are set in USD and converted to BNB using live market data. The BNB amount you see is the actual amount you'll pay at the time of the transaction.",
            },
            {
              q: "What does Contract Verification do?",
              a: "It publishes your token's Solidity source code on BscScan so anyone can read and verify the contract logic. Verified contracts get a green checkmark and build trust with investors.",
            },
            {
              q: "Can I add premium services later?",
              a: "Yes. After deploying your token, you can purchase verification and metadata publishing from your dashboard at any time.",
            },
          ].map((faq) => (
            <div key={faq.q} className="bg-surface-primary border border-border-primary rounded-xl p-5">
              <h3 className="font-semibold text-text-primary text-sm">{faq.q}</h3>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
