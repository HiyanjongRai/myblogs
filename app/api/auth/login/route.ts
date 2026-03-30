/**
 * POST /api/auth/login
 * Accepts email OR username + password
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: "Credentials are required" }, { status: 400 });
    }

    // Find by email OR username, explicitly select password for comparison
    const isEmail = identifier.includes("@");
    const query = isEmail ? { email: identifier.toLowerCase() } : { username: identifier };
    const user = await User.findOne(query).select("+password");

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: user.toJSON(),
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
