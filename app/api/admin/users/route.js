import { NextResponse } from "next/server";

export async function GET(request) {
  // TODO: List/manage users (admin only)
  return NextResponse.json({ message: "admin users endpoint" }, { status: 501 });
}

export async function PATCH(request) {
  // TODO: Update user (admin only)
  return NextResponse.json({ message: "admin users update endpoint" }, { status: 501 });
}
