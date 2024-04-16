"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { ReactNode, useState } from "react";

export default function Home(): ReactNode {
  const [name, setName] = useState<string>("");
  const { data: session } = useSession();

  return (
    <div className="">
      <h1 className="text-[#F2F2F2]">OOPS</h1>
      <input
        type="text"
        placeholder="Create Workspace"
        className="text-[#2F2F2F]"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={async () => {
          // const userId = session?.user.id;
          const { data } = await axios.post("/api/workspace/create", {
            workspaceName: name,
            userId: session?.user.id,
          });
          console.log(data);
        }}
      >
        Create
      </button>
    </div>
  );
}
