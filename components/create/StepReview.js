"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { CheckmarkBadge01Icon, SecurityCheckIcon, Rocket01Icon } from "hugeicons-react";
import { motion } from "motion/react";

/**
 * Step 4: Final Review & Deploy
 */
export default function StepReview({ getValues, setValue, watch }) {
  const { address } = useWallet();
  const values = getValues();
  const addVerification = watch("addVerification");
  const addMetadata = watch("addMetadata");

  const [bnbPriceUsd, setBnbPriceUsd] = useState(600);
  const [pricing, setPricing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch pricing
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPricing(data.services);
        }
      })
      .catch(console.error);

    // Fetch BNB price
    fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT")
      .then(res => res.json())
      .then(data => {
        if (data && data.price) {
          setBnbPriceUsd(parseFloat(data.price));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const verificationPrice = pricing.find(p => p.serviceKey === "verification")?.priceBnb || 0.0033;
  const metadataPrice = pricing.find(p => p.serviceKey === "metadata")?.priceBnb || 0.005;

  let totalBnbCost = 0;
  if (addVerification) totalBnbCost += verificationPrice;
  if (addMetadata) totalBnbCost += metadataPrice;

  const formatUsd = (bnb) => {
    return (bnb * bnbPriceUsd).toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  return (
    <div className="space-y-8">
      <div className="bg-warning-subtle border border-warning/30 p-5 rounded-xl flex items-start gap-4">
        <div className="mt-0.5">
          <SecurityCheckIcon className="text-warning" variant="solid" size={24} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-warning mb-1">
            Final Review
          </h3>
          <p className="text-xs text-warning/90 leading-relaxed">
            Please review your token details carefully. Once you click "Deploy", a transaction
            will be sent to the BNB Chain. <strong>Smart contracts are immutable</strong> — you will not
            be able to change the Name, Symbol, Decimals, or Initial Supply after deployment.
          </p>
        </div>
      </div>

      <div className="bg-surface-primary border border-border-primary rounded-lg overflow-hidden">
        <div className="p-6 pt-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-primary">
              {values.name || "Token Name"} <span className="text-text-tertiary font-normal">({values.symbol || "SYMBOL"})</span>
            </h2>
            {values.shortDescription && (
              <p className="text-sm text-text-secondary mt-1 max-w-lg">
                {values.shortDescription}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1 py-3 border-t border-border-secondary">
              <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Decimals</span>
              <p className="text-sm text-text-primary font-medium">{values.decimals}</p>
            </div>
            
            <div className="space-y-1 py-3 border-t border-border-secondary">
              <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Initial Supply</span>
              <p className="text-sm text-text-primary font-medium">{values.totalSupply || "0"}</p>
            </div>

            <div className="space-y-1 py-3 border-t border-border-secondary md:col-span-2">
              <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Deployer Wallet</span>
              <p className="text-sm text-text-primary font-mono">{address || "Not connected"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="pt-4">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          Deployment Cost Summary
        </h3>
        
        <div className="bg-surface-secondary border border-border-secondary rounded-xl p-6">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Smart Contract Deployment</span>
              <span className="font-semibold text-text-primary">Free (+ Gas)</span>
            </div>
            
            {addVerification && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <CheckmarkBadge01Icon size={16} className="text-accent" variant="solid" />
                  Contract Verification
                </span>
                <span className="font-semibold text-text-primary">{verificationPrice} BNB</span>
              </div>
            )}

            {addMetadata && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <SecurityCheckIcon size={16} className="text-accent" variant="solid" />
                  On-Chain Logo & Info
                </span>
                <span className="font-semibold text-text-primary">{metadataPrice} BNB</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border-primary flex justify-between items-end">
            <span className="text-sm font-semibold text-text-primary">Total Payable</span>
            <div className="text-right">
              <div className="text-xl font-bold text-accent">{totalBnbCost} BNB</div>
              <div className="text-xs text-text-secondary mt-1">~{formatUsd(totalBnbCost)} USD</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 