import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

// Function to generate a 6-digit OTP
function otp() {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
}

// Function to create a transporter with a fresh Ethereal account
async function createTransporter() {
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export { otp, createTransporter };
