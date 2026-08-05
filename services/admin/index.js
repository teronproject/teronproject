import prisma from "@/lib/prisma";

/**
 * Admin Service
 *
 * Owns: Feature flags, pricing config, platform stats, token management.
 */

// ═══════════════════════════════════════════════════════════════════════
// Feature Flags
// ═══════════════════════════════════════════════════════════════════════

export async function getFeatureFlag(key) {
  const flag = await prisma.featureFlag.findUnique({ where: { key } });
  return flag?.enabled ?? false;
}

export async function setFeatureFlag(key, enabled, label) {
  return prisma.featureFlag.upsert({
    where: { key },
    update: { enabled },
    create: { key, enabled, label: label || key },
  });
}

export async function getAllFeatureFlags() {
  return prisma.featureFlag.findMany({ orderBy: { key: "asc" } });
}

// ═══════════════════════════════════════════════════════════════════════
// Pricing Config
// ═══════════════════════════════════════════════════════════════════════

export async function getPricingConfig(serviceKey) {
  return prisma.pricingConfig.findUnique({ where: { serviceKey } });
}

export async function setPricingConfig(serviceKey, data) {
  return prisma.pricingConfig.upsert({
    where: { serviceKey },
    update: data,
    create: { serviceKey, ...data },
  });
}

export async function getAllPricingConfigs() {
  return prisma.pricingConfig.findMany({ where: { active: true } });
}

// ═══════════════════════════════════════════════════════════════════════
// Platform Stats
// ═══════════════════════════════════════════════════════════════════════

export async function getPlatformStats() {
  const [
    totalUsers,
    totalTokens,
    confirmedTokens,
    pendingVerifications,
    pendingMetadata,
    totalPayments,
    confirmedPayments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.token.count(),
    prisma.token.count({ where: { deploymentStatus: "CONFIRMED" } }),
    prisma.token.count({ where: { verificationStatus: "PENDING" } }),
    prisma.token.count({ where: { metadataStatus: "PENDING" } }),
    prisma.payment.count(),
    prisma.payment.count({ where: { status: "CONFIRMED" } }),
  ]);

  // Sum BNB from confirmed payments
  const paymentSum = await prisma.payment.aggregate({
    _sum: { amountBnb: true },
    where: { status: "CONFIRMED" },
  });

  return {
    totalUsers,
    totalTokens,
    confirmedTokens,
    pendingVerifications,
    pendingMetadata,
    totalPayments,
    confirmedPayments,
    totalRevenueBnb: paymentSum._sum.amountBnb || 0,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Token Management (Admin)
// ═══════════════════════════════════════════════════════════════════════

export async function getAdminTokenList({ page = 1, limit = 20, status, search }) {
  const skip = (Math.max(page, 1) - 1) * limit;

  const where = {
    ...(status && status !== "ALL" ? { deploymentStatus: status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { symbol: { contains: search, mode: "insensitive" } },
            { contractAddress: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const totalCount = await prisma.token.count({ where });
  const tokens = await prisma.token.findMany({
    where,
    take: limit,
    skip,
    include: {
      profile: true,
      deployer: {
        select: { id: true, walletAddress: true, displayName: true },
      },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    tokens,
    pagination: { total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) },
  };
}

export async function updateTokenVerificationStatus(tokenId, status) {
  return prisma.token.update({
    where: { id: tokenId },
    data: { verificationStatus: status },
  });
}

export async function updateTokenMetadataStatus(tokenId, status) {
  return prisma.token.update({
    where: { id: tokenId },
    data: { metadataStatus: status },
  });
}

// ═══════════════════════════════════════════════════════════════════════
// User Management (Admin)
// ═══════════════════════════════════════════════════════════════════════

export async function getAdminUserList({ page = 1, limit = 20, search }) {
  const skip = (Math.max(page, 1) - 1) * limit;

  const where = search
    ? {
        OR: [
          { walletAddress: { contains: search, mode: "insensitive" } },
          { displayName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const totalCount = await prisma.user.count({ where });
  const users = await prisma.user.findMany({
    where,
    take: limit,
    skip,
    select: {
      id: true,
      walletAddress: true,
      displayName: true,
      avatar: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { tokens: true, payments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    users,
    pagination: { total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) },
  };
}

export async function isMaintenanceMode() {
  return getFeatureFlag("maintenance_mode");
}
