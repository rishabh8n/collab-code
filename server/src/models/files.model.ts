import { Schema, model } from "mongoose";

const fileSchema = new Schema(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
      enum: ["file", "directory"],
    },
    extension: {
      type: String,
    },
    path: {
      type: String,
    },
    playground: {
      type: Schema.Types.ObjectId,
      ref: "Playground",
      index: true,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true },
);

export const File = model("File", fileSchema);
