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

  const [pricing, setPricing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPricing(data.services);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const verificationPrice = pricing.find(p => p.serviceKey === "verification")?.priceBnb || 0.0033;

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

      {/* Premium Add-ons Section */}
      <div className="pt-4">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Rocket01Icon variant="stroke-rounded" size={22} className="text-accent" />
          Premium Add-ons <span className="text-xs font-normal text-text-tertiary bg-surface-tertiary px-2 py-0.5 rounded-full ml-2">Optional</span>
        </h3>
        
        <div className="space-y-4">
          {/* Verification Add-on */}
          <motion.label 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`cursor-pointer flex items-start p-5 rounded-xl border-2 transition-all ${
              addVerification ? "border-accent bg-accent/5" : "border-border-secondary bg-surface-secondary hover:border-border-primary"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CheckmarkBadge01Icon variant={addVerification ? "solid" : "stroke-rounded"} size={20} className={addVerification ? "text-accent" : "text-text-secondary"} />
                <h4 className="font-semibold text-text-primary text-sm">Automated Contract Verification</h4>
              </div>
              <p className="text-xs text-text-secondary mt-1.5 ml-7 leading-relaxed">
                We'll automatically verify and publish your smart contract source code on BscScan. Verified contracts build trust and attract more investors.
              </p>
              <p className="text-xs font-semibold text-accent mt-2 ml-7">
                {isLoading ? "Loading price..." : `${verificationPrice} BNB`}
              </p>
            </div>
            <div className="ml-4 flex items-center h-full pt-1">
              <div className={`w-11 h-6 rounded-full transition-colors relative ${addVerification ? 'bg-accent' : 'bg-surface-tertiary'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${addVerification ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
            <input type="checkbox" className="hidden" checked={addVerification} onChange={(e) => setValue("addVerification", e.target.checked)} />
          </motion.label>
        </div>
      </div>
    </div>
  );
}
 