import { NextResponse } from "next/server";
import { isAdmin } from "@/services/auth";
import { listAllTasks, createTask, updateTask, deleteTask } from "@/services/tasks";
import { z } from "zod";

async function checkAdmin(request) {
  const walletAddress = request.headers.get("x-wallet-address");
  if (!walletAddress) return false;
  return isAdmin(walletAddress);
}

export async function GET(request) {
  try {
    if (!(await checkAdmin(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const tasks = await listAllTasks();
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Admin tasks list error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to list tasks" },
      { status: 500 }
    );
  }
}

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  verificationMethod: z.enum(["MANUAL", "MANUAL_TELEGRAM", "LINK_CHECK", "SOCIAL_FOLLOW", "REFERRAL"]),
  rewardAmount: z.number().min(0).max(10000),
  externalUrl: z.string().url().optional().nullable().or(z.literal("")),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  category: z.string().optional().nullable(),
  requiresTelegram: z.boolean().optional(),
  active: z.boolean().optional(),
});

export async function POST(request) {
  try {
    if (!(await checkAdmin(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const data = createTaskSchema.parse(body);

    const task = await createTask(data);
    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Admin task create error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create task" },
      { status: 500 }
    );
  }
}

const updateTaskSchema = z.object({
  taskId: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  verificationMethod: z.enum(["MANUAL", "MANUAL_TELEGRAM", "LINK_CHECK", "SOCIAL_FOLLOW", "REFERRAL"]).optional(),
  rewardAmount: z.number().min(0).max(10000).optional(),
  externalUrl: z.string().url().optional().nullable().or(z.literal("")),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  category: z.string().optional().nullable(),
  requiresTelegram: z.boolean().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(request) {
  try {
    if (!(await checkAdmin(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { taskId, ...data } = updateTaskSchema.parse(body);

    const task = await updateTask(taskId, data);
    return NextResponse.json({ success: true, task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Admin task update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update task" },
      { status: 500 }
    );
  }
}

const deleteTaskSchema = z.object({
  taskId: z.string().min(1),
});

export async function DELETE(request) {
  try {
    if (!(await checkAdmin(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { taskId } = deleteTaskSchema.parse(body);

    await deleteTask(taskId);
    return NextResponse.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Admin task delete error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete task" },
      { status: 500 }
    );
  }
}
