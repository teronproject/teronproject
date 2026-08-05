"use client";

import { useRef } from "react";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { useWallet } from "@/hooks/useWallet";
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return;
    const url = await uploadLogo(file);
    if (url) setValue("logoUrl", url, { shouldValidate: true });
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    const url = await uploadBanner(file);
    if (url) setValue("bannerUrl", url, { shouldValidate: true });
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
              <div className="text-center">
                <span className="block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                <span className="text-xs text-text-tertiary mt-1 block">
                  {logoProgress}%
                </span>
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
            Recommended: 1500×500px, JPG or PNG. Max 5MB. Appears at the top of
            your token's public profile page.
          </p>
        </div>

        <div className="space-y-4">
          <div
            onClick={() => bannerInputRef.current?.click()}
            className="w-full h-32 rounded-lg border-2 border-dashed border-border-secondary bg-surface-primary flex items-center justify-center overflow-hidden cursor-pointer hover:border-accent transition-colors group"
          >
            {isBannerUploading ? (
              <div className="text-center">
                <span className="block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                <span className="text-xs text-text-tertiary mt-2 block">
                  Uploading... {bannerProgress}%
                </span>
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
