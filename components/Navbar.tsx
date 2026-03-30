"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide the public navbar completely on all admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/login");
  };

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "WORK", path: "/work" },
    { name: "BLOG", path: user ? "/home" : "/login" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="fixed top-0 left-0 right-0 z-[60] py-6 flex justify-center bg-gradient-to-b from-black/80 to-transparent"
      >
        <div className="w-full max-w-7xl px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              className="w-10 h-10 rounded-full border-2 border-white/80 flex items-center justify-center bg-transparent group-hover:border-violet-500 transition-colors overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=100&auto=format&fit=crop" 
                alt="Logo"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
              />
            </motion.div>
            <div className="flex flex-col -gap-1">
              <span className="text-white font-black text-xl tracking-[0.2em] font-oswald block leading-none">
                HIYAN<span className="text-violet-500">JONG</span>
              </span>
              <span className="text-gray-400 text-[10px] font-bold tracking-[0.3em] uppercase">Development Official</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center gap-12 ml-20">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path}
                className="text-white/40 text-[10px] font-black tracking-[0.4em] uppercase hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions / Menu */}
          <div className="flex items-center gap-6">
            {!user ? (
               <Link 
                href="/login" 
                className="text-white/60 text-[10px] font-black tracking-[0.4em] uppercase hover:text-white transition-colors cursor-pointer relative z-10"
              >
                SIGN IN
              </Link>
            ) : (
                <Link 
                href="/admin" 
                className="hidden sm:block text-violet-500 text-[10px] font-black tracking-[0.4em] uppercase hover:text-white transition-colors"
              >
                DASHBOARD
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-[70] group flex items-center gap-3"
            >
              <div className="flex flex-col gap-1.5 w-8">
                <motion.span 
                  animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="h-[2px] w-full bg-white transition-colors group-hover:bg-violet-500 rounded-full"
                />
                <motion.span 
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="h-[2px] w-full bg-white transition-colors group-hover:bg-violet-500 rounded-full"
                />
                <motion.span 
                  animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="h-[2px] w-full bg-white transition-colors group-hover:bg-violet-500 rounded-full"
                />
              </div>
              <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase hidden sm:block">
                {menuOpen ? "CLOSE" : "MENU"}
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Overlay Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[55] bg-[#0d0d0d] flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, ease: "circOut" }}
                >
                  <Link 
                    href={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="group relative inline-block py-2"
                  >
                    <span className="text-white/40 text-[10px] sm:text-xs font-bold tracking-[0.5em] block mb-1 group-hover:text-violet-500 transition-colors">
                      0{i + 1}
                    </span>
                    <span className="text-white text-4xl sm:text-7xl font-oswald font-bold tracking-widest transition-all duration-500 group-hover:tracking-[0.2em] group-hover:text-violet-500">
                      {link.name}
                    </span>
                    <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-violet-600 transition-all duration-500 group-hover:w-full" />
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 flex items-center gap-8"
              >
                {user ? (
                   <button 
                  onClick={handleLogout}
                  className="text-red-500 text-xs font-black tracking-[0.4em] uppercase border-b border-red-500/30 hover:border-red-500 transition-all py-1"
                >
                  EXIT SESSION
                </button>
                ) : (
                  <Link 
                    href="/register" 
                    onClick={() => setMenuOpen(false)}
                    className="text-violet-500 text-xs font-black tracking-[0.4em] uppercase border-b border-violet-500/30 hover:border-violet-500 transition-all py-1"
                  >
                    JOIN THE BLOG
                  </Link>
                )}
              </motion.div>
            </div>

            <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between pointer-events-none opacity-40">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden grayscale">
                   <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-white text-[10px] font-bold tracking-widest uppercase">Hiyan Jong Rai</span>
                   <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase font-serif">हियान जोंग राई</span>
                 </div>
               </div>
               <div className="text-white text-[10px] font-bold tracking-widest uppercase hidden md:block">
                 Official Creative Journal &copy; 2026
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
