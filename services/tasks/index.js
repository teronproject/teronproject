import prisma from "@/lib/prisma";
import { grantReward } from "@/services/rewards";

/**
 * Tasks Service
 *
 * Owns: Task definitions, completion verification, reward distribution for tasks.
 */

const META_REGEX = /<!--teron_task_meta:([\s\S]*?)-->/;

function toDbVerificationMethod(method) {
  if (method === "MANUAL_TELEGRAM") return "MANUAL";
  if (["MANUAL", "LINK_CHECK", "SOCIAL_FOLLOW", "REFERRAL"].includes(method)) {
    return method;
  }
  return "MANUAL";
}

function serializeTaskDescription(description, meta = {}) {
  const cleanDesc = (description || "").replace(META_REGEX, "").trim();
  const metaObj = {
    imageUrl: meta.imageUrl || meta.thumbnailUrl || null,
    requiresTelegram: !!meta.requiresTelegram,
    category: meta.category || (meta.requiresTelegram ? "TELEGRAM" : "COMMUNITY"),
  };

  if (metaObj.imageUrl || metaObj.requiresTelegram || metaObj.category) {
    return `${cleanDesc}\n\n<!--teron_task_meta:${JSON.stringify(metaObj)}-->`;
  }
  return cleanDesc;
}

function parseTask(task) {
  if (!task) return null;
  let description = task.description || "";
  let imageUrl = null;
  let requiresTelegram = false;
  let category = "COMMUNITY";

  const match = description.match(META_REGEX);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed.imageUrl) imageUrl = parsed.imageUrl;
      if (parsed.requiresTelegram !== undefined) requiresTelegram = parsed.requiresTelegram;
      if (parsed.category) category = parsed.category;
    } catch (_) {}
    description = description.replace(META_REGEX, "").trim();
  }

  // Also auto-detect telegram from externalUrl or category
  if (!requiresTelegram && task.externalUrl && task.externalUrl.includes("t.me")) {
    requiresTelegram = true;
    category = "TELEGRAM";
  }

  return {
    ...task,
    description,
    imageUrl,
    thumbnailUrl: imageUrl,
    category,
    requiresTelegram,
    requireTelegram: requiresTelegram,
    verificationMethod: requiresTelegram ? "MANUAL_TELEGRAM" : task.verificationMethod,
  };
}

/**
 * List all active tasks with the current user's completion status.
 * @param {string|null} userId - If provided, includes completion status per task
 * @returns {Promise<object[]>}
 */
export async function listTasks(userId = null) {
  try {
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

    return tasks.map((t) => {
      const parsed = parseTask(t);
      return {
        id: parsed.id,
        title: parsed.title,
        description: parsed.description,
        verificationMethod: parsed.verificationMethod,
        rewardAmount: parsed.rewardAmount,
        externalUrl: parsed.externalUrl,
        imageUrl: parsed.imageUrl,
        thumbnailUrl: parsed.thumbnailUrl,
        category: parsed.category,
        requiresTelegram: parsed.requiresTelegram,
        requireTelegram: parsed.requireTelegram,
        totalCompletions: t._count?.completions || 0,
        createdAt: parsed.createdAt,
        userCompletion: userId ? t.completions?.[0] || null : null,
      };
    });
  } catch (err) {
    if (err.code === "P2022" || (err.message && err.message.includes("does not exist in the current database"))) {
      const rawTasks = await prisma.$queryRaw`
        SELECT "id", "title", "description", "verificationMethod"::text as "verificationMethod", "rewardAmount", "active", "externalUrl", "createdAt", "updatedAt"
        FROM "tasks"
        WHERE "active" = true
        ORDER BY "createdAt" DESC;
      `;

      const counts = await prisma.$queryRaw`
        SELECT "taskId", COUNT(*)::int as count FROM "task_completions" GROUP BY "taskId";
      `;
      const countMap = Object.fromEntries(counts.map(c => [c.taskId, c.count]));

      let userComps = [];
      if (userId) {
        userComps = await prisma.$queryRaw`
          SELECT "id", "taskId", "status", "proof", "createdAt", "verifiedAt" 
          FROM "task_completions" 
          WHERE "userId" = ${userId};
        `;
      }
      const compMap = Object.fromEntries(userComps.map(c => [c.taskId, c]));

      return rawTasks.map((t) => {
        const parsed = parseTask(t);
        return {
          id: parsed.id,
          title: parsed.title,
          description: parsed.description,
          verificationMethod: parsed.verificationMethod,
          rewardAmount: parsed.rewardAmount,
          externalUrl: parsed.externalUrl,
          imageUrl: parsed.imageUrl,
          thumbnailUrl: parsed.thumbnailUrl,
          category: parsed.category,
          requiresTelegram: parsed.requiresTelegram,
          requireTelegram: parsed.requireTelegram,
          totalCompletions: countMap[t.id] || 0,
          createdAt: parsed.createdAt,
          userCompletion: compMap[t.id] || null,
        };
      });
    }
    throw err;
  }
}

/**
 * Get a single task by ID (for public / shareable pages).
 * @param {string} taskId
 * @param {string|null} userId
 * @returns {Promise<object|null>}
 */
export async function getTaskById(taskId, userId = null) {
  try {
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

    const parsed = parseTask(task);

    return {
      id: parsed.id,
      title: parsed.title,
      description: parsed.description,
      verificationMethod: parsed.verificationMethod,
      rewardAmount: parsed.rewardAmount,
      externalUrl: parsed.externalUrl,
      imageUrl: parsed.imageUrl,
      thumbnailUrl: parsed.thumbnailUrl,
      category: parsed.category,
      requiresTelegram: parsed.requiresTelegram,
      requireTelegram: parsed.requireTelegram,
      active: parsed.active,
      totalCompletions: task._count?.completions || 0,
      createdAt: parsed.createdAt,
      userCompletion: userId ? task.completions?.[0] || null : null,
    };
  } catch (err) {
    if (err.code === "P2022" || (err.message && err.message.includes("does not exist in the current database"))) {
      const [rawTask] = await prisma.$queryRaw`
        SELECT "id", "title", "description", "verificationMethod"::text as "verificationMethod", "rewardAmount", "active", "externalUrl", "createdAt", "updatedAt"
        FROM "tasks"
        WHERE "id" = ${taskId}
        LIMIT 1;
      `;
      if (!rawTask) return null;

      const [countRow] = await prisma.$queryRaw`
        SELECT COUNT(*)::int as count FROM "task_completions" WHERE "taskId" = ${taskId};
      `;

      let userComp = null;
      if (userId) {
        const [comp] = await prisma.$queryRaw`
          SELECT "id", "taskId", "status", "proof", "createdAt", "verifiedAt" 
          FROM "task_completions" 
          WHERE "userId" = ${userId} AND "taskId" = ${taskId}
          LIMIT 1;
        `;
        if (comp) userComp = comp;
      }

      const parsed = parseTask(rawTask);
      return {
        ...parsed,
        totalCompletions: countRow?.count || 0,
        userCompletion: userComp,
      };
    }
    throw err;
  }
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
  let rawTask;
  try {
    rawTask = await prisma.task.findUnique({ where: { id: taskId } });
  } catch (err) {
    if (err.code === "P2022") {
      const [t] = await prisma.$queryRaw`
        SELECT * FROM "tasks" WHERE "id" = ${taskId} LIMIT 1;
      `;
      rawTask = t;
    } else {
      throw err;
    }
  }

  if (!rawTask) throw new Error("Task not found");
  if (!rawTask.active) throw new Error("Task is no longer active");

  const task = parseTask(rawTask);
  const isTgRequired = task.requiresTelegram;

  if (isTgRequired && (!telegramUsername || telegramUsername.trim().length === 0)) {
    throw new Error("Telegram username is required to complete this task.");
  }

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
  }

  let initialStatus = "PENDING";
  if (rawTask.verificationMethod === "LINK_CHECK" && !isTgRequired) {
    initialStatus = "VERIFIED";
  }

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

  const completion = await prisma.taskCompletion.upsert({
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

  if (initialStatus === "VERIFIED") {
    try {
      await grantReward(userId, rawTask.rewardAmount, "TASK", null, taskId);
    } catch (err) {
      console.error("Failed to grant task reward:", err);
    }
  }

  return {
    ...completion,
    telegramUsername: cleanTg,
  };
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
          description: true,
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
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { completions: true },
        },
      },
    });

    return tasks.map((t) => {
      const parsed = parseTask(t);
      return {
        ...parsed,
        _count: t._count,
      };
    });
  } catch (err) {
    if (err.code === "P2022" || (err.message && err.message.includes("does not exist in the current database"))) {
      const rawTasks = await prisma.$queryRaw`
        SELECT "id", "title", "description", "verificationMethod"::text as "verificationMethod", "rewardAmount", "active", "externalUrl", "createdAt", "updatedAt"
        FROM "tasks"
        ORDER BY "createdAt" DESC;
      `;

      const counts = await prisma.$queryRaw`
        SELECT "taskId", COUNT(*)::int as count FROM "task_completions" GROUP BY "taskId";
      `;
      const countMap = Object.fromEntries(counts.map(c => [c.taskId, c.count]));

      return rawTasks.map((t) => {
        const parsed = parseTask(t);
        return {
          ...parsed,
          _count: { completions: countMap[t.id] || 0 }
        };
      });
    }
    throw err;
  }
}

/**
 * Create a new task.
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function createTask(data) {
  const requiresTelegram =
    data.requiresTelegram === true ||
    data.requireTelegram === true ||
    data.verificationMethod === "MANUAL_TELEGRAM";

  const dbVerificationMethod = toDbVerificationMethod(data.verificationMethod);
  const imageUrl = data.imageUrl || data.thumbnailUrl || null;
  const category = data.category || (requiresTelegram ? "TELEGRAM" : "COMMUNITY");

  const fullDescription = serializeTaskDescription(data.description, {
    imageUrl,
    requiresTelegram,
    category,
  });

  try {
    const created = await prisma.task.create({
      data: {
        title: data.title,
        description: fullDescription,
        verificationMethod: dbVerificationMethod,
        rewardAmount: Number(data.rewardAmount) || 10,
        active: data.active !== false,
        externalUrl: data.externalUrl || null,
      },
    });

    return parseTask(created);
  } catch (err) {
    if (err.code === "P2022" || (err.message && err.message.includes("does not exist in the current database"))) {
      // Safe Raw SQL fallback ensuring zero Prisma model mismatch in running server memory
      const [inserted] = await prisma.$queryRaw`
        INSERT INTO "tasks" ("id", "title", "description", "verificationMethod", "rewardAmount", "active", "externalUrl", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid()::text,
          ${data.title},
          ${fullDescription},
          ${dbVerificationMethod}::"TaskVerificationMethod",
          ${Number(data.rewardAmount) || 10},
          ${data.active !== false},
          ${data.externalUrl || null},
          NOW(),
          NOW()
        )
        RETURNING "id", "title", "description", "verificationMethod"::text as "verificationMethod", "rewardAmount", "active", "externalUrl", "createdAt", "updatedAt";
      `;
      return parseTask(inserted);
    }
    throw err;
  }
}

/**
 * Update a task.
 * @param {string} taskId
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function updateTask(taskId, data) {
  let current;
  try {
    current = await prisma.task.findUnique({ where: { id: taskId } });
  } catch (err) {
    if (err.code === "P2022") {
      const [t] = await prisma.$queryRaw`SELECT * FROM "tasks" WHERE "id" = ${taskId} LIMIT 1;`;
      current = t;
    } else {
      throw err;
    }
  }

  if (!current) throw new Error("Task not found");

  const currentParsed = parseTask(current);

  const requiresTelegram =
    data.requiresTelegram !== undefined
      ? data.requiresTelegram
      : data.requireTelegram !== undefined
      ? data.requireTelegram
      : data.verificationMethod === "MANUAL_TELEGRAM"
      ? true
      : currentParsed.requiresTelegram;

  const imageUrl =
    data.imageUrl !== undefined
      ? data.imageUrl
      : data.thumbnailUrl !== undefined
      ? data.thumbnailUrl
      : currentParsed.imageUrl;

  const category = data.category !== undefined ? data.category : currentParsed.category;

  const descriptionToUse = data.description !== undefined ? data.description : currentParsed.description;

  const fullDescription = serializeTaskDescription(descriptionToUse, {
    imageUrl,
    requiresTelegram,
    category,
  });

  const dbVerificationMethod = data.verificationMethod
    ? toDbVerificationMethod(data.verificationMethod)
    : undefined;

  try {
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        description: fullDescription,
        ...(dbVerificationMethod !== undefined && { verificationMethod: dbVerificationMethod }),
        ...(data.rewardAmount !== undefined && { rewardAmount: Number(data.rewardAmount) }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.externalUrl !== undefined && { externalUrl: data.externalUrl }),
      },
    });

    return parseTask(updated);
  } catch (err) {
    if (err.code === "P2022" || (err.message && err.message.includes("does not exist in the current database"))) {
      const [updated] = await prisma.$queryRaw`
        UPDATE "tasks"
        SET
          "title" = COALESCE(${data.title !== undefined ? data.title : null}, "title"),
          "description" = ${fullDescription},
          "rewardAmount" = COALESCE(${data.rewardAmount !== undefined ? Number(data.rewardAmount) : null}, "rewardAmount"),
          "active" = COALESCE(${data.active !== undefined ? data.active : null}, "active"),
          "externalUrl" = COALESCE(${data.externalUrl !== undefined ? data.externalUrl : null}, "externalUrl"),
          "updatedAt" = NOW()
        WHERE "id" = ${taskId}
        RETURNING "id", "title", "description", "verificationMethod"::text as "verificationMethod", "rewardAmount", "active", "externalUrl", "createdAt", "updatedAt";
      `;
      return parseTask(updated);
    }
    throw err;
  }
}

/**
 * Delete a task (admin function, cascades completions).
 * @param {string} taskId
 * @returns {Promise<object>}
 */
export async function deleteTask(taskId) {
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new Error("Task not found");

    return await prisma.task.delete({
      where: { id: taskId },
    });
  } catch (err) {
    if (err.code === "P2022" || (err.message && err.message.includes("does not exist in the current database"))) {
      await prisma.$executeRaw`DELETE FROM "task_completions" WHERE "taskId" = ${taskId};`;
      await prisma.$executeRaw`DELETE FROM "tasks" WHERE "id" = ${taskId};`;
      return { success: true };
    }
    throw err;
  }
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
