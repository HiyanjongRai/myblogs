"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Globe,
  FileText,
  Eye,
  X,
  Plus,
  Tag,
  Layers,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import StepBuilder, { Step } from "@/components/admin/StepBuilder";
import ImageUploader from "@/components/admin/ImageUploader";
import BlogPreview from "@/components/admin/BlogPreview";

const CATEGORIES = [
  "General", "Technology", "Travel", "Food", "Lifestyle",
  "Health", "Business", "Science", "Culture", "Other",
];

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("General");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Auto-save draft every 30s
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDirty = useRef(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const saveBlog = useCallback(
    async (publishStatus?: "draft" | "published") => {
      if (!title.trim()) {
        showToast("Please enter a blog title", "error");
        return;
      }
      setSaving(true);
      try {
        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            coverImage: coverImage[0] || "",
            steps: steps.map(({ id: _id, ...rest }) => rest),
            tags,
            category,
            status: publishStatus ?? status,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save");
        setSaved(true);
        isDirty.current = false;
        showToast(
          publishStatus === "published" ? "Blog published successfully!" : "Draft saved!",
          "success"
        );
        if (publishStatus === "published") {
          setTimeout(() => router.push("/admin/blogs"), 1500);
        }
      } catch (e: unknown) {
        showToast(e instanceof Error ? e.message : "Something went wrong", "error");
      } finally {
        setSaving(false);
      }
    },
    [title, description, coverImage, steps, tags, category, status, router]
  );

  useEffect(() => {
    isDirty.current = true;
    setSaved(false);
  }, [title, description, coverImage, steps, tags, category]);

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (isDirty.current && title.trim()) {
        saveBlog("draft");
      }
    }, 30000);
    return () => { if (autoSaveRef.current) clearInterval(autoSaveRef.current); };
  }, [saveBlog]);

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]);
      setTagInput("");
    }
  }

  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t));
  }

  return (
    <div className="admin-page create-page p-6 max-w-[1600px] mx-auto">
      {toast && (
        <div className={`toast toast-${toast.type} absolute top-4 left-1/2 -translate-x-1/2 z-50`}>
          <CheckCircle size={16} /> {toast.msg}
        </div>
      )}

      {/* Header EXACT match */}
      <div className="flex items-center mb-6">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Create Blog</h1>
      </div>

      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8 w-full border-b border-gray-100 pb-6">
        <div className="flex items-center gap-6 w-full lg:w-auto flex-1">
          <div className="flex-1 max-w-[350px]">
            <label className="block text-[15px] font-semibold text-gray-900 mb-2">Blog Title</label>
            <input
              className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-sm text-gray-900 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Summer Vacation Guide"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="flex-1 max-w-[450px]">
            <label className="block text-[15px] font-semibold text-gray-900 mb-2">Short Description</label>
            <input
              className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-sm text-gray-900 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Enter a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {saved && <span className="saved-indicator text-xs font-semibold mr-2 text-gray-500 flex items-center gap-1"><CheckCircle size={12}/> Saved</span>}
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            onClick={() => saveBlog("draft")}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
            onClick={() => saveBlog("published")}
            disabled={saving}
          >
            Publish
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Hide Preview Tab" : "Preview in New Tab"}
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${showPreview ? "lg:grid-cols-[1.5fr,1fr]" : ""} gap-10`}>
        {/* ── Editor Panel ── */}
        <div className="create-editor-panel flex flex-col gap-8">
          {/* Step Builder */}
          <div>
            <h2 className="text-[20px] font-bold text-gray-900 mb-4">Step-by-Step Content Builder</h2>
            <StepBuilder steps={steps} onChange={setSteps} />
          </div>

          <hr className="border-gray-200 my-4" />
          {/* Blog Meta */}
          <div className="editor-section">
            <h2 className="editor-section-title">
              <FileText size={16} /> Blog Details
            </h2>
            <div className="form-group">
              <label className="form-label">Blog Title *</label>
              <input
                className="form-input title-input"
                placeholder="Enter an engaging blog title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
              />
              <span className="char-count">{title.length}/200</span>
            </div>

            <div className="form-group">
              <label className="form-label">Short Description</label>
              <textarea
                className="form-textarea"
                placeholder="Write a compelling short description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={500}
              />
              <span className="char-count">{description.length}/500</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <div className="toggle-wrap">
                  <button
                    type="button"
                    className={`toggle-btn ${status === "draft" ? "toggle-active" : ""}`}
                    onClick={() => setStatus("draft")}
                  >
                    <FileText size={13} /> Draft
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${status === "published" ? "toggle-active-pub" : ""}`}
                    onClick={() => setStatus("published")}
                  >
                    <Globe size={13} /> Published
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <div className="tags-input-wrap">
                <Tag size={14} className="tags-icon" />
                <input
                  className="tags-input"
                  placeholder="Add tag and press Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addTag(); }
                  }}
                />
                <button type="button" className="tags-add-btn" onClick={addTag}>
                  <Plus size={14} />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="tags-list">
                  {tags.map((t) => (
                    <span key={t} className="tag-chip">
                      {t}
                      <button type="button" onClick={() => removeTag(t)}>
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="editor-section">
            <h2 className="editor-section-title">
              <Eye size={16} /> Cover Image
            </h2>
            <ImageUploader images={coverImage} onChange={setCoverImage} max={1} />
          </div>

          {/* Step Builder */}
          <div className="editor-section">
            <h2 className="editor-section-title">
              <Layers size={16} /> Content Steps
            </h2>
            <p className="editor-section-desc">
              Build your blog content step by step. Each step can contain rich text and images.
              Drag to reorder.
            </p>
            <StepBuilder steps={steps} onChange={setSteps} />
          </div>
        </div>

        {/* ── Preview Panel ── */}
        {showPreview && (
          <div className="sticky top-24 self-start flex flex-col gap-4">
            <h2 className="text-[20px] font-bold text-gray-900">Live Preview</h2>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 overflow-y-auto max-h-[80vh]">
              <BlogPreview
                title={title}
                description={description}
                coverImage={coverImage[0]}
                steps={steps}
                tags={tags}
                category={category}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
