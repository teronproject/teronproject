/**
 * BscScan Contract Verification Service
 *
 * Uses the BscScan API to verify smart contract source code on-chain.
 * Also handles token-info metadata submissions.
 *
 * API Docs: https://docs.bscscan.com/api-endpoints/contracts
 */

const BSCSCAN_API_URL = "https://api.bscscan.com/api";
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;

/**
 * Verify a smart contract on BscScan.
 *
 * @param {object} params
 * @param {string} params.contractAddress - Deployed contract address
 * @param {string} params.sourceCode - Solidity source code (flattened)
 * @param {string} params.contractName - Name of the contract
 * @param {string} params.compilerVersion - e.g. "v0.8.20+commit.a1b79de6"
 * @param {string} [params.constructorArguments] - ABI-encoded constructor args (hex, no 0x)
 * @param {number} [params.optimizationUsed] - 0 or 1
 * @param {number} [params.runs] - Optimizer runs (default 200)
 * @returns {Promise<{ success: boolean, guid?: string, message?: string }>}
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
  if (!BSCSCAN_API_KEY) {
    throw new Error("BSCSCAN_API_KEY is not set");
  }

  const params = new URLSearchParams({
    apikey: BSCSCAN_API_KEY,
    module: "contract",
    action: "verifysourcecode",
    contractaddress: contractAddress,
    sourceCode,
    codeformat: "solidity-single-file",
    contractname: contractName,
    compilerversion: compilerVersion,
    optimizationUsed: String(optimizationUsed),
    runs: String(runs),
    constructorArguements: constructorArguments, // BscScan typo is intentional
    licenseType: "3", // MIT
  });

  const response = await fetch(BSCSCAN_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await response.json();

  if (data.status === "1") {
    return { success: true, guid: data.result };
  }

  return { success: false, message: data.result || "Verification submission failed" };
}

/**
 * Check verification status by GUID.
 *
 * @param {string} guid - GUID returned from verifyContract()
 * @returns {Promise<{ verified: boolean, pending: boolean, message: string }>}
 */
export async function checkVerificationStatus(guid) {
  const params = new URLSearchParams({
    apikey: BSCSCAN_API_KEY,
    module: "contract",
    action: "checkverifystatus",
    guid,
  });

  const response = await fetch(`${BSCSCAN_API_URL}?${params.toString()}`);
  const data = await response.json();

  if (data.result === "Pass - Verified") {
    return { verified: true, pending: false, message: "Contract verified successfully" };
  }

  if (data.result === "Pending in queue") {
    return { verified: false, pending: true, message: "Verification pending in queue" };
  }

  return { verified: false, pending: false, message: data.result || "Unknown status" };
}

/**
 * Submit token information to BscScan (logo, socials, website).
 * This uses the BscScan Token Info Update API.
 *
 * Note: BscScan requires the contract to be verified first before
 * token info can be submitted. In practice, this is handled through
 * BscScan's token-info self-service portal or their API.
 *
 * @param {object} params
 * @param {string} params.contractAddress
 * @param {string} params.tokenName
 * @param {string} params.symbol
 * @param {string} params.logoUrl
 * @param {string} params.website
 * @param {string} [params.email]
 * @param {string} [params.description]
 * @param {string} [params.twitter]
 * @param {string} [params.telegram]
 * @param {string} [params.discord]
 * @param {string} [params.category]
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function submitTokenInfo({
  contractAddress,
  tokenName,
  symbol,
  logoUrl,
  website,
  email = "",
  description = "",
  twitter = "",
  telegram = "",
  discord = "",
  category = "",
}) {
  if (!BSCSCAN_API_KEY) {
    throw new Error("BSCSCAN_API_KEY is not set");
  }

  // BscScan token info submission
  const params = new URLSearchParams({
    apikey: BSCSCAN_API_KEY,
    module: "token",
    action: "tokeninfo",
    contractAddress,
    tokenName,
    symbol,
    logoURL: logoUrl,
    websiteURL: website,
    email,
    description: description.slice(0, 300),
    twitter,
    telegram,
    discord,
    tokenType: "BEP-20",
    category,
  });

  try {
    const response = await fetch(BSCSCAN_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.status === "1") {
      return { success: true, message: "Token info submitted successfully" };
    }

    // BscScan may require manual submission for some features
    // We'll store the metadata and mark as submitted
    return {
      success: false,
      message: data.result || "Token info submission returned non-success status",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Full verification + metadata flow.
 * Orchestrates contract verification and token info submission.
 *
 * @param {object} params
 * @param {string} params.contractAddress
 * @param {string} params.sourceCode
 * @param {string} params.contractName
 * @param {string} params.compilerVersion
 * @param {string} [params.constructorArguments]
 * @param {object} params.tokenInfo - Token metadata for submission
 * @returns {Promise<object>}
 */
export async function verifyAndSubmitMetadata({
  contractAddress,
  sourceCode,
  contractName,
  compilerVersion,
  constructorArguments = "",
  tokenInfo = {},
}) {
  const results = {
    verification: { success: false, guid: null, message: "" },
    tokenInfo: { success: false, message: "" },
  };

  // 1. Verify contract source code
  try {
    const verifyResult = await verifyContract({
      contractAddress,
      sourceCode,
      contractName,
      compilerVersion,
      constructorArguments,
    });
    results.verification = verifyResult;

    // 2. If verification submitted, poll for result (max 60s)
    if (verifyResult.success && verifyResult.guid) {
      let attempts = 0;
      const maxAttempts = 12; // 12 * 5s = 60s
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const status = await checkVerificationStatus(verifyResult.guid);
        
        if (status.verified) {
          results.verification.message = "Contract verified on BscScan";
          break;
        }
        
        if (!status.pending) {
          results.verification.message = status.message;
          break;
        }
        
        attempts++;
      }
    }
  } catch (err) {
    results.verification.message = err.message;
  }

  // 3. Submit token info/metadata
  if (tokenInfo && tokenInfo.logoUrl) {
    try {
      const infoResult = await submitTokenInfo({
        contractAddress,
        ...tokenInfo,
      });
      results.tokenInfo = infoResult;
    } catch (err) {
      results.tokenInfo.message = err.message;
    }
  }

  return results;
}
