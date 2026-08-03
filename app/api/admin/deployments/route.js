import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "admin deployments endpoint" }, { status: 501 });
}

export async function PATCH(request) {
  return NextResponse.json({ message: "admin deployments update endpoint" }, { status: 501 });
}
