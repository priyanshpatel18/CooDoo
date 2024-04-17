import prisma from "@/db";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const workspaceSchema = z.object({
  workspaceId: z.number(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { workspaceId } = workspaceSchema.parse(body);

  await prisma.workspace.delete({
    where: {
      id: workspaceId,
    },
  });

  return NextResponse.json({ status: 200, message: "Workspace Deleted" });
}
