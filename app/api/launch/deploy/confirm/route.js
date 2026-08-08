import { NextResponse } from "next/server";
import { z } from "zod";
import { processPostDeployment } from "@/services/token-deployment";

const postDeploySchema = z.object({
  deploymentId: z.string().min(1),
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address"),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash"),
  constructorArgs: z.string().optional().default(""),
});

/**
 * POST /api/launch/deploy/confirm
 * Called after the token contract is deployed on-chain.
 * Triggers BscScan verification, metadata submission, and success email.
 */
export async function POST(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { deploymentId, contractAddress, txHash, constructorArgs } = postDeploySchema.parse(body);

    const result = await processPostDeployment(deploymentId, contractAddress, txHash, constructorArgs);

    return NextResponse.json({
      success: true,
      message: "Post-deployment processing complete",
      ...result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid request", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Post-deployment confirm error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Processing failed" },
      { status: 500 }
    );
  }
}
