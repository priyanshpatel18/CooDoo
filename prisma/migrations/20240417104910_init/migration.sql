-- DropForeignKey
ALTER TABLE "UserWorkSpace" DROP CONSTRAINT "UserWorkSpace_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserWorkSpace" DROP CONSTRAINT "UserWorkSpace_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "UserWorkSpace" ADD CONSTRAINT "UserWorkSpace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkSpace" ADD CONSTRAINT "UserWorkSpace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
