import fetch from 'node-fetch';

async function testCompile() {
  try {
    const res = await fetch('http://localhost:3000/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenName: 'Doge Coin Super' })
    });
    
    const data = await res.json();
    console.log(data);
    
    if (data.success) {
      console.log("Success!");
      console.log("Contract Name:", data.contractName);
      console.log("ABI keys:", Object.keys(data.abi).length);
      console.log("Bytecode length:", data.bytecode.length);
      console.log("Source contains 'contract DogeCoinSuper':", data.sourceCode.includes("contract DogeCoinSuper"));
    }
  } catch(e) {
    console.error(e);
  }
}

testCompile();
