import { NextResponse } from "next/server";
import { generateUploadSignature } from "@/lib/cloudinary";
import { walletAddressSchema } from "@/lib/zod-schemas/user";
import { z } from "zod";

/**
 * POST /api/upload/signature
 * Generate a signed Cloudinary upload signature.
 * Client uploads directly to Cloudinary using this signature — no secrets exposed.
 */
export async function POST(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    walletAddressSchema.parse(walletAddress);

    const body = await request.json();
    const { type } = z
      .object({
        type: z.enum(["avatar", "token-logo", "token-banner", "task-image"]),
      })
      .parse(body);

    // Configure folder and constraints based on upload type
    const configs = {
      avatar: {
        folder: "avatars",
        allowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 2 * 1024 * 1024, // 2MB
      },
      "token-logo": {
        folder: "tokens/logos",
        allowedFormats: ["jpg", "jpeg", "png", "webp", "svg"],
        maxFileSize: 2 * 1024 * 1024, // 2MB
      },
      "token-banner": {
        folder: "tokens/banners",
        allowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 5 * 1024 * 1024, // 5MB
      },
      "task-image": {
        folder: "tasks/og-images",
        allowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 5 * 1024 * 1024, // 5MB
      },
    };

    const config = configs[type];
    const signatureData = generateUploadSignature(config);

    return NextResponse.json(signatureData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Upload signature error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
