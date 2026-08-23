import { NextResponse } from "next/server";
import { getRewardHistory } from "@/services/rewards";
import { getUserByWallet, createOrResumeSession } from "@/services/auth";

export async function GET(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress) {
      return NextResponse.json(
        { success: false, message: "Wallet address required" },
        { status: 401 }
      );
    }

    let user = await getUserByWallet(walletAddress);
    if (!user) {
      user = await createOrResumeSession(walletAddress);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getRewardHistory(user.id, { page, limit });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Rewards balance error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch rewards" },
      { status: 500 }
    );
  }
}
