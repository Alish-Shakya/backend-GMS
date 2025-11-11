import { Router } from "express";
import {
  forgotPassword,
  Login,
  myProfile,
  register,
  resetPassword,
  // verifyEmail,
  verifyOTP,
} from "../controller/webUserController.js";
import upload from "../middleware/upload.js";
import { isAuthenticated } from "../middleware/Authenticated.js";

const webUserRouter = Router();

webUserRouter.route("/register").post(upload.single("photo"), register);

// webUserRouter.route("/verifyEmail").post(verifyEmail);
webUserRouter.post("/verify-otp", verifyOTP);

webUserRouter.route("/login").post(Login);

webUserRouter.route("/myProfile").get(isAuthenticated, myProfile);

webUserRouter.route("/forgot-password").post(forgotPassword);

webUserRouter.route("/reset-password").patch(isAuthenticated, resetPassword);

export default webUserRouter;
