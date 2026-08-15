import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const flags = await prisma.featureFlag.findMany({
      select: {
        key: true,
        enabled: true,
      },
    });

    const flagMap = flags.reduce((acc, flag) => {
      acc[flag.key] = flag.enabled;
      return acc;
    }, {});

    return NextResponse.json({ success: true, flags: flagMap });
  } catch (error) {
    console.error("Public feature flags GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
