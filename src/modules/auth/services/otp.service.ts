import { redis } from "@/infrastructure/cache/redis";

const OTP_PREFIX = "otp:";
const REQUEST_PREFIX = "otp:req:";
const FAIL_PREFIX = "otp:fail:";
const BLOCK_PREFIX = "otp:block:";

const OTP_TTL = 30;
const REQUEST_LIMIT = 20;
const FAIL_LIMIT = 10;

export async function generateOTP(phone: string) {
  const blockKey = BLOCK_PREFIX + phone;
  const reqKey = REQUEST_PREFIX + phone;
  const otpKey = OTP_PREFIX + phone;

  // Check if blocked
  const blocked = await redis.get(blockKey);
  if (blocked) {
    throw new Error("Too many failed attempts. Try after 1 hour.");
  }

  // Check request count
  const requests = await redis.incr(reqKey);

  if (requests === 1) {
    await redis.expire(reqKey, 3600);
  }

  if (requests > REQUEST_LIMIT) {
    throw new Error("Too many OTP requests");
  }

  // Generate OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Override existing OTP with new TTL
  await redis.set(otpKey, code, "EX", OTP_TTL);

  return code;
}

export async function verifyOTP(phone: string, otp: string) {
  const blockKey = BLOCK_PREFIX + phone;
  const failKey = FAIL_PREFIX + phone;
  const otpKey = OTP_PREFIX + phone;

  const blocked = await redis.get(blockKey);
  if (blocked) {
    throw new Error("Blocked for 1 hour");
  }

  const storedOTP = await redis.get(otpKey);

  if (!storedOTP) {
    throw new Error("OTP expired");
  }

  if (storedOTP !== otp) {
    const fails = await redis.incr(failKey);

    if (fails === 1) {
      await redis.expire(failKey, 3600);
    }

    if (fails >= FAIL_LIMIT) {
      await redis.set(blockKey, "1", "EX", 3600);
      throw new Error("Too many wrong OTPs. Blocked for 1 hour.");
    }

    throw new Error("Invalid OTP");
  }

  // success
  await redis.del(otpKey);
  await redis.del(failKey);

  return true;
}