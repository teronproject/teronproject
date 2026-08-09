import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/tokens/list
 * Fetch deployed tokens for leaderboard & search discovery.
 * Supports query params: ?search=keyword & ?limit=20 & ?page=1 & ?status=CONFIRMED
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const status = searchParams.get("status") || "CONFIRMED";

    const skip = (Math.max(page, 1) - 1) * limit;

    // Construct filter condition
    const where = {
      // By default show tokens that have confirmed on-chain deployment or are in progress if requested
      deploymentStatus: status === "ALL" ? undefined : status,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { symbol: { contains: search, mode: "insensitive" } },
          { contractAddress: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    // Fetch sequentially to prevent connection pool exhaustion on Neon Free Tier
    const totalCount = await prisma.token.count({ where });
    const tokens = await prisma.token.findMany({
      where,
      take: limit,
      skip,
      include: {
        profile: true,
        deployments: {
          select: { id: true, status: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        deployer: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Newest deployments first by default
      },
    });

    // Calculate basic profile completeness score for ranking / highlighting
    const scoredTokens = tokens.map((token) => {
      const profile = token.profile;
      let score = 0;
      if (profile?.logoUrl) score += 20;
      if (profile?.bannerUrl) score += 20;
      if (profile?.website) score += 20;
      if (profile?.twitter) score += 20;
      if (profile?.telegram || profile?.discord) score += 20;

      return {
        ...token,
        completenessScore: score,
      };
    });

    return NextResponse.json({
      tokens: scoredTokens,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching token list:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
