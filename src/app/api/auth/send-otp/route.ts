import { NextResponse } from "next/server";
import { saveOTP } from "@/infrastructure/auth/otp-store";

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ message: "Phone required" }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  saveOTP(phone, otp);

  console.log("OTP for", phone, ":", otp); // dev only

  return NextResponse.json({
    success: true,
    message: "OTP sent",
  });
}