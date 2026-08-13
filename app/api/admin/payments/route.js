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
    const serviceType = searchParams.get("serviceType");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where = {};
    if (status) where.status = status;
    if (serviceType) where.serviceType = serviceType;

    const [payments, total, totalBnb, byStatus, byService] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          token: { select: { name: true, symbol: true, contractAddress: true } },
          user: { select: { walletAddress: true, displayName: true } },
        },
      }),
      prisma.payment.count({ where }),
      prisma.payment.aggregate({ _sum: { amountBnb: true }, where: { status: { in: ["CONFIRMED", "COMPLETED"] } } }),
      prisma.payment.groupBy({ by: ["status"], _count: true }),
      prisma.payment.groupBy({ by: ["serviceType"], _count: true, _sum: { amountBnb: true } }),
    ]);

    return NextResponse.json({
      success: true,
      payments,
      total,
      totalRevenueBnb: totalBnb._sum.amountBnb || 0,
      byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count])),
      byService: Object.fromEntries(byService.map(s => [s.serviceType, { count: s._count, totalBnb: s._sum.amountBnb || 0 }])),
    });
  } catch (error) {
    console.error("Admin payments GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
