import prisma from "@/lib/prisma";
import { getActivePricing } from "@/services/pricing";
import { getContractSourceCode, COMPILER_VERSION } from "@/services/bscscan";
import { sendDeploymentSuccessEmail, sendPaymentInvoiceEmail } from "@/services/email";
import { encodeAbiParameters, parseUnits } from "viem";

/**
 * Token Deployment Service
 */

// Etherscan V2 unified API — chainid in URL, not body
const V2_POST_URL = "https://api.etherscan.io/v2/api?chainid=56";
const CHAIN_ID = "56";
function getApiKey() {
  return process.env.ETHERSCAN_API_KEY || process.env.BSCSCAN_API_KEY;
}

/**
 * Compute ABI-encoded constructor arguments using viem.
 */
function computeConstructorArgs(tokenName, tokenSymbol, totalSupply, decimals, ownerAddress) {
  const rawSupply = parseUnits(totalSupply.toString(), Number(decimals));
  const encoded = encodeAbiParameters(
    [
      { name: "name_", type: "string" },
      { name: "symbol_", type: "string" },
      { name: "initialSupply_", type: "uint256" },
      { name: "decimals_", type: "uint8" },
      { name: "initialOwner_", type: "address" },
    ],
    [tokenName, tokenSymbol, rawSupply, Number(decimals), ownerAddress]
  );
  return encoded.slice(2);
}

/**
 * Submit verification to BscScan and poll for result.
 * Tries optimization ON then OFF.
 */
async function verifyOnBscScan(contractAddress, constructorArgs, tokenName) {
  const apiKey = getApiKey();
  if (!apiKey) return { verified: false, message: "No API key configured" };

  const sanitizedName = tokenName.replace(/[^a-zA-Z0-9]/g, '');
  const contractName = /^[a-zA-Z]/.test(sanitizedName) ? sanitizedName : 'Token' + sanitizedName;
  const sourceCode = getContractSourceCode(tokenName);

  const attempts = [
    { opt: "1", runs: "200", label: "optimization=1, runs=200" },
    { opt: "0", runs: "200", label: "optimization=0" },
  ];

  for (const attempt of attempts) {
    console.log(`[BscScan] Attempt: ${attempt.label}`);

    // V2: chainid is in V2_POST_URL, NOT in the body
    const params = new URLSearchParams({
      apikey: apiKey,
      module: "contract",
      action: "verifysourcecode",
      contractaddress: contractAddress,
      sourceCode: sourceCode,
      codeformat: "solidity-single-file",
      contractname: contractName,
      compilerversion: COMPILER_VERSION,
      optimizationUsed: attempt.opt,
      runs: attempt.runs,
      constructorArguements: constructorArgs,
      evmversion: "paris",
      licenseType: "3",
    });

    try {
      const submitRes = await fetch(V2_POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const submitData = await submitRes.json();
      console.log(`[BscScan] Submit response:`, JSON.stringify(submitData));

      if (submitData.status === "1" && submitData.result) {
        const guid = submitData.result;
        console.log(`[BscScan] GUID: ${guid}. Polling...`);

        for (let i = 0; i < 18; i++) {
          await new Promise(r => setTimeout(r, 5000));
          const statusRes = await fetch(
            `https://api.etherscan.io/v2/api?chainid=${CHAIN_ID}&module=contract&action=checkverifystatus&guid=${guid}&apikey=${apiKey}`
          );
          const statusData = await statusRes.json();
          console.log(`[BscScan] Poll ${i + 1}:`, statusData.result);

          if (statusData.result === "Pass - Verified") {
            return { verified: true, message: "Contract verified on BscScan!" };
          }
          if (statusData.result !== "Pending in queue") {
            console.log(`[BscScan] Failed:`, statusData.result);
            break;
          }
        }
      } else {
        console.log(`[BscScan] Rejected:`, submitData.result);
      }
    } catch (err) {
      console.error(`[BscScan] Error:`, err.message);
    }
  }

  return { verified: false, message: "All verification attempts failed" };
}

/**
 * Submit token metadata/info via V2 API.
 */
async function submitTokenInfo(contractAddress, tokenInfo) {
  const apiKey = getApiKey();
  if (!apiKey || !tokenInfo?.logoUrl) {
    return { success: false, message: "Missing API key or logo URL" };
  }

  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      module: "token",
      action: "tokeninfo",
      contractAddress,
      tokenName: tokenInfo.tokenName,
      symbol: tokenInfo.symbol,
      logoURL: tokenInfo.logoUrl,
      websiteURL: tokenInfo.website || "",
      email: tokenInfo.email || "",
      description: (tokenInfo.description || "").slice(0, 300),
      twitter: tokenInfo.twitter || "",
      telegram: tokenInfo.telegram || "",
      discord: tokenInfo.discord || "",
      tokenType: "BEP-20",
    });

    const res = await fetch(V2_POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await res.json();
    console.log("[BscScan] Token info response:", JSON.stringify(data));
    return { success: data.status === "1", message: data.result || "Submitted" };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// ─────────────────────────────────────────────────────
// initiateDeployment
// ─────────────────────────────────────────────────────

export async function initiateDeployment(userId, data, paymentTxHash = null) {
  const {
    name, symbol, decimals, totalSupply, chain,
    shortDescription, description, website, twitter, telegram, discord,
    logoUrl, bannerUrl, addVerification, addMetadata, projectCategory, contactEmail
  } = data;

  const pricing = await getActivePricing();
  const verificationPrice = pricing.find(p => p.serviceKey === "verification")?.priceBnb || 0.0033;
  const metadataPrice = pricing.find(p => p.serviceKey === "metadata")?.priceBnb || 0.005;

  const deployment = await prisma.$transaction(async (tx) => {
    const token = await tx.token.create({
      data: {
        deployerId: userId, name, symbol, decimals, totalSupply,
        chain: chain || "BSC", deploymentStatus: "PENDING",
      }
    });

    await tx.tokenProfile.create({
      data: {
        tokenId: token.id, shortDescription, description,
        website, twitter, telegram, discord, logoUrl, bannerUrl,
        projectCategory, contactEmail,
      }
    });

    const newDeployment = await tx.deployment.create({
      data: { tokenId: token.id, userId, status: "PENDING" }
    });

    const services = [];

    if (addVerification) {
      await tx.payment.create({
        data: {
          userId, tokenId: token.id, serviceType: "VERIFICATION",
          amountBnb: verificationPrice,
          status: paymentTxHash ? "CONFIRMED" : "PENDING",
          ...(paymentTxHash && { txHash: paymentTxHash }),
          coldWalletAddress: process.env.COLD_WALLET_ADDRESS || null,
        }
      });
      services.push({ name: "Contract Verification", amountBnb: verificationPrice });
    }

    if (addMetadata) {
      await tx.payment.create({
        data: {
          userId, tokenId: token.id, serviceType: "METADATA",
          amountBnb: metadataPrice,
          status: paymentTxHash ? "CONFIRMED" : "PENDING",
          ...(paymentTxHash && { txHash: paymentTxHash }),
          coldWalletAddress: process.env.COLD_WALLET_ADDRESS || null,
        }
      });
      services.push({ name: "On-Chain Logo & Info", amountBnb: metadataPrice });
    }

    if (paymentTxHash && contactEmail && services.length > 0) {
      const totalBnb = services.reduce((sum, s) => sum + s.amountBnb, 0);
      sendPaymentInvoiceEmail({
        to: contactEmail, tokenName: name, symbol, services, totalBnb,
        paymentTxHash,
        walletAddress: (await tx.user.findUnique({ where: { id: userId } }))?.walletAddress || "",
      }).catch(err => console.error("Invoice email error:", err));
    }

    return { ...newDeployment, tokenId: token.id, token };
  });

  return deployment;
}

// ─────────────────────────────────────────────────────
// processPostDeployment
// ─────────────────────────────────────────────────────

export async function processPostDeployment(deploymentId, contractAddress, deployTxHash) {
  console.log(`[PostDeploy] ═══════════════════════════════════════════`);
  console.log(`[PostDeploy] Deployment: ${deploymentId}`);
  console.log(`[PostDeploy] Contract: ${contractAddress}, TX: ${deployTxHash}`);

  const deployment = await prisma.deployment.findUnique({
    where: { id: deploymentId },
    include: { token: { include: { profile: true, deployer: true } } },
  });

  if (!deployment) throw new Error("Deployment not found");

  const { token } = deployment;
  const profile = token.profile;
  const user = token.deployer;

  console.log(`[PostDeploy] Token: ${token.name} (${token.symbol}), Deployer: ${user?.walletAddress}`);

  const payments = await prisma.payment.findMany({ where: { tokenId: token.id } });
  const hasVerification = payments.some(p => p.serviceType === "VERIFICATION");
  const hasMetadata = payments.some(p => p.serviceType === "METADATA");

  console.log(`[PostDeploy] Services: verification=${hasVerification}, metadata=${hasMetadata}`);

  let verificationResult = { verified: false, message: "Not purchased" };
  let metadataResult = { success: false, message: "Not purchased" };

  // ─── VERIFICATION ──────────────────────────────────
  if (hasVerification && user?.walletAddress) {
    const constructorArgs = computeConstructorArgs(
      token.name, token.symbol, token.totalSupply, token.decimals, user.walletAddress
    );
    console.log(`[PostDeploy] Constructor args: ${constructorArgs.slice(0, 120)}...`);

    verificationResult = await verifyOnBscScan(contractAddress, constructorArgs, token.name);
    console.log(`[PostDeploy] Verification:`, JSON.stringify(verificationResult));

    await prisma.payment.updateMany({
      where: { tokenId: token.id, serviceType: "VERIFICATION" },
      data: { status: verificationResult.verified ? "COMPLETED" : "CONFIRMED" },
    });
    await prisma.token.update({
      where: { id: token.id },
      data: { verificationStatus: verificationResult.verified ? "VERIFIED" : "PENDING" },
    });
  }

  // ─── METADATA ──────────────────────────────────────
  if (hasMetadata && profile?.logoUrl) {
    metadataResult = await submitTokenInfo(contractAddress, {
      tokenName: token.name, symbol: token.symbol,
      logoUrl: profile.logoUrl, website: profile.website || "",
      email: profile.contactEmail || "",
      description: profile.shortDescription || "",
      twitter: profile.twitter || "", telegram: profile.telegram || "",
      discord: profile.discord || "",
    });
    console.log(`[PostDeploy] Metadata:`, JSON.stringify(metadataResult));

    await prisma.payment.updateMany({
      where: { tokenId: token.id, serviceType: "METADATA" },
      data: { status: metadataResult.success ? "COMPLETED" : "CONFIRMED" },
    });
  }

  // ─── EMAIL ─────────────────────────────────────────
  const contactEmail = profile?.contactEmail || user?.email;
  if (contactEmail) {
    try {
      await sendDeploymentSuccessEmail({
        to: contactEmail, tokenName: token.name, symbol: token.symbol,
        contractAddress, txHash: deployTxHash, totalSupply: token.totalSupply,
        verified: verificationResult.verified || false,
        metadataSubmitted: metadataResult.success || false,
      });
      console.log(`[PostDeploy] Email sent to ${contactEmail}`);
    } catch (err) {
      console.error("[PostDeploy] Email error:", err.message);
    }
  }

  console.log(`[PostDeploy] ═══════════════════════════════════════════`);
  return { contractAddress, verification: verificationResult, metadata: metadataResult, emailSent: !!contactEmail };
}

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────

export async function getDeploymentHistory(userId) {
  return prisma.deployment.findMany({
    where: { userId },
    include: { token: { include: { profile: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTokenById(tokenId) {
  return prisma.token.findUnique({ where: { id: tokenId }, include: { profile: true } });
}

export async function getDeploymentById(deploymentId) {
  return prisma.deployment.findUnique({
    where: { id: deploymentId },
    include: { token: { include: { profile: true } } },
  });
}
