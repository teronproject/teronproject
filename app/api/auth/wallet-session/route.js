import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Implement wallet session creation/resumption
  return NextResponse.json({ message: "wallet-session endpoint" }, { status: 501 });
}
