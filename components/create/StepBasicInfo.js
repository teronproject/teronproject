"use client";

import Input from "@/components/ui/Input";
import { Settings02Icon } from "hugeicons-react";

/**
 * Step 1: Basic Token Info
 */
export default function StepBasicInfo({ register, errors }) {
  return (
    <div className="space-y-6">
      <div className="bg-surface-tertiary border border-border-secondary p-5 rounded-xl flex items-start gap-4">
        <div className="mt-0.5">
          <Settings02Icon className="text-accent" variant="stroke-rounded" size={24} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            Smart Contract Fundamentals
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
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

        <div>
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
        </div>

        <div className="md:col-span-2">
          <Input
            label="Initial Supply"
            type="text"
            placeholder="e.g. 1000000"
            {...register("totalSupply")}
            error={errors.totalSupply?.message}
            helperText="The total number of tokens to mint initially. Do not include commas."
          />
        </div>
      </div>
    </div>
  );
}
