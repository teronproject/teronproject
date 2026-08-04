import { createPublicClient, http, parseUnits, encodeDeployData } from 'viem';
import { bsc } from 'viem/chains';
import { BEP20_ABI, BEP20_BYTECODE } from './lib/contracts/bep20.js';

const client = createPublicClient({
  chain: bsc,
  transport: http('https://bsc-dataseed1.binance.org')
});

async function run() {
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
    const gas = await client.estimateGas({
      data,
      account: "0x0000000000000000000000000000000000000001"
    });
    console.log("Gas estimation SUCCESS! Gas:", gas.toString());
  } catch (err) {
    console.error("Gas estimation FAILED:", err.message);
  }
}
run();
