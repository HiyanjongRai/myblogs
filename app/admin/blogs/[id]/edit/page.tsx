"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Save, Globe, FileText, Eye, X, Plus, Tag, Layers, ArrowLeft, CheckCircle,
} from "lucide-react";
import StepBuilder, { Step } from "@/components/admin/StepBuilder";
import ImageUploader from "@/components/admin/ImageUploader";
import BlogPreview from "@/components/admin/BlogPreview";

const CATEGORIES = [
  "General", "Technology", "Travel", "Food", "Lifestyle",
  "Health", "Business", "Science", "Culture", "Other",
];

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

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
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!id) return;
    fetch(`/api/blogs/${id}`)
      .then((r) => r.json())
      .then(({ blog }) => {
        if (!blog) { router.push("/admin/blogs"); return; }
        setTitle(blog.title || "");
        setDescription(blog.description || "");
        setCoverImage(blog.coverImage ? [blog.coverImage] : []);
        setSteps(
          (blog.steps || []).map((s: { order: number; text: string; images: string[] }, i: number) => ({
            id: `step-${i}-${Date.now()}`,
            order: s.order,
            text: s.text,
            images: s.images || [],
          }))
        );
        setTags(blog.tags || []);
        setCategory(blog.category || "General");
        setStatus(blog.status || "draft");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, router]);

  const saveBlog = useCallback(
    async (publishStatus?: "draft" | "published") => {
      if (!title.trim()) { showToast("Please enter a blog title", "error"); return; }
      setSaving(true);
      try {
        const res = await fetch(`/api/blogs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title, description,
            coverImage: coverImage[0] || "",
            steps: steps.map(({ id: _sid, ...rest }) => rest),
            tags, category,
            status: publishStatus ?? status,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save");
        showToast(publishStatus === "published" ? "Published!" : "Saved!", "success");
        if (publishStatus === "published") setTimeout(() => router.push("/admin/blogs"), 1500);
      } catch (e: unknown) {
        showToast(e instanceof Error ? e.message : "Error saving", "error");
      } finally {
        setSaving(false);
      }
    },
    [id, title, description, coverImage, steps, tags, category, status, router]
  );

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]); setTagInput("");
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="page-loading">
          <div className="loading-spinner" />
          <p>Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page create-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <CheckCircle size={16} /> {toast.msg}
        </div>
      )}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="btn-ghost-sm" type="button">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="page-title">
              <Layers size={22} className="page-title-icon" /> Edit Blog
            </h1>
            <p className="page-subtitle">Update your blog content and settings</p>
          </div>
        </div>
        <div className="create-header-actions">
          <button type="button" className="btn-ghost" onClick={() => setShowPreview(!showPreview)}>
            <Eye size={15} /> {showPreview ? "Hide Preview" : "Preview"}
          </button>
          <button type="button" className="btn-secondary" onClick={() => saveBlog("draft")} disabled={saving}>
            {saving ? <span className="btn-spinner" /> : <Save size={15} />} Save
          </button>
          <button type="button" className="btn-primary" onClick={() => saveBlog("published")} disabled={saving}>
            <Globe size={15} /> Publish
          </button>
        </div>
      </div>

      <div className={`create-layout ${showPreview ? "create-layout-split" : ""}`}>
        <div className="create-editor-panel">
          <div className="editor-section">
            <h2 className="editor-section-title"><FileText size={16} /> Blog Details</h2>
            <div className="form-group">
              <label className="form-label">Blog Title *</label>
              <input className="form-input title-input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
              <span className="char-count">{title.length}/200</span>
            </div>
            <div className="form-group">
              <label className="form-label">Short Description</label>
              <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} />
              <span className="char-count">{description.length}/500</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <div className="toggle-wrap">
                  <button type="button" className={`toggle-btn ${status === "draft" ? "toggle-active" : ""}`} onClick={() => setStatus("draft")}>
                    <FileText size={13} /> Draft
                  </button>
                  <button type="button" className={`toggle-btn ${status === "published" ? "toggle-active-pub" : ""}`} onClick={() => setStatus("published")}>
                    <Globe size={13} /> Published
                  </button>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tags</label>
              <div className="tags-input-wrap">
                <Tag size={14} className="tags-icon" />
                <input className="tags-input" placeholder="Add tag..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
                <button type="button" className="tags-add-btn" onClick={addTag}><Plus size={14} /></button>
              </div>
              {tags.length > 0 && (
                <div className="tags-list">
                  {tags.map((t) => (
                    <span key={t} className="tag-chip">{t}<button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}><X size={11} /></button></span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="editor-section">
            <h2 className="editor-section-title"><Eye size={16} /> Cover Image</h2>
            <ImageUploader images={coverImage} onChange={setCoverImage} max={1} />
          </div>
          <div className="editor-section">
            <h2 className="editor-section-title"><Layers size={16} /> Content Steps</h2>
            <StepBuilder steps={steps} onChange={setSteps} />
          </div>
        </div>
        {showPreview && (
          <div className="create-preview-panel">
            <div className="preview-panel-header"><Eye size={16} /> Live Preview</div>
            <BlogPreview title={title} description={description} coverImage={coverImage[0]} steps={steps} tags={tags} category={category} />
          </div>
        )}
      </div>
    </div>
  );
}
