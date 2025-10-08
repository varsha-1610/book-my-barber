import jwt from "jsonwebtoken";

import Client from "../Models/clientModel.js";
import Shops from "../Models/shopModel.js";

import { comparePassword, hashPassword } from "../Helpers/hashing.js";
import { otp, createTransporter } from "../Helpers/otpCreate.js";
import { createTokenForUser as createToken, getTokenForUser as getToken } from "../utils/generateToken.js";
import { getData } from "../utils/getDetails.js";
import client from "../Models/clientModel.js";
import Notification from "../Models/notificationModel.js";

// ------------------ Register ------------------
const registerUser = async (req, res) => {
  try {
    const { userName, email, password, cPassword } = req.body;

    if (!userName || !userName.trim()) {
      return res.json({ error: "User name is required" });
    }

    if (!password || password.length < 6 || !password.trim()) {
      return res.json({ error: "Password must be at least 6 characters long" });
    }

    const exist = await Client.findOne({ email });
    if (exist) {
      return res.json({ error: "Email is already registered" });
    }

    if (password !== cPassword) {
      return res.json({ error: "Confirm password did not match" });
    }

    const sendedOtp = otp();
    console.log("Generated OTP:", sendedOtp);
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: "bookmybarber@gmail.com",
      to: email,
      text: `Your OTP is ${sendedOtp}`,
    });

    const currentTime = new Date();
    createToken(res, { otp: sendedOtp, time: currentTime });

    return res.json({ success: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred while registering user." });
  }
};

// ------------------ Verify OTP during register ------------------
const submitOtp = async (req, res) => {
  let token = await getToken(req);

  if (token) {
    try {
      const { userName, email, password, userOtp } = req.body;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const decodedTokenTime = new Date(decodedToken.data.time);
      const enterOtpTime = new Date();

      const timeDifference = Math.abs(enterOtpTime - decodedTokenTime) / 60000;

      if (userOtp !== decodedToken.data.otp || timeDifference > 5) {
        return res.json({ error: "Invalid or expired OTP" });
      }

      const hashedPassword = await hashPassword(password);

      await Client.create({
        userName,
        email,
        password: hashedPassword,
      });

      return res.json({ success: "Registration successful" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred while submitting OTP." });
    }
  }
};

// ------------------ Resend OTP ------------------
const clientResendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const sendedOtp = otp();
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: "bookmybarber@gmail.com",
      to: email,
      text: `Your OTP is ${sendedOtp}`,
    });

    const currentTime = new Date();
    createToken(res, { otp: sendedOtp, time: currentTime });

    return res.json({ success: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ------------------ Normal login ------------------
const clientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let emailExist = await Client.findOne({ email });

    if (!emailExist) {
      return res.json({ error: "User not found, please sign up" });
    }

    if (emailExist.isBlock) {
      return res.json({ error: "You do not have permission to access this website." });
    }

    let match = await comparePassword(password, emailExist.password);
    if (!match) {
      return res.json({ error: "Password did not match" });
    }

    const tokenPayload = {
      email: emailExist.email,
      userName: emailExist.userName,
      userId: emailExist._id,
    };
    createToken(res, tokenPayload);

    const clientData = {
      userName: emailExist.userName,
      email: emailExist.email,
      id: emailExist._id,
    };

    return res.json(clientData);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong" });
  }
};

// ------------------ Google login ------------------
const gClientLogin = async (req, res) => {
  try {
    const { gName, gEmail } = req.body;
    let gClientDetails = await Client.findOne({ email: gEmail });

    if (!gClientDetails) {
      const client = await Client.create({
        userName: gName,
        email: gEmail,
      });

      const resultData = { userName: client.userName, email: client.email, userId: client._id };
      createToken(res, resultData);
      return res.json(resultData);
    }

    if (gClientDetails.isBlock) {
      return res.json({ error: "You do not have permission to enter this website" });
    }

    const resultData = { userName: gClientDetails.userName, email: gClientDetails.email, userId: gClientDetails._id };
    createToken(res, resultData);
    return res.json(resultData);
  } catch (error) {
    console.log("Error in google login", error);
    return res.json({ error: "Something went wrong in Google login" });
  }
};

// ------------------ Forgot password: send OTP ------------------
const changePassword = async (req, res) => {
  try {
    const { email } = req.body;
    let emailExist = await Client.findOne({ email });

    if (!emailExist) {
      return res.json({ error: "User not found" });
    }

    const sendedOtp = otp();
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: "bookmybarber@gmail.com",
      to: email,
      text: `Your OTP is ${sendedOtp}`,
    });

    const currentTime = new Date();
    createToken(res, { otp: sendedOtp, time: currentTime });

    return res.json({ email });
  } catch (error) {
    console.log("Error in changePassword", error);
    return res.json({ error: "Something went wrong" });
  }
};

// ------------------ Forgot password: verify OTP ------------------
const fClOtp = async (req, res) => {
  try {
    let token = await getToken(req);
    if (token) {
      const { userOtp } = req.body;

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const decodedTokenTime = new Date(decodedToken.data.time);
      const enterOtpTime = new Date();

      const timeDifference = Math.abs(enterOtpTime - decodedTokenTime) / 60000;

      if (userOtp !== decodedToken.data.otp || timeDifference > 5) {
        return res.json({ error: "Invalid or expired OTP" });
      }
      return res.json({ success: "OTP verified" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong" });
  }
};

// ------------------ Forgot password: update password ------------------
const updatePassword = async (req, res) => {
  try {
    const { email, passw, cPassw } = req.body;

    if (!passw || !cPassw) {
      return res.json({ error: "Password cannot be empty" });
    }

    if (passw.length < 6) {
      return res.json({ error: "Password must be at least 6 characters" });
    }

    if (passw !== cPassw) {
      return res.json({ error: "Confirm password did not match" });
    }

    const passwBcrypt = await hashPassword(passw);

    let userDetails = await Client.findOneAndUpdate(
      { email },
      { $set: { password: passwBcrypt } },
      { new: true }
    );

    if (!userDetails) {
      return res.json({ error: "Failed to update password, try again later" });
    }
    return res.json({ success: "Password updated successfully" });
  } catch (error) {
    console.log("Error in updatePassword", error);
    return res.json({ error: "Something went wrong" });
  }
};

// ------------------ Logout ------------------
const clientLogout = async (req, res) => {
  let token = await getToken(req);
  res.setHeader("Set-Cookie", `user=${token}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  res.json({ success: "Logout successful" });
};

// ------------------ Get homepage ------------------
const getHome = async (req, res) => {
  try {
    return res.json({ success: "Successfully entered" });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong in getHome" });
  }
};

// ------------------ Get logged-in user ------------------
const getUser = async (req, res) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res.json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let Data = decoded.data;
      return res.json({ Data });
    } catch (error) {
      return res.json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong in getUser" });
  }
};

// ------------------ Search shops ------------------
const searchShop = async (req, res) => {
  const { pincode, name } = req.body;

  if (!pincode && !name) {
    return res.json({ error: "Search shops using proper keys" });
  }

  if (pincode && !name) {
    const stringZipcode = pincode.toString();
    const pinCodeRegex = /^[1-9][0-9]{5}$/;
    const validZip = pinCodeRegex.test(stringZipcode);

    if (!validZip) {
      return res.json({ error: "Enter valid pincode" });
    }

    const shops = await Shops.find(
      { zipcode: pincode, access: true },
      { businessName: 1, address: 1, phoneNumber: 1, zipcode: 1, _id: 1, photos: 1 }
    );

    if (shops.length) {
      return res.json(shops);
    } else {
      return res.json({ error: "No shops found with this pincode." });
    }
  }

  if (!pincode && name) {
    const regexPattern = new RegExp(name, "i");
    const shops = await Shops.find(
      { businessName: { $regex: regexPattern }, access: true },
      { businessName: 1, address: 1, phoneNumber: 1, zipcode: 1, _id: 1, photos: 1 }
    );

    if (shops.length) {
      return res.json(shops);
    } else {
      return res.json({ error: "No shops found with this name." });
    }
  }

  const shops = await Shops.find(
    { businessName: name, access: true },
    { businessName: 1, address: 1, phoneNumber: 1, zipcode: 1, _id: 1, photos: 1 }
  );

  if (shops.length) {
    return res.json(shops);
  } else {
    return res.json({ error: "No shops found with these details." });
  }
};

// ------------------ Check if user is valid ------------------
const ifUser = async (req, res) => {
  try {
    const token = await getToken(req);

    if (!token) {
      return res.json({ error: "User logged out, please login again" });
    }

    const details = await getData(token);

    let userData;
    if (details && !details.userId) {
      userData = await client.find({ email: details.email });
      if (userData[0].isBlock) {
        return res.json({ error: "Sorry, you cannot enter this website." });
      }
      return res.json(userData);
    } else {
      userData = await client.find({ _id: details.userId });
      if (userData[0].isBlock) {
        return res.json({ error: "Sorry, you cannot enter this website." });
      }
      return res.json(userData);
    }
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong in ifUser" });
  }
};

const getNotification = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json({ error: "User ID required" });

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (error) {
    console.log("Error in getNotification", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export {
  registerUser,
  submitOtp,
  clientResendOtp,
  clientLogin,
  changePassword,
  fClOtp,
  updatePassword,
  clientLogout,
  gClientLogin,
  getHome,
  getUser,
  searchShop,
  ifUser,
  getNotification,
};
