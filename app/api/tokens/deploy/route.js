import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Initiate on-chain contract deployment
  return NextResponse.json({ message: "token deploy endpoint" }, { status: 501 });
}
