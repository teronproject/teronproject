import prisma from "@/lib/prisma";
import crypto from "crypto";

/**
 * Referrals Service
 *
 * Owns: Referral code management, referral link processing, referral reward distribution.
 */

/** Default reward amounts */
const REFERRAL_REWARDS = {
  REFERRER: 25,
  NEW_USER: 10,
};

/**
 * Generate a unique 8-character alphanumeric referral code.
 */
export async function generateUniqueReferralCode() {
  for (let i = 0; i < 5; i++) {
    const code = crypto.randomBytes(4).toString("hex").toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });
    if (!existing) return code;
  }
  return `${Date.now().toString(36).slice(-4)}${crypto.randomBytes(2).toString("hex")}`.toLowerCase();
}

/**
 * Get a user's referral code, generating one if missing.
 * @param {string} userId
 * @returns {Promise<string>}
 */
export async function getUserReferralCode(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, referralCode: true },
  });
  if (!user) throw new Error("User not found");

  if (user.referralCode) return user.referralCode;

  const newCode = await generateUniqueReferralCode();
  await prisma.user.update({
    where: { id: userId },
    data: { referralCode: newCode },
  });
  return newCode;
}

/**
 * Get referral stats for a user.
 * @param {string} userId
 * @returns {Promise<object>}
 */
export async function getReferralStats(userId) {
  const [user, referralCount, referralGrants] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true, terrBalance: true, referredById: true },
    }),
    prisma.user.count({
      where: { referredById: userId },
    }),
    prisma.rewardGrant.aggregate({
      where: { userId, reason: "REFERRAL" },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  // Get the list of referred users
  const referredUsers = await prisma.user.findMany({
    where: { referredById: userId },
    select: {
      id: true,
      walletAddress: true,
      displayName: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  let refCode = user?.referralCode;

  // Auto-generate for users who don't have one
  if (user && !refCode) {
    refCode = await generateUniqueReferralCode();
    await prisma.user.update({
      where: { id: userId },
      data: { referralCode: refCode },
    });
  }

  // Calculate earnings strictly from referred friends (25 TERR per friend)
  const earningsFromReferrals = referralCount * REFERRAL_REWARDS.REFERRER;

  return {
    referralCode: refCode || "",
    totalReferrals: referralCount,
    totalEarnings: earningsFromReferrals || referralGrants._sum?.amount || 0,
    referralGrantCount: referralGrants._count || 0,
    isReferred: Boolean(user?.referredById),
    referredUsers,
  };
}

/**
 * Process a referral when a user enters a referral link or applies a code.
 * Links the user to the referrer and atomically grants TERR rewards to both.
 *
 * @param {string} targetUserId - The user being referred
 * @param {string} referralCode - The referral code
 * @returns {Promise<boolean>} True if referral was successfully processed
 */
export async function processReferral(targetUserId, referralCode) {
  if (!referralCode || !targetUserId) return false;

  const cleanCode = referralCode.trim().toLowerCase();
  if (!cleanCode) return false;

  // Find the referrer by referral code (case-insensitive)
  const referrer = await prisma.user.findFirst({
    where: {
      referralCode: {
        equals: cleanCode,
        mode: "insensitive",
      },
    },
    select: { id: true, referredById: true },
  });

  if (!referrer) return false;

  // Prevent self-referral
  if (referrer.id === targetUserId) return false;

  // Prevent circular referral
  if (referrer.referredById === targetUserId) return false;

  // Check if target user is already referred
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, referredById: true },
  });

  if (!targetUser || targetUser.referredById) {
    return false; // Already referred or user not found
  }

  // Atomically link user and grant rewards in a single transaction
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Link the target user to the referrer
      await tx.user.update({
        where: { id: targetUserId },
        data: { referredById: referrer.id },
      });

      // 2. Grant TERR to the Referrer (25 TERR)
      await tx.rewardGrant.create({
        data: {
          userId: referrer.id,
          amount: REFERRAL_REWARDS.REFERRER,
          reason: "REFERRAL",
        },
      });
      await tx.user.update({
        where: { id: referrer.id },
        data: { terrBalance: { increment: REFERRAL_REWARDS.REFERRER } },
      });

      // 3. Grant TERR to the New User (10 TERR)
      await tx.rewardGrant.create({
        data: {
          userId: targetUserId,
          amount: REFERRAL_REWARDS.NEW_USER,
          reason: "REFERRAL",
        },
      });
      await tx.user.update({
        where: { id: targetUserId },
        data: { terrBalance: { increment: REFERRAL_REWARDS.NEW_USER } },
      });
    });

    return true;
  } catch (err) {
    console.error("Failed to process referral transaction:", err);
    return false;
  }
}
