import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(async (req: NextRequestWithAuth) => {
  const token = req.nextauth.token;
  if (!token) {
    return NextResponse.redirect(new URL("/invalidsession", req.url));
  }

  return;
});

export const config = {
  matcher: ["/"],
};
