import jwt from "jsonwebtoken";

export const VerifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains user email or id
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
