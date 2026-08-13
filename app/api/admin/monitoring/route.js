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
    const severity = searchParams.get("severity");
    const type = searchParams.get("type");
    const resolved = searchParams.get("resolved");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where = {};
    if (severity) where.severity = severity;
    if (type) where.type = type;
    if (resolved !== null && resolved !== undefined && resolved !== "") {
      where.resolved = resolved === "true";
    }

    const [events, total, bySeverity, byType] = await Promise.all([
      prisma.monitoringEvent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { affectedUser: { select: { walletAddress: true, displayName: true } } },
      }),
      prisma.monitoringEvent.count({ where }),
      prisma.monitoringEvent.groupBy({
        by: ["severity"],
        _count: true,
        where: { resolved: false },
      }),
      prisma.monitoringEvent.groupBy({
        by: ["type"],
        _count: true,
        where: { resolved: false },
      }),
    ]);

    const stats = {
      total,
      unresolved: bySeverity.reduce((sum, s) => sum + s._count, 0),
      bySeverity: Object.fromEntries(bySeverity.map(s => [s.severity, s._count])),
      byType: Object.fromEntries(byType.map(t => [t.type, t._count])),
    };

    return NextResponse.json({ success: true, events, stats });
  } catch (error) {
    console.error("Monitoring GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id, resolved } = await request.json();
    if (!id) {
      return NextResponse.json({ message: "Event id is required" }, { status: 400 });
    }

    const event = await prisma.monitoringEvent.update({
      where: { id },
      data: {
        resolved: resolved !== false,
        resolvedAt: resolved !== false ? new Date() : null,
        resolvedBy: walletAddress,
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Monitoring PATCH error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
