import { NextResponse } from "next/server";

export async function GET(request) {
  // TODO: Read real-time BNB balance via viem
  return NextResponse.json({ message: "balance endpoint" }, { status: 501 });
}
