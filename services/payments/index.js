/**
 * Payments Service
 *
 * Owns: BNB payment verification, cold wallet transfer confirmation.
 */

export async function verifyPayment(txHash, expectedAmount, serviceType) {
  throw new Error("Not implemented");
}

export async function getPaymentsByToken(tokenId) {
  throw new Error("Not implemented");
}
