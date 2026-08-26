import prisma from "@/lib/prisma";
import { grantReward } from "@/services/rewards";

/**
 * Tasks Service
 *
 * Owns: Task definitions, completion verification, reward distribution for tasks.
 */

function toDbVerificationMethod(method) {
  if (method === "MANUAL_TELEGRAM") return "MANUAL";
  if (["MANUAL", "LINK_CHECK", "SOCIAL_FOLLOW", "REFERRAL"].includes(method)) {
    return method;
  }
  return "MANUAL";
}

function formatTaskPayload(task) {
  if (!task) return null;
  const isTg =
    task.requireTelegram === true ||
    task.requiresTelegram === true ||
    task.category === "TELEGRAM" ||
    (task.externalUrl && task.externalUrl.includes("t.me"));

  const img = task.thumbnailUrl || task.imageUrl || null;

  return {
    ...task,
    imageUrl: img,
    thumbnailUrl: img,
    verificationMethod: isTg ? "MANUAL_TELEGRAM" : task.verificationMethod,
    requiresTelegram: isTg,
    requireTelegram: isTg,
  };
}

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
              select: {
                id: true,
                status: true,
                proof: true,
                createdAt: true,
                verifiedAt: true,
              },
            },
          }
        : {}),
    },
  });

  return tasks.map((task) => {
    const formatted = formatTaskPayload(task);
    return {
      id: formatted.id,
      title: formatted.title,
      description: formatted.description,
      verificationMethod: formatted.verificationMethod,
      rewardAmount: formatted.rewardAmount,
      externalUrl: formatted.externalUrl,
      imageUrl: formatted.imageUrl,
      thumbnailUrl: formatted.thumbnailUrl,
      category: formatted.category || (formatted.requireTelegram ? "TELEGRAM" : "COMMUNITY"),
      requiresTelegram: formatted.requireTelegram,
      requireTelegram: formatted.requireTelegram,
      totalCompletions: task._count?.completions || 0,
      createdAt: formatted.createdAt,
      // User-specific
      userCompletion: userId ? task.completions?.[0] || null : null,
    };
  });
}

/**
 * Get a single task by ID (for public / shareable pages).
 * @param {string} taskId
 * @param {string|null} userId
 * @returns {Promise<object|null>}
 */
export async function getTaskById(taskId, userId = null) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      _count: {
        select: { completions: true },
      },
      ...(userId
        ? {
            completions: {
              where: { userId },
              select: {
                id: true,
                status: true,
                proof: true,
                createdAt: true,
                verifiedAt: true,
              },
            },
          }
        : {}),
    },
  });

  if (!task) return null;

  const formatted = formatTaskPayload(task);

  return {
    id: formatted.id,
    title: formatted.title,
    description: formatted.description,
    verificationMethod: formatted.verificationMethod,
    rewardAmount: formatted.rewardAmount,
    externalUrl: formatted.externalUrl,
    imageUrl: formatted.imageUrl,
    thumbnailUrl: formatted.thumbnailUrl,
    category: formatted.category || (formatted.requireTelegram ? "TELEGRAM" : "COMMUNITY"),
    requiresTelegram: formatted.requireTelegram,
    requireTelegram: formatted.requireTelegram,
    active: formatted.active,
    totalCompletions: task._count?.completions || 0,
    createdAt: formatted.createdAt,
    userCompletion: userId ? task.completions?.[0] || null : null,
  };
}

/**
 * Submit a task completion.
 * @param {string} userId
 * @param {string} taskId
 * @param {string|null} proof - Optional proof (URL, screenshot, etc.)
 * @param {string|null} telegramUsername - Optional/Required Telegram handle
 * @returns {Promise<object>} The created TaskCompletion
 */
export async function completeTask(userId, taskId, proof = null, telegramUsername = null) {
  // Check task exists and is active
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");
  if (!task.active) throw new Error("Task is no longer active");

  const isTgRequired =
    task.requireTelegram === true ||
    task.requiresTelegram === true ||
    task.category === "TELEGRAM" ||
    (task.externalUrl && task.externalUrl.includes("t.me"));

  if (isTgRequired && (!telegramUsername || telegramUsername.trim().length === 0)) {
    throw new Error("Telegram username is required to complete this task.");
  }

  // Format Telegram username cleanly (e.g., @cryptoking)
  const cleanTg = telegramUsername?.trim()
    ? (telegramUsername.trim().startsWith("@") ? telegramUsername.trim() : `@${telegramUsername.trim()}`)
    : null;

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
  if (task.verificationMethod === "LINK_CHECK" && !isTgRequired) {
    // Auto-verify LINK_CHECK tasks — user just needs to visit the URL
    initialStatus = "VERIFIED";
  }

  // If user provided TG handle and doesn't have it on profile, update profile too
  if (cleanTg) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { telegram: true } });
      if (user && !user.telegram) {
        await prisma.user.update({
          where: { id: userId },
          data: { telegram: cleanTg },
        });
      }
    } catch (_) {}
  }

  const combinedProof = proof ? proof : (cleanTg ? `Telegram: ${cleanTg}` : null);

  let completion;
  try {
    completion = await prisma.taskCompletion.upsert({
      where: { userId_taskId: { userId, taskId } },
      create: {
        userId,
        taskId,
        status: initialStatus,
        proof: combinedProof,
        telegramUsername: cleanTg,
        ...(initialStatus === "VERIFIED" ? { verifiedAt: new Date() } : {}),
      },
      update: {
        status: initialStatus,
        proof: combinedProof,
        telegramUsername: cleanTg,
        rejectedAt: null,
        adminNotes: null,
        ...(initialStatus === "VERIFIED" ? { verifiedAt: new Date() } : {}),
      },
    });
  } catch (err) {
    // Fallback if telegramUsername is not a separate column
    completion = await prisma.taskCompletion.upsert({
      where: { userId_taskId: { userId, taskId } },
      create: {
        userId,
        taskId,
        status: initialStatus,
        proof: combinedProof,
        ...(initialStatus === "VERIFIED" ? { verifiedAt: new Date() } : {}),
      },
      update: {
        status: initialStatus,
        proof: combinedProof,
        rejectedAt: null,
        ...(initialStatus === "VERIFIED" ? { verifiedAt: new Date() } : {}),
      },
    });
  }

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
        select: {
          title: true,
          rewardAmount: true,
          verificationMethod: true,
          thumbnailUrl: true,
        },
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
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { completions: true },
      },
    },
  });

  return tasks.map((task) => {
    const formatted = formatTaskPayload(task);
    return {
      ...formatted,
      _count: task._count,
    };
  });
}

/**
 * Create a new task.
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function createTask(data) {
  const requireTelegram =
    data.requiresTelegram === true ||
    data.requireTelegram === true ||
    data.verificationMethod === "MANUAL_TELEGRAM";

  const dbVerificationMethod = toDbVerificationMethod(data.verificationMethod);
  const thumbnailUrl = data.thumbnailUrl || data.imageUrl || null;

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      verificationMethod: dbVerificationMethod,
      rewardAmount: Number(data.rewardAmount) || 10,
      active: data.active !== false,
      externalUrl: data.externalUrl || null,
      thumbnailUrl,
      requireTelegram,
      requireProof: data.requireProof || false,
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
  const requireTelegram =
    data.requireTelegram !== undefined
      ? data.requireTelegram
      : data.requiresTelegram !== undefined
      ? data.requiresTelegram
      : data.verificationMethod === "MANUAL_TELEGRAM";

  const dbVerificationMethod = data.verificationMethod
    ? toDbVerificationMethod(data.verificationMethod)
    : undefined;

  const thumbnailUrl =
    data.thumbnailUrl !== undefined
      ? data.thumbnailUrl
      : data.imageUrl !== undefined
      ? data.imageUrl
      : undefined;

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(dbVerificationMethod !== undefined && { verificationMethod: dbVerificationMethod }),
      ...(data.rewardAmount !== undefined && { rewardAmount: Number(data.rewardAmount) }),
      ...(data.active !== undefined && { active: data.active }),
      ...(data.externalUrl !== undefined && { externalUrl: data.externalUrl }),
      ...(thumbnailUrl !== undefined && { thumbnailUrl }),
      ...(requireTelegram !== undefined && { requireTelegram }),
      ...(data.requireProof !== undefined && { requireProof: data.requireProof }),
    },
  });
}

/**
 * Delete a task (admin function, cascades completions).
 * @param {string} taskId
 * @returns {Promise<object>}
 */
export async function deleteTask(taskId) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");

  return prisma.task.delete({
    where: { id: taskId },
  });
}

/**
 * Admin: verify or reject a task completion.
 * @param {string} completionId
 * @param {"VERIFIED"|"REJECTED"} status
 * @param {string|null} adminNotes
 */
export async function reviewTaskCompletion(completionId, status, adminNotes = null) {
  const completion = await prisma.taskCompletion.findUnique({
    where: { id: completionId },
    include: { task: true },
  });

  if (!completion) throw new Error("Completion not found");
  if (completion.status === "VERIFIED") throw new Error("Already verified");

  let updated;
  try {
    updated = await prisma.taskCompletion.update({
      where: { id: completionId },
      data: {
        status,
        adminNotes: adminNotes || null,
        ...(status === "VERIFIED" ? { verifiedAt: new Date() } : { rejectedAt: new Date() }),
      },
    });
  } catch (err) {
    // Fallback if adminNotes column not available
    updated = await prisma.taskCompletion.update({
      where: { id: completionId },
      data: {
        status,
        ...(status === "VERIFIED" ? { verifiedAt: new Date() } : { rejectedAt: new Date() }),
      },
    });
  }

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
