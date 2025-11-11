// import jwt from "jsonwebtoken";
// import { secretKey } from "../utils/constant.js";

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader)
//     return res.status(403).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1];

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });
//     req.user = decoded; // decoded contains user info (like id, email)
//     next();
//   });
// };
