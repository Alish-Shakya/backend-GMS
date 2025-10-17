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

    data = {
      ...data,
      password: hashedPassword,
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
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
