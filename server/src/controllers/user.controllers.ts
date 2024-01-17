import { User, UserType } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  //get user data from request
  const { name, username, email, password }: UserType = req.body;

  //validate
  if (!name) throw new ApiError(401, "Name is required");
  if (!username) throw new ApiError(401, "username is required");
  if (!email) throw new ApiError(401, "email is required");
  if (!password) throw new ApiError(401, "password is required");
  if (!email.toLowerCase().match(/^\S+@\S+\.\S+$/))
    throw new ApiError(401, "email is invalid");

  //find user in database
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (user) {
    if (user.email === email) {
      throw new ApiError(401, "user with this email already exists");
    } else {
      throw new ApiError(401, "username is already taken");
    }
  }

  //create new user
  const newUser = await User.create({ name, email, username, password });

  //save user in database
  const savedUser = await newUser.save();
  if (!savedUser) {
    throw new ApiError(501, "unable to register user, try again later");
  }

  //send user details back
  res.status(201).send(
    new ApiResponse(
      201,
      {
        email: savedUser.email,
        username: savedUser.username,
        name,
        _id: savedUser._id,
      },
      "user registered successfully",
    ),
  );
});

const loginUser = asyncHandler((req: Request, res: Response) => {});

export { registerUser, loginUser };
