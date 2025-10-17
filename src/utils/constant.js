import { config } from "dotenv";

config();

export let secretKey = process.env.SECRET_KEY;

export let smtp_mail = process.env.SMTP_MAIL;

export let smtp_password = process.env.SMTP_PASSWORD;
