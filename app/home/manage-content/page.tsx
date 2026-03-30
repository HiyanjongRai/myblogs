"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import Link from "next/link";

export default function ManageHomeContentPage() {
  const { user, loading, fetchUser } = useAuthStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchUser();
    const loadCurrentContent = async () => {
      try {
        const res = await axios.get("/api/home-content");
        if (res.data) {
          setTitle(res.data.title || "");
          setDescription(res.data.description || "");
          setImages(res.data.images || []);
        }
      } catch (err) {
        console.error("Failed to load content", err);
      }
    };
    loadCurrentContent();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        const res = await axios.post("/api/upload", formData);
        newImages.push(res.data.url);
      }
      setImages(newImages);
    } catch (err) {
      alert("Failed to upload image(s)");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      await axios.post("/api/home-content", {
        title,
        description,
        images
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save content");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link href="/home" className="text-violet-500 text-[10px] font-black tracking-[0.4em] uppercase hover:text-white transition-colors block mb-4">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-6xl font-serif italic mb-4">Manage <span className="text-violet-500">Home Page</span></h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Update the landing page experience</p>
        </header>

        <form onSubmit={handleSave} className="space-y-8 bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-2xl">
          <div className="space-y-4">
            <label className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">Hero Section Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full bg-white/[0.05] border border-white/10 px-6 py-4 text-white focus:border-violet-600 outline-none transition-all font-oswald text-xl tracking-widest uppercase"
              placeholder="e.g. HIYAN JONG RAI"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">Hero Section Subtitle / Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full bg-white/[0.05] border border-white/10 px-6 py-4 text-white focus:border-violet-600 outline-none transition-all font-serif h-32"
              placeholder="e.g. OFFICIAL TRAVEL BLOG & CREATIVE JOURNAL"
              required
            />
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 block">Hero Background Images (Multiple Support)</label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatePresence>
                {images.map((img, i) => (
                  <motion.div 
                    key={img} 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative group aspect-square rounded-lg overflow-hidden border border-white/10"
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Hero Preview" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-bold text-white tracking-widest">IMG 0{i+1}</div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <label className="relative aspect-square border-2 border-dashed border-white/10 hover:border-violet-500/50 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.01]">
                <input type="file" multiple onChange={handleFileUpload} className="hidden" accept="image/*" disabled={isUploading} />
                {isUploading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full" />
                ) : (
                  <>
                    <span className="text-2xl mb-2">📸</span>
                    <span className="text-[8px] font-black tracking-widest text-gray-500 uppercase">ADD IMAGE</span>
                  </>
                )}
              </label>
            </div>
            <p className="text-gray-600 text-[10px] italic mb-4">Multiple images will enable the auto-sliding carousel on the home page.</p>
            
            <div className="flex gap-4 items-center bg-white/[0.02] p-4 rounded-xl border border-white/5">
               <input 
                 type="text" 
                 id="urlInput"
                 placeholder="Or paste an external image URL (e.g. Unsplash)" 
                 className="flex-1 bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-violet-600 outline-none transition-all text-xs tracking-widest"
               />
               <button 
                 type="button"
                 onClick={() => {
                   const input = document.getElementById('urlInput') as HTMLInputElement;
                   if (input && input.value && input.value.startsWith('http')) {
                     setImages([...images, input.value]);
                     input.value = '';
                   } else {
                     alert("Please enter a valid HTTP/HTTPS image URL.");
                   }
                 }}
                 className="px-6 py-3 bg-white/10 hover:bg-violet-600 border border-white/10 text-white font-black text-[10px] tracking-[0.3em] uppercase transition-all whitespace-nowrap"
               >
                 ADD BY URL
               </button>
            </div>
          </div>

          <div className="pt-8 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSaving}
              className="px-12 py-5 bg-violet-600 text-white font-black text-xs tracking-[0.4em] uppercase hover:bg-violet-500 transition-all flex items-center gap-3 disabled:opacity-50 shadow-2xl shadow-violet-900/40"
            >
              {isSaving ? "Synchronizing..." : "UPDATE HOME EXPERIENCE"}
            </motion.button>
            
            {success && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 text-xs font-bold tracking-widest uppercase">
                ✅ System Updated Successfully
              </motion.span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

