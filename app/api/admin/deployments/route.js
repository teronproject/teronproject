import { NextResponse } from "next/server";
import { isAdmin } from "@/services/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where = {};
    if (status) where.status = status;

    const [deployments, total, byStatus] = await Promise.all([
      prisma.deployment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          token: { select: { name: true, symbol: true, contractAddress: true } },
          user: { select: { walletAddress: true, displayName: true } },
        },
      }),
      prisma.deployment.count({ where }),
      prisma.deployment.groupBy({ by: ["status"], _count: true }),
    ]);

    return NextResponse.json({
      success: true,
      deployments,
      total,
      byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count])),
    });
  } catch (error) {
    console.error("Admin deployments GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
