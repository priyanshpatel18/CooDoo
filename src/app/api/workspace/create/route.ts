import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function POST(request: NextRequest) {
  // Validate Request
  const { workspaceName } = await request.json();
  if (!workspaceName || typeof workspaceName !== "string") {
    return NextResponse.json({
      status: 400,
      message: "Invalid Input",
    });
  }
  console.log(await getServerSession());

  return NextResponse.json({ status: 200 });
}
