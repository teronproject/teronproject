import { NextResponse } from "next/server";
import { z } from "zod";
import { tokenCreateSchema } from "@/lib/zod-schemas/token";
import { createOrResumeSession } from "@/services/auth";
import { initiateDeployment } from "@/services/token-deployment";

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const data = tokenCreateSchema.parse(body);

    // Get the address from the request headers or body.
    // In a production app, we would verify a signature or use a session cookie.
    // For this MVP, we'll assume the wallet session was created and we trust the address.
    // We should require the address to be passed in, or use a strict signed message approach.
    // Let's assume the client passes the deployerAddress, but wait, the schema doesn't have it.
    // We need to know who is deploying.
    
    // I'll extract it from an auth header if possible, or expect it in the body.
    // Wait, the UI doesn't pass the wallet address in the body right now. 
    // Let's add it to the request body in the UI, or handle it via a secure session.
    // For now, let's look for an x-wallet-address header (mock auth for Phase 1).
    const walletAddress = request.headers.get("x-wallet-address");
    
    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized. Please connect wallet." }, { status: 401 });
    }

    // Ensure user exists
    const user = await createOrResumeSession(walletAddress);

    // Initiate deployment session
    const deployment = await initiateDeployment(user.id, data);

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
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
