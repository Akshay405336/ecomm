import { NextResponse } from "next/server";
import { runSendOtpLua } from "@/infrastructure/cache/otp-lua";

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json(
      { error: "Phone required" },
      { status: 400 }
    );
  }

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    await runSendOtpLua(phone, otp);
  } catch (err: any) {
    if (err.message.includes("BLOCKED")) {
      return NextResponse.json(
        { error: "Blocked for 1 hour" },
        { status: 429 }
      );
    }

    if (err.message.includes("COOLDOWN")) {
      return NextResponse.json(
        { error: "Wait 15 seconds before requesting again" },
        { status: 429 }
      );
    }

    if (err.message.includes("RATE_LIMIT")) {
      return NextResponse.json(
        { error: "Maximum 20 OTP per hour" },
        { status: 429 }
      );
    }

    throw err;
  }

  console.log("OTP:", otp);

  return NextResponse.json({
    success: true,
    expiresIn: 30,
    resendIn: 15
  });
}