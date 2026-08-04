import { createPublicClient, http, formatEther } from 'viem';
import { bsc } from 'viem/chains';

const client = createPublicClient({
  chain: bsc,
  transport: http('https://bsc-dataseed1.binance.org')
});

async function run() {
  try {
    const address = '0x666b29be331bcc22598bd2c073722ee3e564abd9';
    const balance = await client.getBalance({ address });
    console.log(`Balance of ${address}: ${formatEther(balance)} BNB`);
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
run();
