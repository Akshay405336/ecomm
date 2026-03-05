import { NextResponse } from "next/server";
import { generateToken } from "@/infrastructure/auth/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("LOGIN BODY:", body);

    const { email, password } = body;

    if (!email || !password) {
      console.log("Missing email or password");

      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    // fake admin test
    if (email === "admin@test.com" && password === "123456") {
      console.log("Admin authenticated");

      const token = generateToken({
        email,
        role: "admin",
      });

      console.log("Generated token:", token);

      const res = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      res.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "lax",
      });

      console.log("Cookie set: admin_token");

      return res;
    }

    console.log("Invalid credentials");

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}