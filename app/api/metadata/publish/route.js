import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Publish on-chain metadata/image (paid)
  return NextResponse.json({ message: "metadata publish endpoint" }, { status: 501 });
}
