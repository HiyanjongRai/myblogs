/**
 * Blog Mongoose Model
 * - Stores blog posts with step-by-step content builder
 */
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IStep {
  _id?: string;
  order: number;
  text: string;
  images: string[];
}

export interface IBlog extends Document {
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  steps: IStep[];
  tags: string[];
  category: string;
  status: "draft" | "published";
  author: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const StepSchema = new Schema<IStep>({
  order: { type: Number, required: true },
  text: { type: String, default: "" },
  images: [{ type: String }],
});

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title must be at most 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be at most 500 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    steps: [StepSchema],
    tags: [{ type: String, trim: true }],
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    author: {
      type: String,
      default: "Admin",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/** Auto-generate slug from title */
BlogSchema.pre("save", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim() +
      "-" +
      Date.now();
  }
});

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
