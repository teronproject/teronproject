import { NextResponse } from "next/server";
import { z } from "zod";
import { tokenCreateSchema } from "@/lib/zod-schemas/token";
import { createOrResumeSession } from "@/services/auth";
import { initiateDeployment } from "@/services/token-deployment";

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Extract payment tx hash before validation (it's not part of the token schema)
    const { paymentTxHash, ...tokenData } = body;

    // Validate the token data
    const data = tokenCreateSchema.parse(tokenData);

    const walletAddress = request.headers.get("x-wallet-address");
    
    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized. Please connect wallet." }, { status: 401 });
    }

    // Ensure user exists
    const user = await createOrResumeSession(walletAddress);

    // Initiate deployment session with payment tx hash
    const deployment = await initiateDeployment(user.id, data, paymentTxHash || null);

    return NextResponse.json({
      message: "Deployment initiated",
      deploymentId: deployment.id,
      tokenId: deployment.tokenId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid payload", errors: error.errors }, { status: 400 });
    }
    console.error("Token creation error:", error);
    
    // Log to central monitoring
    import("@/services/monitoring").then(({ logEvent }) => {
      const walletAddress = request.headers.get("x-wallet-address");
      logEvent({
        type: "DEPLOYMENT_FAILURE",
        severity: "HIGH",
        message: error.message || "Internal server error during token launch",
        stackTrace: error.stack,
        metadata: { walletAddress },
      });
    }).catch(e => console.error("Failed to load monitoring service", e));

    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
