import { redis } from "./redis";
import fs from "fs";
import path from "path";

const luaScript = fs.readFileSync(
  path.join(process.cwd(), "src/infrastructure/cache/lua/sendOtp.lua"),
  "utf8"
);

export async function runSendOtpLua(
  phone: string,
  otp: string
) {
  return redis.eval(luaScript, 4,
    `otp:${phone}`,
    `otp:req:${phone}`,
    `otp:cooldown:${phone}`,
    `otp:block:${phone}`,
    otp
  );
}