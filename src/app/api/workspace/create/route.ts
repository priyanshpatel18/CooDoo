import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const workspaceSchema = z.object({
  workspaceName: z.string(),
  userId: z.number(),
});

export async function POST(request: NextRequest) {
  // Validate Request
  const body = await request.json();
  const { workspaceName, userId } = workspaceSchema.parse(body);
  if (!workspaceName || !userId) {
    return NextResponse.json({
      status: 400,
      message: "Invalid Inputs",
    });
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExists) {
    return NextResponse.json({
      status: 400,
      message: "User does not exist",
    });
  }

  const newWorkspace = await prisma.workspace.create({
    data: {
      workspaceName,
      UserWorkspace: {
        create: {
          userId: userExists.id,
        },
      },
    },
  });
  if (!newWorkspace) {
    return NextResponse.json({
      status: 400,
      message: "Something went wrong",
    });
  }

  // UserWorkspace Created
  const userWorkspace = await prisma.userWorkSpace.findFirst({
    where: {
      userId: userExists.id,
      workspaceId: newWorkspace.id,
    },
  });
  if (!userWorkspace) {
    return NextResponse.json({
      status: 400,
      message: "Something went wrong",
    });
  }

  // Update User
  const updatedUser = await prisma.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      UserWorkspace: {
        connect: {
          id: userWorkspace.id,
        },
      },
    },
  });
  if (!updatedUser) {
    return NextResponse.json({
      status: 400,
      message: "Something went wrong",
    });
  }

  return NextResponse.json({
    message: "Workspace Created",
    data: newWorkspace,
    status: 200,
  });
}
