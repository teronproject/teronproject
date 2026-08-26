import { NextResponse } from "next/server";
import { isAdmin } from "@/services/auth";
import { reviewTaskCompletion } from "@/services/tasks";
import prisma from "@/lib/prisma";

async function checkAdmin(request) {
  const walletAddress = request.headers.get("x-wallet-address");
  if (!walletAddress) return false;
  return isAdmin(walletAddress);
}

const META_REGEX = /<!--teron_task_meta:([\s\S]*?)-->/;

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
            description: true,
            rewardAmount: true,
            verificationMethod: true,
            externalUrl: true,
          },
        },
        user: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
            avatar: true,
            telegram: true,
          },
        },
      },
    });

    const formatted = completions.map((c) => {
      // Extract telegram handle from proof string or user profile
      let tg = c.user?.telegram || null;
      if (c.proof && c.proof.includes("Telegram: ")) {
        tg = c.proof.replace("Telegram: ", "").trim();
      }

      let imageUrl = null;
      let requiresTelegram = false;
      let cleanDesc = c.task?.description || "";

      if (cleanDesc) {
        const match = cleanDesc.match(META_REGEX);
        if (match) {
          try {
            const parsed = JSON.parse(match[1]);
            if (parsed.imageUrl) imageUrl = parsed.imageUrl;
            if (parsed.requiresTelegram) requiresTelegram = true;
          } catch (_) {}
          cleanDesc = cleanDesc.replace(META_REGEX, "").trim();
        }
      }

      if (!requiresTelegram && c.task?.externalUrl && c.task.externalUrl.includes("t.me")) {
        requiresTelegram = true;
      }

      return {
        ...c,
        telegramUsername: tg,
        task: {
          ...c.task,
          description: cleanDesc,
          imageUrl,
          thumbnailUrl: imageUrl,
          requiresTelegram,
          verificationMethod: requiresTelegram ? "MANUAL_TELEGRAM" : c.task?.verificationMethod,
        },
      };
    });

    return NextResponse.json({ success: true, completions: formatted });
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
 * Body: { completionId, action: "VERIFIED" | "REJECTED", adminNotes?: string }
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
