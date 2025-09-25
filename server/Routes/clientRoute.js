import express from "express";
const router = express.Router();
import { 
  registerUser, 
  submitOtp, 
  clientLogin, 
  gClientLogin, 
  clientResendOtp,
  changePassword,
  fClOtp,
  updatePassword,
  clientLogout,
  getHome,
  getUser,
  searchShop,
  ifUser,
  getNotification
} from "../Controllers/clientController.js";

// Client routes
router.post("/register", registerUser);
router.post("/submit-otp", submitOtp);
router.post("/login", clientLogin);
router.post("/googleLogin", gClientLogin);
router.post("/resend-otp", clientResendOtp);

// Forgot password flow
router.post("/changePassword", changePassword);  //Send otp to email
router.post("/fClOtp", fClOtp);                 // verify OTP
router.post("/updatePassword", updatePassword);  // set new password

// Other client routes
router.post("/logout", clientLogout);
router.get("/home", getHome);
router.get("/getUser", getUser);
router.post("/search", searchShop);
router.get("/ifUser", ifUser);
router.get("/getNotification", getNotification);

export default router;
