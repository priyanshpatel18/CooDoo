"use server";

import prisma from "@/db";

export async function getData(userId: number | undefined) {
  if (!userId) {
    return undefined;
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
    if (!user) {
      return undefined;
    }

    const workspaces = await prisma.workspace.findMany({
      where: {
        id: {
          in: user?.UserWorkspace.map((workspace) => workspace.workspaceId),
        },
      },
    });

    const todos = await prisma.todo.findMany({
      where: {
        workspaceId: {
          in: workspaces?.map((ws) => ws.id),
        },
      },
    });

    const workspaceObject = workspaces.map((workspace) => {
      const todosForWorkspace = todos.filter(
        (todo) => todo.workspaceId === workspace.id
      );

      return {
        id: workspace.id,
        workspaceName: workspace.workspaceName,
        todos: todosForWorkspace,
      };
    });

    return {
      id: user?.id,
      displayName: user?.displayName,
      email: user?.email,
      workspaces: workspaceObject,
    };
  });

  return userData;
}
