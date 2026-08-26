import { NextResponse } from "next/server";
import { completeTask } from "@/services/tasks";
import { getUserByWallet } from "@/services/auth";
import { z } from "zod";

const completeTaskSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  proof: z.string().optional().nullable(),
  telegramUsername: z.string().optional().nullable(),
});

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
        { success: false, message: "User not found. Connect wallet first." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { taskId, proof, telegramUsername } = completeTaskSchema.parse(body);

    const completion = await completeTask(user.id, taskId, proof, telegramUsername);

    return NextResponse.json({
      success: true,
      completion: {
        id: completion.id,
        status: completion.status,
        telegramUsername: completion.telegramUsername,
        verifiedAt: completion.verifiedAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid request", errors: error.errors },
        { status: 400 }
      );
    }

    const message = error.message || "Failed to complete task";
    const isUserError = [
      "Task not found",
      "Task is no longer active",
      "Task already completed and verified",
      "Task completion is pending review",
      "Telegram username is required to complete this task.",
    ].includes(message);

    return NextResponse.json(
      { success: false, message },
      { status: isUserError ? 400 : 500 }
    );
  }
}
