import { Router } from "express";
import {
  Login,
  myProfile,
  register,
  verifyEmail,
} from "../controller/webUserController.js";
import upload from "../middleware/upload.js";
import { isAuthenticated } from "../middleware/Authenticated.js";

const webUserRouter = Router();

webUserRouter.route("/register").post(upload.single("photo"), register);

webUserRouter.route("/verifyEmail").post(verifyEmail);

webUserRouter.route("/login").post(Login);

webUserRouter.route("/myProfile").get(isAuthenticated, myProfile);

export default webUserRouter;
