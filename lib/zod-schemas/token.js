import { z } from "zod";
import {
  TOKEN_NAME_MIN_LENGTH,
  TOKEN_NAME_MAX_LENGTH,
  TOKEN_SYMBOL_MIN_LENGTH,
  TOKEN_SYMBOL_MAX_LENGTH,
  MIN_DECIMALS,
  MAX_DECIMALS,
} from "@/lib/constants";

/**
 * Token creation wizard — step 1: Basic info
 */
export const tokenBasicInfoSchema = z.object({
  name: z
    .string()
    .min(TOKEN_NAME_MIN_LENGTH, "Token name is required")
    .max(TOKEN_NAME_MAX_LENGTH, `Token name must be ${TOKEN_NAME_MAX_LENGTH} characters or fewer`)
    .regex(/^[a-zA-Z0-9\s]+$/, "Token name can only contain letters, numbers, and spaces"),
  symbol: z
    .string()
    .min(TOKEN_SYMBOL_MIN_LENGTH, "Token symbol is required")
    .max(TOKEN_SYMBOL_MAX_LENGTH, `Token symbol must be ${TOKEN_SYMBOL_MAX_LENGTH} characters or fewer`)
    .regex(/^[A-Z0-9]+$/, "Token symbol must be uppercase letters and numbers only"),
  decimals: z.coerce
    .number()
    .int("Decimals must be a whole number")
    .min(MIN_DECIMALS, `Decimals must be at least ${MIN_DECIMALS}`)
    .max(MAX_DECIMALS, `Decimals must be at most ${MAX_DECIMALS}`),
  totalSupply: z
    .string()
    .min(1, "Total supply is required")
    .regex(/^\d+$/, "Total supply must be a positive whole number")
    .refine((val) => BigInt(val) > 0n, "Total supply must be greater than 0"),
});

/**
 * Token creation wizard — step 2: Description & socials
 */
export const tokenSocialsSchema = z.object({
  shortDescription: z
    .string()
    .max(160, "Short description must be 160 characters or fewer")
    .optional()
    .default(""),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .default(""),
  website: z
    .string()
    .url("Must be a valid URL")
    .regex(/^https?:\/\//i, "Website must start with http:// or https://")
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url("Must be a valid URL")
    .regex(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i, "Must be a valid X (Twitter) URL")
    .optional()
    .or(z.literal("")),
  telegram: z
    .string()
    .url("Must be a valid URL")
    .regex(/^https?:\/\/(www\.)?(t\.me|telegram\.me)\//i, "Must be a valid Telegram URL")
    .optional()
    .or(z.literal("")),
  discord: z
    .string()
    .url("Must be a valid URL")
    .regex(/^https?:\/\/(www\.)?(discord\.gg|discord\.com)\//i, "Must be a valid Discord URL")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("Must be a valid URL")
    .regex(/^https?:\/\/(www\.)?github\.com\//i, "Must be a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  projectCategory: z.string().optional().default(""),
  contactEmail: z
    .string()
    .email("Must be a valid email")
    .optional()
    .or(z.literal("")),
});

/**
 * Token creation wizard — step 3: Media
 */
export const tokenMediaSchema = z.object({
  logoUrl: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  bannerUrl: z.string().url("Invalid banner URL").optional().or(z.literal("")),
});

/**
 * Full token creation schema (all steps combined)
 */
export const tokenCreateSchema = tokenBasicInfoSchema
  .merge(tokenSocialsSchema)
  .merge(tokenMediaSchema)
  .extend({
    chain: z.string().optional().default("BSC"),
    addVerification: z.boolean().optional().default(false),
    addMetadata: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.addVerification) {
      if (!data.projectCategory || data.projectCategory.length === 0) {
        ctx.addIssue({
          path: ["projectCategory"],
          message: "Category is required for verification",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.contactEmail || data.contactEmail.length === 0) {
        ctx.addIssue({
          path: ["contactEmail"],
          message: "Contact email is required for verification",
          code: z.ZodIssueCode.custom,
        });
      }
    }
    
    if (data.addMetadata) {
      if (!data.logoUrl || data.logoUrl.length === 0) {
        ctx.addIssue({
          path: ["logoUrl"],
          message: "Logo URL is required for on-chain metadata",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.website || data.website.length === 0) {
        ctx.addIssue({
          path: ["website"],
          message: "Website is required for on-chain metadata",
          code: z.ZodIssueCode.custom,
        });
      }
      // Require at least one social
      if (!data.twitter && !data.telegram && !data.discord) {
        ctx.addIssue({
          path: ["twitter"],
          message: "At least one social link is required (Twitter, Telegram, or Discord)",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

/**
 * Token deployment request
 */
export const tokenDeploySchema = z.object({
  tokenId: z.string().cuid("Invalid token ID"),
});

/**
 * Token simulation request
 */
export const tokenSimulateSchema = z.object({
  tokenId: z.string().cuid("Invalid token ID"),
});
