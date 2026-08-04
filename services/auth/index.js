import prisma from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

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
export async function createOrResumeSession(walletAddress) {
  const normalizedAddress = walletAddress.toLowerCase();
  
  // Check if admin
  const adminAddresses = (process.env.ADMIN_WALLET_ADDRESSES || "")
    .toLowerCase()
    .split(",")
    .map(a => a.trim());
    
  const isUserAdmin = adminAddresses.includes(normalizedAddress);
  const role = isUserAdmin ? ROLES.ADMIN : ROLES.USER;

  let user = await prisma.user.findUnique({
    where: { walletAddress: normalizedAddress },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress: normalizedAddress,
        role: role,
      },
    });
  } else if (user.role !== role) {
    // Sync role if env var changed
    user = await prisma.user.update({
      where: { id: user.id },
      data: { role: role },
    });
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
