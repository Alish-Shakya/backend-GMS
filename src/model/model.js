import mongoose from "mongoose";
import webUserSchema from "../schema/webUserSchema.js";

export const webUser = mongoose.model("WebUsser", webUserSchema);
