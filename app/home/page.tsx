"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function HomePage() {
  const { user, loading, fetchUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const stats = [
    { label: "PUBLISHED STORIES", value: "12", trend: "+2 this month" },
    { label: "READER ENGAGEMENT", value: "4.8K", trend: "High reach" },
    { label: "JOURNAL STREAK", value: "5 Days", trend: "Keep going!" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-violet-600/30 font-sans">
      {/* Background Texture Element */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Main Centered Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center pt-48 pb-32">
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 flex flex-col items-center">
           
           {/* 1. Header Information */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="w-full flex flex-col items-center text-center mb-16"
           >
             <div className="flex items-center justify-center gap-6 mb-10 w-full">
                <div className="h-[1px] w-12 sm:w-24 bg-white/20" />
                <span className="text-violet-400 font-oswald font-black text-[10px] sm:text-xs tracking-[0.5em] uppercase">
                  OFFICIAL AUTHOR PORTAL
                </span>
                <div className="h-[1px] w-12 sm:w-24 bg-white/20" />
             </div>

             <h1 className="text-6xl sm:text-8xl md:text-9xl font-serif italic mb-6 leading-tight text-white/90 font-light text-balance px-4">
                Welcome back, <br/>
                <span className="text-violet-500 font-medium">{user.fullName.split(' ')[0]}.</span>
             </h1>

             <p className="text-gray-500 text-xs font-bold tracking-[0.4em] uppercase max-w-lg mx-auto opacity-80 mt-6">
                ACTIVE SESSION: <span className="text-white">@{user.username}</span> &mdash; SECURED
             </p>
           </motion.div>

           {/* 2. Primary CTA / Write Button */}
           <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-32 w-full flex flex-col sm:flex-row items-center justify-center gap-6"
           >
             <Link 
                href="/editor/new"
                className="group relative px-12 py-6 bg-white text-black font-black text-[10px] sm:text-xs tracking-[0.5em] uppercase hover:text-white transition-colors duration-500 overflow-hidden flex items-center justify-center gap-4 rounded-sm w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-violet-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10">WRITE NEW STORY</span>
                <svg className="relative z-10 w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
              
              <Link 
                href="/home/manage-content"
                className="group relative px-12 py-6 bg-transparent border border-white/20 text-white font-black text-[10px] sm:text-xs tracking-[0.5em] uppercase hover:border-violet-500 transition-colors duration-500 overflow-hidden flex items-center justify-center gap-4 rounded-sm w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-violet-600/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10">MANAGE LANDING PAGE</span>
                <svg className="relative z-10 w-5 h-5 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </Link>
           </motion.div>

           {/* 3. Stats Section */}
           <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
             {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-white/[0.02] border border-white/10 p-12 flex flex-col items-center justify-center text-center group hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-500"
                >
                  <span className="text-gray-500 font-oswald font-black text-[10px] tracking-[0.4em] mb-4 block group-hover:text-violet-400 transition-colors uppercase">
                    {stat.label}
                  </span>
                  <div className="text-6xl font-oswald font-bold tracking-widest text-white mb-3">
                    {stat.value}
                  </div>
                  <span className="text-violet-400/60 text-[9px] font-bold tracking-[0.3em] uppercase">
                    {stat.trend}
                  </span>
                </motion.div>
             ))}
           </div>

           {/* 4. Archives / Recent Content Feed */}
           <div className="w-full max-w-5xl mx-auto flex flex-col">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-12 border-b border-white/10 pb-6 w-full gap-6">
                <h2 className="text-2xl font-oswald font-black tracking-[0.3em] uppercase text-white/50">MANAGE ARCHIVES</h2>
                <div className="flex gap-8 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                  <button className="hover:text-violet-400 transition-colors">SORT: NEWEST</button>
                  <button className="hover:text-violet-400 transition-colors">FILTER: ALL</button>
                </div>
              </div>

              {/* Empty state with more presence */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="w-full flex flex-col items-center justify-center py-40 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors gap-6"
               >
                 <svg className="w-24 h-24 text-white/10 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                 <h3 className="text-3xl md:text-5xl font-serif italic text-white/40 text-center font-light text-balance px-4">Your travel library is waiting to be filled.</h3>
                 <p className="text-gray-500 text-[10px] font-bold tracking-[0.6em] uppercase mt-2 mb-8">CAPTURE YOUR FIRST JOURNEY</p>
                 <Link href="/editor/new" className="px-10 py-4 border border-white/20 text-white/80 text-[10px] font-black tracking-[0.5em] uppercase hover:bg-white hover:text-black transition-all">
                   INITIATE CONTENT
                 </Link>
               </motion.div>
           </div>

           {/* 5. Utility Grid (Quick Actions) */}
           <div className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-32 border-t border-white/5 pt-20">
              {[
                  { label: "EXPLORE", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9", path: "/blog" },
                  { label: "DRAFTS", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", path: "/drafts" },
                  { label: "SETTINGS", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", path: "/settings" },
                  { label: "METRICS", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", path: "/analytics" },
              ].map((item, i) => (
                <Link 
                  key={item.label}
                  href={item.path}
                  className="flex flex-col items-center justify-center gap-4 py-10 bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-violet-500/30 transition-all group"
                >
                  <svg className="w-8 h-8 text-white/30 group-hover:text-violet-400 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <span className="text-[10px] font-black tracking-[0.4em] text-white/40 group-hover:text-white transition-colors uppercase mt-2">
                    {item.label}
                  </span>
                </Link>
              ))}
           </div>
        </div>
      </div>

      {/* Global Bottom Branding */}
      <div className="w-full bg-[#050505] border-t border-white/10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
              <span className="text-white/60 text-[10px] font-black tracking-[0.4em] uppercase">Official Journal Management</span>
              <span className="text-violet-500/80 font-serif italic text-xs tracking-widest uppercase">Verified Access</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-white/40 text-right text-[10px] font-bold tracking-[0.2em] uppercase">
                Logged in as: <br/> <strong className="text-white tracking-widest">{user.fullName}</strong>
              </span>
              <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden grayscale">
                 <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=100&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
