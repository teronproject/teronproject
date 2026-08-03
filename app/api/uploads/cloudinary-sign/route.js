import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Generate signed Cloudinary upload request
  return NextResponse.json({ message: "cloudinary sign endpoint" }, { status: 501 });
}
