"use client";

import DragDropContent from "@/components/DragDropContent";
import WorkspaceNav from "@/components/WorkspaceNav";
import UserStore from "@/store/store";
import { useState } from "react";

export default function Workspace({ params }: { params: { id: string } }) {
  const store = UserStore();
  const workspace = store.workspaces?.find((w) => w.id === Number(params.id));

  const [workspaceName, setWorkspaceName] = useState(
    workspace?.workspaceName || ""
  );

  return (
    <div className="h-[93vh] flex flex-col">
      <WorkspaceNav workspaceName={workspaceName} />

      <div className="flex flex-1">
        <DragDropContent workspace={workspace} />
      </div>
    </div>
  );
}
