const { execSync } = require('child_process');
const fs = require('fs');

console.log("Compiling ERC20.sol via npx solc...");

try {
  // Ensure build dir exists
  if (!fs.existsSync('./build')) {
    fs.mkdirSync('./build');
  }

  // Compile the contract to individual ABI and BIN files
  execSync('npx -y solc@0.8.20 --abi --bin ERC20.sol -o build', { encoding: 'utf-8' });
  
  // Read the generated files
  const abiContent = fs.readFileSync('./build/ERC20_sol_StandardToken.abi', 'utf-8');
  const binContent = fs.readFileSync('./build/ERC20_sol_StandardToken.bin', 'utf-8').trim();

  if (!abiContent || !binContent) {
    throw new Error("Compilation output files are empty or missing.");
  }

  const fileContent = `/**
 * Standard BEP-20 / ERC-20 Smart Contract Artifacts
 * Auto-compiled with exact 5-argument constructor for Teron Launchpad.
 */

export const BEP20_ABI = ${abiContent};

export const BEP20_BYTECODE = "0x${binContent}";
`;

  fs.writeFileSync('./lib/contracts/bep20.js', fileContent);
  console.log("✅ Successfully compiled ERC20.sol and updated lib/contracts/bep20.js!");
  
  // Clean up
  fs.rmSync('./build', { recursive: true, force: true });
} catch (err) {
  console.error("❌ Compilation failed:", err.message);
  if (err.stdout) console.error(err.stdout);
  if (err.stderr) console.error(err.stderr);
}
