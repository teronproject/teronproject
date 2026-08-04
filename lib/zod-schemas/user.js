import { z } from "zod";

/**
 * User profile update schema
 */
export const userProfileSchema = z.object({
  displayName: z
    .string()
    .max(50, "Display name must be 50 characters or fewer")
    .optional()
    .or(z.literal("")),
  avatar: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

/**
 * Wallet address validation
 */
export const walletAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address");
