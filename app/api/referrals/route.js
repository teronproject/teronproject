import { NextResponse } from "next/server";
import { getUserReferralCode, getReferralStats } from "@/services/referrals";
import { getUserByWallet } from "@/services/auth";

export async function GET(request) {
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
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const stats = await getReferralStats(user.id);

    return NextResponse.json({
      success: true,
      ...stats,
    });
  } catch (error) {
    console.error("Referrals error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch referral data" },
      { status: 500 }
    );
  }
}
