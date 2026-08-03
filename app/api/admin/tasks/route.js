import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "admin tasks endpoint" }, { status: 501 });
}

export async function POST(request) {
  return NextResponse.json({ message: "admin tasks create endpoint" }, { status: 501 });
}

export async function PATCH(request) {
  return NextResponse.json({ message: "admin tasks update endpoint" }, { status: 501 });
}

export async function DELETE(request) {
  return NextResponse.json({ message: "admin tasks delete endpoint" }, { status: 501 });
}
