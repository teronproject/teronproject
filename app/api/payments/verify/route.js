import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Verify BNB payment on-chain
  return NextResponse.json({ message: "payment verify endpoint" }, { status: 501 });
}
