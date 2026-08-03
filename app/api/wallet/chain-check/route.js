import { NextResponse } from "next/server";

export async function GET(request) {
  // TODO: Verify connected chain is BNB Chain
  return NextResponse.json({ message: "chain-check endpoint" }, { status: 501 });
}
