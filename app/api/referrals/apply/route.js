import { NextResponse } from "next/server";
import { processReferral } from "@/services/referrals";
import { getUserByWallet } from "@/services/auth";
import { z } from "zod";

const applySchema = z.object({
  referralCode: z.string().min(1, "Referral code is required"),
});

export async function POST(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress) {
      return NextResponse.json(
        { success: false, message: "Wallet address required" },
        { status: 401 }
      );
    }

    const user = await getUserByWallet(walletAddress);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found. Connect wallet first." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { referralCode } = applySchema.parse(body);

    const success = await processReferral(user.id, referralCode);

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Invalid or already used referral code" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Referral code applied successfully! TERR rewards granted.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid request", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Referral apply error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to apply referral code" },
      { status: 500 }
    );
  }
}
