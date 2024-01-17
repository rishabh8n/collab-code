import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controllers";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/refresh-token").get(refreshAccessToken);

export default router;
