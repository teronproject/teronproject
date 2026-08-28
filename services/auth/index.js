import prisma from "@/lib/prisma";
import { ROLES } from "@/lib/constants";
import { processReferral, generateUniqueReferralCode } from "@/services/referrals";

/**
 * Auth Service
 *
 * Owns: Wallet-based identity, session creation on first connect, profile auto-creation.
 * No direct imports from other service internals — use exported functions only.
 */

/**
 * Create or resume a session from a wallet address.
 * If the user doesn't exist, creates a new user with role USER (or ADMIN if in env).
 * @param {string} walletAddress - The connected wallet address
 * @param {string|null} referralCode - Optional referral code used during onboarding
 * @returns {Promise<object>} The user object
 */
export async function createOrResumeSession(walletAddress, referralCode = null) {
  const normalizedAddress = walletAddress.toLowerCase();
  
  // Check if admin
  const adminAddresses = (process.env.ADMIN_WALLET_ADDRESSES || "")
    .toLowerCase()
    .split(",")
    .map(a => a.trim())
    .filter(Boolean);
    
  const isUserAdmin = adminAddresses.includes(normalizedAddress);
  const role = isUserAdmin ? ROLES.ADMIN : ROLES.USER;

  let user = await prisma.user.findUnique({
    where: { walletAddress: normalizedAddress },
  });

  let isNewUser = false;

  if (!user) {
    // --- GLOBAL BOT PROTECTION ---
    // Prevent bot scripts from inflating the database by creating thousands of fake wallets.
    // Limit: Max 10 new accounts globally per minute.
    const recentUsersCount = await prisma.user.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 60000) }
      }
    });

    if (recentUsersCount >= 10) {
      throw new Error("System under heavy load. Temporary pause on new account creations to prevent spam. Please try again in a few minutes.");
    }
    // -----------------------------

    // New user — create with collision-safe unique referralCode
    const refCode = await generateUniqueReferralCode();
    try {
      user = await prisma.user.create({
        data: {
          walletAddress: normalizedAddress,
          role: role,
          referralCode: refCode,
        },
      });
    } catch (createErr) {
      // Fallback: create without referralCode if column issue occurs
      user = await prisma.user.create({
        data: {
          walletAddress: normalizedAddress,
          role: role,
        },
      });
    }
    isNewUser = true;
  } else {
    // Existing user — sync role if needed
    if (user.role !== role) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role },
      });
    }

    // Backfill referralCode if missing
    if (!user.referralCode) {
      try {
        const refCode = await generateUniqueReferralCode();
        user = await prisma.user.update({
          where: { id: user.id },
          data: { referralCode: refCode },
        });
      } catch (backfillErr) {
        console.warn("Could not backfill referralCode:", backfillErr.message);
      }
    }
  }

  // Process referral code if provided and user is not yet referred
  if (referralCode && (!user.referredById || isNewUser)) {
    try {
      const processed = await processReferral(user.id, referralCode);
      if (processed) {
        // Re-fetch user so terrBalance and referredById reflect the new rewards
        user = await prisma.user.findUnique({
          where: { id: user.id },
        });
      }
    } catch (err) {
      console.error("Failed to process referral on connect:", err);
    }
  }

  return user;
}

/**
 * Get user by wallet address.
 * @param {string} walletAddress
 * @returns {Promise<object|null>}
 */
export async function getUserByWallet(walletAddress) {
  if (!walletAddress) return null;
  const normalizedAddress = walletAddress.toLowerCase();
  return prisma.user.findUnique({
    where: { walletAddress: normalizedAddress },
  });
}

/**
 * Check if a wallet address has admin role.
 * @param {string} walletAddress
 * @returns {Promise<boolean>}
 */
export async function isAdmin(walletAddress) {
  const user = await getUserByWallet(walletAddress);
  if (user && user.role === ROLES.ADMIN) return true;
  
  // Fallback to env check
  const normalizedAddress = walletAddress.toLowerCase();
  const adminAddresses = (process.env.ADMIN_WALLET_ADDRESSES || "")
    .toLowerCase()
    .split(",")
    .map(a => a.trim());
    
  return adminAddresses.includes(normalizedAddress);
}
