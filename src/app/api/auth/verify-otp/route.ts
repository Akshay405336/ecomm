import { NextResponse } from "next/server";
import { getOTP, deleteOTP } from "@/infrastructure/auth/otp-store";
import { generateToken } from "@/infrastructure/auth/jwt";

export async function POST(req: Request) {
  const { phone, otp } = await req.json();

  const storedOtp = getOTP(phone);

  if (!storedOtp || storedOtp !== otp) {
    return NextResponse.json(
      { message: "Invalid OTP" },
      { status: 401 }
    );
  }

  deleteOTP(phone);

  const token = generateToken({
    phone,
    role: "customer",
  });

  const res = NextResponse.json({
    success: true,
    message: "Login successful",
  });

  res.cookies.set("customer_token", token, {
    httpOnly: true,
    path: "/",
  });

  return res;
}