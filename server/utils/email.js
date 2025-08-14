const nodemailer = require('nodemailer');
const { emailUser, emailPass } = require('../config/keys');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

function sendOTP(email, otp) {
  return transporter.sendMail({
    from: `CipherNest <${emailUser}>`,
    to: email,
    subject: 'Your CipherNest OTP',
    text: `Your OTP is: ${otp}`
  });
}

module.exports = { sendOTP };
