import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Simulate deployment transaction (gas estimate)
  return NextResponse.json({ message: "token simulate endpoint" }, { status: 501 });
}
