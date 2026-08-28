import { NextResponse } from "next/server";
import { createOrResumeSession } from "@/services/auth";
import { walletAddressSchema } from "@/lib/zod-schemas/user";
import { z } from "zod";

const rateLimitMap = new Map();

export async function POST(request) {
  try {
    // Basic In-Memory IP Rate Limiting to prevent bot account creation spam
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (ip !== "unknown") {
      const now = Date.now();
      const windowData = rateLimitMap.get(ip) || [];
      // keep only requests from the last 60 seconds
      const recent = windowData.filter(timestamp => now - timestamp < 60000);
      
      if (recent.length >= 10) {
        return NextResponse.json(
          { message: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
      
      recent.push(now);
      rateLimitMap.set(ip, recent);
    }

    const body = await request.json();

    // Validate request body
    const { address, referralCode } = z
      .object({
        address: walletAddressSchema,
        referralCode: z.string().optional().nullable(),
      })
      .parse(body);

    // Create or resume session (with optional referral code for new users)
    const user = await createOrResumeSession(address, referralCode || null);

    return NextResponse.json({
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        role: user.role,
        displayName: user.displayName,
        avatar: user.avatar,
        email: user.email,
        terrBalance: user.terrBalance,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid wallet address", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Wallet session error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
