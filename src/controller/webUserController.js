import bcrypt from "bcryptjs";
import { webUser } from "../model/model.js";
import { secretKey } from "../utils/constant.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const register = async (req, res, next) => {
  try {
    let data = req.body;
    let password = req.body.password;

    let hashedPassword = await bcrypt.hash(password, 10);

    let photoPath = req.file ? `/uploads/${req.file.filename}` : "";

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    data = {
      ...data,
      password: hashedPassword,
      photo: photoPath,
      isVerifiedEmail: false,
      role: "user",
      otp,
      otpExpires,
    };

    let result = await webUser.create(data);

    // let infoObj = {
    //   _id: result._id,
    // };
    // let expiryInfo = {
    //   expiresIn: "1h",
    // };

    // let token = await jwt.sign(infoObj, secretKey, expiryInfo);

    await sendEmail({
      to: data.email,
      Subject: "Your OTP Code",

      html: `
      
 <h2>Welcome to our platform!</h2>
        <p>Your OTP code is <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      
      `,
    });

    res.status(201).json({
      success: true,
      message: "Web user Registered Successfully. OTP sent to email.",
      result: result,
      // token: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body; // get OTP and email from frontend

    // find user with that email
    const user = await webUser.findOne({ email });
    if (!user) throw new Error("User not found");

    // check if OTP matches
    if (user.otp !== otp) throw new Error("Invalid OTP");

    // check if OTP is expired
    if (Date.now() > user.otpExpires) throw new Error("OTP expired");

    // mark as verified
    user.isVerifiedEmail = true;

    // clear OTP fields (optional but good practice)
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// export const verifyEmail = async (req, res, next) => {
//   try {
//     let tokenString = req.headers.authorization;
//     let tokenArray = tokenString.split(" ");
//     let token = tokenArray[1];
//     // console.log(token);

//     //id, iat, exp
//     let user = await jwt.verify(token, secretKey);
//     console.log(user);

//     let result = await webUser.findByIdAndUpdate(
//       user._id,
//       { isVerifiedEmail: true },
//       { new: true }
//     );
//     res.status(200).json({
//       success: true,
//       message: "message verified true",
//       result: result,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if email exists
    const user = await webUser.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "This account has not been registered. Please register to continue.",
      });
    }

    // 2️⃣ Check if email is verified
    if (!user.isVerifiedEmail) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // 3️⃣ Check if password is valid
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }

    // 4️⃣ Generate token
    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: "365d" });

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      result: user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const myProfile = async (req, res, next) => {
  try {
    let id = req._id;
    let result = await webUser.findById(id);

    res.status(200).json({
      success: true,
      message: "read profile successfully",
      result: result,
    });
    // console.log(id);
    // console.log(result);
  } catch (error) {
    success: false;
    message: error.message;
  }
};

// export const forgotPassword = async (req, res, next) => {
//   try {
//     let email = req.body.email;

//     let user = await webUser.findOne({ email: email });

//     if (user) {
//       let infoObj = {
//         _id: user._id,
//       };
//       let expiryInfo = {
//         expiresIn: "1h",
//       };

//       let token = await jwt.sign(infoObj, secretKey, expiryInfo);

//       await sendEmail({
//         to: user.email,
//         subject: "Reset Password",
//         html: `
//         <h1> Password Reset</h1>
//         <p> Click this link to reset your password </p>
//         <a href="http://localhost:5173/reset-password?token=${token}">
//         http://localhost:5173/reset-password?token=${token}
//        </a>

//         `,
//       });

//       res.status(200).json({
//         success: true,
//         message: "Password link has been sent to your email",
//         result: user,
//       });
//     } else {
//       console.log("User not found");
//     }
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const resetPassword = async (req, res, next) => {
//   try {
//     let password = req.body.password;
//     let hashpassword = await bcrypt.hash(password, 10);

//     let result = await webUser.findByIdAndUpdate(
//       req._id,
//       { password: hashpassword },
//       { new: true }
//     );
//     res.status(200).json({
//       success: true,
//       message: "password reset successfully",
//       result: result,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// ✅ Step 1: Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await webUser.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If this email exists, a reset code has been sent.",
      });
    }

    // Generate random 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Use existing otp fields instead of creating new ones
    user.otp = resetCode;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Your Password Reset Code",
      html: `
        <h2>Password Reset Verification</h2>
        <p>Your 6-digit reset code is:</p>
        <h1>${resetCode}</h1>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Reset code sent to your email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Step 2: Verify Code
export const verifyCodeReset = async (req, res) => {
  try {
    const { email, code } = req.body;

    console.log("🔍 Incoming verify request:", { email, code });

    const user = await webUser.findOne({ email });
    console.log("📦 User record:", {
      otp: user?.otp,
      otpExpires: user?.otpExpires,
      now: Date.now(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or code",
      });
    }

    // Check code and expiry
    if (!user.otp || user.otpExpires < Date.now() || user.otp !== code) {
      console.log("❌ Code expired or missing");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code",
      });
    }

    // Clear after success
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Code verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.log("❌ Verify error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Step 3: Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await webUser.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;

    // Optional cleanup
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
