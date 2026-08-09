/**
 * BscScan Contract Verification Service
 *
 * Uses the Etherscan V2 unified API for contract verification.
 * IMPORTANT: Requires an Etherscan API key (from etherscan.io), NOT a BscScan key.
 * The BscScan-specific V1 API has been fully deprecated.
 *
 * V2 API rules:
 * - Base URL: https://api.etherscan.io/v2/api
 * - chainid MUST be in the URL query string (NOT the POST body)
 * - BSC Mainnet chainid = 56
 */

// V2 API: chainid goes in the URL, everything else in the body
const V2_BASE = "https://api.etherscan.io/v2/api";
const CHAIN_ID = "56"; // BSC Mainnet

import fs from 'fs';
import path from 'path';

// Use Etherscan key for V2, fall back to BscScan key
function getApiKey() {
  return process.env.ETHERSCAN_API_KEY || process.env.BSCSCAN_API_KEY;
}

// Build V2 GET URL
function v2Get(params) {
  return `${V2_BASE}?chainid=${CHAIN_ID}&apikey=${getApiKey()}&${params}`;
}

// V2 POST URL (chainid in URL, rest in body)
const V2_POST_URL = `${V2_BASE}?chainid=${CHAIN_ID}`;

/**
 * Reads ERC20.sol and replaces the placeholder with the actual sanitized token name.
 */
export function getContractSourceCode(tokenName) {
  const sanitizedName = tokenName.replace(/[^a-zA-Z0-9]/g, '');
  const contractName = /^[a-zA-Z]/.test(sanitizedName) ? sanitizedName : 'Token' + sanitizedName;
  
  const templatePath = path.join(process.cwd(), 'ERC20.sol');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  
  return templateSource.replace(/\{\{CONTRACT_NAME\}\}/g, contractName);
}

export const COMPILER_VERSION = "v0.8.20+commit.a1b79de6";

/**
 * Verify a smart contract via Etherscan V2 API.
 */
export async function verifyContract({
  contractAddress,
  sourceCode,
  contractName,
  compilerVersion,
  constructorArguments = "",
  optimizationUsed = 1,
  runs = 200,
}) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("ETHERSCAN_API_KEY (or BSCSCAN_API_KEY) is not set");

  console.log(`[BscScan] Verifying ${contractAddress} via V2 API`);

  // POST body — NO chainid here (it's in the URL)
  const params = new URLSearchParams({
    apikey: apiKey,
    module: "contract",
    action: "verifysourcecode",
    contractaddress: contractAddress,
    sourceCode,
    codeformat: "solidity-single-file",
    contractname: contractName,
    compilerversion: compilerVersion,
    optimizationUsed: String(optimizationUsed),
    runs: String(runs),
    constructorArguements: constructorArguments,
    evmversion: "paris",
    licenseType: "3",
  });

  const response = await fetch(V2_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await response.json();
  console.log("[BscScan] Response:", JSON.stringify(data));

  if (data.status === "1") {
    return { success: true, guid: data.result };
  }
  return { success: false, message: data.result || "Verification failed" };
}

/**
 * Poll verification status.
 */
export async function checkVerificationStatus(guid) {
  const url = v2Get(`module=contract&action=checkverifystatus&guid=${guid}`);
  const response = await fetch(url);
  const data = await response.json();
  console.log(`[BscScan] Status:`, data.result);

  if (data.result === "Pass - Verified") return { verified: true, pending: false, message: "Verified" };
  if (data.result === "Pending in queue") return { verified: false, pending: true, message: "Pending" };
  return { verified: false, pending: false, message: data.result || "Unknown" };
}

/**
 * Check if already verified.
 */
export async function isContractVerified(contractAddress) {
  try {
    const url = v2Get(`module=contract&action=getsourcecode&address=${contractAddress}`);
    const res = await fetch(url);
    const data = await res.json();
    return !!(data.result?.[0]?.SourceCode && data.result[0].SourceCode !== "");
  } catch {
    return false;
  }
}

/**
 * Submit token info metadata.
 */
export async function submitTokenInfo({
  contractAddress, tokenName, symbol, logoUrl,
  website, email = "", description = "",
  twitter = "", telegram = "", discord = "",
}) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API key not set");

  const params = new URLSearchParams({
    apikey: apiKey,
    module: "token",
    action: "tokeninfo",
    contractAddress, tokenName, symbol,
    logoURL: logoUrl, websiteURL: website, email,
    description: description.slice(0, 300),
    twitter, telegram, discord,
    tokenType: "BEP-20",
  });

  try {
    const res = await fetch(V2_POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await res.json();
    console.log("[BscScan] Token info:", JSON.stringify(data));
    return { success: data.status === "1", message: data.result || "Submitted" };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
