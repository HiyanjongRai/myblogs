import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectDB();

    const [total, published, drafts, totalViews] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      Blog.countDocuments({ status: "draft" }),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
    ]);

    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status createdAt views category");

    return NextResponse.json({
      total,
      published,
      drafts,
      totalViews: totalViews[0]?.total || 0,
      recentBlogs,
    });
  } catch (err) {
    console.error("GET /api/blogs/stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
