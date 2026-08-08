import prisma from "@/lib/prisma";
import { getActivePricing } from "@/services/pricing";
import { verifyAndSubmitMetadata } from "@/services/bscscan";
import { sendDeploymentSuccessEmail } from "@/services/email";

/**
 * Token Deployment Service
 *
 * Owns: Wizard state, contract deployment, transaction simulation, deployment history.
 */

/**
 * Standard ERC-20 / BEP-20 token source code template for verification.
 * This is the exact Solidity code compiled and deployed on-chain.
 */
const TOKEN_SOURCE_CODE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TeronToken is ERC20 {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        address owner_
    ) ERC20(name_, symbol_) {
        _mint(owner_, totalSupply_);
    }
}
`;

const COMPILER_VERSION = "v0.8.20+commit.a1b79de6";

/**
 * Initiate a new token deployment session.
 * Creates the Token, TokenProfile, and a PENDING Deployment record.
 * 
 * @param {string} userId - The ID of the deploying user
 * @param {object} data - The validated token data
 * @param {string} [paymentTxHash] - Optional BNB payment transaction hash
 * @returns {Promise<object>} The created Deployment record with nested Token
 */
export async function initiateDeployment(userId, data, paymentTxHash = null) {
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
    addVerification,
    addMetadata,
    projectCategory,
    contactEmail
  } = data;

  const pricing = await getActivePricing();
  const verificationPrice = pricing.find(p => p.serviceKey === "verification")?.priceBnb || 0.0033;
  const metadataPrice = pricing.find(p => p.serviceKey === "metadata")?.priceBnb || 0.005;

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
        projectCategory,
        contactEmail,
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
          status: paymentTxHash ? "CONFIRMED" : "PENDING",
          ...(paymentTxHash && { txHash: paymentTxHash }),
        }
      });
    }

    if (addMetadata) {
      await tx.payment.create({
        data: {
          userId,
          tokenId: token.id,
          serviceType: "METADATA",
          amountBnb: metadataPrice,
          status: paymentTxHash ? "CONFIRMED" : "PENDING",
          ...(paymentTxHash && { txHash: paymentTxHash }),
        }
      });
    }

    return { ...newDeployment, tokenId: token.id, token };
  });

  return deployment;
}

/**
 * After a token is deployed on-chain, process post-deployment tasks:
 * - BscScan contract verification
 * - Token info/metadata submission
 * - Success email notification
 *
 * @param {string} deploymentId
 * @param {string} contractAddress - The on-chain contract address
 * @param {string} deployTxHash - The deployment transaction hash
 * @param {string} [constructorArgs] - ABI-encoded constructor arguments
 */
export async function processPostDeployment(deploymentId, contractAddress, deployTxHash, constructorArgs = "") {
  const deployment = await prisma.deployment.findUnique({
    where: { id: deploymentId },
    include: {
      token: {
        include: { profile: true, deployer: true }
      },
    },
  });

  if (!deployment) throw new Error("Deployment not found");

  const { token } = deployment;
  const profile = token.profile;
  const user = token.deployer;

  // Update token with contract address
  await prisma.token.update({
    where: { id: token.id },
    data: {
      contractAddress,
      deploymentStatus: "DEPLOYED",
    },
  });

  // Update deployment status
  await prisma.deployment.update({
    where: { id: deploymentId },
    data: {
      status: "DEPLOYED",
      contractAddress,
      txHash: deployTxHash,
    },
  });

  // Check if premium services were purchased
  const payments = await prisma.payment.findMany({
    where: { tokenId: token.id },
  });

  const hasVerification = payments.some(p => p.serviceType === "VERIFICATION");
  const hasMetadata = payments.some(p => p.serviceType === "METADATA");

  let verificationResult = { success: false };
  let metadataResult = { success: false };

  // Process BscScan verification + metadata
  if (hasVerification || hasMetadata) {
    try {
      const results = await verifyAndSubmitMetadata({
        contractAddress,
        sourceCode: TOKEN_SOURCE_CODE,
        contractName: "TeronToken",
        compilerVersion: COMPILER_VERSION,
        constructorArguments: constructorArgs,
        tokenInfo: hasMetadata ? {
          tokenName: token.name,
          symbol: token.symbol,
          logoUrl: profile?.logoUrl || "",
          website: profile?.website || "",
          email: profile?.contactEmail || "",
          description: profile?.shortDescription || "",
          twitter: profile?.twitter || "",
          telegram: profile?.telegram || "",
          discord: profile?.discord || "",
          category: profile?.projectCategory || "",
        } : null,
      });

      verificationResult = results.verification;
      metadataResult = results.tokenInfo;

      // Update payment records
      if (hasVerification) {
        await prisma.payment.updateMany({
          where: { tokenId: token.id, serviceType: "VERIFICATION" },
          data: {
            status: verificationResult.success ? "COMPLETED" : "CONFIRMED",
          },
        });
      }

      if (hasMetadata) {
        await prisma.payment.updateMany({
          where: { tokenId: token.id, serviceType: "METADATA" },
          data: {
            status: metadataResult.success ? "COMPLETED" : "CONFIRMED",
          },
        });
      }
    } catch (err) {
      console.error("Post-deployment BscScan processing error:", err);
    }
  }

  // Send success email
  const contactEmail = profile?.contactEmail || user?.email;
  if (contactEmail) {
    try {
      await sendDeploymentSuccessEmail({
        to: contactEmail,
        tokenName: token.name,
        symbol: token.symbol,
        contractAddress,
        txHash: deployTxHash,
        totalSupply: token.totalSupply,
        verified: verificationResult.success,
        metadataSubmitted: metadataResult.success,
      });
    } catch (err) {
      console.error("Failed to send deployment email:", err);
    }
  }

  return {
    contractAddress,
    verification: verificationResult,
    metadata: metadataResult,
    emailSent: !!contactEmail,
  };
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

export async function getDeploymentById(deploymentId) {
  return prisma.deployment.findUnique({
    where: { id: deploymentId },
    include: {
      token: {
        include: { profile: true }
      },
    },
  });
}
