const nodemailer = require("nodemailer");
const User=require("../Models/user")

const sendNotification = async (userId, message) => {
  // get user email
  const user = await User.findById(userId);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    to: user.email,
    subject: "Plan Expiry Alert",
    text: message
  });

  console.log("Email sent to:", user.email);
};

module.exports = sendNotification;
