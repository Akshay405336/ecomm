import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/infrastructure/database/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customer_token")?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("customer_token", "", {
    expires: new Date(0),
  });

  return res;
}