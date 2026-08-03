import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Log monitoring event
  return NextResponse.json({ message: "monitoring log endpoint" }, { status: 501 });
}
