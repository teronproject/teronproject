import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "admin rewards endpoint" }, { status: 501 });
}

export async function POST(request) {
  return NextResponse.json({ message: "admin rewards distribute endpoint" }, { status: 501 });
}
