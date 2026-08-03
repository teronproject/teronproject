import { NextResponse } from "next/server";

export async function GET(request) {
  // TODO: List available tasks for user
  return NextResponse.json({ message: "tasks list endpoint" }, { status: 501 });
}
