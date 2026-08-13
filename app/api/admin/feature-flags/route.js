import { NextResponse } from "next/server";
import { isAdmin } from "@/services/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const flags = await prisma.featureFlag.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json({ success: true, flags });
  } catch (error) {
    console.error("Feature flags GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { key, enabled } = await request.json();
    if (!key || typeof enabled !== "boolean") {
      return NextResponse.json({ message: "key and enabled (boolean) are required" }, { status: 400 });
    }

    const flag = await prisma.featureFlag.upsert({
      where: { key },
      update: { enabled },
      create: { key, enabled, label: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) },
    });

    return NextResponse.json({ success: true, flag });
  } catch (error) {
    console.error("Feature flags PATCH error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { key, label, enabled = false } = await request.json();
    if (!key) {
      return NextResponse.json({ message: "key is required" }, { status: 400 });
    }

    const flag = await prisma.featureFlag.create({
      data: { key, label: label || key, enabled },
    });

    return NextResponse.json({ success: true, flag });
  } catch (error) {
    console.error("Feature flags POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
