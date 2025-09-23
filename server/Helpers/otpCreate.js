import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

function otp() {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCaseAlphabets: true,
    specialChars: false,
    lowerCaseAlphabets: true,
  });
}

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'laney.mueller@ethereal.email',
        pass: 'zEw6FeeAHPrtywebkJ'
    }
});

export { otp, transporter };