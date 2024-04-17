"use client";

import { useSession } from "next-auth/react";
import { getData } from "./actions/user";
import { useEffect, useState } from "react";
import Workspace from "@/components/Workspace";
import axios from "axios";

interface Workspace {
  id: number | undefined;
  workspaceName: string | undefined;
}

interface UserData {
  id: number | undefined;
  displayName: string | undefined;
  email: string | undefined;
  workspaces: Workspace[] | undefined;
}

export default function Home() {
  const [user, setUser] = useState<UserData | null>();

  const session = useSession();
  useEffect(() => {
    (async function fetchData() {
      const user = await getData(session.data?.user?.id);
      setUser(user);
    })();
  }, [session.data?.user?.id]);

  return (
    <div className="">
      <h1 className="text-[#F2F2F2]">OOPS</h1>
      {user?.workspaces?.map((workspace, index) => (
        <div key={index}>
          <Workspace name={workspace.workspaceName} id={workspace.id} />
        </div>
      ))}
    </div>
  );
}
