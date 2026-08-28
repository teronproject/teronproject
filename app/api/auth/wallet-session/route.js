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
    const { address, referralCode, cfToken } = z
      .object({
        address: walletAddressSchema,
        referralCode: z.string().optional().nullable(),
        cfToken: z.string().optional().nullable(),
      })
      .parse(body);

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    
    // Only enforce Turnstile if the secret key is provided (so dev environments don't break if not set)
    if (turnstileSecret && turnstileSecret !== "") {
      if (!cfToken) {
        return NextResponse.json(
          { message: "Bot protection verification required (missing token)." },
          { status: 403 }
        );
      }

      // Verify the token with Cloudflare
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(cfToken)}&remoteip=${encodeURIComponent(ip)}`,
        }
      );

      const outcome = await verifyRes.json();
      if (!outcome.success) {
        console.warn("Turnstile failure:", outcome);
        return NextResponse.json(
          { message: "Bot verification failed. Please try again." },
          { status: 403 }
        );
      }
    }

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
