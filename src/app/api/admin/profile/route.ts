import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin";

export async function GET() {

  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const profile = await prisma.adminProfile.findUnique({
    where: {
      adminId: admin.id
    }
  });

  return NextResponse.json({
    id: admin.id,
    email: admin.email,
    profile
  });
}

export async function PATCH(req: Request) {

  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const profile = await prisma.adminProfile.upsert({
    where: {
      adminId: admin.id
    },
    update: {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      avatar: body.avatar
    },
    create: {
      adminId: admin.id,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      avatar: body.avatar
    }
  });

  return NextResponse.json(profile);
}