import React, { ReactNode } from "react";

export default function Providers({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <>{children}</>;
}
