import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { tokenSocialsSchema, tokenMediaSchema } from "@/lib/zod-schemas/token";
import { createOrResumeSession } from "@/services/auth";

const profileSchema = tokenSocialsSchema.merge(tokenMediaSchema);

export async function PUT(request, { params }) {
  try {
    const { symbolOrAddress: id } = await params;
    const body = await request.json();
    const data = profileSchema.parse(body);

    const walletAddress = request.headers.get("x-wallet-address");
    
    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await createOrResumeSession(walletAddress);

    // Verify token belongs to user
    const token = await prisma.token.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (!token) {
      return NextResponse.json({ message: "Token not found" }, { status: 404 });
    }

    if (token.deployerId !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Upsert the profile
    const updatedProfile = await prisma.tokenProfile.upsert({
      where: {
        tokenId: id
      },
      update: {
        shortDescription: data.shortDescription,
        description: data.description,
        website: data.website,
        twitter: data.twitter,
        telegram: data.telegram,
        discord: data.discord,
        logoUrl: data.logoUrl,
        bannerUrl: data.bannerUrl,
      },
      create: {
        tokenId: id,
        shortDescription: data.shortDescription,
        description: data.description,
        website: data.website,
        twitter: data.twitter,
        telegram: data.telegram,
        discord: data.discord,
        logoUrl: data.logoUrl,
        bannerUrl: data.bannerUrl,
      }
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid payload", errors: error.errors }, { status: 400 });
    }
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
