import { createPublicClient, http } from "viem";
import { bsc, bscTestnet } from "viem/chains";

/**
 * Viem public client for reading BNB Chain data server-side.
 * Used for: balance checks, transaction receipt verification, contract reads.
 */

export const publicClient = createPublicClient({
  chain: bsc,
  transport: http(
    process.env.NEXT_PUBLIC_BNB_RPC_URL || "https://bsc-dataseed1.binance.org"
  ),
});

export const testnetClient = createPublicClient({
  chain: bscTestnet,
  transport: http("https://data-seed-prebsc-1-s1.bnbchain.org:8545"),
});

/**
 * Get BNB balance for an address.
 * @param {string} address - Wallet address (0x...)
 * @returns {Promise<bigint>} Balance in wei
 */
export async function getBnbBalance(address) {
  return publicClient.getBalance({ address });
}

/**
 * Get transaction receipt to verify a transaction was confirmed.
 * @param {string} hash - Transaction hash
 * @returns {Promise<object>} Transaction receipt
 */
export async function getTransactionReceipt(hash) {
  return publicClient.getTransactionReceipt({ hash });
}

/**
 * Wait for a transaction to be confirmed.
 * @param {string} hash - Transaction hash
 * @returns {Promise<object>} Transaction receipt
 */
export async function waitForTransaction(hash) {
  return publicClient.waitForTransactionReceipt({ hash });
}

export default publicClient;
