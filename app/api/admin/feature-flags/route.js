import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "admin feature-flags endpoint" }, { status: 501 });
}

export async function PATCH(request) {
  return NextResponse.json({ message: "admin feature-flags update endpoint" }, { status: 501 });
}
