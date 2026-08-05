"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToastContext } from "@/components/ToastProvider";
import { useWallet } from "@/hooks/useWallet";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import StepProfile from "@/components/create/StepProfile";
import StepMedia from "@/components/create/StepMedia";
import { tokenSocialsSchema, tokenMediaSchema } from "@/lib/zod-schemas/token";

const profileSchema = tokenSocialsSchema.merge(tokenMediaSchema);

export default function TokenProfileEditor() {
  const { id } = useParams();
  const router = useRouter();
  const { address } = useWallet();
  const { addToast } = useToastContext();
  
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      shortDescription: "",
      description: "",
      website: "",
      twitter: "",
      telegram: "",
      discord: "",
      logoUrl: "",
      bannerUrl: "",
    },
  });

  useEffect(() => {
    async function loadToken() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          setToken(data.project);
          // Initialize form with existing data
          if (data.project?.profile) {
            reset({
              shortDescription: data.project.profile.shortDescription || "",
              description: data.project.profile.description || "",
              website: data.project.profile.website || "",
              twitter: data.project.profile.twitter || "",
              telegram: data.project.profile.telegram || "",
              discord: data.project.profile.discord || "",
              logoUrl: data.project.profile.logoUrl || "",
              bannerUrl: data.project.profile.bannerUrl || "",
            });
          }
        } else {
          addToast({ variant: "error", message: "Token not found" });
          router.push("/dashboard/profiles");
        }
      } catch (error) {
        addToast({ variant: "error", message: "Failed to load token" });
      } finally {
        setIsLoading(false);
      }
    }
    loadToken();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      
      addToast({ variant: "success", message: "Profile saved successfully!" });
      reset(data); // reset form state so isDirty is false again
    } catch (err) {
      addToast({ variant: "error", message: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 px-6 max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Edit Link-in-Bio
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Updating the profile for <strong>{token.name}</strong> ({token.symbol})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.push("/dashboard/profiles")}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            isLoading={isSaving} 
            disabled={!isDirty || isSaving}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-surface-primary border border-border-primary rounded-xl p-6">
          <h2 className="text-lg font-bold text-text-primary border-b border-border-secondary pb-4 mb-6">Profile & Socials</h2>
          <StepProfile register={register} errors={errors} />
        </div>

        <div className="bg-surface-primary border border-border-primary rounded-xl p-6">
          <h2 className="text-lg font-bold text-text-primary border-b border-border-secondary pb-4 mb-6">Media Assets</h2>
          <StepMedia register={register} errors={errors} watch={watch} setValue={setValue} />
        </div>
      </div>
    </div>
  );
}
