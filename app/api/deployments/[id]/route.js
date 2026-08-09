import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { processPostDeployment } from "@/services/token-deployment";

/**
 * GET /api/deployments/[id]
 * Fetch deployment status and associated token details.
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ message: "Missing deployment ID" }, { status: 400 });
    }

    const deployment = await prisma.deployment.findUnique({
      where: { id },
      include: {
        token: {
          include: {
            profile: true,
            deployer: true,
            payments: true,
          },
        },
      },
    });

    if (!deployment) {
      return NextResponse.json({ message: "Deployment not found" }, { status: 404 });
    }

    return NextResponse.json({ deployment });
  } catch (error) {
    console.error("Error fetching deployment:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

const updateDeploymentSchema = z.object({
  status: z.enum(["PENDING", "SIMULATING", "DEPLOYING", "DEPLOYED", "CONFIRMED", "FAILED"]),
  txHash: z.string().optional(),
  contractAddress: z.string().optional(),
  errorMessage: z.string().optional(),
  constructorArgs: z.string().optional(),
});

/**
 * PATCH /api/deployments/[id]
 * Update deployment status (e.g., when transaction is broadcasted or confirmed).
 * When status is CONFIRMED + contractAddress is provided, triggers BscScan verification.
 */
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data = updateDeploymentSchema.parse(body);

    const existing = await prisma.deployment.findUnique({
      where: { id },
      include: { token: true },
    });

    if (!existing) {
      return NextResponse.json({ message: "Deployment not found" }, { status: 404 });
    }

    // Use transaction to update both Deployment and Token status
    const updated = await prisma.$transaction(async (tx) => {
      const dep = await tx.deployment.update({
        where: { id },
        data: {
          status: data.status,
          ...(data.txHash && { txHash: data.txHash }),
          ...(data.contractAddress && { contractAddress: data.contractAddress }),
          ...(data.errorMessage && { errorMessage: data.errorMessage }),
        },
      });

      // Update related Token status and address
      if (data.status === "CONFIRMED") {
        await tx.token.update({
          where: { id: existing.tokenId },
          data: {
            deploymentStatus: "CONFIRMED",
            ...(data.contractAddress && { contractAddress: data.contractAddress }),
            ...(data.txHash && { deploymentTxHash: data.txHash }),
          },
        });
      } else if (data.status === "DEPLOYING") {
        await tx.token.update({
          where: { id: existing.tokenId },
          data: {
            deploymentStatus: "DEPLOYING",
            ...(data.txHash && { deploymentTxHash: data.txHash }),
          },
        });
      } else if (data.status === "FAILED") {
        await tx.token.update({
          where: { id: existing.tokenId },
          data: {
            deploymentStatus: "FAILED",
          },
        });
      }

      return dep;
    });

    // ─────────────────────────────────────────────────────────────────
    // TRIGGER POST-DEPLOYMENT: BscScan verification + email
    // This runs AFTER the DB update is committed, in the background.
    // ─────────────────────────────────────────────────────────────────
    if (data.status === "CONFIRMED" && data.contractAddress && data.txHash) {
      console.log(`[Deployment] Contract confirmed at ${data.contractAddress}. Triggering post-deployment...`);
      
      // Run in background — don't block the response
      processPostDeployment(
        id,
        data.contractAddress,
        data.txHash
      ).then(result => {
        console.log("[Deployment] Post-deployment completed:", JSON.stringify(result, null, 2));
      }).catch(err => {
        console.error("[Deployment] Post-deployment error:", err);
      });
    }

    return NextResponse.json({ deployment: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid update payload", errors: error.errors }, { status: 400 });
    }
    console.error("Error updating deployment:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
