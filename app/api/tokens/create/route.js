import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Validate and save token creation form data
  return NextResponse.json({ message: "token create endpoint" }, { status: 501 });
}
