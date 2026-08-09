import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/services/auth";
import { encodeAbiParameters, parseUnits } from "viem";

/**
 * POST /api/admin/verify-contract
 *
 * Manually trigger BscScan contract verification for a deployed token.
 * Body: { contractAddress: string } OR { tokenId: string }
 *
 * Uses the BSC-specific API (api.bscscan.com) with the BscScan API key.
 * The V2 unified API (api.etherscan.io) requires a paid plan for BSC.
 */

// Etherscan V2 API — chainid in URL, not body
const V2_POST_URL = "https://api.etherscan.io/v2/api?chainid=56";
const CHAIN_ID = "56";
function getApiKey() {
  return process.env.ETHERSCAN_API_KEY || process.env.BSCSCAN_API_KEY;
}

const SOURCE_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TeronBEP20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        uint8 decimals_,
        address initialOwner_
    ) {
        name = name_;
        symbol = symbol_;
        decimals = decimals_;
        totalSupply = initialSupply_;
        owner = initialOwner_;
        balanceOf[initialOwner_] = initialSupply_;
        emit Transfer(address(0), initialOwner_, initialSupply_);
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool success) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Allowance exceeded");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}`;

const COMPILER_VERSION = "v0.8.20+commit.a1b79de6";
const CONTRACT_NAME = "TeronBEP20";

/**
 * Compute ABI-encoded constructor arguments.
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
 * Extract constructor args from the deployment tx input data.
 */
async function extractConstructorArgsFromTx(txHash) {
  const rpcUrl = process.env.NEXT_PUBLIC_BNB_RPC_URL || "https://bsc-dataseed1.binance.org";
  try {
    const rpcRes = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "eth_getTransactionByHash", params: [txHash], id: 1 }),
    });
    const rpcData = await rpcRes.json();
    if (!rpcData.result?.input) return null;

    const input = rpcData.result.input;
    // CBOR metadata pattern: a2646970667358221220[32-byte hash]64736f6c6343[3-byte version]0033
    const marker = "a2646970667358221220";
    const idx = input.indexOf(marker);
    if (idx === -1) return null;

    const argsStart = idx + 20 + 64 + 12 + 6 + 4;
    if (argsStart >= input.length) return null;

    const args = input.slice(argsStart);
    return args.length > 0 ? args : null;
  } catch (err) {
    console.error("Failed to extract constructor args:", err);
    return null;
  }
}

/**
 * Submit verification to BscScan V1 API.
 */
async function submitVerification(contractAddress, constructorArgs, optimizationUsed = "1", runs = "200") {
  const params = new URLSearchParams({
    apikey: getApiKey(),
    module: "contract",
    action: "verifysourcecode",
    contractaddress: contractAddress,
    sourceCode: SOURCE_CODE,
    codeformat: "solidity-single-file",
    contractname: CONTRACT_NAME,
    compilerversion: COMPILER_VERSION,
    optimizationUsed,
    runs,
    constructorArguements: constructorArgs, // BscScan intentional typo
    licenseType: "3",
  });

  const res = await fetch(V2_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  return res.json();
}

async function pollVerification(guid) {
  for (let i = 0; i < 18; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const res = await fetch(`https://api.etherscan.io/v2/api?chainid=${CHAIN_ID}&module=contract&action=checkverifystatus&guid=${guid}&apikey=${getApiKey()}`);
    const data = await res.json();

    if (data.result === "Pass - Verified") {
      return { verified: true, message: "Contract verified successfully!" };
    }
    if (data.result !== "Pending in queue") {
      return { verified: false, message: data.result };
    }
  }
  return { verified: false, message: "Timed out — check BscScan manually" };
}

export async function POST(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Use the proper isAdmin() which checks both DB role AND env var
    if (!(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Admin only" }, { status: 403 });
    }

    if (!getApiKey()) {
      return NextResponse.json({ success: false, message: "ETHERSCAN_API_KEY not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { contractAddress, tokenId } = body;

    let token;
    if (tokenId) {
      token = await prisma.token.findUnique({
        where: { id: tokenId },
        include: { profile: true, deployer: true, deployments: true },
      });
    } else if (contractAddress) {
      token = await prisma.token.findFirst({
        where: { contractAddress },
        include: { profile: true, deployer: true, deployments: true },
      });
    }

    if (!token) {
      return NextResponse.json({ success: false, message: "Token not found in database" }, { status: 404 });
    }

    if (!token.contractAddress) {
      return NextResponse.json({ success: false, message: "Token not deployed yet — no contract address" }, { status: 400 });
    }

    const deployment = token.deployments?.[0];
    const ownerAddress = token.deployer?.walletAddress;

    if (!ownerAddress) {
      return NextResponse.json({ success: false, message: "Could not determine deployer wallet address" }, { status: 400 });
    }

    const logs = [];
    const log = (msg) => { logs.push(msg); console.log(`[Verify] ${msg}`); };

    log(`Token: ${token.name} (${token.symbol})`);
    log(`Contract: ${token.contractAddress}`);
    log(`Deployer: ${ownerAddress}`);
    log(`Supply: ${token.totalSupply}, Decimals: ${token.decimals}`);

    // Step 1: Check if already verified
    log("Checking if already verified...");
    try {
      const checkRes = await fetch(`https://api.etherscan.io/v2/api?chainid=${CHAIN_ID}&module=contract&action=getsourcecode&address=${token.contractAddress}&apikey=${getApiKey()}`);
      const checkData = await checkRes.json();
      if (checkData.result?.[0]?.SourceCode && checkData.result[0].SourceCode !== "") {
        log("✅ Already verified!");
        return NextResponse.json({
          success: true, alreadyVerified: true,
          message: "Contract is already verified on BscScan",
          contractName: checkData.result[0].ContractName,
          compiler: checkData.result[0].CompilerVersion,
          logs,
        });
      }
    } catch (err) {
      log(`Warning: Could not check verification status: ${err.message}`);
    }

    // Step 2: Compute constructor args
    log("Computing constructor arguments...");
    const computedArgs = computeConstructorArgs(token.name, token.symbol, token.totalSupply, token.decimals, ownerAddress);
    log(`Computed args (${computedArgs.length} hex chars): ${computedArgs.slice(0, 120)}...`);

    // Also try extracting from tx
    let txArgs = null;
    if (deployment?.txHash) {
      log(`Extracting args from deploy tx: ${deployment.txHash}`);
      txArgs = await extractConstructorArgsFromTx(deployment.txHash);
      if (txArgs) {
        log(`TX args (${txArgs.length} hex chars): ${txArgs.slice(0, 120)}...`);
        log(`Args match: ${computedArgs === txArgs}`);
      } else {
        log("Could not extract from tx — using computed args");
      }
    }

    const constructorArgs = txArgs || computedArgs;
    log(`Using ${txArgs ? "tx-extracted" : "computed"} constructor args`);

    // Step 3: Try verification — optimization=1, runs=200
    log("Attempt 1: optimization=1, runs=200");
    const r1 = await submitVerification(token.contractAddress, constructorArgs, "1", "200");
    log(`Response: ${JSON.stringify(r1)}`);

    if (r1.status === "1") {
      log(`GUID: ${r1.result}. Polling...`);
      const poll1 = await pollVerification(r1.result);
      log(`Result: ${JSON.stringify(poll1)}`);
      if (poll1.verified) {
        await prisma.token.update({ where: { id: token.id }, data: { verificationStatus: "VERIFIED" } });
        return NextResponse.json({ success: true, message: "🎉 Contract verified!", attempt: 1, logs });
      }
    }

    // Step 4: Try optimization=0
    log("Attempt 2: optimization=0");
    const r2 = await submitVerification(token.contractAddress, constructorArgs, "0", "200");
    log(`Response: ${JSON.stringify(r2)}`);

    if (r2.status === "1") {
      log(`GUID: ${r2.result}. Polling...`);
      const poll2 = await pollVerification(r2.result);
      log(`Result: ${JSON.stringify(poll2)}`);
      if (poll2.verified) {
        await prisma.token.update({ where: { id: token.id }, data: { verificationStatus: "VERIFIED" } });
        return NextResponse.json({ success: true, message: "🎉 Contract verified!", attempt: 2, logs });
      }
    }

    // Step 5: Try with alternate args if available
    if (txArgs && txArgs !== computedArgs) {
      log("Attempt 3: alternate args, optimization=1");
      const r3 = await submitVerification(token.contractAddress, computedArgs, "1", "200");
      log(`Response: ${JSON.stringify(r3)}`);
      if (r3.status === "1") {
        const poll3 = await pollVerification(r3.result);
        log(`Result: ${JSON.stringify(poll3)}`);
        if (poll3.verified) {
          await prisma.token.update({ where: { id: token.id }, data: { verificationStatus: "VERIFIED" } });
          return NextResponse.json({ success: true, message: "🎉 Contract verified!", attempt: 3, logs });
        }
      }
    }

    return NextResponse.json({ success: false, message: "All verification attempts failed. See logs.", logs });
  } catch (error) {
    console.error("Verify contract error:", error);
    return NextResponse.json({ success: false, message: error.message, stack: error.stack }, { status: 500 });
  }
}
