import prisma from "@/lib/prisma";

const BASE_URL = "https://www.teron.io";

export default async function sitemap() {
  // ── Static public routes ──
  const staticRoutes = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
    { path: "/investment", changeFrequency: "monthly", priority: 0.7 },
    { path: "/leaderboard", changeFrequency: "daily", priority: 0.9 },
    { path: "/legal", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/cookies", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/disclaimer", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/risk-disclosure", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/security-policy", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // ── Dynamic token pages ──
  let tokenEntries = [];
  try {
    const tokens = await prisma.token.findMany({
      where: { deploymentStatus: "CONFIRMED" },
      select: { symbol: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
      take: 5000,
    });

    tokenEntries = tokens.map((token) => ({
      url: `${BASE_URL}/t/${encodeURIComponent(token.symbol.toLowerCase())}`,
      lastModified: token.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap: Failed to fetch tokens:", error.message);
  }

  return [...staticEntries, ...tokenEntries];
}
