import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { authenticator } from "otplib";
import { generateToken } from "@/infrastructure/auth/jwt";

authenticator.options = {
  step: 30,
  window: 1,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { adminId, code } = body;

    if (!adminId || !code) {
      return NextResponse.json(
        { message: "adminId and code required" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    if (!admin.totpEnabled || !admin.totpSecret) {
      return NextResponse.json(
        { message: "TOTP not enabled" },
        { status: 400 }
      );
    }

    const valid = authenticator.verify({
      token: code,
      secret: admin.totpSecret,
    });

    if (!valid) {
      return NextResponse.json(
        { message: "Invalid authenticator code" },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: admin.id,
      role: "admin",
    });

    const res = NextResponse.json({
      success: true,
    });

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (error) {
    console.error("VERIFY TOTP ERROR:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}