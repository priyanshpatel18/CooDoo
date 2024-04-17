"use server";

import prisma from "@/db";

export async function getData(userId: number | undefined) {
  if (!userId) {
    return null;
  }

  const userData = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        UserWorkspace: true,
      },
    });

    const workspaces = await prisma.workspace.findMany({
      where: {
        id: {
          in: user?.UserWorkspace.map((workspace) => workspace.workspaceId),
        },
      },
    });

    return {
      id: user?.id,
      displayName: user?.displayName,
      email: user?.email,
      workspaces: workspaces,
    };
  });

  return userData;
}
