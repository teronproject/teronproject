import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "admin seo endpoint" }, { status: 501 });
}

export async function PATCH(request) {
  return NextResponse.json({ message: "admin seo update endpoint" }, { status: 501 });
}
