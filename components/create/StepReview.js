"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { CheckmarkBadge01Icon, SecurityCheckIcon, Rocket01Icon, Mail01Icon } from "hugeicons-react";
import { useBalance } from "wagmi";
import { formatEther } from "viem";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToastContext } from "@/components/ToastProvider";

/**
 * Step 3: Final Review & Deploy
 */
export default function StepReview({ getValues, setValue, watch }) {
  const { address } = useWallet();
  const { addToast } = useToastContext();
  const values = getValues();
  const addVerification = watch("addVerification");
  const addMetadata = watch("addMetadata");

  const [bnbPriceUsd, setBnbPriceUsd] = useState(600);
  const [pricing, setPricing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Assistance state
  const [assistanceForm, setAssistanceForm] = useState({ telegram: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Check BNB balance
  const { data: balanceData } = useBalance({ address, query: { enabled: !!address } });
  const bnbBalance = balanceData ? Number(formatEther(balanceData.value)) : 0;

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

  const verificationPrice = pricing.find(p => p.serviceKey === "verification")?.priceBnb || 0.0033;
  const metadataPrice = pricing.find(p => p.serviceKey === "metadata")?.priceBnb || 0.005;

  let totalBnbCost = 0;
  if (addVerification) totalBnbCost += Number(verificationPrice);
  if (addMetadata) totalBnbCost += Number(metadataPrice);

  const totalRequired = totalBnbCost + 0.001; // Adding a small buffer for gas
  const isInsufficientBnb = bnbBalance < totalRequired;

  const formatUsd = (bnb) => {
    return (Number(bnb) * bnbPriceUsd).toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  const handleRequestAssistance = async () => {
    if (!values.contactEmail) {
      addToast({ variant: "error", message: "Please provide a contact email in Step 2 first." });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/assistance/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({
          contactEmail: values.contactEmail,
          telegram: assistanceForm.telegram,
          description: assistanceForm.description,
          totalBnbCost: totalBnbCost,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
      } else {
        addToast({ variant: "error", message: data.message || "Failed to submit request" });
      }
    } catch (err) {
      addToast({ variant: "error", message: "Network error submitting request" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Warning Banner */}
      <div className="bg-warning/5 border border-warning/30 p-5 rounded-xl shadow-sm card">
        <h3 className="text-lg title text-warning mb-1">
          Final Review
        </h3>
        <p className="text-xs text-text-tertiary leading-relaxed">
          Please review your token details carefully. Once you click "Deploy", a transaction
          will be sent to the BNB Chain. <strong className="font-bold">Smart contracts are immutable</strong> — you will not
          be able to change the Name, Symbol, Decimals, or Initial Supply after deployment.
        </p>
      </div>

      {/* Token Summary Card */}
      <div className="bg-surface-primary border border-border-primary rounded-xl overflow-hidden card">
        <div className="p-6 pt-8">
          <div className="flex items-center gap-4 mb-6">
            {values.logoUrl && (
              <img
                src={values.logoUrl}
                alt={values.name}
                className="w-14 h-14 rounded-xl object-cover border border-border-secondary shadow-sm"
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                {values.name || "Token Name"}{" "}
                <span className="text-text-tertiary font-normal">({values.symbol || "SYMBOL"})</span>
              </h2>
              {values.shortDescription && (
                <p className="text-sm text-text-secondary mt-0.5 max-w-lg">
                  {values.shortDescription}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1 py-3 border-t border-border-secondary">
              <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Decimals</span>
              <p className="text-sm text-text-primary font-medium">{values.decimals}</p>
            </div>
            
            <div className="space-y-1 py-3 border-t border-border-secondary">
              <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Initial Supply</span>
              <p className="text-sm text-text-primary font-medium">
                {values.totalSupply ? Number(values.totalSupply).toLocaleString() : "0"}
              </p>
            </div>

            <div className="space-y-1 py-3 border-t border-border-secondary">
              <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Chain</span>
              <p className="text-sm text-text-primary font-medium">BNB Smart Chain (BSC)</p>
            </div>

            <div className="space-y-1 py-3 border-t border-border-secondary">
              <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Deployer Wallet</span>
              <p className="text-sm text-text-primary font-mono text-xs truncate">{address || "Not connected"}</p>
            </div>

            {values.contactEmail && (
              <div className="space-y-1 py-3 border-t border-border-secondary md:col-span-2">
                <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Mail01Icon size={12} /> Contact Email
                </span>
                <p className="text-sm text-text-primary">{values.contactEmail}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add-ons Summary */}
      {(addVerification || addMetadata) && (
        <div>
          <h3 className="text-sm title text-text-primary mb-3">Selected Premium Services</h3>
          <div className="space-y-2">
            {addVerification && (
              <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-lg p-3">
                <CheckmarkBadge01Icon size={18} className="text-accent" variant="solid" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-text-primary">Contract Verification</p>
                  <p className="text-[10px] text-text-tertiary">Source code verified on BscScan</p>
                </div>
                <span className="text-xs font-bold text-accent">{Number(verificationPrice).toFixed(4)} BNB</span>
              </div>
            )}
            {addMetadata && (
              <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-lg p-3">
                <SecurityCheckIcon size={18} className="text-accent" variant="solid" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-text-primary">On-Chain Logo & Info</p>
                  <p className="text-[10px] text-text-tertiary">Logo, website, socials published on-chain</p>
                </div>
                <span className="text-xs font-bold text-accent">{Number(metadataPrice).toFixed(4)} BNB</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cost Summary */}
      <div className="bg-surface-secondary border border-border-secondary rounded-xl p-6 card">
        <h3 className="text-sm title text-text-primary mb-4">
          Deployment Cost Summary
        </h3>
        
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
              <span className="font-semibold text-text-primary">{Number(verificationPrice).toFixed(4)} BNB</span>
            </div>
          )}

          {addMetadata && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary flex items-center gap-1.5">
                <SecurityCheckIcon size={16} className="text-accent" variant="solid" />
                On-Chain Logo & Info
              </span>
              <span className="font-semibold text-text-primary">{Number(metadataPrice).toFixed(4)} BNB</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border-primary flex justify-between items-end">
          <div>
            <span className="text-sm font-semibold text-text-primary">Total Payable</span>
            {totalBnbCost > 0 && (
              <p className="text-[10px] text-text-tertiary mt-0.5">Sent to Teron service wallet + network gas</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">{totalBnbCost.toFixed(4)} BNB</div>
            <div className="text-xs text-text-secondary mt-1">≈ {formatUsd(totalBnbCost)} USD</div>
          </div>
        </div>
      </div>

      {/* BNB Assistance Card */}
      {isInsufficientBnb && (
        <div className="bg-error/5 border border-error/20 rounded-xl p-6 card shadow-sm mt-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-error/10 rounded-full shrink-0">
              <SecurityCheckIcon size={24} className="text-error" variant="solid" />
            </div>
            <div>
              <h3 className="text-sm title text-text-primary mb-1">Insufficient BNB Balance</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Your wallet balance ({bnbBalance.toFixed(4)} BNB) is below the required {totalRequired.toFixed(4)} BNB (including gas buffer). 
                If you are a promising project, you can request BNB assistance from the Teron team to cover your deployment costs.
              </p>
            </div>
          </div>

          {submitSuccess ? (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
              <CheckmarkBadge01Icon size={24} className="text-success mx-auto mb-2" variant="solid" />
              <p className="text-sm font-bold text-success">Assistance Request Sent!</p>
              <p className="text-xs text-text-secondary mt-1">Our team will review your project and get back to you shortly.</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2 border-t border-error/10">
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Telegram Username (Optional)"
                  placeholder="@yourusername"
                  value={assistanceForm.telegram}
                  onChange={(e) => setAssistanceForm({ ...assistanceForm, telegram: e.target.value })}
                />
                <div className="space-y-2">
                  <label className="input-label">Why should we sponsor your deployment?</label>
                  <textarea
                    value={assistanceForm.description}
                    onChange={(e) => setAssistanceForm({ ...assistanceForm, description: e.target.value })}
                    placeholder="Tell us about your project, team, and goals..."
                    className="input text-sm"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleRequestAssistance} 
                  isLoading={isSubmitting}
                  className="bg-error text-white hover:bg-error/90"
                >
                  Request BNB Assistance
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}