import React from "react";

export default function Workspace({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-[#f2f2f2]">Workspace {params.id}</h1>
    </div>
  );
}
