import express from "express";
import connectDB from "./src/connectDB/connectDB.js";
import webUserRouter from "./src/route/webUserRouter.js";
import cors from "cors";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use("/webUser", webUserRouter);
