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

    const [requests, total, byStatus] = await Promise.all([
      prisma.assistanceRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          user: { select: { walletAddress: true, displayName: true, email: true } },
        },
      }),
      prisma.assistanceRequest.count({ where }),
      prisma.assistanceRequest.groupBy({ by: ["status"], _count: true }),
    ]);

    return NextResponse.json({
      success: true,
      requests,
      total,
      byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count])),
    });
  } catch (error) {
    console.error("Admin assistance GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id, status, adminNotes } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ message: "id and status are required" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "REVIEWING", "APPROVED", "REJECTED", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    const updated = await prisma.assistanceRequest.update({
      where: { id },
      data: {
        status,
        ...(adminNotes !== undefined && { adminNotes }),
        resolvedBy: ["APPROVED", "REJECTED", "COMPLETED"].includes(status) ? walletAddress : undefined,
      },
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("Admin assistance PATCH error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
