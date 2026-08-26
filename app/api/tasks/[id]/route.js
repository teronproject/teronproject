import { NextResponse } from "next/server";
import { getTaskById } from "@/services/tasks";
import { getUserByWallet } from "@/services/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: "Task ID required" }, { status: 400 });
    }

    const walletAddress = request.headers.get("x-wallet-address");
    let userId = null;
    if (walletAddress) {
      const user = await getUserByWallet(walletAddress);
      userId = user?.id || null;
    }

    const task = await getTaskById(id, userId);
    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Task detail error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load task details" },
      { status: 500 }
    );
  }
}
