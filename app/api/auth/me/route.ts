/**
 * GET /api/auth/me — Returns logged-in user from JWT cookie
 * POST /api/auth/logout — Clears the auth cookie
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await connectDB();
      const user = await User.findOne({ email: payload.email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ user: user.toJSON() });
    } catch (dbError) {
      console.warn("DB offline during auth check. Trusting JWT payload locally.");
      return NextResponse.json({ user: payload });
    }
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
