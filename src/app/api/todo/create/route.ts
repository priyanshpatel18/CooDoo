import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

enum TodoStatus {
  pending = "PENDING",
  progress = "PROGRESS",
  completed = "COMPLETED",
}
const statusSchema = z.nativeEnum(TodoStatus);

const todoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: statusSchema.optional(),
  workspaceId: z.number(),
  bgColor: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // Validate Request
  const body = await request.json();
  const { title, description, status, workspaceId, bgColor } =
    todoSchema.parse(body);

  if (!title || !status || !workspaceId) {
    return NextResponse.json({
      status: 400,
      message: "Invalid Inputs",
    });
  }

  try {
    const createTodo = await prisma.$transaction(async (prisma) => {
      await prisma.todo.deleteMany();

      const newTodo = await prisma.todo.create({
        data: {
          title,
          description: description || "",
          status: status || TodoStatus.pending,
          workspaceId,
          bgColor: bgColor || "#c377e0",
        },
      });

      await prisma.workspace.update({
        where: {
          id: workspaceId,
        },
        data: {
          todos: {
            connect: {
              id: newTodo.id,
            },
          },
        },
      });

      return newTodo;
    });
    if (!createTodo) {
      return NextResponse.json({
        status: 400,
        message: "Something went wrong",
      });
    }
    return NextResponse.json({
      status: 200,
      message: "Added successfully",
      todo: createTodo,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
