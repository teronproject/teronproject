"use client";

import { useEffect, useState } from "react";
import { CheckmarkBadge01Icon, SecurityCheckIcon } from "hugeicons-react";
import { motion, AnimatePresence } from "motion/react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

/**
 * Step 2: Premium Add-ons
 */
export default function StepAddons({ register, errors, watch, setValue }) {
  const addVerification = watch("addVerification");
  const addMetadata = watch("addMetadata");

  const [bnbPriceUsd, setBnbPriceUsd] = useState(600); // Fallback
  const [pricing, setPricing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch pricing from our backend
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPricing(data.services);
        }
      })
      .catch(console.error);

    // Fetch live BNB price
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

  const verificationPriceBnb = pricing.find(p => p.serviceKey === "verification")?.priceBnb || 0.0033;
  const metadataPriceBnb = pricing.find(p => p.serviceKey === "metadata")?.priceBnb || 0.005;

  const formatUsd = (bnb) => {
    return (bnb * bnbPriceUsd).toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  const categoryOptions = [
    { value: "DeFi", label: "DeFi" },
    { value: "Gaming", label: "Gaming" },
    { value: "Meme", label: "Meme Coin" },
    { value: "Utility", label: "Utility Token" },
    { value: "Governance", label: "Governance" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-accent/5 border border-accent/20 p-5 rounded-xl flex items-start gap-4 mb-6 shadow-sm card">
        <div>
          <h3 className="text-sm title text-text-secondary mb-1 tracking-wide">
            Premium Launch Services
          </h3>
          <p className="text-xs text-text-tertiary text-balance leading-relaxed">
            Enhance your token's credibility and visibility on BscScan. These services are highly recommended for serious projects.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Verification Add-on */}
        <div className={`rounded-xl border-2 transition-all ${addVerification ? "border-accent bg-accent/5" : "border-border-secondary bg-surface-secondary hover:border-border-primary"}`}>
          <motion.label 
            whileTap={{ scale: 0.995 }}
            className="cursor-pointer flex items-start p-5 select-none relative"
          >
            <input 
              type="checkbox" 
              className="sr-only" 
              {...register("addVerification")} 
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CheckmarkBadge01Icon variant={addVerification ? "solid" : "stroke-rounded"} size={20} className={addVerification ? "text-accent" : "text-text-secondary"} />
                <h4 className="font-semibold text-text-primary text-sm">
                  Contract Verification <span className="text-[10px] uppercase font-bold bg-accent text-accent-text px-1.5 py-0.5 rounded ml-2">Recommended</span>
                </h4>
              </div>
              <p className="text-xs text-text-secondary mt-1.5 ml-7 leading-relaxed">
                Automatically verify and publish your smart contract source code on BscScan.
              </p>
              <div className="mt-2 ml-7 flex items-center gap-2">
                <span className="text-sm font-bold text-text-primary">{formatUsd(verificationPriceBnb)}</span>
                <span className="text-xs text-text-tertiary">({verificationPriceBnb} BNB)</span>
              </div>
            </div>
            <div className="ml-4 flex items-center h-full pt-2">
              <div className={`w-11 h-6 rounded-full transition-colors relative ${addVerification ? 'bg-accent' : 'bg-surface-tertiary'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${addVerification ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
          </motion.label>
          
          <AnimatePresence>
            {addVerification && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 ml-7 pt-2 border-t border-accent/10">
                  <p className="text-xs text-text-secondary mb-4">Provide the following details required by BscScan for verification:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Project Category"
                      options={categoryOptions}
                      {...register("projectCategory")}
                      error={errors.projectCategory?.message}
                    />
                    <Input
                      label="Official Contact Email"
                      placeholder="e.g. hello@project.com"
                      {...register("contactEmail")}
                      error={errors.contactEmail?.message}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metadata Add-on */}
        <div className={`rounded-xl border-2 transition-all ${addMetadata ? "border-accent bg-accent/5" : "border-border-secondary bg-surface-secondary hover:border-border-primary"}`}>
          <motion.label 
            whileTap={{ scale: 0.995 }}
            className="cursor-pointer flex items-start p-5 select-none relative"
          >
            <input 
              type="checkbox" 
              className="sr-only" 
              {...register("addMetadata")} 
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <SecurityCheckIcon variant={addMetadata ? "solid" : "stroke-rounded"} size={20} className={addMetadata ? "text-accent" : "text-text-secondary"} />
                <h4 className="font-semibold text-text-primary text-sm">
                  On-Chain Logo & Info
                </h4>
              </div>
              <p className="text-xs text-text-secondary mt-1.5 ml-7 leading-relaxed">
                Submit your logo, website, and social links to Web3 metadata registries to appear in wallets and explorers.
              </p>
              <div className="mt-2 ml-7 flex items-center gap-2">
                <span className="text-sm font-bold text-text-primary">{formatUsd(metadataPriceBnb)}</span>
                <span className="text-xs text-text-tertiary">({metadataPriceBnb} BNB)</span>
              </div>
            </div>
            <div className="ml-4 flex items-center h-full pt-2">
              <div className={`w-11 h-6 rounded-full transition-colors relative ${addMetadata ? 'bg-accent' : 'bg-surface-tertiary'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${addMetadata ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
          </motion.label>
          
          <AnimatePresence>
            {addMetadata && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 ml-7 pt-2 border-t border-accent/10">
                  <p className="text-xs text-text-secondary mb-4">Ensure links are correct. BscScan requires a website and at least one social link.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Logo URL"
                        placeholder="https://..."
                        {...register("logoUrl")}
                        error={errors.logoUrl?.message}
                        helperText="Provide a direct link to a 256x256 PNG image."
                      />
                    </div>
                    <Input
                      label="Website URL"
                      placeholder="https://..."
                      {...register("website")}
                      error={errors.website?.message}
                    />
                    <Input
                      label="Twitter Profile URL"
                      placeholder="https://twitter.com/..."
                      {...register("twitter")}
                      error={errors.twitter?.message}
                    />
                    <Input
                      label="Telegram Group URL"
                      placeholder="https://t.me/..."
                      {...register("telegram")}
                      error={errors.telegram?.message}
                    />
                    <Input
                      label="Discord Server URL"
                      placeholder="https://discord.gg/..."
                      {...register("discord")}
                      error={errors.discord?.message}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
