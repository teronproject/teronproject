import { encodeDeployData, parseUnits } from 'viem';
import { BEP20_ABI, BEP20_BYTECODE } from './lib/contracts/bep20.js';

try {
  const data = encodeDeployData({
    abi: BEP20_ABI,
    bytecode: BEP20_BYTECODE,
    args: [
      "Test Token",
      "TST",
      parseUnits("1000", 18),
      18,
      "0x0000000000000000000000000000000000000001",
    ],
  });
  console.log("Encode success! Length:", data.length);
} catch (err) {
  console.error("Encode failed:", err.message);
}
