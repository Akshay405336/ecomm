import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { redis } from "@/infrastructure/cache/redis";
import { randomUUID } from "crypto";

const OTP_PREFIX = "otp:";
const FAIL_PREFIX = "otp:fail:";
const BLOCK_PREFIX = "otp:block:";

const FAIL_LIMIT = 10;

export async function POST(req: Request) {
  const { phone, otp } = await req.json();

  if (!phone || !otp) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const otpKey = OTP_PREFIX + phone;
  const failKey = FAIL_PREFIX + phone;
  const blockKey = BLOCK_PREFIX + phone;

  // 1️⃣ Check block
  const blocked = await redis.get(blockKey);

  if (blocked) {
    return NextResponse.json(
      { error: "Too many wrong attempts. Try again after 1 hour." },
      { status: 429 }
    );
  }

  // 2️⃣ Get OTP
  const storedOTP = await redis.get(otpKey);

  if (!storedOTP) {
    return NextResponse.json(
      { error: "OTP expired or not found" },
      { status: 400 }
    );
  }

  // 3️⃣ Wrong OTP
  if (storedOTP !== otp) {
    const fails = await redis.incr(failKey);

    if (fails === 1) {
      await redis.expire(failKey, 3600);
    }

    if (fails >= FAIL_LIMIT) {
      await redis.set(blockKey, "1", "EX", 3600);

      return NextResponse.json(
        { error: "Too many wrong OTP attempts. Blocked for 1 hour." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Invalid OTP" },
      { status: 400 }
    );
  }

  // 4️⃣ Correct OTP
  await redis.del(otpKey);
  await redis.del(failKey);

  // 5️⃣ Create or get user + profile
  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: {
      phone,
      profile: {
        create: {}
      }
    },
    include: {
      profile: true
    }
  });

  // 6️⃣ Create session
  const token = randomUUID();

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // 7️⃣ Send cookie
  const res = NextResponse.json({ success: true });

  res.cookies.set("customer_token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return res;
}