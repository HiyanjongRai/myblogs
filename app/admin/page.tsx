"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  BookOpen, Globe, FileText, Eye, PenSquare, TrendingUp, Clock,
  ArrowRight, Sparkles, PlusCircle, BarChart3, Image as ImageIcon,
  Zap, Activity, CheckCircle2, Circle, ChevronRight, Flame
} from "lucide-react";

interface Stats {
  total: number;
  published: number;
  drafts: number;
  totalViews: number;
  recentBlogs: {
    _id: string;
    title: string;
    status: string;
    createdAt: string;
    views: number;
    category: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good day");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/blogs/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(console.error)
      .finally(() => setLoading(false));

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const statCards = [
    {
      label: "Total Blogs",
      value: stats?.total ?? 0,
      icon: BookOpen,
      gradient: "from-violet-500 to-purple-600",
      lightBg: "bg-violet-50",
      iconColor: "text-violet-600",
      trend: "+2 this week",
      trendUp: true,
    },
    {
      label: "Published",
      value: stats?.published ?? 0,
      icon: Globe,
      gradient: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "Live on web",
      trendUp: true,
    },
    {
      label: "Drafts",
      value: stats?.drafts ?? 0,
      icon: FileText,
      gradient: "from-amber-400 to-orange-500",
      lightBg: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: "In progress",
      trendUp: false,
    },
    {
      label: "Total Views",
      value: stats?.totalViews ?? 0,
      icon: Eye,
      gradient: "from-blue-500 to-cyan-500",
      lightBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "All articles",
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      href: "/admin/create",
      icon: PenSquare,
      title: "Write New Article",
      desc: "Start creating with step builder",
      gradient: "from-violet-500 to-purple-600",
      tag: "Popular",
    },
    {
      href: "/admin/blogs",
      icon: BarChart3,
      title: "Manage Content",
      desc: "Edit, publish, or delete posts",
      gradient: "from-blue-500 to-cyan-500",
      tag: null,
    },
    {
      href: "/admin/media",
      icon: ImageIcon,
      title: "Media Library",
      desc: "Upload & organize images",
      gradient: "from-emerald-500 to-teal-500",
      tag: null,
    },
  ];

  return (
    <div className="admin-page min-h-full bg-[#f7f8fc]">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl mx-0 mb-8 p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl">
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl translate-y-12 -translate-x-12 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">System Online</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {greeting}, Admin <Sparkles className="inline-block ml-1 text-yellow-400 animate-pulse" size={26} />
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-lg">
              Your content hub is running smoothly. Here's everything happening across your blog platform today.
            </p>
          </div>

          <div className="flex flex-row gap-3 shrink-0">
            <Link href="/admin/create" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95">
              <PlusCircle size={16} className="text-blue-600" />
              New Article
            </Link>
            <Link href="/admin/blogs" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
              <BarChart3 size={16} />
              Manage
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, gradient, lightBg, iconColor, trend, trendUp }) => (
          <div key={label} className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${lightBg}`}>
                <Icon size={20} className={iconColor} />
              </div>
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trendUp ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}`}>
                {trendUp ? <TrendingUp size={10} /> : <Activity size={10} />}
                {trend}
              </span>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-200 rounded-lg animate-pulse" />
                ) : value.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main 2-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,320px] gap-6">

        {/* Left — Recent Articles */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-gray-100">
                <Flame size={16} className="text-orange-500" />
              </div>
              <h2 className="font-bold text-gray-900 text-base">Recent Articles</h2>
            </div>
            <Link href="/admin/blogs" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !stats?.recentBlogs?.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <BookOpen size={28} className="text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">No articles yet</h3>
              <p className="text-gray-500 text-sm mb-6">Get started by creating your first blog post.</p>
              <Link href="/admin/create" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors">
                <PlusCircle size={16} /> Create Article
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.recentBlogs.map((blog, i) => (
                <div key={blog._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/70 transition-colors group">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{blog.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{blog.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Clock size={10} /> {format(new Date(blog.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      blog.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {blog.status === "published" ? <CheckCircle2 size={10} /> : <Circle size={10} />}
                      {blog.status}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye size={12} /> {blog.views}
                    </div>
                    <Link href={`/admin/blogs/${blog._id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <PenSquare size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={15} className="text-amber-500" />
              <h3 className="font-bold text-gray-900 text-sm">Quick Actions</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {quickActions.map(({ href, icon: Icon, title, desc, gradient, tag }) => (
                <Link key={href} href={href} className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm bg-white transition-all">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm">{title}</p>
                      {tag && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded-full uppercase tracking-wide">{tag}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Status */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-8 translate-x-8 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">System Status</h3>
                <span className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Operational
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Framework", value: "Next.js 15", ok: true },
                  { label: "Database", value: "MongoDB", ok: true },
                  { label: "Storage", value: "Cloudinary", ok: true },
                  { label: "Auth", value: "JWT Active", ok: true },
                ].map(({ label, value, ok }) => (
                  <div key={label} className="flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-400">{label}</span>
                    <span className="flex items-center gap-1.5 font-medium text-gray-200 text-xs">
                      <CheckCircle2 size={12} className={ok ? "text-emerald-400" : "text-red-400"} />
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's date card */}
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-5 text-white shadow-md">
            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Today</p>
            <p className="text-2xl font-bold tracking-tight">
              {mounted ? format(new Date(), "MMMM d, yyyy") : "—"}
            </p>
            <p className="text-blue-200 text-xs mt-1">{mounted ? format(new Date(), "EEEE") : ""}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
