import { NextResponse } from "next/server";
import { isAdmin } from "@/services/auth";
import { getAdminUserList } from "@/services/admin";

export async function GET(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || "";

    const result = await getAdminUserList({ page, limit, search });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
