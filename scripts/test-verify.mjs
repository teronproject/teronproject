/**
 * Test BscScan Verification — Etherscan V2 API with chainid in URL (not body)
 * 
 * Run: node scripts/test-verify.mjs <CONTRACT_ADDRESS>
 *
 * Key insight: For V2 POST requests, chainid MUST be in the URL query string,
 * NOT in the POST body. The V1 API is fully deprecated.
 */

import 'dotenv/config';

// V2: chainid goes in the URL, not the body!
const API_KEY = process.env.ETHERSCAN_API_KEY || process.env.BSCSCAN_API_KEY;
console.log("API Key:", API_KEY ? `${API_KEY.slice(0,8)}...` : "NOT SET");
const BSC_RPC = process.env.NEXT_PUBLIC_BNB_RPC_URL || "https://bsc-dataseed1.binance.org";

const VERIFY_URL = "https://api.etherscan.io/v2/api?chainid=56";
const CHECK_URL = (params) => `https://api.etherscan.io/v2/api?chainid=56&${params}`;

const contractAddress = process.argv[2] || "0x1fde0a62f82306fe226566f36dc67eed533b6aa4";

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

async function main() {
  console.log("=== Etherscan V2 Test (chainid in URL, NOT body) ===\n");
  console.log("Contract:", contractAddress);
  console.log("POST URL:", VERIFY_URL);

  // Step 1: Check status (GET — this worked before!)
  console.log("\n--- Step 1: Check status ---");
  const checkRes = await fetch(CHECK_URL(`module=contract&action=getsourcecode&address=${contractAddress}&apikey=${API_KEY}`));
  const checkData = await checkRes.json();
  console.log("Status:", checkData.status, "Message:", checkData.message);
  
  if (checkData.result?.[0]?.SourceCode && checkData.result[0].SourceCode !== "") {
    console.log("✅ Already verified!");
    console.log("Name:", checkData.result[0].ContractName, "Compiler:", checkData.result[0].CompilerVersion);
    return;
  }
  console.log("Not verified yet.");

  // Step 2: Extract constructor args from tx
  console.log("\n--- Step 2: Constructor args ---");
  let constructorArgs = "";
  
  const txHash = process.argv[3];
  if (txHash) {
    const rpcRes = await fetch(BSC_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "eth_getTransactionByHash", params: [txHash], id: 1 }),
    });
    const rpcData = await rpcRes.json();
    if (rpcData.result?.input) {
      const input = rpcData.result.input;
      const marker = "a2646970667358221220";
      const idx = input.indexOf(marker);
      if (idx !== -1) {
        const argsStart = idx + 20 + 64 + 12 + 6 + 4;
        constructorArgs = input.slice(argsStart);
        console.log("Extracted:", constructorArgs.length, "hex chars");
      }
    }
  } else {
    console.log("No TX hash — submitting without constructor args.");
    console.log("Usage: node scripts/test-verify.mjs <ADDR> <TX_HASH>");
  }

  // Step 3: POST verification — chainid in URL, NOT in body
  const attempts = [
    { opt: "1", runs: "200", label: "opt=1, runs=200" },
    { opt: "0", runs: "200", label: "opt=0" },
  ];

  for (const attempt of attempts) {
    console.log(`\n--- Step 3: Verify (${attempt.label}) ---`);
    
    // KEY FIX: chainid is in the URL (VERIFY_URL), NOT in the body params
    const params = new URLSearchParams({
      apikey: API_KEY,
      module: "contract",
      action: "verifysourcecode",
      contractaddress: contractAddress,
      sourceCode: SOURCE_CODE,
      codeformat: "solidity-single-file",
      contractname: "TeronBEP20",
      compilerversion: "v0.8.20+commit.a1b79de6",
      optimizationUsed: attempt.opt,
      runs: attempt.runs,
      constructorArguements: constructorArgs,
      licenseType: "3",
    });

    console.log("POST to:", VERIFY_URL);
    console.log("Body keys:", [...params.keys()].join(", "));

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.status === "1") {
      const guid = data.result;
      console.log("\n✅ Submitted! GUID:", guid, "— Polling...");
      
      for (let i = 0; i < 12; i++) {
        await new Promise(r => setTimeout(r, 5000));
        const sRes = await fetch(CHECK_URL(`module=contract&action=checkverifystatus&guid=${guid}&apikey=${API_KEY}`));
        const sData = await sRes.json();
        console.log(`  Poll ${i+1}:`, sData.result);
        
        if (sData.result === "Pass - Verified") {
          console.log("\n🎉 CONTRACT VERIFIED SUCCESSFULLY!");
          return;
        }
        if (sData.result !== "Pending in queue") {
          console.log("\n❌ Failed:", sData.result);
          break;
        }
      }
    } else {
      console.log("❌ Failed:", data.result);
    }
  }
  
  console.log("\n⚠️ Done. Check errors above.");
}

main().catch(console.error);
