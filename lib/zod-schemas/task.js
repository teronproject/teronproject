import { z } from "zod";

/**
 * Task completion submission schema
 */
export const taskCompleteSchema = z.object({
  taskId: z.string().cuid("Invalid task ID"),
  proof: z
    .string()
    .max(500, "Proof must be 500 characters or fewer")
    .optional()
    .default(""),
});

/**
 * Admin task creation/update schema
 */
export const taskAdminSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Task title must be 200 characters or fewer"),
  description: z
    .string()
    .min(1, "Task description is required")
    .max(2000, "Task description must be 2000 characters or fewer"),
  verificationMethod: z.enum(
    ["MANUAL", "LINK_CHECK", "SOCIAL_FOLLOW", "REFERRAL"],
    { errorMap: () => ({ message: "Invalid verification method" }) }
  ),
  rewardAmount: z.coerce
    .number()
    .positive("Reward amount must be positive")
    .max(1000000, "Reward amount exceeds maximum"),
  active: z.boolean().default(true),
  externalUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});
