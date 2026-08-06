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
import { Link01Icon, Copy01Icon } from "hugeicons-react";
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
        
        if (res.ok && data.token) {
          setToken(data.token);
          // Initialize form with existing data
          if (data.token?.profile) {
            reset({
              shortDescription: data.token.profile.shortDescription || "",
              description: data.token.profile.description || "",
              website: data.token.profile.website || "",
              twitter: data.token.profile.twitter || "",
              telegram: data.token.profile.telegram || "",
              discord: data.token.profile.discord || "",
              logoUrl: data.token.profile.logoUrl || "",
              bannerUrl: data.token.profile.bannerUrl || "",
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
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl title text-text-primary mb-2">
            Edit Link-in-Bio
          </h1>
          <p className="text-sm stitle text-text-secondary">
            Updating the profile for <strong className="font-semibold text-text-primary">{token.name}</strong> ({token.symbol})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="card text-white cursor-pointer" onClick={() => router.push("/dashboard/profiles")}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            isLoading={isSaving} 
            disabled={!isDirty || isSaving}
            className="cta"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="mb-8 p-5 card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <p className="text-[11px] text-text-tertiary mb-1.5 font-bold uppercase tracking-wider">Public Profile Link</p>
          <div className="flex items-center gap-2.5 text-text-primary font-mono text-sm bg-surface-secondary px-3 py-1.5 rounded-lg border border-border-secondary/50">
            <Link01Icon size={16} className="text-accent" variant="stroke-rounded" />
            <span className="select-all">teron.io/t/{token.symbol}</span>
          </div>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => {
            navigator.clipboard.writeText(`https://teron.io/t/${token.symbol}`);
            addToast({ variant: "success", message: "Link copied to clipboard!" });
          }}
          className="h-10 px-3 text-xs font-semibold cta"
        >
          <Copy01Icon size={16} className="mr-1.5 inline-block" variant="stroke-rounded" />
          Copy Link
        </Button>
      </div>

      <div className="space-y-8">
        <div className="card p-8 shadow-sm">
          <h2 className="text-xl title text-text-primary border-b border-border-secondary/50 pb-5 mb-8">Profile & Socials</h2>
          <StepProfile register={register} errors={errors} />
        </div>

        <div className="card p-8 shadow-sm">
          <h2 className="text-xl title text-text-primary border-b border-border-secondary/50 pb-5 mb-8">Media Assets</h2>
          <StepMedia register={register} errors={errors} watch={watch} setValue={setValue} />
        </div>
      </div>
    </div>
  );
}
