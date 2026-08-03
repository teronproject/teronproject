import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Execute TERR→TER swap (feature-flagged)
  return NextResponse.json({ message: "swap execute endpoint" }, { status: 501 });
}
