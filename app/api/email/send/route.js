import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Send transactional email (internal)
  return NextResponse.json({ message: "email send endpoint" }, { status: 501 });
}
