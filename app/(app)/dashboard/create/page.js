"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenCreateSchema } from "@/lib/zod-schemas/token";
import WizardLayout from "@/components/create/WizardLayout";
import StepBasicInfo from "@/components/create/StepBasicInfo";
import StepAddons from "@/components/create/StepAddons";
import StepReview from "@/components/create/StepReview";
import Skeleton from "@/components/ui/Skeleton";
import MaintenanceGuard from "@/components/shared/MaintenanceGuard";
import { useToastContext } from "@/components/ToastProvider";
import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

const COLD_WALLET = process.env.NEXT_PUBLIC_COLD_WALLET_ADDRESS;
import { useSearchParams } from "next/navigation";

export function CreateTokenContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState(""); // "paying" | "submitting" | "done"
  const { addToast } = useToastContext();
  const { address, isConnected, isBnbChain } = useWallet();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assistanceId = searchParams.get("assistanceId");
  const { open } = useWeb3Modal();

  // Wagmi send transaction
  const { sendTransactionAsync } = useSendTransaction();

  // Pricing state (fetched once for BNB cost calc)
  const [pricing, setPricing] = useState([]);
  const [bnbPriceUsd, setBnbPriceUsd] = useState(600);
  const [isAssistanceMode, setIsAssistanceMode] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tokenCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      symbol: "",
      decimals: 18,
      totalSupply: "",
      shortDescription: "",
      website: "",
      twitter: "",
      telegram: "",
      discord: "",
      logoUrl: "",
      projectCategory: "",
      contactEmail: "",
      addVerification: true,
      addMetadata: false,
      chain: "BSC",
    },
  });

  useEffect(() => {
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => { if (data.success) setPricing(data.services); })
      .catch(console.error);

    fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT")
      .then(res => res.json())
      .then(data => { if (data?.price) setBnbPriceUsd(parseFloat(data.price)); })
      .catch(console.error);
      
    if (assistanceId && address) {
      fetch(`/api/assistance/request/${assistanceId}`, {
        headers: { "x-wallet-address": address }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.request && data.request.status === "APPROVED") {
          setIsAssistanceMode(true);
          const td = data.request.tokenData;
          if (td) {
            reset({ ...getValues(), ...td });
          }
          addToast({ variant: "success", message: "Loaded approved assistance token data." });
        }
      })
      .catch(console.error);
    }
  }, [assistanceId, address, setValue, addToast]);

  // Check BNB balance
  const { useBalance } = require("wagmi");
  const { formatEther } = require("viem");
  const { data: balanceData } = useBalance({ address, query: { enabled: !!address } });
  const bnbBalance = balanceData ? Number(formatEther(balanceData.value)) : 0;

  const nextStep = async () => {
    let fieldsToValidate = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["name", "symbol", "decimals", "totalSupply"];
    } else if (currentStep === 2) {
      const formValues = getValues();
      // Always validate email
      fieldsToValidate.push("contactEmail");
      if (formValues.addVerification) {
        fieldsToValidate.push("projectCategory");
      }
      if (formValues.addMetadata) {
        fieldsToValidate.push("logoUrl", "website");
      }
    }

    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  /**
   * Calculate total BNB cost for premium add-ons.
   */
  function getTotalBnbCost(data) {
    const verificationPrice = pricing.find(p => p.serviceKey === "verification")?.priceBnb || 0.0033;
    const metadataPrice = pricing.find(p => p.serviceKey === "metadata")?.priceBnb || 0.005;

    let total = 0;
    if (data.addVerification) total += Number(verificationPrice);
    if (data.addMetadata) total += Number(metadataPrice);
    return total;
  }

  const isInsufficientBnb = currentStep === 3 && (getTotalBnbCost(getValues()) + 0.001 > bnbBalance);

  const onSubmit = async (data) => {
    if (!isConnected) {
      addToast({ variant: "error", message: "Please connect your wallet first." });
      return;
    }
    if (!isBnbChain) {
      addToast({ variant: "error", message: "Please switch to BNB Chain." });
      return;
    }

    setIsDeploying(true);
    let paymentTxHash = null;

    try {
      const totalCost = getTotalBnbCost(data);

      // Step 1: If there's a premium cost, send BNB to cold wallet
      if (totalCost > 0) {
        setDeployStatus("paying");
        addToast({ variant: "info", message: `Sending ${totalCost.toFixed(4)} BNB to Teron service wallet...` });

        const coldWalletAddress = COLD_WALLET || process.env.COLD_WALLET_ADDRESS;
        if (!coldWalletAddress) {
          throw new Error("Cold wallet address not configured. Please contact support.");
        }

        try {
          const txHash = await sendTransactionAsync({
            to: coldWalletAddress,
            value: parseEther(totalCost.toFixed(18)),
          });

          paymentTxHash = txHash;
          addToast({ variant: "success", message: "Payment confirmed! Processing deployment..." });
        } catch (txError) {
          // User rejected or tx failed
          if (txError.message?.includes("User rejected") || txError.message?.includes("denied")) {
            throw new Error("Transaction was rejected. Deployment cancelled.");
          }
          throw new Error(`Payment failed: ${txError.shortMessage || txError.message}`);
        }
      }

      // Step 2: Submit to backend
      setDeployStatus("submitting");
      const response = await fetch("/api/launch/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({
          ...data,
          paymentTxHash,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to initiate deployment");
      }

      setDeployStatus("done");
      addToast({ variant: "success", message: "Token deployment initiated! 🚀" });
      
      // Redirect to the deployment status page
      router.push(`/dashboard/deployments/${result.deploymentId}`);
    } catch (error) {
      addToast({ variant: "error", message: error.message });
      setIsDeploying(false);
      setDeployStatus("");
    }
  };

  // Deploy button label
  function getDeployLabel() {
    if (isInsufficientBnb) return "Insufficient BNB";
    if (!isDeploying) return "Deploy Token";
    if (deployStatus === "paying") return "Confirm Payment...";
    if (deployStatus === "submitting") return "Deploying...";
    if (deployStatus === "done") return "Redirecting...";
    return "Deploying...";
  }

  return (
    <div className="py-12 px-4">
      {!isConnected && currentStep === 3 ? (
        <div className="max-w-xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Connect Wallet to Deploy</h2>
          <p className="text-text-secondary mb-8">
            You need a connected wallet to sign the deployment transaction.
          </p>
          <button
            onClick={() => open()}
            className="h-12 px-8 bg-accent text-accent-text font-bold rounded-lg hover:bg-accent-hover transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <WizardLayout
          currentStep={currentStep}
          title={
            currentStep === 1 ? "Token Fundamentals" : 
            currentStep === 2 ? "Premium Add-ons" : 
            "Final Review"
          }
          description={
            currentStep === 3 
              ? "Ensure all details are correct. Smart contracts cannot be altered once deployed."
              : null
          }
          onNext={currentStep === 3 ? handleSubmit(onSubmit) : nextStep}
          onBack={currentStep > 1 ? prevStep : null}
          nextLabel={currentStep === 3 ? getDeployLabel() : "Continue"}
          isNextDisabled={isInsufficientBnb}
          isNextLoading={isDeploying}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && <StepBasicInfo register={register} errors={errors} setValue={setValue} isAssistanceMode={isAssistanceMode} />}
            {currentStep === 2 && <StepAddons register={register} errors={errors} watch={watch} setValue={setValue} isAssistanceMode={isAssistanceMode} />}
            {currentStep === 3 && <StepReview getValues={getValues} setValue={setValue} watch={watch} isAssistanceMode={isAssistanceMode} />}
          </form>
        </WizardLayout>
      )}
    </div>
  );
}

export default function CreateTokenPage() {
  return (
    <MaintenanceGuard featureKey="token_creation">
      <Suspense fallback={<div className="py-20 text-center"><Skeleton className="h-12 w-64 mx-auto" /></div>}>
        <CreateTokenContent />
      </Suspense>
    </MaintenanceGuard>
  );
}
