import { z } from "zod";

/**
 * Payment verification request schema
 */
export const paymentVerifySchema = z.object({
  txHash: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash"),
  serviceType: z.enum(["VERIFICATION", "METADATA"], {
    errorMap: () => ({ message: "Service type must be VERIFICATION or METADATA" }),
  }),
  tokenId: z.string().cuid("Invalid token ID"),
});
