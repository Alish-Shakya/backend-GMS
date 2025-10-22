import { secretKey } from "../utils/constant.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    let tokenString = req.headers.authorization; // ✅ fixed spelling and removed ()
    if (!tokenString) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    let tokenArray = tokenString.split(" ");
    let token = tokenArray[1]; // "Bearer <token>"

    let user = jwt.verify(token, secretKey); // ✅ no await needed
    req._id = user._id; // ✅ clearer naming
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Token not valid",
    });
  }
};
