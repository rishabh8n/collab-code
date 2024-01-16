import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

const registerUser = asyncHandler((req: Request, res: Response) => {
  //get user data from request
  //find user in database
  //create new user
  //save user in database
  //send user details back
});
const loginUser = asyncHandler((req: Request, res: Response) => {});

export { registerUser, loginUser };
