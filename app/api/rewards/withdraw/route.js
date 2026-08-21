import { NextResponse } from "next/server";
import { getUserByWallet } from "@/services/auth";
import { withdrawTerr, getWithdrawalHistory } from "@/services/rewards";

/**
 * POST /api/rewards/withdraw
 * Withdraw TERR tokens to the user's connected wallet.
 */
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
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { amount } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid withdrawal amount" },
        { status: 400 }
      );
    }

    const result = await withdrawTerr(user.id, amount, walletAddress);

    return NextResponse.json({
      success: true,
      txHash: result.txHash,
      amount: result.amount,
      status: result.status,
    });
  } catch (error) {
    console.error("Withdrawal error:", error);

    // Return user-friendly error messages
    const message = error.message || "Withdrawal failed";
    const status = message.includes("Insufficient") ? 400
      : message.includes("wait 5 minutes") ? 429
      : message.includes("Minimum") ? 400
      : message.includes("not configured") ? 503
      : 500;

    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}

/**
 * GET /api/rewards/withdraw
 * Get withdrawal history for the authenticated user.
 */
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getWithdrawalHistory(user.id, { page, limit });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Withdrawal history error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch withdrawal history" },
      { status: 500 }
    );
  }
}
