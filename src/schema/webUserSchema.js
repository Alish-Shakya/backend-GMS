import mongoose from "mongoose";

const webUserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  contactNo: {
    type: Number,
    required: true,
  },

  photo: {
    type: String,
    required: false,
  },

  otp: {
    type: String,
  },

  otpExpires: {
    type: Date,
  },

  isVerifiedEmail: {
    type: Boolean,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },
});

export default webUserSchema;
