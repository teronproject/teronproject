import prisma from "@/lib/prisma";
import { ROLES } from "@/lib/constants";
import { processReferral } from "@/services/referrals";

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

  // Generate a unique referral code (8 chars)
  const generateRefCode = () => crypto.randomUUID().replace(/-/g, "").slice(0, 8);

  if (!user) {
    // New user — create with referralCode
    try {
      user = await prisma.user.create({
        data: {
          walletAddress: normalizedAddress,
          role: role,
          referralCode: generateRefCode(),
        },
      });
    } catch (createErr) {
      // Fallback: create without referralCode if column doesn't exist yet
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

    // Backfill referralCode (separate try-catch so it doesn't break login)
    if (!user.referralCode) {
      try {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { referralCode: generateRefCode() },
        });
      } catch (backfillErr) {
        console.warn("Could not backfill referralCode (column may not exist yet):", backfillErr.message);
      }
    }
  }

  // Process referral code for new users
  if (isNewUser && referralCode) {
    try {
      await processReferral(user.id, referralCode);
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
