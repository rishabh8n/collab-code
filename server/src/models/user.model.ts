import { NextFunction } from "express";
import bcrypt from "bcrypt";
import { Schema, model, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";

export interface UserProps extends Document {
  name: string;
  username: String;
  email: String;
  password: string;
  refreshToken?: String;
  starred?: String[];
}

interface UserMethods {
  isPasswordCorrect(password: string): boolean;
}

type UserModel = Model<UserProps, {}, UserMethods>;

const userSchema = new Schema<UserProps, UserModel, UserMethods>(
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

userSchema.pre("save", async function (this: UserProps): Promise<void> {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.method(
  "isPasswordCorrect",
  async function (this: UserProps, password: string) {
    return await bcrypt.compare(password, this.password);
  },
);
userSchema.method("generateAccessToken", function (this: UserProps) {
  let sec: string = process.env.ACCESS_TOKEN_SECRET as string;
  return jwt.sign({ _id: this._id }, sec, {
    expiresIn: process.env.ACCESS_TOKEN_DURATION,
  });
});
userSchema.method("generateRefreshToken", function (this: UserProps) {
  let sec: string = process.env.REFRESH_TOKEN_SECRET as string;
  return jwt.sign({ _id: this._id }, sec, {
    expiresIn: process.env.REFRESH_TOKEN_DURATION,
  });
});
export const User = model<UserProps, UserModel>("User", userSchema);
