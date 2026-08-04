"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenCreateSchema } from "@/lib/zod-schemas/token";
import WizardLayout from "@/components/create/WizardLayout";
import StepBasicInfo from "@/components/create/StepBasicInfo";
import StepProfile from "@/components/create/StepProfile";
import StepMedia from "@/components/create/StepMedia";
import StepReview from "@/components/create/StepReview";
import { useToastContext } from "@/components/ToastProvider";
import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";

export default function CreateTokenPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const { addToast } = useToastContext();
  const { address, isConnected, isBnbChain, connect, connectors } = useWallet();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
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
      bannerUrl: "",
      chain: "BSC",
    },
  });

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) fieldsToValidate = ["name", "symbol", "decimals", "totalSupply"];
    else if (currentStep === 2) fieldsToValidate = ["shortDescription", "website", "twitter", "telegram", "discord"];
    else if (currentStep === 3) fieldsToValidate = ["logoUrl", "bannerUrl"];

    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

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
    
    try {
      const response = await fetch("/api/tokens/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-wallet-address": address // Note: In production this should be a cryptographically signed payload
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to initiate deployment");
      }

      addToast({ variant: "success", message: "Token deployment initiated!" });
      
      // Redirect to the deployment status page
      router.push(`/deployments/${result.deploymentId}`);
    } catch (error) {
      addToast({ variant: "error", message: error.message });
      setIsDeploying(false);
    }
  };

  return (
    <div className="py-12 px-4">
      {!isConnected && currentStep === 4 ? (
        <div className="max-w-xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Connect Wallet to Deploy</h2>
          <p className="text-text-secondary mb-8">
            You need a connected wallet to sign the deployment transaction.
          </p>
          <button
            onClick={() => connect({ connector: connectors[0] })}
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
            currentStep === 2 ? "Profile & Socials" :
            currentStep === 3 ? "Visual Assets" :
            "Final Review"
          }
          description={
            currentStep === 4 
              ? "Ensure all details are correct. Smart contracts cannot be altered once deployed."
              : null
          }
          onNext={currentStep === 4 ? handleSubmit(onSubmit) : nextStep}
          onBack={currentStep > 1 ? prevStep : null}
          nextLabel={currentStep === 4 ? (isDeploying ? "Deploying..." : "Deploy Token") : "Continue"}
          isNextLoading={isDeploying}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && <StepBasicInfo register={register} errors={errors} />}
            {currentStep === 2 && <StepProfile register={register} errors={errors} />}
            {currentStep === 3 && <StepMedia register={register} errors={errors} watch={watch} setValue={setValue} />}
            {currentStep === 4 && <StepReview getValues={getValues} />}
          </form>
        </WizardLayout>
      )}
    </div>
  );
}
