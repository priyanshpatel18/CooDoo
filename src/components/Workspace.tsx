"use client";
import axios from "axios";
import React from "react";

type IWorkspaceProps = {
  id: number | undefined;
  name: string | undefined;
};

export default function Workspace({ name, id }: IWorkspaceProps) {
  const [workspace, setWorkspace] = React.useState<string | undefined>(name);

  return (
    <div className="h-[300px] w-[300px] bg-blue-500 flex flex-col items-center justify-center relative cursor-pointer">
      <span
        className="absolute top-0 right-[1rem] text-[red] text-[4rem]"
        onClick={async () => {
          const { data } = await axios.post("/api/workspace/delete", {
            workspaceId: id,
          });
          console.log(data);
        }}
      >
        X
      </span>

      <h1 className="text-primary-dark">{name}</h1>
      <h1 className="text-primary-dark">{id}</h1>
      <input
        type="text"
        placeholder="Workspace Name"
        value={workspace}
        onChange={(e) => setWorkspace(e.target.value)}
      />
      <button
        onClick={async () => {
          const { data } = await axios.post("/api/workspace/update", {
            name: workspace,
            id: id,
          });
          console.log(data);
        }}
      >
        Update
      </button>
    </div>
  );
}
