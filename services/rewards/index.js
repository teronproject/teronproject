import prisma from "@/lib/prisma";

/**
 * Rewards Service
 *
 * Owns: TERR grants on confirmed deployment, task completion, referrals.
 * TERR balance tracking per user.
 */

/** Default reward amounts (can be overridden by PricingConfig) */
const DEFAULT_REWARDS = {
  DEPLOYMENT: 100,
  TASK: 25, // Overridden by individual task rewardAmount
  REFERRAL_REFERRER: 25,
  REFERRAL_NEW_USER: 10,
};

/**
 * Get configurable reward amount from PricingConfig.
 * Falls back to defaults if not configured.
 */
async function getRewardAmount(key) {
  try {
    const config = await prisma.pricingConfig.findUnique({
      where: { serviceKey: `reward_${key.toLowerCase()}` },
    });
    if (config && config.active) return config.priceBnb; // reusing priceBnb as amount field
  } catch (_) {}
  return DEFAULT_REWARDS[key] || 0;
}

/**
 * Grant TERR reward to a user.
 * Creates a RewardGrant record and increments the user's terrBalance atomically.
 *
 * @param {string} userId
 * @param {number} amount - TERR amount to grant
 * @param {"DEPLOYMENT"|"TASK"|"REFERRAL"|"BONUS"} reason
 * @param {string|null} relatedTokenId - Token ID if reason is DEPLOYMENT
 * @param {string|null} relatedTaskId - Task ID if reason is TASK
 * @returns {Promise<object>} The created RewardGrant
 */
export async function grantReward(userId, amount, reason, relatedTokenId = null, relatedTaskId = null) {
  if (!userId || amount <= 0) {
    throw new Error("Invalid reward parameters");
  }

  // Use a transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Create the reward grant record
    const grant = await tx.rewardGrant.create({
      data: {
        userId,
        amount,
        reason,
        relatedTokenId,
        relatedTaskId,
      },
    });

    // Increment user's TERR balance
    await tx.user.update({
      where: { id: userId },
      data: {
        terrBalance: { increment: amount },
      },
    });

    return grant;
  });

  return result;
}

/**
 * Get a user's TERR balance.
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function getTerrBalance(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { terrBalance: true },
  });
  return user?.terrBalance || 0;
}

/**
 * Get a user's reward history with pagination.
 * @param {string} userId
 * @param {object} options
 * @returns {Promise<{grants: object[], total: number, balance: number}>}
 */
export async function getRewardHistory(userId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;

  const [grants, total, user] = await Promise.all([
    prisma.rewardGrant.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        relatedToken: {
          select: { name: true, symbol: true, id: true },
        },
      },
    }),
    prisma.rewardGrant.count({ where: { userId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { terrBalance: true },
    }),
  ]);

  return {
    grants,
    total,
    balance: user?.terrBalance || 0,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Grant deployment reward to a user.
 * @param {string} userId
 * @param {string} tokenId
 */
export async function grantDeploymentReward(userId, tokenId) {
  const amount = await getRewardAmount("DEPLOYMENT");
  
  // Check if already granted for this token
  const existing = await prisma.rewardGrant.findFirst({
    where: { userId, reason: "DEPLOYMENT", relatedTokenId: tokenId },
  });
  if (existing) return existing; // Idempotent

  return grantReward(userId, amount, "DEPLOYMENT", tokenId);
}

/**
 * Grant referral rewards to both referrer and new user.
 * @param {string} referrerId
 * @param {string} newUserId
 */
export async function grantReferralRewards(referrerId, newUserId) {
  const referrerAmount = await getRewardAmount("REFERRAL_REFERRER");
  const newUserAmount = await getRewardAmount("REFERRAL_NEW_USER");

  // Grant to referrer
  await grantReward(referrerId, referrerAmount, "REFERRAL");

  // Grant to new user
  await grantReward(newUserId, newUserAmount, "REFERRAL");
}
