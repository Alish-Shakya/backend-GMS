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

// import { member } from "../model/model.js";

// // Add a new member
// export const addMember = async (req, res) => {
//   try {
//     const { fullName, address, phone, membership, amountPaid } = req.body;

//     // Handle photo upload or use default
//     let photoPath = req.file
//       ? `/uploads/${req.file.filename}`
//       : "/uploads/default-avatar.png";

//     const newMember = new member({
//       fullName,
//       phone,
//       address,
//       membership,
//       amountPaid,
//       photo: photoPath,
//     });

//     await newMember.save();

//     res.status(201).json({
//       success: true,
//       message: "Member added successfully!",
//       data: newMember,
//     });
//   } catch (error) {
//     console.error("Error adding member:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to add member",
//       error: error.message,
//     });
//   }
// };
