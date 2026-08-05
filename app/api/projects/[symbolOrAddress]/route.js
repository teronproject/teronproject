import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/tokens/[symbolOrAddress]
 * Lookup a single token by Symbol, Contract Address, or DB ID.
 */
export async function GET(request, { params }) {
  try {
    const { symbolOrAddress } = await params;

    if (!symbolOrAddress) {
      return NextResponse.json({ message: "Missing token identifier" }, { status: 400 });
    }

    const query = decodeURIComponent(symbolOrAddress).trim();
    const isAddress = query.startsWith("0x") && query.length === 42;
    const isCuid = query.length === 25 || query.length === 36; // CUID or UUID length match

    // Try to find by Contract Address first if it looks like an EVM address,
    // otherwise try Symbol match (case-insensitive) or DB ID
    const token = await prisma.token.findFirst({
      where: {
        OR: [
          ...(isAddress ? [{ contractAddress: { equals: query, mode: "insensitive" } }] : []),
          ...(isCuid ? [{ id: query }] : []),
          { symbol: { equals: query, mode: "insensitive" } },
        ],
      },
      include: {
        profile: true,
        deployer: {
          select: {
            id: true,
            walletAddress: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        // If duplicate symbols exist, prioritize CONFIRMED tokens, then newest
        createdAt: "desc",
      },
    });

    if (!token) {
      return NextResponse.json({ message: "Token not found" }, { status: 404 });
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error looking up token:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
