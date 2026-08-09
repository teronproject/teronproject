import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processPostDeployment } from "@/services/token-deployment";
import { sendPaymentInvoiceEmail } from "@/services/email";

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

    // Get token info and updated payments
    const token = await prisma.token.findUnique({
      where: { id: tokenId },
      include: { profile: true, deployer: true },
    });

    const updatedPayments = await prisma.payment.findMany({
      where: { tokenId, txHash }
    });

    // Update Token verification/metadata statuses
    for (const payment of updatedPayments) {
      if (payment.serviceType === "VERIFICATION") {
        await prisma.token.update({
          where: { id: tokenId },
          data: { verificationStatus: "PENDING" }
        });
      }
      if (payment.serviceType === "METADATA") {
        await prisma.token.update({
          where: { id: tokenId },
          data: { metadataStatus: "PENDING" }
        });
      }
    }

    // Send payment invoice email
    const contactEmail = token?.profile?.contactEmail || token?.deployer?.email;
    if (contactEmail && updatedPayments.length > 0) {
      const services = updatedPayments.map(p => ({
        name: p.serviceType === "VERIFICATION" ? "Contract Verification" : "On-Chain Logo & Info",
        amountBnb: p.amountBnb,
      }));
      const totalBnb = updatedPayments.reduce((acc, p) => acc + p.amountBnb, 0);

      sendPaymentInvoiceEmail({
        to: contactEmail,
        tokenName: token.name,
        symbol: token.symbol,
        services,
        totalBnb,
        paymentTxHash: txHash,
        walletAddress,
      }).catch(err => console.error("Invoice email error:", err));
    }

    // If the contract is already deployed, trigger verification now
    if (token?.contractAddress) {
      const deployment = await prisma.deployment.findFirst({
        where: { tokenId, status: "CONFIRMED" },
      });

      if (deployment) {
        console.log("[PaymentConfirm] Contract already deployed, triggering post-deployment...");
        processPostDeployment(
          deployment.id,
          token.contractAddress,
          deployment.txHash
        ).then(result => {
          console.log("[PaymentConfirm] Post-deployment completed:", JSON.stringify(result));
        }).catch(err => {
          console.error("[PaymentConfirm] Post-deployment error:", err);
        });
      }
    }

    return NextResponse.json({ success: true, message: "Payments confirmed." });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
