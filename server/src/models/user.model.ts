import { NextFunction } from "express";
import bcrypt from "bcrypt";
import { Schema, model, Document } from "mongoose";

export interface UserType extends Document {
  name: string;
  username: String;
  email: String;
  password: string;
  refreshToken?: String;
  starred?: String[];
}

const userSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    starred: {
      type: [Schema.Types.ObjectId],
      ref: "playground",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (this: UserType): Promise<void> {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
export const User = model("User", userSchema);
