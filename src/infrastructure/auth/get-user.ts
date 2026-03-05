import { cookies } from "next/headers";
import { prisma } from "../database/prisma";

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customer_token")?.value;

  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) return null;

  return session.user;
}