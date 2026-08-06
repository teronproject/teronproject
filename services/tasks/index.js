import prisma from "@/lib/prisma";
import { grantReward } from "@/services/rewards";

/**
 * Tasks Service
 *
 * Owns: Task definitions, completion verification, reward distribution for tasks.
 */

/**
 * List all active tasks with the current user's completion status.
 * @param {string|null} userId - If provided, includes completion status per task
 * @returns {Promise<object[]>}
 */
export async function listTasks(userId = null) {
  const tasks = await prisma.task.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { completions: true },
      },
      ...(userId
        ? {
            completions: {
              where: { userId },
              select: { id: true, status: true, createdAt: true, verifiedAt: true },
            },
          }
        : {}),
    },
  });

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    verificationMethod: task.verificationMethod,
    rewardAmount: task.rewardAmount,
    externalUrl: task.externalUrl,
    totalCompletions: task._count.completions,
    createdAt: task.createdAt,
    // User-specific
    userCompletion: userId ? task.completions?.[0] || null : null,
  }));
}

/**
 * Submit a task completion.
 * @param {string} userId
 * @param {string} taskId
 * @param {string|null} proof - Optional proof (URL, screenshot, etc.)
 * @returns {Promise<object>} The created TaskCompletion
 */
export async function completeTask(userId, taskId, proof = null) {
  // Check task exists and is active
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");
  if (!task.active) throw new Error("Task is no longer active");

  // Check if already completed
  const existing = await prisma.taskCompletion.findUnique({
    where: { userId_taskId: { userId, taskId } },
  });
  if (existing) {
    if (existing.status === "VERIFIED") throw new Error("Task already completed and verified");
    if (existing.status === "PENDING") throw new Error("Task completion is pending review");
    // If REJECTED, allow re-submission
  }

  // Determine initial status based on verification method
  let initialStatus = "PENDING";

  if (task.verificationMethod === "LINK_CHECK") {
    // Auto-verify LINK_CHECK tasks — user just needs to visit the URL
    initialStatus = "VERIFIED";
  }

  // Upsert (allows re-submission after rejection)
  const completion = await prisma.taskCompletion.upsert({
    where: { userId_taskId: { userId, taskId } },
    create: {
      userId,
      taskId,
      status: initialStatus,
      proof,
      ...(initialStatus === "VERIFIED" ? { verifiedAt: new Date() } : {}),
    },
    update: {
      status: initialStatus,
      proof,
      rejectedAt: null,
      ...(initialStatus === "VERIFIED" ? { verifiedAt: new Date() } : {}),
    },
  });

  // If auto-verified, grant reward immediately
  if (initialStatus === "VERIFIED") {
    try {
      await grantReward(userId, task.rewardAmount, "TASK", null, taskId);
    } catch (err) {
      console.error("Failed to grant task reward:", err);
    }
  }

  return completion;
}

/**
 * Get all task completions for a user.
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
export async function getTaskCompletions(userId) {
  return prisma.taskCompletion.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      task: {
        select: { title: true, rewardAmount: true, verificationMethod: true },
      },
    },
  });
}

// ===================== Admin Functions =====================

/**
 * List all tasks (admin view - includes inactive).
 * @returns {Promise<object[]>}
 */
export async function listAllTasks() {
  return prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { completions: true },
      },
    },
  });
}

/**
 * Create a new task.
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function createTask(data) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      verificationMethod: data.verificationMethod || "MANUAL",
      rewardAmount: data.rewardAmount || 10,
      active: data.active !== false,
      externalUrl: data.externalUrl || null,
    },
  });
}

/**
 * Update a task.
 * @param {string} taskId
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function updateTask(taskId, data) {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.verificationMethod !== undefined && { verificationMethod: data.verificationMethod }),
      ...(data.rewardAmount !== undefined && { rewardAmount: data.rewardAmount }),
      ...(data.active !== undefined && { active: data.active }),
      ...(data.externalUrl !== undefined && { externalUrl: data.externalUrl }),
    },
  });
}

/**
 * Admin: verify or reject a task completion.
 * @param {string} completionId
 * @param {"VERIFIED"|"REJECTED"} status
 */
export async function reviewTaskCompletion(completionId, status) {
  const completion = await prisma.taskCompletion.findUnique({
    where: { id: completionId },
    include: { task: true },
  });

  if (!completion) throw new Error("Completion not found");
  if (completion.status === "VERIFIED") throw new Error("Already verified");

  const updated = await prisma.taskCompletion.update({
    where: { id: completionId },
    data: {
      status,
      ...(status === "VERIFIED" ? { verifiedAt: new Date() } : { rejectedAt: new Date() }),
    },
  });

  // Grant reward if verified
  if (status === "VERIFIED") {
    try {
      await grantReward(completion.userId, completion.task.rewardAmount, "TASK", null, completion.taskId);
    } catch (err) {
      console.error("Failed to grant task reward on admin review:", err);
    }
  }

  return updated;
}
