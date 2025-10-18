import { Router } from "express";
import { register, verifyEmail } from "../controller/webUserController.js";

const webUserRouter = Router();

webUserRouter.route("/register").post(register);

webUserRouter.route("/verifyEmail").post(verifyEmail);

export default webUserRouter;
