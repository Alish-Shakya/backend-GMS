import express from "express";
const router = express.Router();

homeRouter.get("/", (req, res) => {
  res.json({
    name: "IronCore Fitness",
    tagline: "Transform Your Body, Elevate Your Mind",
    offers: [
      "50% Off for New Members",
      "Free Personal Training on Signup",
      "Access to All Equipment 24/7",
    ],
  });
});

export default homeRouter;
