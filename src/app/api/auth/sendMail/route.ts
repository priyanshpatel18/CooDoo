import otpGenerator from "otp-generator";
import prisma from "@/db/index";
import sendOTP from "@/utils/nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, forgotFlag } = await request.json();
  if (!email || typeof email !== "string") {
    return {
      message: "Invalid email",
      status: 400,
    };
  }

  // Generate OTP
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    // Send OTP
    const { mailResponse } = await sendOTP(email, otp);

    // Save OTP
    if (mailResponse.accepted) {
      const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);

      const newOTP = await prisma.otp.upsert({
        where: {
          email: email,
        },
        create: {
          email,
          otp,
          expiresAt,
          forgotPass: forgotFlag,
          createdAt: new Date(),
        },
        update: {
          otp,
          expiresAt,
          forgotPass: forgotFlag,
          createdAt: new Date(),
        },
      });
      if (!newOTP) {
        return NextResponse.json({
          message: "Internal Server Error",
          status: 500,
        });
      }

      return NextResponse.json({
        message: `OTP sent to ${email}`,
        status: 200,
      });
    } else {
      return NextResponse.json({
        message: "Internal Server Error",
        status: 500,
      });
    }
  } else {
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
}
