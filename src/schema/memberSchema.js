import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      default: "/uploads/default-avatar.png",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String, // Changed to String to handle leading zeros
      required: true,
    },
    membership: {
      type: String,
      required: true,
      enum: ["monthly", "quarterly", "yearly"], // optional for validation
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now, // automatically sets when member is created
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Automatically calculate endDate based on membership plan
memberSchema.pre("save", function (next) {
  if (this.membership === "monthly") {
    this.endDate = new Date(this.startDate);
    this.endDate.setMonth(this.endDate.getMonth() + 1);
  } else if (this.membership === "quarterly") {
    this.endDate = new Date(this.startDate);
    this.endDate.setMonth(this.endDate.getMonth() + 3);
  } else if (this.membership === "yearly") {
    this.endDate = new Date(this.startDate);
    this.endDate.setFullYear(this.endDate.getFullYear() + 1);
  }
  next();
});

export default memberSchema;
