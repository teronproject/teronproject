"use client";

import { useEffect, useState, useRef } from "react";
import { CheckmarkBadge01Icon, SecurityCheckIcon, Upload04Icon, Image01Icon } from "hugeicons-react";
import { motion, AnimatePresence } from "motion/react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useWallet } from "@/hooks/useWallet";
import { useFeatureFlags } from "@/components/FeatureFlagProvider";

/**
 * Step 2: Premium Add-ons
 */
export default function StepAddons({ register, errors, watch, setValue, isAssistanceMode }) {
  const addVerification = watch("addVerification");
  const addMetadata = watch("addMetadata");
  const logoUrl = watch("logoUrl");
  const { address } = useWallet();
  const { flags } = useFeatureFlags();
  const isGlobalMaintenance = flags.maintenance_mode === true;
  const premiumEnabled = !isGlobalMaintenance && flags.premium_addons !== false;
  const verificationEnabled = premiumEnabled && flags.contract_verification !== false;
  const metadataEnabled = premiumEnabled && flags.metadata_submission !== false;

  const [bnbPriceUsd, setBnbPriceUsd] = useState(600);
  const [pricing, setPricing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Logo upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => {
        if (data.success) setPricing(data.services);
      })
      .catch(console.error);

    fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT")
      .then(res => res.json())
      .then(data => {
        if (data?.price) setBnbPriceUsd(parseFloat(data.price));
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

  // --- Logo upload to Cloudinary ---
  async function handleLogoUpload(file) {
    if (!file) return;

    // Validate file
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only PNG, JPG, WebP, or SVG images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File must be under 2MB.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Get signed upload params from our API
      const sigRes = await fetch("/api/upload/signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({ type: "token-logo" }),
      });

      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const sigData = await sigRes.json();

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp);
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) throw new Error("Upload failed");
      const uploadData = await uploadRes.json();

      // 3. Set the URL in the form
      setValue("logoUrl", uploadData.secure_url, { shouldValidate: true });
    } catch (err) {
      console.error("Logo upload error:", err);
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoUpload(file);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) handleLogoUpload(file);
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-accent/5 border border-accent/20 p-5 rounded-xl flex items-start gap-4 shadow-sm card">
        <div>
          <h3 className="text-sm title text-text-secondary mb-1 tracking-wide">
            Premium Launch Services
          </h3>
          <p className="text-xs text-text-tertiary text-balance leading-relaxed">
            Enhance your token's credibility and visibility on BscScan. These services are highly recommended for serious projects.
          </p>
        </div>
      </div>

      {/* Email Input — Always visible */}
      <div>
        <Input
          label="Contact Email"
          type="email"
          placeholder="admin@yourproject.com"
          error={errors.contactEmail?.message}
          {...register("contactEmail")}
          helperText="Required for important notifications (e.g., successful deployment, errors)."
          disabled={isAssistanceMode}
        />
      </div>

      <div className="space-y-5">
        {/* ══════════════ Verification Toggle ══════════════ */}
        <div className={`rounded-xl border-2 transition-all duration-300 ${addVerification ? "border-accent " : "border-border-secondary  hover:border-border-primary"} ${!verificationEnabled ? "opacity-60" : ""}`}>
          <button
            type="button"
            disabled={!verificationEnabled || isAssistanceMode}
            onClick={() => setValue("addVerification", !addVerification, { shouldValidate: true })}
            className="w-full cursor-pointer flex items-start p-5 select-none relative text-left disabled:cursor-not-allowed"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CheckmarkBadge01Icon variant={addVerification ? "solid" : "stroke-rounded"} size={20} className={addVerification ? "text-accent" : "text-text-secondary"} />
                <h4 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                  Contract Verification 
                  {verificationEnabled ? (
                    <span className="text-[10px] uppercase font-bold bg-accent text-accent-text px-1.5 py-0.5 rounded">Recommended</span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold bg-surface-tertiary text-text-tertiary px-1.5 py-0.5 rounded border border-border-secondary">Unavailable</span>
                  )}
                </h4>
              </div>
              <p className="text-xs text-text-secondary mt-1.5 ml-7 leading-relaxed">
                Automatically verify and publish your smart contract source code on BscScan. Gives your token a green checkmark ✓ and builds investor trust.
              </p>
              <div className="mt-2 ml-7 flex items-center gap-2">
                <span className="text-sm font-bold text-text-primary">{formatUsd(verificationPriceBnb)}</span>
                <span className="text-xs text-text-tertiary">({verificationPriceBnb.toFixed(4)} BNB)</span>
              </div>
            </div>
            <div className="ml-4 flex items-center h-full pt-2 shrink-0">
              <div className={`w-12 h-7 rounded-full transition-all duration-300 relative ${!verificationEnabled ? 'bg-surface-tertiary opacity-50' : addVerification ? 'bg-accent shadow-[0_0_10px_rgba(var(--color-accent-rgb,234,179,8),0.3)]' : 'bg-surface-tertiary'}`}>
                <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${addVerification ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
          </button>
          
          <AnimatePresence>
            {addVerification && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden w-full border-t border-dashed border-accent/10"
              >
                <div className="px-5 pb-5 ml-7 pt-2 ">
                  <p className="text-xs text-text-secondary mb-4">Provide the following details required by BscScan for verification:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Project Category"
                      options={categoryOptions}
                      error={errors.projectCategory?.message}
                      {...register("projectCategory")}
                      disabled={isAssistanceMode}
                    />
                    {/* Contact email is moved to top-level, but we keep a reference */}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ══════════════ Metadata Toggle ══════════════ */}
        <div className={`rounded-xl border-2 transition-all duration-300 ${addMetadata ? "border-accent" : "border-border-secondary hover:border-border-primary"} ${!metadataEnabled ? "opacity-60" : ""}`}>
          <button
            type="button"
            disabled={!metadataEnabled || isAssistanceMode}
            onClick={() => setValue("addMetadata", !addMetadata, { shouldValidate: true })}
            className="w-full cursor-pointer flex items-start p-5 select-none relative text-left disabled:cursor-not-allowed"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <SecurityCheckIcon variant={addMetadata ? "solid" : "stroke-rounded"} size={20} className={addMetadata ? "text-accent" : "text-text-secondary"} />
                <h4 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                  On-Chain Logo & Info
                  {metadataEnabled ? (
                    <span className="text-[10px] uppercase font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded">Premium</span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold bg-surface-tertiary text-text-tertiary px-1.5 py-0.5 rounded border border-border-secondary">Unavailable</span>
                  )}
                </h4> 
              </div>
              <p className="text-xs text-text-secondary mt-1.5 ml-7 leading-relaxed">
                Submit your logo, website, and social links to on-chain metadata registries. Makes your token visible in Trust Wallet, PancakeSwap, and other explorers.
              </p>
              <div className="mt-2 ml-7 flex items-center gap-2">
                <span className="text-sm font-bold text-text-primary">{formatUsd(metadataPriceBnb)}</span>
                <span className="text-xs text-text-tertiary">({metadataPriceBnb.toFixed(4)} BNB)</span>
              </div>
            </div>
            <div className="ml-4 flex items-center h-full pt-2 shrink-0">
              <div className={`w-12 h-7 rounded-full transition-all duration-300 relative ${!metadataEnabled ? 'bg-surface-tertiary opacity-50' : addMetadata ? 'bg-accent shadow-[0_0_10px_rgba(var(--color-accent-rgb,234,179,8),0.3)]' : 'bg-surface-tertiary'}`}>
                <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${addMetadata ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
          </button>
          
          <AnimatePresence>
            {addMetadata && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 ml-7 pt-2 border-t border-accent/10 space-y-4">
                  <p className="text-xs text-text-secondary">Ensure links are correct. BscScan requires a website and at least one social link.</p>
                  
                  {/* Logo Upload Area */}
                  <div>
                    <label className="input-label mb-2 block">Token Logo</label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => !isAssistanceMode && fileInputRef.current?.click()}
                      className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                        dragOver
                          ? "border-accent bg-accent/10"
                          : logoUrl
                          ? "border-success/30 bg-success/5"
                          : "border-border-secondary bg-surface-secondary hover:border-accent/30 hover:bg-surface-tertiary"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={isAssistanceMode || isUploading}
                      />

                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs text-text-secondary">Uploading...</p>
                        </div>
                      ) : logoUrl ? (
                        <div className="flex items-center gap-4">
                          <img src={logoUrl} alt="Logo" className="w-14 h-14 rounded-xl object-cover border border-border-secondary shadow-sm" />
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-xs font-semibold text-success flex items-center gap-1">
                              <CheckmarkBadge01Icon size={14} variant="solid" /> Logo uploaded
                            </p>
                            <p className="text-[10px] text-text-tertiary truncate mt-0.5">{logoUrl}</p>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setValue("logoUrl", ""); }}
                              disabled={isAssistanceMode}
                              className="text-[10px] text-error hover:underline mt-1"
                            >
                              Remove & re-upload
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <Upload04Icon size={28} className="text-text-tertiary" />
                          <p className="text-xs text-text-secondary">
                            <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-[10px] text-text-tertiary">PNG, JPG, WebP, SVG · Max 2MB · 256×256px recommended</p>
                        </div>
                      )}
                    </div>

                    {uploadError && (
                      <p className="text-xs text-error mt-1.5">{uploadError}</p>
                    )}

                    {/* URL fallback */}
                    <div className="mt-3">
                      <Input
                        label="Or paste a Logo URL"
                        placeholder="https://..."
                        value={logoUrl || ""}
                        onChange={(e) => setValue("logoUrl", e.target.value, { shouldValidate: true })}
                        error={errors.logoUrl?.message}
                        helperText="Direct link to a 256×256 PNG image"
                        disabled={isAssistanceMode}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Website URL"
                      placeholder="https://yourproject.com"
                      error={errors.website?.message}
                      {...register("website")}
                      disabled={isAssistanceMode}
                    />
                    <Input
                      label="Twitter / X Profile"
                      placeholder="https://x.com/..."
                      {...register("twitter")}
                      error={errors.twitter?.message}
                      disabled={isAssistanceMode}
                    />
                    <Input
                      label="Telegram Group"
                      placeholder="https://t.me/..."
                      {...register("telegram")}
                      error={errors.telegram?.message}
                      disabled={isAssistanceMode}
                    />
                    <Input
                      label="Discord Server"
                      placeholder="https://discord.gg/..."
                      {...register("discord")}
                      error={errors.discord?.message}
                      disabled={isAssistanceMode}
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
