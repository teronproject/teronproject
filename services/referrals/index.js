import prisma from "@/lib/prisma";
import { grantReferralRewards } from "@/services/rewards";

/**
 * Referrals Service
 *
 * Owns: Referral code management, referral link processing, referral reward distribution.
 */

/**
 * Get a user's referral code.
 * @param {string} userId
 * @returns {Promise<string>}
 */
export async function getUserReferralCode(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });
  if (!user) throw new Error("User not found");
  return user.referralCode;
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
      select: { referralCode: true, terrBalance: true },
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

  // Auto-generate for legacy users who don't have one
  if (user && !refCode) {
    refCode = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    await prisma.user.update({
      where: { id: userId },
      data: { referralCode: refCode },
    });
  }

  return {
    referralCode: refCode || "",
    totalReferrals: referralCount,
    totalEarnings: referralGrants._sum?.amount || 0,
    referralGrantCount: referralGrants._count || 0,
    referredUsers,
  };
}

/**
 * Process a referral when a new user signs up.
 * Links the new user to the referrer and grants TERR to both.
 *
 * @param {string} newUserId - The newly created user's ID
 * @param {string} referralCode - The referral code from the URL
 * @returns {Promise<boolean>} True if referral was successfully processed
 */
export async function processReferral(newUserId, referralCode) {
  if (!referralCode || !newUserId) return false;

  // Find the referrer by referral code
  const referrer = await prisma.user.findUnique({
    where: { referralCode },
    select: { id: true },
  });

  if (!referrer) return false;

  // Prevent self-referral
  if (referrer.id === newUserId) return false;

  // Check if user is already referred
  const newUser = await prisma.user.findUnique({
    where: { id: newUserId },
    select: { referredById: true },
  });

  if (newUser?.referredById) return false; // Already referred

  // Link the new user to the referrer
  await prisma.user.update({
    where: { id: newUserId },
    data: { referredById: referrer.id },
  });

  // Grant TERR rewards to both
  try {
    await grantReferralRewards(referrer.id, newUserId);
  } catch (err) {
    console.error("Failed to grant referral rewards:", err);
  }

  return true;
}
