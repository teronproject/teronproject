import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { userProfileSchema, walletAddressSchema } from "@/lib/zod-schemas/user";
import { z } from "zod";

/**
 * GET /api/auth/profile
 * Fetch the user's full profile by wallet address (via header).
 */
export async function GET(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const validated = walletAddressSchema.parse(walletAddress);
    const normalizedAddress = validated.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { walletAddress: normalizedAddress },
      select: {
        id: true,
        walletAddress: true,
        displayName: true,
        avatar: true,
        email: true,
        role: true,
        terrBalance: true,
        website: true,
        twitter: true,
        telegram: true,
        discord: true,
        github: true,
        createdAt: true,
        _count: {
          select: {
            tokens: true,
            deployments: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid wallet address" },
        { status: 400 }
      );
    }
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/auth/profile
 * Update user's editable profile fields (name, email, avatar, socials).
 */
export async function PATCH(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const validatedAddr = walletAddressSchema.parse(walletAddress);
    const normalizedAddress = validatedAddr.toLowerCase();
    const body = await request.json();

    // Extended schema with socials
    const updateSchema = userProfileSchema.extend({
      website: z.string().url().optional().or(z.literal("")),
      twitter: z.string().optional().or(z.literal("")),
      telegram: z.string().optional().or(z.literal("")),
      discord: z.string().optional().or(z.literal("")),
      github: z.string().optional().or(z.literal("")),
    });

    const data = updateSchema.parse(body);

    // Remove empty strings — set to null instead
    const cleanData = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === "") {
        cleanData[key] = null;
      } else if (value !== undefined) {
        cleanData[key] = value;
      }
    }

    const user = await prisma.user.update({
      where: { walletAddress: normalizedAddress },
      data: cleanData,
      select: {
        id: true,
        walletAddress: true,
        displayName: true,
        avatar: true,
        email: true,
        role: true,
        website: true,
        twitter: true,
        telegram: true,
        discord: true,
        github: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid profile data", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
