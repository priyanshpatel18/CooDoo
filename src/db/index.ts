import { PrismaClient } from "@prisma/client";

function singletonPrismaClient() {
  console.log("Prisma Created");
  return new PrismaClient();
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof singletonPrismaClient>;
}

const prisma = globalThis.prismaGlobal ?? singletonPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
