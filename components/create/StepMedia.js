"use client";

import { useRef, useState } from "react";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import { Image01Icon, Camera01Icon, ImageUploadIcon } from "hugeicons-react";

/**
 * Step 3: Media Uploads — Logo & Banner via Cloudinary
 */
export default function StepMedia({ register, errors, watch, setValue }) {
  const logoUrl = watch("logoUrl");
  const bannerUrl = watch("bannerUrl");
  const { address } = useWallet();

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const {
    upload: uploadLogo,
    isUploading: isLogoUploading,
    progress: logoProgress,
  } = useCloudinaryUpload({ type: "token-logo", walletAddress: address });

  const {
    upload: uploadBanner,
    isUploading: isBannerUploading,
    progress: bannerProgress,
  } = useCloudinaryUpload({ type: "token-banner", walletAddress: address });

  const { addToast } = useToastContext();
  const [localLogoPreview, setLocalLogoPreview] = useState(null);
  const [localBannerPreview, setLocalBannerPreview] = useState(null);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Safety Validations
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      addToast({ variant: "error", message: "Logo must be a JPG, PNG, WebP, or SVG." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      addToast({ variant: "error", message: "Logo file size must be less than 2MB." });
      return;
    }

    // Set local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setLocalLogoPreview(objectUrl);

    try {
      const url = await uploadLogo(file);
      if (url) setValue("logoUrl", url, { shouldValidate: true, shouldDirty: true });
    } catch (err) {
      addToast({ variant: "error", message: err.message || "Failed to upload logo." });
    } finally {
      // Clean up object URL to prevent memory leaks
      URL.revokeObjectURL(objectUrl);
      setLocalLogoPreview(null);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Safety Validations
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      addToast({ variant: "error", message: "Banner must be a JPG, PNG, or WebP." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast({ variant: "error", message: "Banner file size must be less than 5MB." });
      return;
    }

    // Set local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setLocalBannerPreview(objectUrl);

    try {
      const url = await uploadBanner(file);
      if (url) setValue("bannerUrl", url, { shouldValidate: true, shouldDirty: true });
    } catch (err) {
      addToast({ variant: "error", message: err.message || "Failed to upload banner." });
    } finally {
      URL.revokeObjectURL(objectUrl);
      setLocalBannerPreview(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-surface-tertiary border border-border-secondary p-5 rounded-xl flex items-start gap-4">
        <div className="mt-0.5">
          <Image01Icon className="text-accent" variant="stroke-rounded" size={24} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            Visual Identity
          </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Your token's branding is the first thing investors see. High-quality,
          properly sized images make your project look professional and
          trustworthy. Images are uploaded securely via Cloudinary.
          </p>
        </div>
      </div>

      {/* Logo Upload Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-text-primary">Token Logo</h4>
          <p className="text-xs text-text-tertiary mt-1">
            Recommended: 512×512px, PNG or WebP. Max 2MB. A square image with a
            transparent or solid background.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div
            onClick={() => logoInputRef.current?.click()}
            className="w-24 h-24 rounded-full border-2 border-dashed border-border-secondary bg-surface-primary flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-accent transition-colors group"
          >
            {isLogoUploading ? (
              <div className="relative w-full h-full">
                {localLogoPreview && (
                  <img src={localLogoPreview} alt="Preview" className="w-full h-full object-cover opacity-50 grayscale" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-primary/40 backdrop-blur-sm">
                  <span className="block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-1" />
                  <span className="text-xs font-bold text-accent drop-shadow-sm">
                    {logoProgress}%
                  </span>
                </div>
              </div>
            ) : logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center flex flex-col items-center justify-center">
                <Camera01Icon variant="stroke-rounded" size={28} className="text-text-tertiary group-hover:text-accent transition-colors mb-2" />
                <span className="text-[10px] text-text-tertiary group-hover:text-accent transition-colors font-medium">
                  Upload Logo
                </span>
              </div>
            )}
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleLogoUpload}
          />
          <div className="flex-1 space-y-2">
            {logoUrl && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-success font-semibold">
                  ✓ Uploaded
                </span>
                <button
                  type="button"
                  onClick={() => setValue("logoUrl", "", { shouldValidate: true })}
                  className="text-xs text-text-tertiary hover:text-error transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
            {errors.logoUrl && (
              <p className="text-xs text-error">{errors.logoUrl.message}</p>
            )}
            {/* Hidden input to register the field */}
            <input type="hidden" {...register("logoUrl")} />
          </div>
        </div>
      </div>

      <hr className="border-border-primary" />

      {/* Banner Upload Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-text-primary">
            Profile Banner (Optional)
          </h4>
          <p className="text-xs text-text-tertiary mt-1">
            Recommended: 1024×256px, JPG or PNG. Max 5MB. Appears at the top of
            your token's public profile page.
          </p>
        </div>

        <div className="space-y-4">
          <div
            onClick={() => bannerInputRef.current?.click()}
            className="w-full aspect-[4/1] rounded-lg border-2 border-dashed border-border-secondary bg-surface-primary flex items-center justify-center overflow-hidden cursor-pointer hover:border-accent transition-colors group"
          >
            {isBannerUploading ? (
              <div className="relative w-full h-full">
                {localBannerPreview && (
                  <img src={localBannerPreview} alt="Preview" className="w-full h-full object-cover opacity-50 grayscale" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-primary/40 backdrop-blur-sm">
                  <span className="block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs font-bold text-accent drop-shadow-sm">
                    Uploading... {bannerProgress}%
                  </span>
                </div>
              </div>
            ) : bannerUrl ? (
              <img
                src={bannerUrl}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center flex flex-col items-center justify-center">
                <ImageUploadIcon variant="stroke-rounded" size={32} className="text-text-tertiary group-hover:text-accent transition-colors mb-2" />
                <span className="text-xs font-medium text-text-tertiary group-hover:text-accent transition-colors block">
                  Click to upload banner
                </span>
              </div>
            )}
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleBannerUpload}
          />

          {bannerUrl && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-success font-semibold">
                ✓ Uploaded
              </span>
              <button
                type="button"
                onClick={() => setValue("bannerUrl", "", { shouldValidate: true })}
                className="text-xs text-text-tertiary hover:text-error transition-colors"
              >
                Remove
              </button>
            </div>
          )}
          {errors.bannerUrl && (
            <p className="text-xs text-error">{errors.bannerUrl.message}</p>
          )}
          <input type="hidden" {...register("bannerUrl")} />
        </div>
      </div>
    </div>
  );
}
