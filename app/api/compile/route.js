import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import solc from 'solc';

// Helper to sanitize token name to a valid Solidity contract name
// E.g., "My Token!" -> "MyToken"
function sanitizeContractName(name) {
  const sanitized = name.replace(/[^a-zA-Z0-9]/g, '');
  // Ensure it starts with a letter
  if (!/^[a-zA-Z]/.test(sanitized)) {
    return 'Token' + sanitized;
  }
  return sanitized;
}

export async function POST(request) {
  try {
    const { tokenName } = await request.json();

    if (!tokenName) {
      return NextResponse.json({ error: "Token name is required" }, { status: 400 });
    }

    const contractName = sanitizeContractName(tokenName);
    
    // Read the base template
    const templatePath = path.join(process.cwd(), 'ERC20.sol');
    const templateSource = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholder with actual contract name
    const sourceCode = templateSource.replace(/\{\{CONTRACT_NAME\}\}/g, contractName);

    const fileName = `Teron${contractName}.sol`;

    // Prepare solc input
    const input = {
      language: 'Solidity',
      sources: {
        [fileName]: {
          content: sourceCode
        }
      },
      settings: {
        evmVersion: 'paris',
        optimizer: {
          enabled: true,
          runs: 200
        },
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };

    // Compile
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
      const hasErrors = output.errors.some(e => e.severity === 'error');
      if (hasErrors) {
        console.error("Compilation errors:", output.errors);
        return NextResponse.json({ error: "Compilation failed", details: output.errors }, { status: 500 });
      }
    }

    const compiledContract = output.contracts[fileName][contractName];
    
    if (!compiledContract) {
      return NextResponse.json({ error: "Contract compilation output missing" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      contractName,
      abi: compiledContract.abi,
      bytecode: '0x' + compiledContract.evm.bytecode.object,
      sourceCode: sourceCode
    });

  } catch (error) {
    console.error("Compile API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
