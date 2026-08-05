"use client";

import Input from "@/components/ui/Input";

/**
 * Step 1: Basic Token Info
 */
export default function StepBasicInfo({ register, errors, setValue }) {
  return (
    <div className="space-y-6">
      <div className="bg-accent/5 border border-accent/20 p-5 rounded-xl flex items-start gap-4 mb-6 shadow-sm card">
        <div>
          <h3 className="text-sm title text-text-primary mb-1 tracking-wide">
            Smart Contract Fundamentals
          </h3>
          <p className="text-xs text-text-tertiary text-balance leading-relaxed">
            These details are permanently written to the blockchain when you deploy.
            Ensure you double-check your Token Name, Symbol, and Supply, as they
            cannot be altered later.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Token Name"
            placeholder="e.g. Teron Network"
            {...register("name")}
            error={errors.name?.message}
            helperText="The full, displayable name of your token. Usually 3-20 characters."
            maxLength={50}
          />
        </div>

        <div>
          <Input
            label="Token Symbol"
            placeholder="e.g. TERR"
            {...register("symbol")}
            error={errors.symbol?.message}
            helperText="The ticker symbol. Keep it short (2-6 characters) and memorable."
            maxLength={10}
            onChange={(e) => {
              // Auto-uppercase symbol
              e.target.value = e.target.value.toUpperCase();
              register("symbol").onChange(e);
            }}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Decimals"
            type="number"
            placeholder="18"
            {...register("decimals", { valueAsNumber: true })}
            error={errors.decimals?.message}
            helperText="How divisible the token is. 18 is the standard for BNB Chain tokens."
            min={0}
            max={18}
          />
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setValue("decimals", 18, { shouldValidate: true })}
              className="text-xs px-2.5 py-1 rounded bg-surface-secondary border border-border-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
            >
              18 (Standard)
            </button>
            <button
              type="button"
              onClick={() => setValue("decimals", 9, { shouldValidate: true })}
              className="text-xs px-2.5 py-1 rounded bg-surface-secondary border border-border-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
            >
              9 (Meme/Deflationary)
            </button>
            <button
              type="button"
              onClick={() => setValue("decimals", 0, { shouldValidate: true })}
              className="text-xs px-2.5 py-1 rounded bg-surface-secondary border border-border-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
            >
              0 (Indivisible)
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <Input
            label="Initial Supply"
            type="text"
            placeholder="e.g. 1000000"
            {...register("totalSupply")}
            error={errors.totalSupply?.message}
            helperText="The total number of tokens to mint initially. Do not include commas."
          />
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setValue("totalSupply", "1000000", { shouldValidate: true })}
              className="text-xs px-2.5 py-1 rounded bg-surface-secondary border border-border-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
            >
              1M
            </button>
            <button
              type="button"
              onClick={() => setValue("totalSupply", "10000000", { shouldValidate: true })}
              className="text-xs px-2.5 py-1 rounded bg-surface-secondary border border-border-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
            >
              10M
            </button>
            <button
              type="button"
              onClick={() => setValue("totalSupply", "1000000000", { shouldValidate: true })}
              className="text-xs px-2.5 py-1 rounded bg-surface-secondary border border-border-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
            >
              1B
            </button>
            <button
              type="button"
              onClick={() => setValue("totalSupply", "1000000000000", { shouldValidate: true })}
              className="text-xs px-2.5 py-1 rounded bg-surface-secondary border border-border-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
            >
              1T (Meme Coin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
