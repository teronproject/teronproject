import { NextResponse } from "next/server";

export async function GET(request) {
  // TODO: List deployment history for connected user
  return NextResponse.json({ message: "token history endpoint" }, { status: 501 });
}
