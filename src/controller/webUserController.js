import bcrypt from "bcryptjs";
import { webUser } from "../model/model.js";
import { secretKey } from "../utils/constant.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

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
    let email = req.body.email;
    console.log(email);
    let password = req.body.password;
    let user = await webUser.findOne({ email: email });
    // console.log(user);
    if (!user) {
      throw new Error("User Not Found");
    }

    if (!user.isVerifiedEmail) {
      throw new Error("Email not verified");
    }

    let isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid Credentials");
    }

    let infoObj = {
      _id: user._id,
    };

    let expiryInfo = {
      expiresIn: "365d",
    };

    let token = await jwt.sign(infoObj, secretKey, expiryInfo);

    res.status(200).json({
      success: true,
      message: "web User loged in successfully",
      result: user,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
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

export const forgotPassword = async (req, res, next) => {
  try {
    let email = req.body.email;

    let user = await webUser.findOne({ email: email });

    if (user) {
      let infoObj = {
        _id: user._id,
      };
      let expiryInfo = {
        expiresIn: "1h",
      };

      let token = await jwt.sign(infoObj, secretKey, expiryInfo);

      await sendEmail({
        to: user.email,
        subject: "Reset Password",
        html: `
        <h1> Password Reset</h1>
        <p> Click this link to reset your password </p>
        <a href="http://localhost:5173/reset-password?token=${token}">
        http://localhost:5173/reset-password?token=${token}
       </a>

        `,
      });

      res.status(200).json({
        success: true,
        message: "Password link has been sent to your email",
        result: user,
      });
    } else {
      console.log("User not found");
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    let password = req.body.password;
    let hashpassword = await bcrypt.hash(password, 10);

    let result = await webUser.findByIdAndUpdate(
      req._id,
      { password: hashpassword },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "password reset successfully",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
