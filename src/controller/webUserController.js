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

    data = {
      ...data,
      password: hashedPassword,
      photo: photoPath,
      isVerifiedEmail: false,
      role: "user",
    };

    let result = await webUser.create(data);

    let infoObj = {
      _id: result._id,
    };
    let expiryInfo = {
      expiresIn: "1h",
    };

    let token = await jwt.sign(infoObj, secretKey, expiryInfo);
    await sendEmail({
      to: data.email,
      Subject: "Account Registration",

      html: `
      
     <h1> Your account has been registered successfully </h1>

     <p> Click This link to verify your Email </p>


     <a href = "http://localhost:5173/verify-email?token=${token}">
                http://localhost:5173/verify-email?token=${token}
            </a>
      
      `,
    });

    res.status(201).json({
      success: true,
      message: "Web user Registered Successfully",
      result: result,
      token: token,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        photo: user.photo,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    let tokenString = req.headers.authorization;
    let tokenArray = tokenString.split(" ");
    let token = tokenArray[1];
    // console.log(token);

    //id, iat, exp
    let user = await jwt.verify(token, secretKey);
    console.log(user);

    let result = await webUser.findByIdAndUpdate(
      user._id,
      { isVerifiedEmail: true },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "message verified true",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

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
