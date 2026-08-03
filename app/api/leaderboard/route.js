import { NextResponse } from "next/server";

export async function GET(request) {
  // TODO: Get leaderboard data (recent tokens, featured)
  return NextResponse.json({ message: "leaderboard endpoint" }, { status: 501 });
}
