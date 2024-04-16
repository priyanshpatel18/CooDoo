import prisma from "@/db/index";
import { generateJWT, verifyJWT } from "@/lib/auth";
import { signIn } from "next-auth/react";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Validate Request
  const { otp } = await request.json();
  if (!otp || typeof otp !== "string") {
    return NextResponse.json({ status: 400, message: "Invalid OTP" });
  }

  // Get Payload from the Token
  const userDoc = cookies().get("userDoc")?.value || "";
  const decodedToken = verifyJWT(userDoc);
  if (
    !decodedToken.payload ||
    !decodedToken ||
    !decodedToken.payload.email ||
    !decodedToken.payload.id
  ) {
    return NextResponse.json({ status: 400, message: "Invalid Token" });
  }

  // Decoded Email
  const { email } = decodedToken.payload;

  // Check if OTP Exists
  const otpDoc = await prisma.otp.findFirst({
    where: {
      email,
    },
  });
  // OTP Checks
  if (!otpDoc) {
    return NextResponse.json({ status: 400, message: "Invalid OTP" });
  }
  if (otpDoc.expiresAt < new Date()) {
    return NextResponse.json({ status: 400, message: "OTP Expired" });
  }

  if (otpDoc.otp !== otp) {
    console.log(otpDoc.otp === otp);
    return NextResponse.json({ status: 400, message: "Incorrect OTP" });
  }

  // Control the flow on the basis of the ForgotFlag
  if (otpDoc.forgotPass === true) {
    return NextResponse.json({
      status: 200,
      message: "Change your Password",
    });
  } else {
    // Create User from the Unverified User
    const unverifiedUser = await prisma.unverifiedUser.findUnique({
      where: {
        email,
      },
    });
    if (!unverifiedUser || unverifiedUser.expiresAt < new Date()) {
      return NextResponse.json({
        status: 400,
        message: "OTP Expired",
      });
    }

    const token = generateJWT({
      email: unverifiedUser.email,
      id: unverifiedUser.id,
    });

    const newUser = await prisma.user.create({
      data: {
        displayName: unverifiedUser.displayName,
        email: unverifiedUser.email,
        password: unverifiedUser.password,
        token,
      },
    });
    await prisma.unverifiedUser.delete({
      where: {
        email,
      },
    });
    await prisma.otp.update({
      where: {
        email,
      },
      data: {
        verified: true,
      },
    });

    // Delete Cookies
    cookies().delete("userDoc");

    await signIn("credentials", {
      email: newUser.email,
      password: newUser.password,
      redirect: false,
      callbackUrl: "/",
    });

    return NextResponse.json({
      status: 200,
      message: "Account Created Successfully",
    });
  }
}
