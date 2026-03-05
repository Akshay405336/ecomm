import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { cookies } from "next/headers";

export async function POST() {

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token) {
    await prisma.adminSession.deleteMany({
      where: { token },
    });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("admin_token", "", {
    expires: new Date(0),
    path: "/",
  });

  return res;
}