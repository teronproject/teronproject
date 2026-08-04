"use client";

import Input from "@/components/ui/Input";

/**
 * Step 2: Token Profile & Socials
 */
export default function StepProfile({ register, errors }) {
  return (
    <div className="space-y-6">
      <div className="bg-surface-tertiary border border-border-secondary p-4 rounded-md mb-8">
        <h3 className="text-sm font-semibold text-text-primary mb-1">
          Community & Trust
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Provide links to your project's website and social media. Tokens with verified
          social profiles rank higher on the Teron Leaderboard and attract more investors.
          This information is saved to your Token Profile, not the blockchain, and can
          be updated later.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Short Description
          </label>
          <textarea
            {...register("shortDescription")}
            placeholder="A one-sentence summary of your token's purpose..."
            className={`w-full h-20 p-3 bg-surface-primary border rounded text-sm text-text-primary placeholder:text-text-disabled transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none ${
              errors.shortDescription
                ? "border-error focus:ring-error"
                : "border-border-primary hover:border-border-secondary"
            }`}
          />
          {errors.shortDescription ? (
            <p className="mt-1.5 text-sm text-error">{errors.shortDescription.message}</p>
          ) : (
            <p className="mt-1.5 text-xs text-text-tertiary">
              Max 160 characters. Displayed on token cards and leaderboard previews.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-primary">
        <Input
          label="Website URL (Optional)"
          type="url"
          placeholder="https://myproject.com"
          {...register("website")}
          error={errors.website?.message}
          helperText="Link to your official project website."
        />

        <Input
          label="Twitter/X Handle (Optional)"
          placeholder="@myproject"
          {...register("twitter")}
          error={errors.twitter?.message}
          helperText="Format: @username or full URL."
        />

        <Input
          label="Telegram Group (Optional)"
          placeholder="t.me/myproject"
          {...register("telegram")}
          error={errors.telegram?.message}
          helperText="Link to your official Telegram community."
        />

        <Input
          label="Discord Invite (Optional)"
          placeholder="discord.gg/invitecode"
          {...register("discord")}
          error={errors.discord?.message}
          helperText="Permanent invite link to your Discord server."
        />
      </div>
    </div>
  );
}
