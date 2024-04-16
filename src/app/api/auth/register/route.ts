import { NextRequest, NextResponse } from "next/server";
import { RegisterUserSchema } from "@/schema/user";
import prisma from "@/db/index";
import { cookies } from "next/headers";
import { generateJWT } from "@/lib/auth";
import { genSalt, hash } from "bcrypt";
import axios from "axios";

export async function POST(request: NextRequest) {
  await prisma.user.deleteMany();
  // Validate Request
  const requestBody = await request.json();
  const validateData = RegisterUserSchema.parse(requestBody);
  if (
    !validateData.email ||
    !validateData.password ||
    !validateData.displayName
  ) {
    return NextResponse.json({
      status: 400,
      message: "Invalid Credentials",
    });
  }
  const { displayName, email, password } = validateData;

  // Check if User exists
  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (userExists) {
    return NextResponse.json({
      status: 400,
      message: "User Already Exists",
    });
  }

  // Create Unverified User
  const unverifiedUser = await prisma.unverifiedUser.upsert({
    where: {
      email,
    },
    create: {
      displayName,
      email,
      password: await hash(password, await genSalt(10)),
      expiresAt: new Date(new Date().getTime() + 5 * 60 * 1000),
    },
    update: {
      displayName,
      password: await hash(password, await genSalt(10)),
      expiresAt: new Date(new Date().getTime() + 5 * 60 * 1000),
    },
  });
  if (!unverifiedUser) {
    return NextResponse.json({
      status: 400,
      message: "Something went wrong",
    });
  }

  // Send OTP to the mail
  const { data } = await axios.post("http://localhost:3000/api/auth/sendMail", {
    email: unverifiedUser.email,
    forgotFlag: false,
  });
  if (data.status !== 200) {
    return NextResponse.json({
      status: data.status,
      message: data.message,
    });
  }

  // Set Cookie if Mail is Sent
  cookies().set({
    name: "userDoc",
    value: generateJWT({ email: unverifiedUser.email, id: unverifiedUser.id }),
  });

  // Return Response
  return NextResponse.json({
    message: data.message,
    status: 200,
  });
}
