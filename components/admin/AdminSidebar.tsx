"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, PenSquare, BookOpen, Image as ImageIcon, Settings,
  ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Create Blog", icon: PenSquare, href: "/admin/create" },
  { label: "Manage Blogs", icon: BookOpen, href: "/admin/blogs" },
  { label: "Media Library", icon: ImageIcon, href: "/admin/media" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col bg-gray-900 transition-all duration-300 z-20 h-full shrink-0 ${
        open ? "w-60" : "w-[68px]"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-white/5 ${open ? "px-5 gap-3" : "justify-center"}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg">
          H
        </div>
        {open && (
          <span className="font-bold text-white text-sm tracking-tight whitespace-nowrap">
            HiyanBlog <span className="text-blue-400 font-black">CMS</span>
          </span>
        )}
        <button
          className={`ml-auto p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors ${!open && "hidden"}`}
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {!open && (
        <button
          className="flex justify-center mt-2 mx-2 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          onClick={onToggle}
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 px-2.5 flex flex-col gap-1 overflow-y-auto">
        {open && (
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">
            Menu
          </p>
        )}
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={!open ? label : undefined}
              className={`flex items-center rounded-xl text-sm font-medium transition-all group relative ${
                open ? "gap-3 px-3 py-2.5" : "justify-center py-2.5"
              } ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {open && <span className="whitespace-nowrap">{label}</span>}
              {/* Active dot for collapsed */}
              {!open && isActive && (
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-3 border-t border-white/5 ${open ? "" : "flex justify-center"}`}>
        <Link
          href="/login"
          className={`flex items-center gap-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium ${
            open ? "px-3 py-2.5" : "p-2.5 justify-center"
          }`}
          title={!open ? "Sign Out" : undefined}
        >
          <LogOut size={16} className="shrink-0" />
          {open && <span>Sign Out</span>}
        </Link>
      </div>
    </aside>
  );
}
