import { Router } from "express";
import {
  Login,
  register,
  verifyEmail,
} from "../controller/webUserController.js";

const webUserRouter = Router();

webUserRouter.route("/register").post(register);

webUserRouter.route("/verifyEmail").post(verifyEmail);

webUserRouter.route("/login").post(Login);

export default webUserRouter;
