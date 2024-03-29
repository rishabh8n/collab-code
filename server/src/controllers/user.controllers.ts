import { CustomRequest, DecodedData } from "../middlewares/auth.middleware";
import { User, UserProps } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  //get user data from request
  const { name, username, email, password }: UserProps = req.body;

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

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  //get user data from request
  const { email, password }: { email: string; password: string } = req.body;

  //find user
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "email is not registered");

  //compare password
  if (!(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Incorrect password");
  }

  //generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  //save refresh token in database
  user.refreshToken = refreshToken;
  const savedUser = await user.save();
  if (!savedUser) {
    throw new ApiError(501, "unable to login user");
  }
  //send response with cookies
  res
    .status(201)
    .cookie("ACCESS_TOKEN", accessToken, {
      httpOnly: true,
      secure: true,
    })
    .cookie("REFRESH_TOKEN", refreshToken, {
      httpOnly: true,
      secure: true,
    })
    .send(
      new ApiResponse(
        201,
        {
          username: savedUser.username,
          email: savedUser.email,
          refreshToken: savedUser.refreshToken,
          starred: savedUser.starred,
        },
        "user logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req: CustomRequest, res) => {
  const userId = req.user?._id;
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { refreshToken: "" } },
    { new: true },
  );
  res
    .status(201)
    .clearCookie("ACCESS_TOKEN", {
      httpOnly: true,
      secure: true,
    })
    .clearCookie("REFRESH_TOKEN", {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(201, {}, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req: Request, res) => {
  //get user id
  try {
    const refreshToken = req.cookies.REFRESH_TOKEN;
    if (!refreshToken) throw new ApiError(401, "unauthorized request");
    let sec = process.env.REFRESH_TOKEN_SECRET as string;
    const decoded = jwt.verify(refreshToken, sec) as DecodedData;
    //find user
    const user = await User.findById(decoded);
    if (!user) {
      throw new ApiError(401, "Invalid request token");
    }
    //compare refresh token
    if (user?.refreshToken !== refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    //generate new access token
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    //save new refresh token in database
    user.refreshToken = newRefreshToken;
    const savedUser = await user.save();
    if (!savedUser) {
      throw new ApiError(501, "unable to process request");
    }
    //set new access token in cookie
    res
      .status(200)
      .cookie("ACCESS_TOKEN", newAccessToken, { httpOnly: true, secure: true })
      .cookie("REFRESH_TOKEN", newRefreshToken, {
        httpOnly: true,
        secure: true,
      })
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          "Token refreshed successfully",
        ),
      );
  } catch (error: any) {
    throw new ApiError(401, error?.message || "unable to process request");
  }
});
export { registerUser, loginUser, logoutUser, refreshAccessToken };
