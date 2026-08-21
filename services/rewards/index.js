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

/**
 * Withdraw TERR tokens to a user's wallet on-chain.
 * Deducts from DB balance and sends BEP-20 transfer via hot wallet.
 *
 * @param {string} userId
 * @param {number} amount - TERR amount to withdraw
 * @param {string} toAddress - User's wallet address
 * @returns {Promise<object>} The withdrawal record with txHash
 */
export async function withdrawTerr(userId, amount, toAddress) {
  const { createWalletClient, createPublicClient, http, parseUnits, encodeFunctionData } = await import("viem");
  const { privateKeyToAccount } = await import("viem/accounts");
  const { bsc } = await import("viem/chains");

  const MIN_WITHDRAWAL = 10;
  const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

  // Validate amount
  if (!amount || amount < MIN_WITHDRAWAL) {
    throw new Error(`Minimum withdrawal is ${MIN_WITHDRAWAL} TERR`);
  }

  // Check cooldown — prevent rapid withdrawals
  const recentWithdrawal = await prisma.terrWithdrawal.findFirst({
    where: {
      userId,
      status: { in: ["PENDING", "CONFIRMED"] },
      createdAt: { gte: new Date(Date.now() - COOLDOWN_MS) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentWithdrawal) {
    throw new Error("Please wait 5 minutes between withdrawals");
  }

  // Check hot wallet key is configured
  const privateKey = process.env.TERR_HOT_WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Withdrawal service not configured");
  }

  const contractAddress = process.env.NEXT_PUBLIC_TERR_CONTRACT_ADDRESS || "0xc5457424698643d8A643FeFE787488C9aA8FBBF0";

  // Atomic: deduct balance + create withdrawal record
  const withdrawal = await prisma.$transaction(async (tx) => {
    // Fetch current balance inside transaction
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { terrBalance: true },
    });

    if (!user || user.terrBalance < amount) {
      throw new Error("Insufficient TERR balance");
    }

    // Deduct balance
    await tx.user.update({
      where: { id: userId },
      data: { terrBalance: { decrement: amount } },
    });

    // Create withdrawal record
    return tx.terrWithdrawal.create({
      data: {
        userId,
        amount,
        toAddress: toAddress.toLowerCase(),
        status: "PENDING",
      },
    });
  });

  // Send on-chain transfer
  try {
    const account = privateKeyToAccount(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);

    const rpcUrl = process.env.NEXT_PUBLIC_BNB_RPC_URL || "https://bsc-dataseed1.binance.org";

    const walletClient = createWalletClient({
      account,
      chain: bsc,
      transport: http(rpcUrl),
    });

    const publicClient = createPublicClient({
      chain: bsc,
      transport: http(rpcUrl),
    });

    // ERC-20 transfer function ABI
    const transferAbi = [
      {
        name: "transfer",
        type: "function",
        inputs: [
          { name: "to", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
      },
    ];

    const tokenAmount = parseUnits(amount.toString(), 18);

    const data = encodeFunctionData({
      abi: transferAbi,
      functionName: "transfer",
      args: [toAddress, tokenAmount],
    });

    const txHash = await walletClient.sendTransaction({
      to: contractAddress,
      data,
    });

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 1,
      timeout: 60_000,
    });

    if (receipt.status === "success") {
      // Mark as confirmed
      await prisma.terrWithdrawal.update({
        where: { id: withdrawal.id },
        data: { status: "CONFIRMED", txHash },
      });

      return { ...withdrawal, status: "CONFIRMED", txHash };
    } else {
      // Transaction reverted — refund balance
      await prisma.$transaction([
        prisma.terrWithdrawal.update({
          where: { id: withdrawal.id },
          data: { status: "FAILED", txHash, failReason: "Transaction reverted" },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { terrBalance: { increment: amount } },
        }),
      ]);

      throw new Error("Transaction reverted on-chain");
    }
  } catch (error) {
    // If we haven't already handled the error, refund and mark failed
    const existing = await prisma.terrWithdrawal.findUnique({
      where: { id: withdrawal.id },
    });

    if (existing && existing.status === "PENDING") {
      await prisma.$transaction([
        prisma.terrWithdrawal.update({
          where: { id: withdrawal.id },
          data: { status: "FAILED", failReason: error.message?.slice(0, 500) },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { terrBalance: { increment: amount } },
        }),
      ]);
    }

    throw error;
  }
}

/**
 * Get a user's withdrawal history.
 * @param {string} userId
 * @param {object} options
 * @returns {Promise<{withdrawals: object[], total: number}>}
 */
export async function getWithdrawalHistory(userId, { page = 1, limit = 10 } = {}) {
  const skip = (page - 1) * limit;

  const [withdrawals, total] = await Promise.all([
    prisma.terrWithdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.terrWithdrawal.count({ where: { userId } }),
  ]);

  return { withdrawals, total };
}
