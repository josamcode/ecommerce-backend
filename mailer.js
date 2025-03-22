const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your verification code",
    text: `Your verification code is: ${verificationCode}`,
    html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
