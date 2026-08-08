import { NextResponse } from "next/server";
import { isAdmin } from "@/services/auth";
import { reviewTaskCompletion } from "@/services/tasks";
import prisma from "@/lib/prisma";

async function checkAdmin(request) {
  const walletAddress = request.headers.get("x-wallet-address");
  if (!walletAddress) return false;
  return isAdmin(walletAddress);
}

/**
 * GET /api/admin/tasks/completions
 * List all task completions, optionally filtered by status (PENDING, VERIFIED, REJECTED).
 */
export async function GET(request) {
  try {
    if (!(await checkAdmin(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    const completions = await prisma.taskCompletion.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            rewardAmount: true,
            verificationMethod: true,
          },
        },
        user: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, completions });
  } catch (error) {
    console.error("Admin completions list error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to list completions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/tasks/completions
 * Approve or reject a task completion.
 * Body: { completionId, action: "VERIFIED" | "REJECTED" }
 */
export async function POST(request) {
  try {
    if (!(await checkAdmin(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { completionId, action } = body;

    if (!completionId || !["VERIFIED", "REJECTED"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "completionId and action (VERIFIED|REJECTED) are required" },
        { status: 400 }
      );
    }

    const result = await reviewTaskCompletion(completionId, action);
    return NextResponse.json({ success: true, completion: result });
  } catch (error) {
    console.error("Admin review error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to review completion" },
      { status: 500 }
    );
  }
}
