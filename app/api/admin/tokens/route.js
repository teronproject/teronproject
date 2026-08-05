import { NextResponse } from "next/server";
import { isAdmin } from "@/services/auth";
import { getAdminTokenList, updateTokenVerificationStatus, updateTokenMetadataStatus } from "@/services/admin";

export async function GET(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || "";

    const result = await getAdminTokenList({ page, limit, status, search });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Admin tokens error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { tokenId, action, status } = await request.json();

    if (!tokenId || !action) {
      return NextResponse.json({ message: "Missing tokenId or action" }, { status: 400 });
    }

    if (action === "verification") {
      await updateTokenVerificationStatus(tokenId, status);
    } else if (action === "metadata") {
      await updateTokenMetadataStatus(tokenId, status);
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin token update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
