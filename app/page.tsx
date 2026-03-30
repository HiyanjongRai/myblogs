"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

interface HomeData {
  title: string;
  description: string;
  images: string[];
}

interface IBlog {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  createdAt: string;
}

export default function LandingPage() {
  const { user, fetchUser } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    fetchUser();
    const loadHomeContent = async () => {
      const timeout = setTimeout(() => {
        if (loading) {
          setError(true);
          setLoading(false);
          console.error("Home content fetch timed out");
        }
      }, 10000); // 10s fallback

      try {
        const [homeRes, blogsRes] = await Promise.all([
          axios.get("/api/home-content"),
          axios.get("/api/blogs?status=published&limit=3")
        ]);
        setHomeData(homeRes.data);
        setBlogs(blogsRes.data.blogs || []);
        clearTimeout(timeout);
      } catch (err) {
        console.error("Home content fetch failed", err);
        setError(true);
        clearTimeout(timeout);
      } finally {
        setLoading(false);
      }
    };
    loadHomeContent();
  }, [fetchUser]);

  useEffect(() => {
    if (homeData && homeData.images && homeData.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % homeData.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [homeData]);

  // Dynamic blogs loaded from API

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-x-hidden">
      {loading ? (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full" />
        </div>
      ) : error || !homeData ? (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-white text-2xl font-serif italic mb-4">The mountains are calling, but the data is lost.</h2>
          <p className="text-gray-500 text-sm tracking-widest uppercase mb-8">System synchronization error</p>
          <button onClick={() => window.location.reload()} className="px-10 py-3 bg-white text-black text-xs font-black tracking-widest uppercase hover:bg-violet-600 hover:text-white transition-all">Retry Connection</button>
        </div>
      ) : (
        <>
          {/* 1. HERO */}
          <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/60 z-10" />
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  src={homeData.images[currentImageIndex]} 
                  className="w-full h-full object-cover grayscale brightness-75 contrast-125"
                />
              </AnimatePresence>

              {homeData.images.length > 1 && (
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 pointer-events-auto">
                  <button onClick={() => setCurrentImageIndex((prev) => (prev - 1 + homeData.images.length) % homeData.images.length)} className="text-white/40 hover:text-white transition-colors p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="flex items-center gap-3">
                    {homeData.images.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImageIndex(i)} className={`h-[2px] w-6 transition-all duration-500 ${i === currentImageIndex ? "bg-violet-500 w-12" : "bg-white/20"}`} />
                    ))}
                  </div>
                  <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % homeData.images.length)} className="text-white/40 hover:text-white transition-colors p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </motion.div>

            <div className="relative z-20 text-center px-6 max-w-5xl">
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease: "circOut" }}>
                <span className="text-white/60 tracking-[0.6em] font-oswald text-xs sm:text-sm font-bold uppercase mb-4 block">{homeData.description}</span>
                <h1 className="text-5xl sm:text-7xl md:text-9xl font-oswald font-black text-white tracking-[0.1em] mb-8 leading-tight drop-shadow-2xl uppercase">{homeData.title}</h1>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                  <Link href={user ? "/home" : "/register"} className="group relative px-10 py-4 bg-white text-black font-black text-xs tracking-widest uppercase hover:text-white transition-colors duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-violet-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
                    <span className="relative z-10">{user ? "ENTER DASHBOARD" : "START YOUR JOURNEY"}</span>
                  </Link>
                  {homeData.images.length > 1 && (
                    <div className="text-white/20 font-oswald font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 mt-4 sm:mt-0">
                      <span>0{currentImageIndex + 1}</span>
                      <div className="w-8 h-[1px] bg-white/10" />
                      <span>0{homeData.images.length}</span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </div>

            <div className="absolute bottom-12 left-12 right-12 z-20 flex items-center justify-between pointer-events-none">
              <div className="hidden md:flex flex-col items-start text-white/40 text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase">
                <span>BASED IN NEPAL &beyond</span>
                <span>Est. 2026 OFFICIAL</span>
              </div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-[1px] h-20 bg-white/30 mx-auto hidden sm:block" />
              <div className="flex flex-col items-end text-white/40 text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase text-right">
                <span>CURATED STORIES</span>
                <span>LOCALIZED EXPERIENCE</span>
              </div>
            </div>
          </section>

          {/* 2. COLLECTION */}
          <section className="relative z-30 bg-[#f8f9fa] py-32 px-6 flex justify-center">
            <div className="w-full max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-28 gap-8 px-4">
                <div className="max-w-2xl">
                  <span className="text-violet-600 font-oswald font-black text-sm tracking-[0.4em] mb-4 block">THE COLLECTION</span>
                  <h2 className="text-4xl sm:text-6xl font-serif italic text-[#1a1a1a] leading-[1.1]">Authentic Narratives from the Wild Hearts.</h2>
                </div>
                <Link href="/blog" className="group flex items-center gap-3 text-[#1a1a1a] font-oswald font-black text-sm tracking-widest uppercase border-b-2 border-black/10 pb-2 hover:border-violet-500 transition-all whitespace-nowrap">
                  VIEW ALL STORIES
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-4">
                {blogs.length > 0 ? (
                  blogs.map((blog, i) => (
                    <motion.div key={blog._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.8 }} className="group flex flex-col items-start cursor-pointer" onClick={() => window.location.href = `/blog/${blog._id}`}>
                      <div className="relative w-full aspect-[4/5] overflow-hidden mb-8 bg-gray-200 shadow-xl">
                        <div className="absolute top-6 left-6 z-10 px-4 py-1.5 bg-white text-black text-[9px] font-black tracking-[0.3em] uppercase">{blog.category || "Uncategorized"}</div>
                        <img src={blog.coverImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop"} alt={blog.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                        <div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-gray-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} &mdash; BY ADMIN
                      </span>
                      <h3 className="text-3xl font-serif text-[#1a1a1a] mb-4 leading-snug group-hover:text-violet-600 transition-colors">{blog.title}</h3>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">{blog.description ? (blog.description.length > 100 ? blog.description.substring(0, 100) + '...' : blog.description) : "Read this exciting new blog post."}</p>
                      <Link href={`/blog/${blog._id}`} className="text-black text-[10px] font-black tracking-[0.3em] uppercase border-b-2 border-black/10 hover:border-violet-600 transition-all py-1">READ ARTICLE</Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-gray-500 font-serif italic">
                    No articles have been published yet.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 3. CTA */}
          <section className="bg-[#111] py-40 relative overflow-hidden flex flex-col items-center text-center w-full px-6">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-violet-600/10 blur-[100px] pointer-events-none" />
             <span className="text-violet-500 font-oswald font-black text-sm tracking-[0.6em] mb-6 block uppercase">BECOME A CONTRIBUTOR</span>
             <h2 className="text-white text-4xl sm:text-7xl md:text-8xl font-oswald font-bold tracking-[0.1em] mb-16 uppercase leading-tight max-w-5xl">Share Your Story <br/> with the World.</h2>
             <Link href="/register" className="px-16 py-6 border border-white text-white font-black text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all">CREATE YOUR BLOG ACCOUNT</Link>
          </section>

          {/* 4. FOOTER */}
          <footer className="bg-black py-28 px-6 border-t border-white/5 flex justify-center">
            <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-16">
               <div className="flex flex-col items-start text-center md:text-left">
                 <span className="text-white font-oswald font-black text-4xl tracking-[0.2em] mb-4 mx-auto md:mx-0">HIYAN<span className="text-violet-500">JONG</span></span>
                 <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase font-serif italic max-w-xs leading-loose mx-auto md:mx-0">"Photography is the story I fail to put into words."</p>
               </div>
               <div className="flex gap-16 text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase">
                  <div className="flex flex-col gap-5">
                    <span className="text-white/60 mb-2">QUICK LINKS</span>
                    <Link href="/about" className="hover:text-white transition-colors">About Me</Link>
                    <Link href="/work" className="hover:text-white transition-colors">My Work</Link>
                    <Link href="/contact" className="hover:text-white transition-colors">Say Hello</Link>
                  </div>
                  <div className="flex flex-col gap-5">
                    <span className="text-white/60 mb-2">SOCIAL CHANNELS</span>
                    <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
                    <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
                    <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
                  </div>
               </div>
               <div className="flex items-center gap-6 pt-10 border-t border-white/10 md:pt-0 md:border-t-0">
                 <div className="text-right flex flex-col">
                   <span className="text-white text-[10px] font-bold tracking-widest uppercase italic">Hiyan Jong Rai</span>
                   <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase font-serif">हियान जोंग राई</span>
                 </div>
                 <div className="w-16 h-16 rounded-full border border-white/20 overflow-hidden grayscale">
                   <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Founder" className="w-full h-full object-cover" />
                 </div>
               </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
