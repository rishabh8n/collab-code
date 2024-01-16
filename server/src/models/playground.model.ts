import { Schema, model } from "mongoose";

const playgroundSchema = new Schema(
  {
    mode: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: "User", index: true },
    view: { type: String, enum: ["private", "public"] },
    contributors: { type: [Schema.Types.ObjectId], ref: "User" },
    folders: { type: [Schema.Types.ObjectId], ref: "File" },
    files: { type: [Schema.Types.ObjectId], ref: "File" },
  },
  { timestamps: true },
);

export const Playground = model("Playground", playgroundSchema);
