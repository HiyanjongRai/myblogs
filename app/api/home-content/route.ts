import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import HomeContent from "@/models/HomeContent";
import { getUserFromRequest } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * GET: Fetch latest Home Content.
 */
export async function GET() {
  try {
    await connectDB();
    const content = await HomeContent.findOne().sort({ createdAt: -1 });
    
    // Default fallback if no DB record yet
    if (!content) {
      return NextResponse.json({
        title: "HIYAN JONG RAI",
        description: "OFFICIAL TRAVEL BLOG & CREATIVE JOURNAL",
        images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop"],
      });
    }

    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Create or Update Home Content (Auth Required).
 */
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication Required" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { title, description, images } = body;

    if (!title || !description || !images || !images.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Always keep it to 1 main record for the homepage
    let content = await HomeContent.findOne().sort({ createdAt: -1 });

    if (content) {
      content.title = title;
      content.description = description;
      content.images = images;
      await content.save();
    } else {
      content = await HomeContent.create({ title, description, images });
    }

    revalidatePath("/");

    return NextResponse.json({ message: "Home content updated successfully", content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
