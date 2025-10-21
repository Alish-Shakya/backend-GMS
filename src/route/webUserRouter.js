import { Router } from "express";
import {
  Login,
  register,
  verifyEmail,
} from "../controller/webUserController.js";
import upload from "../middleware/upload.js";

const webUserRouter = Router();

webUserRouter.route("/register").post(upload.single("photo"), register);

webUserRouter.route("/verifyEmail").post(verifyEmail);

webUserRouter.route("/login").post(Login);

export default webUserRouter;
