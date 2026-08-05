import prisma from "@/lib/prisma";
import { getActivePricing } from "@/services/pricing";

/**
 * Token Deployment Service
 *
 * Owns: Wizard state, contract deployment, transaction simulation, deployment history.
 */

/**
 * Initiate a new token deployment session.
 * Creates the Token, TokenProfile, and a PENDING Deployment record.
 * 
 * @param {string} userId - The ID of the deploying user
 * @param {object} data - The validated token data
 * @returns {Promise<object>} The created Deployment record with nested Token
 */
export async function initiateDeployment(userId, data) {
  const {
    name,
    symbol,
    decimals,
    totalSupply,
    chain,
    shortDescription,
    description,
    website,
    twitter,
    telegram,
    discord,
    logoUrl,
    bannerUrl,
    addVerification
  } = data;

  const pricing = await getActivePricing();
  const verificationPrice = pricing.find(p => p.serviceKey === "verification")?.priceBnb || 0.0033;

  // Use a transaction to ensure all records are created together
  const deployment = await prisma.$transaction(async (tx) => {
    // 1. Create the base Token record
    const token = await tx.token.create({
      data: {
        deployerId: userId,
        name,
        symbol,
        decimals,
        totalSupply,
        chain: chain || "BSC",
        deploymentStatus: "PENDING",
      }
    });

    // 2. Create the TokenProfile
    await tx.tokenProfile.create({
      data: {
        tokenId: token.id,
        shortDescription,
        description,
        website,
        twitter,
        telegram,
        discord,
        logoUrl,
        bannerUrl,
      }
    });

    // 3. Create the Deployment attempt record
    const newDeployment = await tx.deployment.create({
      data: {
        tokenId: token.id,
        userId: userId,
        status: "PENDING",
      }
    });

    // 4. Create Payment records for optional services
    if (addVerification) {
      await tx.payment.create({
        data: {
          userId,
          tokenId: token.id,
          serviceType: "VERIFICATION",
          amountBnb: verificationPrice,
          status: "PENDING",
        }
      });
    }

    return newDeployment;
  });

  return deployment;
}

export async function getDeploymentHistory(userId) {
  return prisma.deployment.findMany({
    where: { userId },
    include: {
      token: {
        include: {
          profile: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getTokenById(tokenId) {
  return prisma.token.findUnique({
    where: { id: tokenId },
    include: { profile: true }
  });
}
