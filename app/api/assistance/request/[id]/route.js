import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createOrResumeSession } from "@/services/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized. Please connect wallet." }, { status: 401 });
    }

    const user = await createOrResumeSession(walletAddress);

    const assistanceReq = await prisma.assistanceRequest.findUnique({
      where: { id },
    });

    if (!assistanceReq || assistanceReq.userId !== user.id) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: assistanceReq });
  } catch (error) {
    console.error("Assistance request GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
