import nodemailer from "nodemailer";

import { smtp_mail } from "./constant.js";
import { smtp_password } from "./constant.js";

const transporterInfo = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: smtp_mail,
    pass: smtp_password,
  },
};

export const sendEmail = async (mailinfo) => {
  try {
    let transporter = nodemailer.createTransport(transporterInfo);
    let info = await transporter.sendMail(mailinfo);
  } catch (error) {
    console.log("mail error has occured", error.message);
  }
};
