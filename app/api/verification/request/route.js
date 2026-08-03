import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Submit contract for BscScan verification (paid)
  return NextResponse.json({ message: "verification request endpoint" }, { status: 501 });
}
