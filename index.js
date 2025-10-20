import express from "express";
import connectDB from "./src/connectDB/connectDB.js";
import webUserRouter from "./src/route/webUserRouter.js";
import cors from "cors";
import memberRoute from "./src/route/memberRouter.js";
const app = express();
const port = 4000;

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use(cors());

connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use("/webUser", webUserRouter);
app.use("/member", memberRoute);
