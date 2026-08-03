import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;
  // TODO: Get specific token by ID
  return NextResponse.json({ message: `token ${id} endpoint` }, { status: 501 });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  // TODO: Update specific token
  return NextResponse.json({ message: `token ${id} update endpoint` }, { status: 501 });
}
