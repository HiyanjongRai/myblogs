"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export default function ImageUploader({ images, onChange, max = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      const allowed = files.slice(0, max - images.length);
      if (!allowed.length) return;

      setUploading(true);
      try {
        const fd = new FormData();
        allowed.forEach((f) => fd.append("files", f));
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.uploads) {
          const newUrls = (data.uploads as UploadedImage[]).map((u) => u.url);
          onChange([...images, ...newUrls]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setUploading(false);
      }
    },
    [images, onChange, max]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      uploadFiles(files);
    },
    [uploadFiles]
  );

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="image-uploader">
      {images.length > 0 && (
        <div className="uploaded-images-grid">
          {images.map((url, idx) => (
            <div key={idx} className="uploaded-image-item group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Upload ${idx + 1}`} className="uploaded-img" />
              <button
                className="remove-image-btn"
                onClick={() => removeImage(idx)}
                type="button"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < max && (
        <div
          className={`upload-dropzone ${dragging ? "dropzone-active" : ""} ${
            uploading ? "dropzone-uploading" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              uploadFiles(files);
              e.target.value = "";
            }}
          />
          {uploading ? (
            <div className="upload-loading">
              <Loader2 size={24} className="spin" />
              <p>Uploading...</p>
            </div>
          ) : (
            <div className="upload-prompt">
              {dragging ? (
                <ImageIcon size={28} className="upload-icon-active" />
              ) : (
                <Upload size={28} className="upload-icon" />
              )}
              <p className="upload-prompt-main">
                {dragging ? "Drop images here" : "Drag & drop or click to upload"}
              </p>
              <p className="upload-prompt-sub">
                PNG, JPG, WebP · Max {max} images
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
