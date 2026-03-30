"use client";

import { Step } from "./StepBuilder";
import { Tag, Layers } from "lucide-react";

interface BlogPreviewProps {
  title: string;
  description: string;
  coverImage?: string;
  steps: Step[];
  tags: string[];
  category: string;
}

export default function BlogPreview({
  title,
  description,
  coverImage,
  steps,
  tags,
  category,
}: BlogPreviewProps) {
  const hasContent = title || description || coverImage || steps.length > 0;

  if (!hasContent) {
    return (
      <div className="preview-empty">
        <Layers size={40} className="preview-empty-icon" />
        <p>Start filling in the form to see your blog preview here.</p>
      </div>
    );
  }

  return (
    <div className="blog-preview">
      {/* Category */}
      {category && (
        <span className="preview-category">{category}</span>
      )}

      {/* Cover */}
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt="Cover" className="preview-cover" />
      )}

      {/* Title */}
      <h1 className="preview-title">{title || "Your Blog Title"}</h1>

      {/* Description */}
      {description && <p className="preview-description">{description}</p>}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="preview-tags">
          <Tag size={12} />
          {tags.map((t) => (
            <span key={t} className="preview-tag">{t}</span>
          ))}
        </div>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <div className="preview-steps">
          <hr className="preview-divider" />
          {steps.map((step, idx) => (
            <div key={step.id} className="preview-step">
              <div className="preview-step-header">
                <div className="preview-step-num">{idx + 1}</div>
                <span className="preview-step-label">Step {idx + 1}</span>
              </div>
              {step.text && (
                <div
                  className="preview-step-text"
                  dangerouslySetInnerHTML={{ __html: step.text }}
                />
              )}
              {step.images.length > 0 && (
                <div className="preview-step-images">
                  {step.images.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt={`Step ${idx + 1} image ${i + 1}`} className="preview-step-img" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
