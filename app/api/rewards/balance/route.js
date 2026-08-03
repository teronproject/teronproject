import { NextResponse } from "next/server";

export async function GET(request) {
  // TODO: Get TERR balance for connected user
  return NextResponse.json({ message: "reward balance endpoint" }, { status: 501 });
}
