"use client";

import { useWallet } from "@/hooks/useWallet";

/**
 * Step 4: Final Review & Deploy
 */
export default function StepReview({ getValues }) {
  const { address } = useWallet();
  const values = getValues();

  return (
    <div className="space-y-8">
      <div className="bg-warning-subtle border border-warning/30 p-4 rounded-md">
        <h3 className="text-sm font-semibold text-warning mb-1">
          Final Review
        </h3>
        <p className="text-xs text-warning/90 leading-relaxed">
          Please review your token details carefully. Once you click "Deploy", a transaction
          will be sent to the BNB Chain. <strong>Smart contracts are immutable</strong> — you will not
          be able to change the Name, Symbol, Decimals, or Initial Supply after deployment.
        </p>
      </div>

      <div className="bg-surface-primary border border-border-primary rounded-lg overflow-hidden">
        {/* Banner & Logo Preview */}
        <div className="h-24 bg-surface-tertiary relative border-b border-border-primary">
          {values.bannerUrl && (
            <img src={values.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          )}
          <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-full border-4 border-surface-primary bg-bg-secondary overflow-hidden">
            {values.logoUrl ? (
              <img src={values.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl opacity-20">📷</div>
            )}
          </div>
        </div>

        <div className="p-6 pt-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-primary">
              {values.name || "Token Name"} <span className="text-text-tertiary font-normal">({values.symbol || "SYMBOL"})</span>
            </h2>
            {values.shortDescription && (
              <p className="text-sm text-text-secondary mt-1 max-w-lg">
                {values.shortDescription}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1 py-3 border-t border-border-secondary">
              <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Decimals</span>
              <p className="text-sm text-text-primary font-medium">{values.decimals}</p>
            </div>
            
            <div className="space-y-1 py-3 border-t border-border-secondary">
              <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Initial Supply</span>
              <p className="text-sm text-text-primary font-medium">{values.totalSupply || "0"}</p>
            </div>

            <div className="space-y-1 py-3 border-t border-border-secondary md:col-span-2">
              <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Deployer Wallet</span>
              <p className="text-sm text-text-primary font-mono">{address || "Not connected"}</p>
            </div>
            
            {(values.website || values.twitter || values.telegram || values.discord) && (
              <div className="space-y-2 py-3 border-t border-border-secondary md:col-span-2">
                <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Linked Socials</span>
                <div className="flex flex-wrap gap-4 text-sm text-accent">
                  {values.website && <span className="truncate max-w-[150px]">{values.website}</span>}
                  {values.twitter && <span className="truncate max-w-[150px]">{values.twitter}</span>}
                  {values.telegram && <span className="truncate max-w-[150px]">{values.telegram}</span>}
                  {values.discord && <span className="truncate max-w-[150px]">{values.discord}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
