"use client";

import { useCallback } from "react";
import Button from "@/components/ui/Button";

/**
 * Step 3: Media Uploads
 */
export default function StepMedia({ register, errors, watch, setValue }) {
  const logoUrl = watch("logoUrl");
  const bannerUrl = watch("bannerUrl");

  // In a real implementation, this would upload to Cloudinary.
  // For Phase 1 / early implementation, we'll simulate an upload by asking for URLs
  // or hooking up a mock upload handler.
  // Let's implement URL inputs for now, with heavy context on what to provide.

  return (
    <div className="space-y-8">
      <div className="bg-surface-tertiary border border-border-secondary p-4 rounded-md">
        <h3 className="text-sm font-semibold text-text-primary mb-1">
          Visual Identity
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Your token's branding is the first thing investors see. High-quality, properly
          sized images make your project look professional and trustworthy.
        </p>
      </div>

      {/* Logo Upload Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-text-primary">Token Logo</h4>
          <p className="text-xs text-text-tertiary mt-1">
            Recommended: 512x512px, PNG or SVG. Max 2MB. A square image with a transparent or solid background.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-border-secondary bg-surface-primary flex items-center justify-center overflow-hidden shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl opacity-20">📷</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="url"
              {...register("logoUrl")}
              placeholder="https://example.com/logo.png"
              className={`w-full h-10 px-3 bg-surface-primary border rounded text-sm text-text-primary placeholder:text-text-disabled transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.logoUrl ? "border-error focus:ring-error" : "border-border-primary"
              }`}
            />
            {errors.logoUrl && (
              <p className="text-xs text-error">{errors.logoUrl.message}</p>
            )}
            <p className="text-xs text-text-tertiary">
              For this beta, paste a direct URL to your logo image.
            </p>
          </div>
        </div>
      </div>

      <hr className="border-border-primary" />

      {/* Banner Upload Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-text-primary">Profile Banner (Optional)</h4>
          <p className="text-xs text-text-tertiary mt-1">
            Recommended: 1500x500px, JPG or PNG. Max 5MB. Appears at the top of your token's page.
          </p>
        </div>

        <div className="space-y-4">
          <div className="w-full h-32 rounded-lg border-2 border-dashed border-border-secondary bg-surface-primary flex items-center justify-center overflow-hidden">
            {bannerUrl ? (
              <img src={bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl opacity-20">🖼️</span>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="url"
              {...register("bannerUrl")}
              placeholder="https://example.com/banner.jpg"
              className={`w-full h-10 px-3 bg-surface-primary border rounded text-sm text-text-primary placeholder:text-text-disabled transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.bannerUrl ? "border-error focus:ring-error" : "border-border-primary"
              }`}
            />
            {errors.bannerUrl && (
              <p className="text-xs text-error">{errors.bannerUrl.message}</p>
            )}
            <p className="text-xs text-text-tertiary">
              Paste a direct URL to your banner image.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
