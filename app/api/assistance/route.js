import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createOrResumeSession } from "@/services/auth";

export async function GET(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized. Please connect wallet." }, { status: 401 });
    }

    const user = await createOrResumeSession(walletAddress);

    const requests = await prisma.assistanceRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("User assistance GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
