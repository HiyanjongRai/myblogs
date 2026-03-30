"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Step {
  id: string;
  order: number;
  text: string;
  images: string[];
}

interface IBlog {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  createdAt: string;
  steps: Step[];
  tags: string[];
}

export default function BlogReaderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/blogs/${id}`);
        setBlog(data.blog);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-white text-2xl font-serif italic mb-4">Story Not Found</h2>
        <p className="text-gray-500 text-sm tracking-widest uppercase mb-8">This blog might have been deleted or never existed.</p>
        <button onClick={() => router.push("/")} className="px-10 py-3 bg-white text-black text-xs font-black tracking-widest uppercase hover:bg-violet-600 hover:text-white transition-all">Return Home</button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white text-[#1a1a1a] selection:bg-violet-600/30 selection:text-white overflow-x-hidden font-inter">
      {/* 1. Header Hero */}
      <section className="relative w-full h-[60vh] sm:h-[80vh] flex flex-col justify-end bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={blog.coverImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"} 
            alt={blog.title} 
            className="w-full h-full object-cover grayscale brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-20 pt-32">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">
             <ArrowLeft size={14} /> Back to stories
          </Link>
          <span className="text-violet-400 font-black text-sm tracking-[0.4em] uppercase mb-4 block">
            {blog.category || "Uncategorized"}
          </span>
          <h1 className="text-5xl sm:text-7xl font-serif text-white mb-8 leading-[1.1]">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-white/50 text-xs font-bold tracking-widest uppercase">
             <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
             <span className="w-1 h-1 bg-white/30 rounded-full" />
             <span>BY ADMIN</span>
          </div>
        </div>
      </section>

      {/* 2. Blog Body */}
      <section className="w-full max-w-3xl mx-auto px-6 py-20">
         {blog.description && (
           <p className="text-xl sm:text-2xl font-serif italic text-gray-600 leading-relaxed mb-16 border-l-4 border-violet-500 pl-6">
             {blog.description}
           </p>
         )}

         {/* Content Steps */}
         {blog.steps?.length > 0 && (
           <div className="flex flex-col gap-24">
             {blog.steps.sort((a, b) => a.order - b.order).map((step, index) => (
               <div key={(step as any)._id || step.id || `step-${index}`} className="group">
                  <div className="flex items-center gap-4 mb-6">
                     <span className="text-gray-300 font-oswald text-4xl font-bold opacity-50">0{index + 1}</span>
                     <div className="h-[1px] flex-1 bg-gray-200" />
                  </div>
                  
                  {step.text && (
                    <div 
                      className="text-gray-800 text-lg leading-[1.8] mb-10 font-[Inter] 
                      [&>h1]:text-4xl [&>h1]:font-serif [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:text-black 
                      [&>h2]:text-3xl [&>h2]:font-serif [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-8 [&>h2]:text-black 
                      [&>h3]:text-2xl [&>h3]:font-serif [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:mt-6 [&>h3]:text-black 
                      [&>p]:mb-6 
                      [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 
                      [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 
                      [&>blockquote]:border-l-4 [&>blockquote]:border-violet-500 [&>blockquote]:bg-gray-50 [&>blockquote]:py-3 [&>blockquote]:px-6 [&>blockquote]:rounded-r-lg [&>blockquote]:text-gray-600 [&>blockquote]:italic [&>blockquote]:mb-6 
                      [&>a]:text-violet-600 [&>a]:underline hover:[&>a]:text-violet-800"
                      dangerouslySetInnerHTML={{ __html: step.text }}
                    />
                  )}

                  {step.images && step.images.length > 0 && (
                     <div className={`grid gap-4 mt-8 ${step.images.length === 1 ? 'grid-cols-1' : step.images.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                       {step.images.map((img, i) => (
                         <div key={i} className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                           <img src={img} alt={`Step ${index + 1} Image ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                         </div>
                       ))}
                     </div>
                  )}
               </div>
             ))}
           </div>
         )}

         {/* Tags */}
         {blog.tags?.length > 0 && (
           <div className="mt-24 pt-10 border-t border-gray-200 flex flex-wrap gap-2">
             {blog.tags.map(tag => (
               <span key={tag} className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold tracking-widest uppercase rounded-full">
                 #{tag}
               </span>
             ))}
           </div>
         )}
      </section>

      {/* Footer */}
      <footer className="bg-black py-20 px-6 mt-32 border-t border-white/5 flex justify-center text-center">
         <div className="w-full max-w-4xl flex flex-col items-center gap-8">
            <span className="text-white font-oswald font-black text-3xl tracking-[0.2em]">HIYAN<span className="text-violet-500">JONG</span></span>
            <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase max-w-md mx-auto leading-loose items-center gap-2">
              Stay inspired. Keep exploring. <br/>
              © 2026 OFFICIAL HiyanBlog.
            </p>
         </div>
      </footer>
    </div>
  );
}
