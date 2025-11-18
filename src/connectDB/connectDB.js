import mongoose from "mongoose";

const connectDB = () => {
  mongoose.connect("mongodb://localhost:27017/PlanetFitness");
  console.log("Database connected Successfully");
};

export default connectDB;
