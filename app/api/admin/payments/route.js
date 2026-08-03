import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "admin payments endpoint" }, { status: 501 });
}
