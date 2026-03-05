import { cookies } from "next/headers";
import { prisma } from "@/infrastructure/database/prisma";

export async function getCurrentAdmin() {

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: {
      admin: {
        include: {
          profile: true
        }
      }
    }
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) return null;

  return session.admin;
}