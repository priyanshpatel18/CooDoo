"use client";

import { getData } from "@/actions/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fontCalSans, fontPoppins } from "@/fonts/fonts";
import UserStore from "@/store/store";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useState } from "react";

export default function Navbar(): ReactNode {
  const { data: session, status } = useSession();
  const store = UserStore();
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (session?.user.id && status === "authenticated") {
        const userData = await getData(session.user.id);
        store.setUser(userData);
        store.setWorkspaces(userData?.workspaces);
      }
    }

    if (status === "authenticated") {
      fetchData();
    }
  }, [session?.user.id]);

  async function handleCreate(e: FormEvent) {
    setShowCreate(false);
    e.preventDefault();
    const { data } = await axios.post("/api/workspace/create", {
      workspaceName,
      userId: session?.user.id,
    });

    console.log(data);

    if (data.status === 200 && data.workspace) {
      store.setWorkspaces([data.workspace, ...store.workspaces!]);
    }
  }

  return (
    <div
      className={`h-[7vh] flex justify-between items-center text-[#F2F2F2] ${fontPoppins} px-[1rem] border-b-[1px] border-[#888]`}
    >
      <div className="flex items-center gap-[1rem] leading-[1rem] lg:leading-[1.5rem]">
        <Link
          className={`${fontCalSans} text-[1rem] lg:text-[1.5rem] cursor-pointer`}
          href="/"
        >
          CooDoo
        </Link>
        <DropdownMenu open={showWorkspace} onOpenChange={setShowWorkspace}>
          <DropdownMenuTrigger className="outline-none">
            <span className="text-[0.9rem] lg:text-[1rem] capitalize">
              workspaces
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`bg-[#F2F2F2] outline-none border-none p-[10px] text-[#2F2F2F] ${fontPoppins}`}
          >
            <span className="text-[0.9rem]">Your Workspaces</span>
            {store.workspaces?.map((workspace) => (
              <div
                key={workspace.id}
                onClick={() => {
                  router.push(`/workspace/${workspace.id}`);
                  setShowWorkspace(!showWorkspace);
                }}
              >
                <DropdownMenuLabel className="text-[1.1rem] cursor-pointer flex gap-[5px] items-center hover:bg-[#DDD] rounded-[5px]">
                  <div className="text-[#2F2F2F] w-[2rem] h-[2rem] flex items-center justify-center rounded-[5px] uppercase font-bold bg-gradient-to-bl from-[rgb(126,242,287)] to-[rgb(26,142,187)]">
                    {workspace.workspaceName.charAt(0)}
                  </div>
                  {workspace.workspaceName}
                  <DropdownMenuSeparator />
                </DropdownMenuLabel>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Popover
          open={showCreate}
          onOpenChange={() => {
            setShowCreate(!showCreate);
            setWorkspaceName("");
          }}
        >
          <PopoverTrigger className="bg-[#42B6E3] text-[#2F2F2F] px-[5px] lg:px-[10px] py-[5px] rounded-[5px] uppercase font-bold">
            <span className="hidden lg:block">create</span>
            <span className="block lg:hidden">+</span>
          </PopoverTrigger>
          <PopoverContent className="bg-slate-900 text-[#F2F2F2] flex flex-col p-[1.5rem] w-full gap-[1rem]">
            <div className="text-[1rem] lg:text-[1.5rem] font-bold">
              Let&lsquo;s build a Workspace
            </div>
            <form className="flex flex-col gap-[1rem]" onSubmit={handleCreate}>
              <label htmlFor="workspaceName" className="cursor-pointer">
                <div className="text-[0.8rem] lg:text-[0.9rem] font-semibold">
                  Workspace Name
                </div>
                <Input
                  id="workspaceName"
                  value={workspaceName}
                  onChange={(e) => {
                    setWorkspaceName(e.target.value);
                  }}
                  className="bg-transparent outline-none w-full border-gray-400 border-[1px] rounded-[5px] p-[5px] focus:border-[#FFF] focus:bg-[rgb(25,33,52)] peer hover:bg-[rgb(25,33,52)]"
                  placeholder="Untitled"
                  required
                />
              </label>
              <button
                className="bg-[rgb(66,182,227)] text-[#2F2F2F] px-[10px] py-[5px] rounded-[5px] uppercase font-bold hover:bg-[rgb(26,142,187)]"
                type="submit"
              >
                <span className="font-semibold">Create</span>
              </button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
      <div className="text-[1rem] lg:text-[1.2rem] flex w-[1.5rem] h-[1.5rem] lg:w-[2rem] lg:h-[2rem] rounded-full items-center justify-center uppercase bg-gradient-to-b from-[#48C892] to-[#227251] cursor-pointer lg:hover:shadow-[0_0_0_4px_rgba(255,255,255,0.3)]">
        <h1>{store.user?.displayName?.charAt(0)}</h1>
      </div>
    </div>
  );
}
