import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "admin pricing endpoint" }, { status: 501 });
}

export async function PATCH(request) {
  return NextResponse.json({ message: "admin pricing update endpoint" }, { status: 501 });
}
