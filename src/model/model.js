import mongoose from "mongoose";
import webUserSchema from "../schema/webUserSchema.js";
import memberSchema from "../schema/memberSchema.js";

export const webUser = mongoose.model("WebUsser", webUserSchema);

export const member = mongoose.model("Member", memberSchema);
