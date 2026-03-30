import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHomeContent extends Document {
  title: string;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HomeContentSchema = new Schema<IHomeContent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const HomeContent: Model<IHomeContent> =
  mongoose.models.HomeContent || mongoose.model<IHomeContent>("HomeContent", HomeContentSchema);

export default HomeContent;
