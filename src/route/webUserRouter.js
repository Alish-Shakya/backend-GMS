import { Router } from "express";
import { register } from "../controller/webUserController.js";

const webUserRouter = Router();

webUserRouter.route("/register").post(register);

export default webUserRouter;
