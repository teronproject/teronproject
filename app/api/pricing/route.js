import { NextResponse } from "next/server";
import { getActivePricing } from "@/services/pricing";

export async function GET() {
  try {
    const pricingConfigs = await getActivePricing();
    
    // In a real app, this might come from the database config, but PRD uses ENV
    const coldWalletAddress = process.env.COLD_WALLET_ADDRESS || process.env.NEXT_PUBLIC_COLD_WALLET_ADDRESS;

    return NextResponse.json({
      success: true,
      services: pricingConfigs,
      coldWalletAddress,
    });
  } catch (error) {
    console.error("Failed to fetch pricing:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
