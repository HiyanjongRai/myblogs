/**
 * POST /api/auth/register
 * Registers a new user with username, fullName, email, password, profileImage
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { username, fullName, email, password, profileImage } = await req.json();

    // Validate required fields
    if (!username || !fullName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email or username already exists
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      const field = existing.email === email ? "Email" : "Username";
      return NextResponse.json({ error: `${field} is already taken` }, { status: 409 });
    }

    // Create user (password hashed by pre-save hook)
    const user = await User.create({ username, fullName, email, password, profileImage });

    // Sign JWT token
    const token = signToken({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
    });

    // Send response with HTTP-only cookie
    const response = NextResponse.json(
      { message: "Registration successful", user: user.toJSON() },
      { status: 201 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
