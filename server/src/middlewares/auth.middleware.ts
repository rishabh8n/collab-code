import { Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { User, UserProps } from "../models/user.model";

interface DecodedData extends JwtPayload {
  _id: string;
}
export interface CustomRequest extends Request {
  user?: UserProps;
}
export const verifyJWT = asyncHandler(async (req: CustomRequest, res, next) => {
  const token =
    req.cookies?.ACCESS_TOKEN ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Unauthorized request");
  let sec = process.env.ACCESS_TOKEN_SECRET as string;
  const decoded = jwt.verify(token, sec) as DecodedData;
  const user = await User.findById(decoded?._id).select(
    "-password -refreshToken",
  );
  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }
  req.user = user;
  next();
});
