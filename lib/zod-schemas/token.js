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
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .default(""),
  website: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  telegram: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  discord: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("Must be a valid URL")
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
  .merge(tokenMediaSchema);

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
