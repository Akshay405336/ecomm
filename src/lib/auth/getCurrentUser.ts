import { cookies } from "next/headers";
import { prisma } from "@/infrastructure/database/prisma";

export async function getCurrentUser() {

  const cookieStore = await cookies(); // ✅ must await
  const token = cookieStore.get("customer_token")?.value;

  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          profile: true
        }
      }
    }
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) return null;

  return session.user;
}