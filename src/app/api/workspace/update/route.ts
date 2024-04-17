import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  id: z.number(),
  name: z.string(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, name } = schema.parse(body);

  const workspace = await prisma.workspace.update({
    where: {
      id,
    },
    data: {
      workspaceName: name,
    },
  });

  if (!workspace) {
    return NextResponse.json({
      status: 400,
      message: "Error updating workspace",
    });
  }

  return NextResponse.json({ status: 200, workspace });
}
