import { NextResponse } from "next/server";
import { listTasks } from "@/services/tasks";
import { getUserByWallet } from "@/services/auth";

export async function GET(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    let userId = null;

    if (walletAddress) {
      const user = await getUserByWallet(walletAddress);
      userId = user?.id || null;
    }

    const tasks = await listTasks(userId);

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Tasks list error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load tasks" },
      { status: 500 }
    );
  }
}
