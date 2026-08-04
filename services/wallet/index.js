/**
 * Wallet Service
 *
 * Owns: Balance reads, chain detection, wagmi/viem client orchestration.
 */

/**
 * Get BNB balance for a wallet address.
 * @param {string} walletAddress
 * @returns {Promise<string>} Balance in BNB (formatted)
 */
export async function getBalance(walletAddress) {
  // TODO: Implement with viem
  throw new Error("Not implemented");
}

/**
 * Verify that the connected chain is BNB Chain.
 * @param {number} chainId
 * @returns {boolean}
 */
export function isBnbChain(chainId) {
  return chainId === 56; // mainnet only
}
