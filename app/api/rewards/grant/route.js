import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Grant TERR reward (server-internal, after deployment confirm)
  return NextResponse.json({ message: "reward grant endpoint" }, { status: 501 });
}
