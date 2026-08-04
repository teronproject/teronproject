import { z } from "zod";

/**
 * Common schemas shared across domains.
 */

/** Pagination query parameters */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

/** Sort parameters */
export const sortSchema = z.object({
  sortBy: z.string().optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

/** ID parameter */
export const idParamSchema = z.object({
  id: z.string().cuid("Invalid ID"),
});

/** BNB assistance request schema */
export const assistanceRequestSchema = z.object({
  description: z
    .string()
    .min(10, "Please describe your request in at least 10 characters")
    .max(2000, "Description must be 2000 characters or fewer"),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  contactEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
});
