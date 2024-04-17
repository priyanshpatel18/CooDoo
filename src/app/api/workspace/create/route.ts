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

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        UserWorkspace: true,
      },
    });
    if (!userExists) {
      return NextResponse.json({
        status: 400,
        message: "User does not exist",
      });
    }

    // Create a Transaction for Atomicity
    const createWorkspace = await prisma.$transaction(async (prisma) => {
      // Create a new Workspace
      const newWorkspace = await prisma.workspace.create({
        data: {
          workspaceName,
          UserWorkspace: {
            create: {
              userId: userExists.id,
            },
          },
        },
        include: {
          UserWorkspace: true,
        },
      });

      // Check for Created Workspace
      const newUserWorkspace = newWorkspace.UserWorkspace.find(
        (uw) => uw.userId === userExists.id
      );
      if (!newUserWorkspace) {
        throw new Error("Failed to create UserWorkspace");
      }

      // Update the user with the new workspace
      await prisma.user.update({
        where: {
          id: userExists.id,
        },
        data: {
          UserWorkspace: {
            connect: {
              id: newUserWorkspace.id,
            },
          },
        },
        include: {
          UserWorkspace: true,
        },
      });

      return newWorkspace;
    });

    // Return the created workspace
    return NextResponse.json({
      message: "Workspace Created",
      data: createWorkspace,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
}
