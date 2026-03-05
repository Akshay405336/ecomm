import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function GET() {

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    id: user.id,
    phone: user.phone,
    profile: user.profile
  });
}

export async function PATCH(req: Request) {

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const profile = await prisma.customerProfile.upsert({
    where: {
      userId: user.id
    },
    update: {
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      dob: body.dob ? new Date(body.dob) : undefined
    },
    create: {
      userId: user.id,
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      dob: body.dob ? new Date(body.dob) : undefined
    }
  });

  return NextResponse.json(profile);
}