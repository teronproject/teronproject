import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createOrResumeSession } from "@/services/auth";
import { sendAssistanceAdminEmail, sendAssistanceUserEmail } from "@/services/email";
import { logEvent } from "@/services/monitoring";

const requestSchema = z.object({
  telegram: z.string().min(3, "Telegram username must be at least 3 characters").max(32),
  contactEmail: z.string().email("Valid email required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  totalBnbCost: z.number().min(0),
  tokenData: z.any().optional(),
});

export async function POST(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized. Please connect wallet." }, { status: 401 });
    }

    const body = await request.json();
    const data = requestSchema.parse(body);

    if (data.totalBnbCost > 0) {
      return NextResponse.json(
        { message: "Assistance is only available for base gas fees. Please deselect premium add-ons." },
        { status: 400 }
      );
    }

    const user = await createOrResumeSession(walletAddress);

    const assistanceReq = await prisma.assistanceRequest.create({
      data: {
        userId: user.id,
        walletAddress: user.walletAddress,
        contactEmail: data.contactEmail,
        description: data.description,
        tokenData: { ...(data.tokenData || {}), assistanceTelegram: data.telegram },
        status: "PENDING",
      },
    });

    // Send emails (fire and forget)
    sendAssistanceAdminEmail({
      email: data.contactEmail,
      telegram: data.telegram,
      walletAddress: user.walletAddress,
      description: data.description,
      totalBnbCost: data.totalBnbCost,
    }).catch(console.error);

    sendAssistanceUserEmail({
      email: data.contactEmail,
      telegram: data.telegram,
    }).catch(console.error);

    return NextResponse.json({ success: true, message: "Assistance request submitted", requestId: assistanceReq.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid payload", errors: error.errors }, { status: 400 });
    }
    
    logEvent({
      type: "API_EXCEPTION",
      severity: "MEDIUM",
      message: error.message || "Error submitting assistance request",
      stackTrace: error.stack,
    });
    
    console.error("Assistance request error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
