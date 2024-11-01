import React, { useState } from "react";
import Image from "next/image";
import addUser from "@/assets/addUser.png";
import star from "@/assets/star.png";
import starred from "@/assets/starred.png";
import plus from "@/assets/plus.png";

interface IWorkspaceProps {
  workspaceName: string;
}

export default function WorkspaceNav({ workspaceName }: IWorkspaceProps) {
  const [starredWS, setStarredWS] = useState(false);

  return (
    <div className="bg-[#232332] h-[10vh] p-[1rem] text-primary flex items-center gap-[1rem]">
      <span className="text-[1.5rem] font-semibold hover:bg-[rgba(255,255,255,0.4)] rounded-[5px] px-[0.5rem] cursor-pointer">
        {workspaceName}
      </span>
      {/* {updateWorkspaceMode ? (
          <Input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="text-[1.5rem] font-semibold bg-[#111] px-[0.5rem] outline-none rounded-[5px]"
          />
        ) : (
          <> </>
        )} */}
      <span
        className="hover:bg-[rgba(255,255,255,0.4)] p-[0.5rem] rounded-[5px] select-none"
        onClick={() => {
          setStarredWS(!starredWS);
        }}
      >
        <Image
          src={starredWS ? starred : star}
          alt="star"
          className="cursor-pointer w-[1.2rem] h-[1.2rem]"
        />
      </span>
      <button className="bg-[rgba(235,235,235,0.90)] p-[0.5rem] ml-[0.5rem] rounded-[5px] flex items-center gap-[5px] hover:bg-primary">
        <Image src={addUser} alt="addUser" className="w-[1.2rem] h-[1.2rem]" />
        <span className="text-primary-dark font-semibold">Share</span>
      </button>
      <button className="flex items-center text-primary gap-[0.5rem] justify-center bg-[rgb(35,35,50)] px-[1rem] py-[10px] rounded-sm hover:bg-[rgb(65,65,80)] select-none border-[1px] border-primary">
        <Image src={plus} alt="plus" className="w-[1rem] h-[1rem]" />
        <span>Add card</span>
      </button>
    </div>
  );
}
