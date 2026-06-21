/*import nodemailer from "nodemailer";

const getTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log("SMTP USER:", process.env.SMTP_USER);

    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: `"Job Portal" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT SUCCESS:", info.messageId);
  } catch (error) {
    console.error("EMAIL FAILED FULL ERROR:", error);
  }
};*/
import nodemailer from "nodemailer";

const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Job Portal" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};