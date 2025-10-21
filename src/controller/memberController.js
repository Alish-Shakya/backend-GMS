import { member } from "../model/model.js";

export const createMember = async (req, res, next) => {
  try {
    // Get photo path if uploaded, otherwise use default
    let photoPath = req.file
      ? `/uploads/${req.file.filename}`
      : "/uploads/default-avatar.png";

    // Create new member with form data + photo path
    let result = await member.create({
      ...req.body,
      photo: photoPath,
    });

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const readAllMembers = async (req, res, next) => {
  try {
    let result = await member.find({});
    res.status(200).json({
      success: true,
      message: "All Members",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      messsag: error.message,
    });
  }
};

export const expiringMembers = async (req, res, next) => {};
