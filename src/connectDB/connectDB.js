import mongoose from "mongoose";

const connectDB = () => {
  mongoose.connect("mongodb://localhost:27017/backend-gms");
  console.log("Database connected Successfully");
};

export default connectDB;
