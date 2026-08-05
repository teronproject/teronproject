import prisma from "@/lib/prisma";

// Default pricing in USD
const DEFAULT_PRICING = [
  { serviceKey: "verification", priceUsd: 2.0, label: "Contract Verification" },
  { serviceKey: "metadata", priceUsd: 3.0, label: "On-Chain Metadata" }
];

export async function getLiveBnbPrice() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd", {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    const data = await res.json();
    return data?.binancecoin?.usd || 600; // Fallback to 600 if API fails
  } catch (error) {
    console.error("Failed to fetch live BNB price from CoinGecko:", error);
    return 600; // Fallback
  }
}

export async function getActivePricing() {
  // Ensure we have pricing configs in the database
  let configs = await prisma.pricingConfig.findMany({
    where: { active: true },
  });

  if (configs.length === 0) {
    // Seed default configs if DB is empty
    for (const p of DEFAULT_PRICING) {
      await prisma.pricingConfig.upsert({
        where: { serviceKey: p.serviceKey },
        update: {},
        create: {
          serviceKey: p.serviceKey,
          priceUsd: p.priceUsd,
          priceBnb: p.priceUsd / 600, // rough placeholder, updated below
          label: p.label,
          active: true,
        }
      });
    }
    configs = await prisma.pricingConfig.findMany({ where: { active: true } });
  }

  const liveBnbPriceUsd = await getLiveBnbPrice();

  return configs.map(config => {
    // If USD price is set, dynamically calculate BNB price
    const calculatedBnb = config.priceUsd 
      ? (config.priceUsd / liveBnbPriceUsd) 
      : config.priceBnb;
    
    // Round to 4 decimal places for clean UI (e.g., 0.0033)
    const formattedBnb = Math.ceil(calculatedBnb * 10000) / 10000;

    return {
      ...config,
      priceBnb: formattedBnb, 
    };
  });
}
