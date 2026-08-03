/**
 * Auth Service
 *
 * Owns: Wallet-based identity, session creation on first connect, profile auto-creation.
 * No direct imports from other service internals — use exported functions only.
 */

/**
 * Create or resume a session from a wallet address.
 * If the user doesn't exist, creates a new user with role USER.
 * @param {string} walletAddress - The connected wallet address
 * @returns {Promise<object>} The user object
 */
export async function createOrResumeSession(walletAddress) {
  // TODO: Implement with Prisma
  throw new Error("Not implemented");
}

/**
 * Get user by wallet address.
 * @param {string} walletAddress
 * @returns {Promise<object|null>}
 */
export async function getUserByWallet(walletAddress) {
  // TODO: Implement with Prisma
  throw new Error("Not implemented");
}

/**
 * Check if a wallet address has admin role.
 * @param {string} walletAddress
 * @returns {Promise<boolean>}
 */
export async function isAdmin(walletAddress) {
  // TODO: Implement with Prisma + ADMIN_WALLET_ADDRESSES env check
  throw new Error("Not implemented");
}
