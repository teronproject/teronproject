import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { tokenId, txHash } = await request.json();
    const walletAddress = request.headers.get("x-wallet-address");

    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!tokenId || !txHash) {
      return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
    }

    // In a production app, we would verify the transaction hash via RPC 
    // to ensure the funds were actually sent to our COLD_WALLET_ADDRESS and the amount was correct.
    // For this MVP Phase 1, we trust the client's confirmation.

    // Update pending payments for this token
    await prisma.payment.updateMany({
      where: {
        tokenId: tokenId,
        status: "PENDING",
        user: { walletAddress },
      },
      data: {
        status: "CONFIRMED",
        txHash: txHash,
      },
    });

    // Update Token verification/metadata statuses
    const updatedPayments = await prisma.payment.findMany({
      where: { tokenId, txHash }
    });

    for (const payment of updatedPayments) {
      if (payment.serviceType === "VERIFICATION") {
        await prisma.token.update({
          where: { id: tokenId },
          data: { verificationStatus: "PENDING" } // Enters queue
        });
      }
      if (payment.serviceType === "METADATA") {
        await prisma.token.update({
          where: { id: tokenId },
          data: { metadataStatus: "PENDING" } // Enters queue
        });
      }
    }

    return NextResponse.json({ success: true, message: "Payments confirmed." });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
