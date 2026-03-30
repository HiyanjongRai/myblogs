"use client";

import { useState } from "react";
import { Bell, Search, LogOut, User, ChevronDown, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminTopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { msg: "New comment on your blog", time: "2 min ago", unread: true },
    { msg: "Blog published successfully", time: "1 hr ago", unread: true },
    { msg: "Draft auto-saved", time: "3 hrs ago", unread: false },
  ];

  return (
    <header className="flex items-center justify-between h-16 bg-white border-b border-gray-100 px-6 z-10 sticky top-0 shrink-0 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles, drafts..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          {notifOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Notifications</p>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {notifications.filter(n => n.unread).length} new
                </span>
              </div>
              {notifications.map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? "bg-blue-500" : "bg-gray-300"}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{n.msg}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Profile */}
        <div className="relative">
          <button
            className="flex items-center gap-2.5 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors"
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              A
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-800 leading-tight">Admin</span>
              <span className="text-[10px] text-gray-400 font-medium">Administrator</span>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                  A
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@hiyanblog.com</p>
                </div>
              </div>
              <div className="py-1">
                <Link href="/admin/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <Settings size={15} className="text-gray-400" /> Profile Settings
                </Link>
                <hr className="my-1 border-gray-100" />
                <Link href="/login" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={15} /> Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
