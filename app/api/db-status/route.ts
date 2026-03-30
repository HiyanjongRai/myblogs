/**
 * GET /api/db-status
 * Quick endpoint to check if MongoDB is connected.
 * Visit http://localhost:3000/api/db-status in the browser.
 */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  await connectDB();

  const state = mongoose.connections[0].readyState;
  const stateMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const status = stateMap[state] ?? "unknown";
  const ok = state === 1;

  return NextResponse.json(
    {
      ok,
      database: "hiyanblog",
      status,
      message: ok
        ? "✅ MongoDB Connected Successfully"
        : "❌ MongoDB Connection Failed",
    },
    { status: ok ? 200 : 503 }
  );
}
