import { NextResponse } from "next/server";
import { isAdmin } from "@/services/auth";
import { getAllPricingConfigs, setPricingConfig } from "@/services/admin";

export async function GET(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const configs = await getAllPricingConfigs();
    return NextResponse.json({ success: true, configs });
  } catch (error) {
    console.error("Admin pricing error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { serviceKey, priceBnb, priceUsd, label, active } = await request.json();

    if (!serviceKey) {
      return NextResponse.json({ message: "Missing serviceKey" }, { status: 400 });
    }

    const updated = await setPricingConfig(serviceKey, {
      ...(priceBnb !== undefined && { priceBnb }),
      ...(priceUsd !== undefined && { priceUsd }),
      ...(label !== undefined && { label }),
      ...(active !== undefined && { active }),
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (error) {
    console.error("Admin pricing update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
