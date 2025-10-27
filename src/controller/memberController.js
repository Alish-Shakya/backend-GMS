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

export const getNewMembers = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const newMembers = await member.find({
      startDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.status(200).json({
      success: true,
      count: newMembers.length,
      data: newMembers,
    });
  } catch (error) {
    console.error("Error fetching new members:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching new members",
    });
  }
};

//expiring within one week
// export const getExpiringMembers = async (req, res) => {
//   try {
//     const today = new Date();
//     const oneWeekLater = new Date(today);
//     oneWeekLater.setDate(today.getDate() + 7); // add 7 days

//     // Find members whose membership ends within the next 7 days
//     const expiringMembers = await member
//       .find({
//         endDate: {
//           $gte: today, // endDate is today or later
//           $lte: oneWeekLater, // but within 7 days
//         },
//       })
//       .sort({ endDate: 1 });

//     res.status(200).json({
//       success: true,
//       count: expiringMembers.length,
//       data: expiringMembers,
//     });
//   } catch (error) {
//     console.error("Error fetching expiring members:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// expiring within one month
export const getExpiringMembers = async (req, res) => {
  try {
    const today = new Date();
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1); // add 1 month

    console.log("Today:", today);
    console.log("One month later:", oneMonthLater);

    // Find members whose membership ends within the next 1 month
    const expiringMembers = await member
      .find({
        endDate: {
          $gte: today, // endDate is today or later
          $lte: oneMonthLater, // and within 1 month
        },
      })
      .sort({ endDate: 1 }); // sort by soonest expiring first

    res.status(200).json({
      success: true,
      count: expiringMembers.length,
      data: expiringMembers,
    });
  } catch (error) {
    console.error("Error fetching expiring members:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
