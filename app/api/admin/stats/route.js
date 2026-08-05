import { NextResponse } from "next/server";
import { isAdmin } from "@/services/auth";
import { getPlatformStats } from "@/services/admin";

export async function GET(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const stats = await getPlatformStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
