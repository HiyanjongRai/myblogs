"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Trash2, Copy, Check, Search, RefreshCw } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

interface MediaItem {
  url: string;
  name: string;
  uploadedAt: string;
}

export default function MediaLibraryPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [newUploads, setNewUploads] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  // Load from localStorage for demo
  useEffect(() => {
    const stored = localStorage.getItem("hiyanblog_media");
    if (stored) setImages(JSON.parse(stored));
  }, []);

  function saveImages(imgs: MediaItem[]) {
    setImages(imgs);
    localStorage.setItem("hiyanblog_media", JSON.stringify(imgs));
  }

  function handleNewUploads(urls: string[]) {
    const newItems: MediaItem[] = urls.map((url) => ({
      url,
      name: url.split("/").pop() || "image",
      uploadedAt: new Date().toISOString(),
    }));
    saveImages([...newItems, ...images]);
    setNewUploads([]);
  }

  function removeImage(url: string) {
    saveImages(images.filter((i) => i.url !== url));
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  const filtered = images.filter(
    (i) => !search || i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ImageIcon size={22} className="page-title-icon" /> Media Library
          </h1>
          <p className="page-subtitle">{images.length} file{images.length !== 1 ? "s" : ""} uploaded</p>
        </div>
        <button className="btn-ghost" onClick={() => saveImages([])} title="Clear all">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Upload Zone */}
      <div className="editor-section">
        <h2 className="editor-section-title">Upload New Images</h2>
        <ImageUploader images={newUploads} onChange={handleNewUploads} max={10} />
      </div>

      {/* Gallery */}
      <div className="editor-section">
        <div className="section-header">
          <h2 className="section-title">All Media</h2>
          <div className="filter-search" style={{ maxWidth: 280 }}>
            <Search size={14} className="filter-search-icon" />
            <input
              className="filter-search-input"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <ImageIcon size={48} className="empty-icon" />
            <p className="empty-title">No media yet</p>
            <p className="empty-desc">Upload images above to manage them here</p>
          </div>
        ) : (
          <div className="media-gallery">
            {filtered.map((item) => (
              <div key={item.url} className="media-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.name} className="media-img" />
                <div className="media-overlay">
                  <p className="media-name">{item.name.slice(0, 20)}</p>
                  <div className="media-overlay-actions">
                    <button
                      className="media-action-btn"
                      onClick={() => copyUrl(item.url)}
                      title="Copy URL"
                    >
                      {copied === item.url ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button
                      className="media-action-btn media-action-delete"
                      onClick={() => removeImage(item.url)}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
