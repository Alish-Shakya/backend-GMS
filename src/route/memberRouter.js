// routes/memberRoute.js
import express from "express";
import multer from "multer";
import { createMember } from "../controller/memberController.js";

const memberRoute = express.Router();

// 🧩 Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // unique filename
  },
});

const upload = multer({ storage });

// 🧠 Route with multer middleware
memberRoute.post("/add-member", upload.single("photo"), createMember);

export default memberRoute;
